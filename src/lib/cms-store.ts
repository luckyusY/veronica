import "server-only";

import { type WithId, ObjectId } from "mongodb";
import { unstable_noStore as noStore } from "next/cache";
import {
  buildDefaultCmsPage,
  buildDefaultCmsPageWorkspace,
  defaultCmsPageContent,
  defaultSiteSettings,
} from "@/lib/cms-defaults";
import {
  type CmsMediaAsset,
  type CmsPageContentMap,
  type CmsPageDocument,
  type CmsPageDraftSnapshot,
  type CmsPageEditorInput,
  type CmsPagePublishedSnapshot,
  cmsPageSlugs,
  type CmsPageSlug,
  type CmsPageWorkspaceDocument,
  type CmsSiteSettings,
} from "@/lib/cms-types";
import { rebuildMediaUsageIndex } from "@/lib/db/media-usage";
import { getDatabase } from "@/lib/mongodb";
import { getCmsPageEditorSchema } from "@/lib/schemas/cms-pages";

type CmsPagePublishedDbDocument = {
  content: unknown | null;
  publishedAt: Date | null;
  publishedBy: string | null;
};

type CmsPageDraftDbDocument = {
  content: unknown | null;
  savedAt: Date | null;
  savedBy: string | null;
};

type CmsPageDbDocument = {
  slug: CmsPageSlug;
  name: string;
  route: string;
  summary: string;
  published: CmsPagePublishedDbDocument;
  draft: CmsPageDraftDbDocument;
  createdAt: Date;
  updatedAt: Date;
};

