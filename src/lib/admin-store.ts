import "server-only";

import { type WithId, ObjectId } from "mongodb";
import {
  adminCollectionConfig,
  adminCollectionOrder,
  adminStarterRecords,
  type AdminCollectionKey,
  type AdminRecord,
  type AdminRecordInput,
} from "@/lib/admin-schema";
import { getDatabase } from "@/lib/mongodb";

type AdminDocument = AdminRecordInput & {
  createdAt: Date;
  updatedAt: Date;
};

function getCollectionName(collection: AdminCollectionKey) {
  return `admin_${collection}`;
}

function sanitizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRecordInput(
  collection: AdminCollectionKey,
  payload: unknown,
): AdminRecordInput {
  if (!payload || typeof payload !== "object") {
    throw new Error(`Invalid ${adminCollectionConfig[collection].singular.toLowerCase()} payload.`);
  }

  const raw = payload as Record<string, unknown>;
  const title = sanitizeField(raw.title);

  if (!title) {
    throw new Error(`${adminCollectionConfig[collection].fields.title} is required.`);
  }

  const bannerImage = sanitizeField(raw.bannerImage) || undefined;

  // Accept array or newline-separated string for gallery images
  let galleryImages: string[] | undefined;
  if (Array.isArray(raw.galleryImages)) {
    const cleaned = (raw.galleryImages as unknown[])
      .map((v) => sanitizeField(v))
      .filter(Boolean);
    galleryImages = cleaned.length > 0 ? cleaned : undefined;
  } else if (typeof raw.galleryImages === "string" && raw.galleryImages.trim()) {
    const cleaned = raw.galleryImages.split("\n").map((s) => s.trim()).filter(Boolean);
    galleryImages = cleaned.length > 0 ? cleaned : undefined;
  }

  return {
    title,
    subtitle: sanitizeField(raw.subtitle),
    status:
      sanitizeField(raw.status) || adminCollectionConfig[collection].defaultStatus,
    highlight: sanitizeField(raw.highlight),
    link: sanitizeField(raw.link),
    notes: sanitizeField(raw.notes),
    ...(bannerImage !== undefined ? { bannerImage } : {}),
    ...(galleryImages !== undefined ? { galleryImages } : {}),
  };
}

function serializeRecord(record: WithId<AdminDocument>): AdminRecord {
  return {
    id: record._id.toString(),
    title: record.title,
    subtitle: record.subtitle,
    status: record.status,
    highlight: record.highlight,
    link: record.link,
    notes: record.notes,
    bannerImage: record.bannerImage ?? undefined,
    galleryImages: record.galleryImages ?? undefined,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

async function getAdminCollection(collection: AdminCollectionKey) {
  const database = await getDatabase();

  return database.collection<AdminDocument>(getCollectionName(collection));
}

export function isAdminCollectionKey(value: string): value is AdminCollectionKey {
  return adminCollectionOrder.includes(value as AdminCollectionKey);
}

export async function ensureAdminSeedData() {
  await Promise.all(
    adminCollectionOrder.map(async (collection) => {
      const adminCollection = await getAdminCollection(collection);
      const hasRecords = await adminCollection.countDocuments({}, { limit: 1 });

      if (hasRecords > 0) {
        return;
      }

      const now = new Date();
      const starterDocs = adminStarterRecords[collection].map((record) => ({
        ...record,
        createdAt: now,
        updatedAt: now,
      }));

      await adminCollection.insertMany(starterDocs);
    }),
  );
}

export async function listAdminCollection(collection: AdminCollectionKey) {
  const adminCollection = await getAdminCollection(collection);
  const records = await adminCollection
    .find({})
    .sort({ updatedAt: -1, createdAt: -1 })
    .toArray();

  return records.map(serializeRecord);
}

export async function createAdminRecord(
  collection: AdminCollectionKey,
  payload: unknown,
) {
  const adminCollection = await getAdminCollection(collection);
  const input = normalizeRecordInput(collection, payload);
  const now = new Date();

  const insertResult = await adminCollection.insertOne({
    ...input,
    createdAt: now,
    updatedAt: now,
  });

  const createdRecord = await adminCollection.findOne({ _id: insertResult.insertedId });

  if (!createdRecord) {
    throw new Error("Unable to create admin record.");
  }

  return serializeRecord(createdRecord);
}

export async function updateAdminRecord(
  collection: AdminCollectionKey,
  id: string,
  payload: unknown,
) {
  const adminCollection = await getAdminCollection(collection);
  const input = normalizeRecordInput(collection, payload);

  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid record id.");
  }

  const recordId = new ObjectId(id);

  await adminCollection.updateOne(
    { _id: recordId },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
  );

  const updatedRecord = await adminCollection.findOne({ _id: recordId });

  if (!updatedRecord) {
    throw new Error("Unable to update admin record.");
  }

  return serializeRecord(updatedRecord);
}

export async function deleteAdminRecord(collection: AdminCollectionKey, id: string) {
  const adminCollection = await getAdminCollection(collection);

  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid record id.");
  }

  await adminCollection.deleteOne({ _id: new ObjectId(id) });
}

export async function getAdminDashboardData() {
  await ensureAdminSeedData();

  const entries = await Promise.all(
    adminCollectionOrder.map(async (collection) => {
      const records = await listAdminCollection(collection);

      return [collection, records] as const;
    }),
  );

  const sections = Object.fromEntries(entries) as Record<
    AdminCollectionKey,
    AdminRecord[]
  >;

  const counts = adminCollectionOrder.reduce<Record<AdminCollectionKey, number>>(
    (accumulator, collection) => {
      accumulator[collection] = sections[collection].length;
      return accumulator;
    },
    {
      releases: 0,
      events: 0,
      products: 0,
      inquiries: 0,
    },
  );

  return { sections, counts };
}
