import { defaultHomePageContent } from "@/lib/cms-defaults/home";
import { defaultAboutPageContent } from "@/lib/cms-defaults/pages";
import type {
  CmsMediaItem,
  HomePageContent,
  StandardPageContent,
  StandardSection,
} from "@/lib/cms-types";

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
  const rawSignals = Array.isArray(source.signals) ? source.signals : [];
  const signals =
    rawSignals.length > 0
      ? rawSignals.map((item, index) => {
          const fallbackItem =
            fallback.signals[index] ?? fallback.signals[fallback.signals.length - 1];

          return {
            label: item?.label?.trim() || fallbackItem.label,
            title: item?.title?.trim() || fallbackItem.title,
            detail: item?.detail?.trim() || fallbackItem.detail,
          };
        })
      : fallback.signals;

  return {
    ...fallback,
    ...source,
    signals,
    intro: {
      ...fallback.intro,
      ...(source.intro ?? {}),
    },
    visualChapters: {
      ...fallback.visualChapters,
      ...(source.visualChapters ?? {}),
    },
    testimonials: {
      ...fallback.testimonials,
      ...(source.testimonials ?? {}),
    },
    heritage: {
      ...fallback.heritage,
      ...(source.heritage ?? {}),
    },
    rise: {
      ...fallback.rise,
      ...(source.rise ?? {}),
      spotlight: {
        ...fallback.rise.spotlight,
        ...(source.rise?.spotlight ?? {}),
      },
    },
    campaign: {
      ...fallback.campaign,
      ...(source.campaign ?? {}),
      supportFeature: {
        ...fallback.campaign.supportFeature,
        ...(source.campaign?.supportFeature ?? {}),
      },
    },
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
    pathways: {
      ...fallback.pathways,
      ...(source.pathways ?? {}),
    },
    archive: {
      ...fallback.archive,
      ...(source.archive ?? {}),
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