type CmsLegacyPageDbDocument = {
  slug: CmsPageSlug;
  name?: string;
  route?: string;
  summary?: string;
  content?: unknown;
  published?: CmsPagePublishedDbDocument;
  draft?: CmsPageDraftDbDocument;
  createdAt?: Date;
  updatedAt?: Date;
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

const SITE_SETTINGS_KEY = "site-settings" as const;
const SYSTEM_MIGRATION_USER = "system-migration";

let cmsSetupPromise: Promise<void> | null = null;

function sanitizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function getDefaultPageContent<TSlug extends CmsPageSlug>(slug: TSlug) {
  return defaultCmsPageContent[slug];
}

function areContentsEqual(left: unknown, right: unknown) {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function serializePublishedSnapshot<TContent>(
  snapshot: CmsPagePublishedDbDocument | undefined,
): CmsPagePublishedSnapshot<TContent> {
  return {
    content: (snapshot?.content ?? null) as TContent | null,
    publishedAt: snapshot?.publishedAt ? snapshot.publishedAt.toISOString() : null,
    publishedBy: snapshot?.publishedBy ?? null,
  };
}

function serializeDraftSnapshot<TContent>(
  snapshot: CmsPageDraftDbDocument | undefined,
): CmsPageDraftSnapshot<TContent> {
  return {
    content: (snapshot?.content ?? null) as TContent | null,
    savedAt: snapshot?.savedAt ? snapshot.savedAt.toISOString() : null,
    savedBy: snapshot?.savedBy ?? null,
  };
}

function getWorkspaceStatus(document: CmsPageDbDocument) {
  if (
    document.draft.content &&
    !areContentsEqual(document.draft.content, document.published.content)
  ) {
    return "draft-pending" as const;
  }

  if (document.published.publishedAt || document.published.publishedBy) {
    return "published" as const;
  }

  return "never-published" as const;
}

function serializeWorkspacePage<TContent>(
  document: CmsPageDbDocument,
): CmsPageWorkspaceDocument<TContent> {
  const defaultPage = buildDefaultCmsPageWorkspace(document.slug);
  const publishedContent =
    (document.published.content as TContent | null) ?? defaultPage.published.content;
  const draftContent = (document.draft.content as TContent | null) ?? null;
  const activeContent = draftContent ?? publishedContent;

  return {
    slug: document.slug,
    name: document.name,
    route: document.route,
    summary: document.summary,
    content: activeContent as TContent,
    published: serializePublishedSnapshot<TContent>(document.published),
    draft: serializeDraftSnapshot<TContent>(document.draft),
    status: getWorkspaceStatus(document),
    updatedAt: document.updatedAt.toISOString(),
  };
}

function serializePublicPage<TContent>(document: CmsPageDbDocument): CmsPageDocument<TContent> {
  const defaultPage = buildDefaultCmsPage(document.slug);
  const publishedContent =
    ((document.published.content as TContent | null) ?? defaultPage.content) as TContent;

  return {
    slug: document.slug,
    name: document.name,
    route: document.route,
    summary: document.summary,
    content: publishedContent,
    updatedAt:
      document.published.publishedAt?.toISOString() ?? document.updatedAt.toISOString(),
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

  const validationResult = getCmsPageEditorSchema(slug).safeParse({
    name,
    summary,
    content,
  });

  if (!validationResult.success) {
    throw new Error(validationResult.error.issues[0]?.message ?? "Page content is invalid.");
  }

  return validationResult.data as CmsPageEditorInput<CmsPageContentMap[CmsPageSlug]>;
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

  const rawCollabImages = (payload as Record<string, unknown>).collabImages;

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
    collabImages: Array.isArray(rawCollabImages)
      ? rawCollabImages.map(sanitizeText).filter(Boolean)
      : [],
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

async function migrateLegacyPages() {
  const pagesCollection = await getCmsPagesCollection();
  const documents = await pagesCollection.find({}).toArray();

  for (const document of documents as Array<WithId<CmsLegacyPageDbDocument>>) {
    const legacyContent = "content" in document ? document.content : undefined;
    const hasLegacyShape = legacyContent !== undefined;
    const hasPublishedShape = isPlainObject(document.published);
    const hasDraftShape = isPlainObject(document.draft);
    const needsMigration =
      hasLegacyShape ||
      !hasPublishedShape ||
      !hasDraftShape ||
      !isDate(document.createdAt) ||
      !isDate(document.updatedAt);

    if (!needsMigration) {
      continue;
    }

    const defaultPage = buildDefaultCmsPage(document.slug);
    const updatedAt = isDate(document.updatedAt) ? document.updatedAt : new Date();
    const createdAt = isDate(document.createdAt) ? document.createdAt : updatedAt;
    const nextPublished: CmsPagePublishedDbDocument = hasPublishedShape
      ? {
          content:
            document.published?.content ??
            (legacyContent ?? getDefaultPageContent(document.slug)),
          publishedAt: isDate(document.published?.publishedAt)
            ? document.published?.publishedAt ?? null
            : legacyContent !== undefined
              ? updatedAt
              : null,
          publishedBy:
            sanitizeText(document.published?.publishedBy) ||
            (legacyContent !== undefined ? SYSTEM_MIGRATION_USER : null),
        }
      : {
          content: legacyContent ?? getDefaultPageContent(document.slug),
          publishedAt: legacyContent !== undefined ? updatedAt : null,
          publishedBy: legacyContent !== undefined ? SYSTEM_MIGRATION_USER : null,
        };
    const nextDraft: CmsPageDraftDbDocument = hasDraftShape
      ? {
          content: document.draft?.content ?? null,
          savedAt: isDate(document.draft?.savedAt) ? document.draft?.savedAt ?? null : null,
          savedBy: sanitizeText(document.draft?.savedBy) || null,
        }
      : {
          content: null,
          savedAt: null,
          savedBy: null,
        };

    await pagesCollection.updateOne(
      { _id: document._id },
      {
        $set: {
          slug: document.slug,
          name: sanitizeText(document.name) || defaultPage.name,
          route: sanitizeText(document.route) || defaultPage.route,
          summary: sanitizeText(document.summary) || defaultPage.summary,
          published: nextPublished,
          draft: nextDraft,
          createdAt,
          updatedAt,
        },
        $unset: {
          content: "",
        },
      },
    );
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

      await migrateLegacyPages();

      await Promise.all([
        pagesCollection.createIndex({ slug: 1 }, { unique: true }),
        siteSettingsCollection.createIndex({ key: 1 }, { unique: true }),
        mediaCollection.createIndex({ publicId: 1 }, { unique: true }),
      ]);

      await Promise.all(
        cmsPageSlugs.map(async (slug) => {
          const page = buildDefaultCmsPage(slug);
          const now = new Date();

          await pagesCollection.updateOne(
            { slug },
            {
              $setOnInsert: {
                slug,
                name: page.name,
                route: page.route,
                summary: page.summary,
                published: {
                  content: page.content,
                  publishedAt: null,
                  publishedBy: null,
                },
                draft: {
                  content: null,
                  savedAt: null,
                  savedBy: null,
                },
                createdAt: now,
                updatedAt: now,
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

async function getPageDocument(slug: CmsPageSlug) {
  await ensureCmsCollectionsReady();
  const pagesCollection = await getCmsPagesCollection();
  const document = await pagesCollection.findOne({ slug });

  if (document) {
    return document;
  }

  return null;
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
    return page ? serializeWorkspacePage(page) : buildDefaultCmsPageWorkspace(slug);
  });
}

export async function getCmsPage<TSlug extends CmsPageSlug>(
  slug: TSlug,
): Promise<CmsPageDocument<CmsPageContentMap[TSlug]>> {
  // NOTE: noStore() removed — public pages use ISR via the page-level
  // `export const revalidate = N` directive instead of per-request opt-out.
  // Admin routes use getCmsWorkspacePage() which keeps noStore().
  try {
    const page = await getPageDocument(slug);

    if (!page) {
      return buildDefaultCmsPage(slug);
    }

    return serializePublicPage<CmsPageContentMap[TSlug]>(page);
  } catch {
    return buildDefaultCmsPage(slug);
  }
}

export async function getCmsWorkspacePage<TSlug extends CmsPageSlug>(
  slug: TSlug,
): Promise<CmsPageWorkspaceDocument<CmsPageContentMap[TSlug]>> {
  noStore();
  const page = await getPageDocument(slug);

  if (!page) {
    return buildDefaultCmsPageWorkspace(slug);
  }

  return serializeWorkspacePage<CmsPageContentMap[TSlug]>(page);
}

export async function saveCmsPageDraft(
  slug: CmsPageSlug,
  payload: unknown,
  savedBy: string,
): Promise<CmsPageWorkspaceDocument<CmsPageContentMap[CmsPageSlug]>> {
  const input = validatePageUpdate(slug, payload);
  await ensureCmsCollectionsReady();
  const pagesCollection = await getCmsPagesCollection();
  const existingPage = await pagesCollection.findOne({ slug });

  if (!existingPage) {
    throw new Error("Unknown CMS page.");
  }

  const now = new Date();
  const nextDraftContent = areContentsEqual(input.content, existingPage.published.content)
    ? null
    : input.content;

  await pagesCollection.updateOne(
    { slug },
    {
      $set: {
        name: input.name,
        summary: input.summary,
        "draft.content": nextDraftContent,
        "draft.savedAt": nextDraftContent ? now : null,
        "draft.savedBy": nextDraftContent ? savedBy : null,
        updatedAt: now,
      },
    },
    { upsert: false },
  );

  const updated = await pagesCollection.findOne({ slug });

  if (!updated) {
    throw new Error("Unable to save page draft.");
  }

  await rebuildMediaUsageIndex();

  return serializeWorkspacePage(updated);
}

export async function publishCmsPageDraft(
  slug: CmsPageSlug,
  publishedBy: string,
): Promise<CmsPageWorkspaceDocument<CmsPageContentMap[CmsPageSlug]>> {
  await ensureCmsCollectionsReady();
  const pagesCollection = await getCmsPagesCollection();
  const page = await pagesCollection.findOne({ slug });

  if (!page) {
    throw new Error("Unknown CMS page.");
  }

  const draftContent = page.draft.content;

  if (!draftContent) {
    throw new Error("There is no draft to publish.");
  }

  const now = new Date();

  await pagesCollection.updateOne(
    { slug },
    {
      $set: {
        published: {
          content: draftContent,
          publishedAt: now,
          publishedBy,
        },
        draft: {
          content: null,
          savedAt: null,
          savedBy: null,
        },
        updatedAt: now,
      },
    },
  );

  const updated = await pagesCollection.findOne({ slug });

  if (!updated) {
    throw new Error("Unable to publish page draft.");
  }

  await rebuildMediaUsageIndex();

  return serializeWorkspacePage(updated);
}

export async function discardCmsPageDraft(
  slug: CmsPageSlug,
): Promise<CmsPageWorkspaceDocument<CmsPageContentMap[CmsPageSlug]>> {
  await ensureCmsCollectionsReady();
  const pagesCollection = await getCmsPagesCollection();

  await pagesCollection.updateOne(
    { slug },
    {
      $set: {
        draft: {
          content: null,
          savedAt: null,
          savedBy: null,
        },
        updatedAt: new Date(),
      },
    },
  );

  const updated = await pagesCollection.findOne({ slug });

  if (!updated) {
    throw new Error("Unable to discard page draft.");
  }

  await rebuildMediaUsageIndex();

  return serializeWorkspacePage(updated);
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
  const existing = await mediaCollection.findOne({ _id: new ObjectId(id) });

  if (!existing) {
    throw new Error("Media asset not found.");
  }

  await mediaCollection.deleteOne({ _id: existing._id });
  return serializeMediaAsset(existing);
}

export async function getCmsMediaAsset(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid media asset id.");
  }

  await ensureCmsCollectionsReady();
  const mediaCollection = await getMediaCollection();
  const asset = await mediaCollection.findOne({ _id: new ObjectId(id) });

  if (!asset) {
    return null;
  }

  return serializeMediaAsset(asset);
}
