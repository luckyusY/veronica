import type { CmsMediaAsset, CmsSiteSettings } from "./cms-types";

export type FeedbackState = {
  tone: "ok" | "error";
  message: string;
} | null;

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export function prettyPrint(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function cloneSettings(value: CmsSiteSettings) {
  return JSON.parse(JSON.stringify(value)) as CmsSiteSettings;
}

export function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function countMediaReferences(value: unknown) {
  let images = 0;
  let videos = 0;

  function visit(entry: unknown) {
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }

    if (!isPlainObject(entry)) {
      return;
    }

    const publicId = typeof entry.publicId === "string" ? entry.publicId : "";
    const url =
      typeof entry.url === "string"
        ? entry.url
        : typeof entry.secureUrl === "string"
          ? entry.secureUrl
          : "";
    const resourceType = typeof entry.resourceType === "string" ? entry.resourceType : "";

    if (publicId || url) {
      if (resourceType === "video" || publicId.includes("/videos/") || url.includes("/video/")) {
        videos += 1;
      } else {
        images += 1;
      }
    }

    Object.values(entry).forEach(visit);
  }

  visit(value);

  return { images, videos };
}

export function summarizePageContent(value: unknown) {
  const content = isPlainObject(value) ? value : {};
  const sectionKeys = Object.keys(content);
  const hero = isPlainObject(content.hero) ? content.hero : null;
  const heroSlides =
    hero && Array.isArray(hero.slides) ? hero.slides.length : 0;
  const media = countMediaReferences(content);

  return {
    sectionKeys,
    heroSlides,
    images: media.images,
    videos: media.videos,
  };
}

export function mergeMediaAssets(current: CmsMediaAsset[], incoming: CmsMediaAsset[]) {
  const merged = new Map<string, CmsMediaAsset>();

  [...incoming, ...current].forEach((asset) => {
    merged.set(asset.publicId, asset);
  });

  return [...merged.values()].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function toMultiline(items: string[]) {
  return items.join("\n");
}

export function fromMultiline(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeUtilityLinks(links: CmsSiteSettings["footer"]["utilityLinks"]) {
  return links.map((item) => `${item.label} | ${item.href}`).join("\n");
}

export function parseUtilityLinks(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|").map((item) => item.trim());
      return { label: label ?? "", href: href ?? "" };
    })
    .filter((item) => item.label && item.href);
}
