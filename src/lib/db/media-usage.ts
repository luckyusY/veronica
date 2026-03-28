import "server-only";

import { type WithId } from "mongodb";
import type { CmsMediaUsageEntry, CmsMediaUsageRecord, CmsPageSlug } from "@/lib/cms-types";
import { getDatabase } from "@/lib/mongodb";

type CmsMediaUsageDocument = {
  publicId: string;
  usedIn: CmsMediaUsageEntry[];
  updatedAt: Date;
};

type CmsPageUsageDocument = {
  slug: CmsPageSlug;
  published?: {
    content?: unknown | null;
  };
  draft?: {
    content?: unknown | null;
  };
};

let mediaUsageSetupPromise: Promise<void> | null = null;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function formatFieldPath(path: Array<string | number>): string {
  return path.reduce<string>((result, segment) => {
    if (typeof segment === "number") {
      return `${result}[${segment}]`;
    }

    return result ? `${result}.${segment}` : segment;
  }, "");
}

function appendUsageEntry(
  usageMap: Map<string, CmsMediaUsageEntry[]>,
  publicId: string,
  entry: CmsMediaUsageEntry,
) {
  const currentEntries = usageMap.get(publicId) ?? [];
  const exists = currentEntries.some(
    (current) =>
      current.route === entry.route &&
      current.section === entry.section &&
      current.field === entry.field &&
      current.isDraft === entry.isDraft,
  );

  if (!exists) {
    currentEntries.push(entry);
    usageMap.set(publicId, currentEntries);
  }
}

function collectUsageEntries(
  value: unknown,
  route: CmsPageSlug,
  isDraft: boolean,
  usageMap: Map<string, CmsMediaUsageEntry[]>,
  path: Array<string | number> = [],
  section = "root",
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectUsageEntries(item, route, isDraft, usageMap, [...path, index], section),
    );
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  const maybePublicId = typeof value.publicId === "string" ? value.publicId.trim() : "";

  if (maybePublicId) {
    appendUsageEntry(usageMap, maybePublicId, {
      route,
      section,
      field: formatFieldPath(path),
      isDraft,
    });
  }

  for (const [key, child] of Object.entries(value)) {
    collectUsageEntries(
      child,
      route,
      isDraft,
      usageMap,
      [...path, key],
      path.length === 0 ? key : section,
    );
  }
}

function serializeMediaUsage(document: WithId<CmsMediaUsageDocument>): CmsMediaUsageRecord {
  return {
    publicId: document.publicId,
    usedIn: document.usedIn,
    pageCount: new Set(document.usedIn.map((item) => item.route)).size,
    updatedAt: document.updatedAt.toISOString(),
  };
}

async function getMediaUsageCollection() {
  const database = await getDatabase();
  return database.collection<CmsMediaUsageDocument>("media_usage");
}

async function getCmsPagesCollection() {
  const database = await getDatabase();
  return database.collection<CmsPageUsageDocument>("cms_pages");
}

async function ensureMediaUsageCollectionReady() {
  if (!mediaUsageSetupPromise) {
    mediaUsageSetupPromise = (async () => {
      const collection = await getMediaUsageCollection();
      await collection.createIndex({ publicId: 1 }, { unique: true });
    })().catch((error) => {
      mediaUsageSetupPromise = null;
      throw error;
    });
  }

  await mediaUsageSetupPromise;
}

export async function rebuildMediaUsageIndex() {
  await ensureMediaUsageCollectionReady();

  const [pagesCollection, usageCollection] = await Promise.all([
    getCmsPagesCollection(),
    getMediaUsageCollection(),
  ]);
  const pages = await pagesCollection.find({}, { projection: { slug: 1, published: 1, draft: 1 } }).toArray();
  const usageMap = new Map<string, CmsMediaUsageEntry[]>();

  for (const page of pages) {
    if (page.published?.content) {
      collectUsageEntries(page.published.content, page.slug, false, usageMap);
    }

    if (page.draft?.content) {
      collectUsageEntries(page.draft.content, page.slug, true, usageMap);
    }
  }

  const now = new Date();
  const nextDocuments = [...usageMap.entries()].map(([publicId, usedIn]) => ({
    publicId,
    usedIn,
    updatedAt: now,
  }));

  await usageCollection.deleteMany({});

  if (nextDocuments.length > 0) {
    await usageCollection.insertMany(nextDocuments);
  }

  return nextDocuments.length;
}

export async function listMediaUsageIndex() {
  await ensureMediaUsageCollectionReady();
  const usageCollection = await getMediaUsageCollection();
  const existingCount = await usageCollection.countDocuments();

  if (existingCount === 0) {
    await rebuildMediaUsageIndex();
  }

  const items = await usageCollection.find({}).sort({ publicId: 1 }).toArray();
  return items.map(serializeMediaUsage);
}

export async function getMediaUsageForPublicId(publicId: string) {
  await ensureMediaUsageCollectionReady();
  const usageCollection = await getMediaUsageCollection();
  const item = await usageCollection.findOne({ publicId });

  if (item) {
    return serializeMediaUsage(item);
  }

  const existingCount = await usageCollection.countDocuments();

  if (existingCount === 0) {
    await rebuildMediaUsageIndex();
    const rebuiltItem = await usageCollection.findOne({ publicId });
    return rebuiltItem ? serializeMediaUsage(rebuiltItem) : null;
  }

  return null;
}
