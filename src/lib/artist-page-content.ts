import { defaultHomePageContent } from "@/lib/cms-defaults/home";
import { defaultAboutPageContent } from "@/lib/cms-defaults/pages";
import type {
  CmsMediaItem,
  HomePageContent,
  StandardPageContent,
  StandardSection,
} from "@/lib/cms-types";

export const homeResearchSignals = [
  {
    label: "Heritage",
    title: "Azmari Daughter",
    detail:
      "The daughter of Adane Teka turned family legacy into public pride and helped many young Azmari sons and daughters embrace their identity.",
  },
  {
    label: "Journey",
    title: "One Phone to Stages",
    detail:
      "She began with cover songs on a single mobile phone, supported herself through tutoring, and later funded her music through nonstop live performance.",
  },
  {
    label: "Recognition",
    title: "Africa Is Watching",
    detail:
      "African Union recognition, Zikomo Awards wins, and AFRIMA recognition marked a wider pan-African chapter in 2025.",
  },
] as const;

function isGallerySection(
  section: StandardSection,
): section is Extract<StandardSection, { type: "gallery" }> {
  return section.type === "gallery";
}

function isLegacyHomePageContent(source: HomePageContent) {
  return (
    source.intro?.title?.trim() === "Heritage, voice, and the Meteriyaye era." ||
    source.visualChapters?.title?.trim() === "Portraits from the Meteriyaye era." ||
    source.heritage?.title?.trim() === "Adane Teka's daughter carries the legacy forward." ||
    source.archive?.title?.trim() === "The full story lives here."
  );
}

function isLegacyAboutPageContent(source: StandardPageContent) {
  const sectionIds = Array.isArray(source.sections)
    ? source.sections.map((section) => section.id)
    : [];

  return (
    source.hero?.title?.trim() ===
      "A journey shaped by faith, study, sacrifice, and the courage to keep going." ||
    sectionIds.includes("biography-chapters") ||
    sectionIds.includes("meteriyaye")
  );
}

export function getHomePageContent(source?: HomePageContent): HomePageContent {
  const fallback = defaultHomePageContent;

  if (!source || isLegacyHomePageContent(source)) {
    return fallback;
  }

  const rawPlaylists = source.playlists;
  const fallbackPlaylists = fallback.playlists;
  const rawPlaylistItems = Array.isArray(rawPlaylists?.items) ? rawPlaylists.items : [];
  const playlistItems = Array.from(
    { length: Math.max(rawPlaylistItems.length, fallbackPlaylists.items.length) },
    (_, index) => {
      const item = rawPlaylistItems[index];
      const fallbackItem =
        fallbackPlaylists.items[index] ??
        fallbackPlaylists.items[fallbackPlaylists.items.length - 1];

      return {
        title: item?.title?.trim() || fallbackItem.title,
        href: item?.href?.trim() || fallbackItem.href,
        playlistId: item?.playlistId?.trim() || fallbackItem.playlistId,
        previewVideoId: item?.previewVideoId?.trim() || fallbackItem.previewVideoId,
        accent: item?.accent?.trim() || fallbackItem.accent,
        description: item?.description?.trim() || fallbackItem.description,
        note: item?.note?.trim() || fallbackItem.note,
        stat: item?.stat?.trim() || fallbackItem.stat,
      };
    },
  );
  const highlights =
    Array.isArray(rawPlaylists?.highlights) &&
    rawPlaylists.highlights.some((item) => typeof item === "string" && item.trim())
      ? rawPlaylists.highlights
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean)
      : fallbackPlaylists.highlights;

  return {
    ...fallback,
    ...source,
    playlists: {
      ...fallbackPlaylists,
      ...rawPlaylists,
      channelAction: {
        ...fallbackPlaylists.channelAction,
        ...(rawPlaylists?.channelAction ?? {}),
      },
      highlights,
      items: playlistItems,
    },
  };
}

export function getAboutPageContent(source?: StandardPageContent): StandardPageContent {
  if (!source || isLegacyAboutPageContent(source)) {
    return defaultAboutPageContent;
  }

  return source;
}

function normalizeMediaItem(candidate: unknown): CmsMediaItem | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const item = candidate as Partial<CmsMediaItem>;
  const url = typeof item.url === "string" ? item.url.trim() : "";

  if (!url) {
    return null;
  }

  if (item.resourceType && item.resourceType !== "image") {
    return null;
  }

  return {
    url,
    alt:
      typeof item.alt === "string" && item.alt.trim()
        ? item.alt.trim()
        : "Veronica Adane media image",
    publicId: item.publicId,
    resourceType: "image",
    position: item.position,
    label: item.label,
    placeholderBase: item.placeholderBase,
    placeholderHighlight: item.placeholderHighlight,
  };
}

export function getSelectedMediaGridItems(source?: StandardPageContent) {
  const sections = Array.isArray(source?.sections) ? source.sections : [];
  const gallerySections = sections.filter(isGallerySection);
  const seen = new Set<string>();
  const items: CmsMediaItem[] = [];

  for (const section of gallerySections) {
    for (const rawItem of section.items) {
      const item = normalizeMediaItem(rawItem);

      if (!item || seen.has(item.url)) {
        continue;
      }

      seen.add(item.url);
      items.push(item);
    }
  }

  return items;
}
