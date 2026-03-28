import "server-only";

import { type WithId, ObjectId } from "mongodb";
import { unstable_noStore as noStore } from "next/cache";
import { buildDefaultCmsPage, defaultSiteSettings } from "@/lib/cms-defaults";
import {
  type CmsMediaAsset,
  type CmsPageContentMap,
  type CmsPageDocument,
  type CmsPageEditorInput,
  type CmsPageSlug,
  type CmsSiteSettings,
} from "@/lib/cms-types";
import { getDatabase } from "@/lib/mongodb";

type CmsPageDbDocument = {
  slug: CmsPageSlug;
  name: string;
  route: string;
  summary: string;
  content: unknown;
  updatedAt: Date;
};

type CmsSiteSettingsDocument = {
  key: "site-settings";
  content: CmsSiteSettings;
  updatedAt: Date;
};

type CmsMediaAssetDocument = {
  title: string;
  alt: string;
  publicId: string;
  secureUrl: string;
  resourceType: "image" | "video";
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
};

const cmsPageSlugs = [
  "home",
  "about",
  "music",
  "events",
  "shop",
  "collaborations",
  "media",
  "contact",
] as const satisfies readonly CmsPageSlug[];

const SITE_SETTINGS_KEY = "site-settings" as const;

let cmsSetupPromise: Promise<void> | null = null;

function sanitizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function serializePage<TContent>(
  document: CmsPageDbDocument | (Omit<CmsPageDbDocument, "updatedAt"> & { updatedAt: Date }),
): CmsPageDocument<TContent> {
  return {
    slug: document.slug,
    name: document.name,
    route: document.route,
    summary: document.summary,
    content: document.content as TContent,
    updatedAt: document.updatedAt.toISOString(),
  };
}

