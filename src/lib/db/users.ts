import "server-only";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { type WithId } from "mongodb";
import { type AdminRole } from "@/lib/admin-access";
import { env } from "@/lib/env";
import { getDatabase } from "@/lib/mongodb";

type UserDocument = {
  email: string;
  name: string;
  role: AdminRole;
  passwordHash: string;
  createdAt: Date;
  lastLoginAt: Date;
};

export type AdminUserRecord = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  lastLoginAt: string;
};

export type SeedAdminCredential = {
  role: AdminRole;
  name: string;
  email: string;
  password: string;
};

let usersSetupPromise: Promise<void> | null = null;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function serializeUser(document: WithId<UserDocument>): AdminUserRecord {
  return {
    id: document._id.toString(),
    email: document.email,
    name: document.name,
    role: document.role,
    createdAt: document.createdAt.toISOString(),
    lastLoginAt: document.lastLoginAt.toISOString(),
  };
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${key}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64);
  const storedKey = Buffer.from(key, "hex");

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}

async function getUsersCollection() {
  const database = await getDatabase();

  return database.collection<UserDocument>("users");
}

async function ensureUsersCollectionReady() {
  if (!usersSetupPromise) {
    usersSetupPromise = (async () => {
      const usersCollection = await getUsersCollection();
      await usersCollection.createIndex({ email: 1 }, { unique: true });
    })().catch((error) => {
      usersSetupPromise = null;
      throw error;
    });
  }

  await usersSetupPromise;
}

function getDefaultSeedUser(role: AdminRole) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const defaults: Record<AdminRole, SeedAdminCredential> = {
    owner: {
      role: "owner",
      name: "Veronica Admin",
      email: "owner@veronicaadane.com",
      password: "VeronicaAdmin2026!",
    },
    content: {
      role: "content",
      name: "Content Editor",
      email: "content@veronicaadane.com",
      password: "VeronicaContent2026!",
    },
    bookings: {
      role: "bookings",
      name: "Bookings Desk",
      email: "bookings@veronicaadane.com",
      password: "VeronicaBookings2026!",
    },
    media: {
      role: "media",
      name: "Media Manager",
      email: "media@veronicaadane.com",
      password: "VeronicaMedia2026!",
    },
  };

  return defaults[role];
}

function getSeedCredentialForRole(role: AdminRole) {
  const defaults = getDefaultSeedUser(role);

  const roleEnvMap: Record<
    AdminRole,
    {
      email?: string;
      password?: string;
      name?: string;
    }
  > = {
    owner: {
      email: env.ADMIN_OWNER_EMAIL,
      password: env.ADMIN_OWNER_PASSWORD,
      name: env.ADMIN_OWNER_NAME,
    },
    content: {
      email: env.ADMIN_CONTENT_EMAIL,
      password: env.ADMIN_CONTENT_PASSWORD,
      name: env.ADMIN_CONTENT_NAME,
    },
    bookings: {
      email: env.ADMIN_BOOKINGS_EMAIL,
      password: env.ADMIN_BOOKINGS_PASSWORD,
      name: env.ADMIN_BOOKINGS_NAME,
    },
    media: {
      email: env.ADMIN_MEDIA_EMAIL,
      password: env.ADMIN_MEDIA_PASSWORD,
      name: env.ADMIN_MEDIA_NAME,
    },
  };

  const roleEnv = roleEnvMap[role];
  const email = roleEnv.email ?? defaults?.email;
  const password = roleEnv.password ?? defaults?.password;
  const name = roleEnv.name ?? defaults?.name;

  if (!email || !password || !name) {
    return null;
  }

  return {
    role,
    name,
    email: normalizeEmail(email),
    password,
  } satisfies SeedAdminCredential;
}

export function getSampleAdminCredentials() {
  const credentials = (["owner", "content", "bookings", "media"] as const)
    .map((role) => getSeedCredentialForRole(role))
    .filter((credential): credential is SeedAdminCredential => Boolean(credential));

  if (
    process.env.NODE_ENV !== "development" &&
    !env.SHOW_SAMPLE_ADMIN_CREDENTIALS
  ) {
    return [];
  }

  return credentials;
}

export async function ensureSeedUsers() {
  await ensureUsersCollectionReady();

  const seedUsers = (["owner", "content", "bookings", "media"] as const)
    .map((role) => getSeedCredentialForRole(role))
    .filter((credential): credential is SeedAdminCredential => Boolean(credential));

  if (seedUsers.length === 0) {
    return null;
  }

  const usersCollection = await getUsersCollection();
  let ownerRecord: AdminUserRecord | null = null;

  for (const seedUser of seedUsers) {
    const existingUser = await usersCollection.findOne({ email: seedUser.email });

    if (existingUser) {
      if (seedUser.role === "owner") {
        ownerRecord = serializeUser(existingUser);
      }

      continue;
    }

    const now = new Date();
    const insertResult = await usersCollection.insertOne({
      email: seedUser.email,
      name: seedUser.name,
      role: seedUser.role,
      passwordHash: hashPassword(seedUser.password),
      createdAt: now,
      lastLoginAt: now,
    });

    if (seedUser.role === "owner") {
      const insertedUser = await usersCollection.findOne({
        _id: insertResult.insertedId,
      });

      ownerRecord = insertedUser ? serializeUser(insertedUser) : null;
    }
  }

  return ownerRecord;
}

export async function getAuthorizedUserByEmail(email: string) {
  await ensureUsersCollectionReady();
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ email: normalizeEmail(email) });

  return user ? serializeUser(user) : null;
}

export async function authenticateAuthorizedUser(email: string, password: string) {
  await ensureSeedUsers();
  const usersCollection = await getUsersCollection();
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await usersCollection.findOne({ email: normalizedEmail });

  if (!existingUser || !verifyPassword(password, existingUser.passwordHash)) {
    return null;
  }

  const nextLoginAt = new Date();

  await usersCollection.updateOne(
    { _id: existingUser._id },
    {
      $set: {
        lastLoginAt: nextLoginAt,
      },
    },
  );

  return serializeUser({
    ...existingUser,
    lastLoginAt: nextLoginAt,
  });
}
