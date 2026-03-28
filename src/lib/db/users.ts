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

function getSeedOwnerConfig() {
  const email =
    env.ADMIN_OWNER_EMAIL ??
    (process.env.NODE_ENV === "development"
      ? "owner@veronicaadane.com"
      : undefined);
  const password =
    env.ADMIN_OWNER_PASSWORD ??
    (process.env.NODE_ENV === "development" ? "VeronicaAdmin2026!" : undefined);

  if (!email || !password) {
    return null;
  }

  return {
    email: normalizeEmail(email),
    password,
    name: env.ADMIN_OWNER_NAME ?? "Veronica Admin",
  };
}

export async function ensureSeedOwnerUser() {
  await ensureUsersCollectionReady();
  const seedOwner = getSeedOwnerConfig();

  if (!seedOwner) {
    return null;
  }

  const usersCollection = await getUsersCollection();
  const existingUser = await usersCollection.findOne({ email: seedOwner.email });

  if (existingUser) {
    return serializeUser(existingUser);
  }

  const now = new Date();
  const insertResult = await usersCollection.insertOne({
    email: seedOwner.email,
    name: seedOwner.name,
    role: "owner",
    passwordHash: hashPassword(seedOwner.password),
    createdAt: now,
    lastLoginAt: now,
  });

  const insertedUser = await usersCollection.findOne({ _id: insertResult.insertedId });

  return insertedUser ? serializeUser(insertedUser) : null;
}

export async function getAuthorizedUserByEmail(email: string) {
  await ensureUsersCollectionReady();
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ email: normalizeEmail(email) });

  return user ? serializeUser(user) : null;
}

export async function authenticateAuthorizedUser(email: string, password: string) {
  await ensureSeedOwnerUser();
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