function serializeMediaAsset(document: WithId<CmsMediaAssetDocument>): CmsMediaAsset {
  return {
    id: document._id.toString(),
    title: document.title,
    alt: document.alt,
    publicId: document.publicId,
    secureUrl: document.secureUrl,
    resourceType: document.resourceType,
    format: document.format,
    bytes: document.bytes,
    width: document.width,
    height: document.height,
    duration: document.duration,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

function validatePageUpdate(
  slug: CmsPageSlug,
  payload: unknown,
): CmsPageEditorInput<CmsPageContentMap[CmsPageSlug]> {
  if (!isPlainObject(payload)) {
    throw new Error("Invalid page payload.");
  }

  const name = sanitizeText(payload.name);
  const summary = sanitizeText(payload.summary);
  const content = payload.content;

  if (!name) {
    throw new Error("Page name is required.");
  }

  if (!summary) {
    throw new Error("Page summary is required.");
  }

  if (!isPlainObject(content)) {
    throw new Error(`Content for ${slug} must be a JSON object.`);
  }

  return {
    name,
    summary,
    content: content as CmsPageContentMap[CmsPageSlug],
  };
}

function validateSiteSettings(payload: unknown): CmsSiteSettings {
  if (!isPlainObject(payload)) {
    throw new Error("Invalid site settings payload.");
  }

  const header = payload.header;
  const footer = payload.footer;

  if (!isPlainObject(header) || !isPlainObject(footer)) {
    throw new Error("Site settings must include header and footer objects.");
  }

  return {
    header: {
      brandKicker: sanitizeText(header.brandKicker),
      bookingLabel: sanitizeText(header.bookingLabel),
      shopLabel: sanitizeText(header.shopLabel),
    },
    footer: {
      notes: Array.isArray(footer.notes)
        ? footer.notes.map(sanitizeText).filter(Boolean)
        : [],
      description: sanitizeText(footer.description),
      socialSignals: Array.isArray(footer.socialSignals)
        ? footer.socialSignals.map(sanitizeText).filter(Boolean)
        : [],
      utilityLinks: Array.isArray(footer.utilityLinks)
        ? footer.utilityLinks
            .filter(isPlainObject)
            .map((item) => ({
              label: sanitizeText(item.label),
              href: sanitizeText(item.href),
            }))
            .filter((item) => item.label && item.href)
        : [],
      copyrightTagline: sanitizeText(footer.copyrightTagline),
    },
  };
}

async function getCmsPagesCollection() {
  const database = await getDatabase();
  return database.collection<CmsPageDbDocument>("cms_pages");
}

async function getSiteSettingsCollection() {
  const database = await getDatabase();
  return database.collection<CmsSiteSettingsDocument>("cms_site_settings");
}

async function getMediaCollection() {
  const database = await getDatabase();
  return database.collection<CmsMediaAssetDocument>("cms_media");
}

async function removeDuplicatePages() {
  const pagesCollection = await getCmsPagesCollection();
  const documents = await pagesCollection.find({}).sort({ updatedAt: -1, _id: -1 }).toArray();
  const seen = new Set<CmsPageSlug>();
  const duplicateIds: ObjectId[] = [];

  for (const document of documents) {
    if (seen.has(document.slug)) {
      duplicateIds.push(document._id);
      continue;
    }

    seen.add(document.slug);
  }

  if (duplicateIds.length > 0) {
    await pagesCollection.deleteMany({ _id: { $in: duplicateIds } });
  }
}

async function removeDuplicateSiteSettings() {
  const siteSettingsCollection = await getSiteSettingsCollection();
  const documents = await siteSettingsCollection
    .find({})
    .sort({ updatedAt: -1, _id: -1 })
    .toArray();
  const duplicateIds = documents
    .slice(1)
    .map((document) => document._id)
    .filter(Boolean);

  if (duplicateIds.length > 0) {
    await siteSettingsCollection.deleteMany({ _id: { $in: duplicateIds } });
  }
}

async function removeDuplicateMediaAssets() {
  const mediaCollection = await getMediaCollection();
  const documents = await mediaCollection.find({}).sort({ updatedAt: -1, _id: -1 }).toArray();
  const seen = new Set<string>();
  const duplicateIds: ObjectId[] = [];

  for (const document of documents) {
    if (seen.has(document.publicId)) {
      duplicateIds.push(document._id);
      continue;
    }

    seen.add(document.publicId);
  }

  if (duplicateIds.length > 0) {
    await mediaCollection.deleteMany({ _id: { $in: duplicateIds } });
  }
}

async function ensureCmsCollectionsReady() {
  if (!cmsSetupPromise) {
    cmsSetupPromise = (async () => {
      const [pagesCollection, siteSettingsCollection, mediaCollection] = await Promise.all([
        getCmsPagesCollection(),
        getSiteSettingsCollection(),
        getMediaCollection(),
      ]);

      await Promise.all([
        removeDuplicatePages(),
        removeDuplicateSiteSettings(),
        removeDuplicateMediaAssets(),
      ]);

      await Promise.all([
        pagesCollection.createIndex({ slug: 1 }, { unique: true }),
        siteSettingsCollection.createIndex({ key: 1 }, { unique: true }),
        mediaCollection.createIndex({ publicId: 1 }, { unique: true }),
      ]);

      await Promise.all(
        cmsPageSlugs.map(async (slug) => {
          const page = buildDefaultCmsPage(slug);

          await pagesCollection.updateOne(
            { slug },
            {
              $setOnInsert: {
                slug,
                name: page.name,
                route: page.route,
                summary: page.summary,
                content: page.content,
                updatedAt: new Date(),
              },
            },
            { upsert: true },
          );
        }),
      );

      await siteSettingsCollection.updateOne(
        { key: SITE_SETTINGS_KEY },
        {
          $setOnInsert: {
            key: SITE_SETTINGS_KEY,
            content: defaultSiteSettings,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    })().catch((error) => {
      cmsSetupPromise = null;
      throw error;
    });
  }

  await cmsSetupPromise;
}

export function isCmsPageSlug(value: string): value is CmsPageSlug {
  return cmsPageSlugs.includes(value as CmsPageSlug);
}

export async function ensureCmsSeedData() {
  await ensureCmsCollectionsReady();
}

export async function listCmsPages() {
  noStore();
  await ensureCmsSeedData();
  const pagesCollection = await getCmsPagesCollection();
  const pages = await pagesCollection.find({}).toArray();
  const pagesBySlug = new Map(pages.map((page) => [page.slug, page] as const));

  return cmsPageSlugs.map((slug) => {
    const page = pagesBySlug.get(slug);
    return page ? serializePage(page) : buildDefaultCmsPage(slug);
  });
}

export async function getCmsPage<TSlug extends CmsPageSlug>(
  slug: TSlug,
): Promise<CmsPageDocument<CmsPageContentMap[TSlug]>> {
  noStore();
  try {
    await ensureCmsSeedData();
    const pagesCollection = await getCmsPagesCollection();
    const page = await pagesCollection.findOne({ slug });

    if (!page) {
      return buildDefaultCmsPage(slug);
    }

    return serializePage<CmsPageContentMap[TSlug]>(page);
  } catch {
    return buildDefaultCmsPage(slug);
  }
}

export async function updateCmsPage(
  slug: CmsPageSlug,
  payload: unknown,
): Promise<CmsPageDocument<CmsPageContentMap[CmsPageSlug]>> {
  const input = validatePageUpdate(slug, payload);
  await ensureCmsCollectionsReady();
  const pagesCollection = await getCmsPagesCollection();

  await pagesCollection.updateOne(
    { slug },
    {
      $set: {
        name: input.name,
        summary: input.summary,
        content: input.content,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  const updated = await pagesCollection.findOne({ slug });

  if (!updated) {
    throw new Error("Unable to update page content.");
  }

  return serializePage(updated);
}

export async function getCmsSiteSettings() {
  noStore();
  try {
    await ensureCmsSeedData();
    const siteSettingsCollection = await getSiteSettingsCollection();
    const document = await siteSettingsCollection.findOne({ key: "site-settings" });

    if (!document) {
      return defaultSiteSettings;
    }

    return document.content;
  } catch {
    return defaultSiteSettings;
  }
}

export async function updateCmsSiteSettings(payload: unknown) {
  const nextSettings = validateSiteSettings(payload);
  await ensureCmsCollectionsReady();
  const siteSettingsCollection = await getSiteSettingsCollection();

  await siteSettingsCollection.updateOne(
    { key: SITE_SETTINGS_KEY },
    {
      $set: {
        key: SITE_SETTINGS_KEY,
        content: nextSettings,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  return nextSettings;
}

export async function listCmsMediaAssets() {
  noStore();
  await ensureCmsCollectionsReady();
  const mediaCollection = await getMediaCollection();
  const assets = await mediaCollection
    .find({})
    .sort({ updatedAt: -1, createdAt: -1 })
    .toArray();

  return assets.map(serializeMediaAsset);
}

export async function createCmsMediaAsset(
  payload: Omit<CmsMediaAssetDocument, "createdAt" | "updatedAt">,
) {
  await ensureCmsCollectionsReady();
  const mediaCollection = await getMediaCollection();
  const now = new Date();

  const result = await mediaCollection.insertOne({
    ...payload,
    createdAt: now,
    updatedAt: now,
  });

  const inserted = await mediaCollection.findOne({ _id: result.insertedId });

  if (!inserted) {
    throw new Error("Unable to create media asset.");
  }

  return serializeMediaAsset(inserted);
}

export async function upsertCmsMediaAsset(
  payload: Omit<CmsMediaAssetDocument, "createdAt" | "updatedAt">,
) {
  await ensureCmsCollectionsReady();
  const mediaCollection = await getMediaCollection();
  const now = new Date();

  await mediaCollection.updateOne(
    { publicId: payload.publicId },
    {
      $set: {
        ...payload,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  const asset = await mediaCollection.findOne({ publicId: payload.publicId });

  if (!asset) {
    throw new Error("Unable to upsert media asset.");
  }

  return serializeMediaAsset(asset);
}

export async function deleteCmsMediaAsset(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid media asset id.");
  }

  await ensureCmsCollectionsReady();
  const mediaCollection = await getMediaCollection();
  await mediaCollection.deleteOne({ _id: new ObjectId(id) });
}
