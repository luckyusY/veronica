import { defaultMediaLibrary } from "@/lib/cms-defaults/shared";
import type {
  CmsMediaItem,
  HomePageContent,
  StandardPageContent,
  StandardSection,
} from "@/lib/cms-types";

// Public-facing narrative copy is grounded in published profiles and catalogue
// listings, especially SBS Amharic, Apple Music, and SoundCloud.

function mergeMediaItem(candidate: unknown, fallback: CmsMediaItem): CmsMediaItem {
  if (!candidate || typeof candidate !== "object") {
    return fallback;
  }

  const item = candidate as Partial<CmsMediaItem>;
  const url = typeof item.url === "string" ? item.url.trim() : "";

  if (!url) {
    return fallback;
  }

  return {
    ...fallback,
    ...item,
    url,
    alt: typeof item.alt === "string" && item.alt.trim() ? item.alt.trim() : fallback.alt,
  };
}

function mergeMediaList(candidates: unknown, fallbacks: readonly CmsMediaItem[]) {
  const list = Array.isArray(candidates) ? candidates : [];
  return fallbacks.map((fallback, index) => mergeMediaItem(list[index], fallback));
}

function hasImageSection(
  section: StandardSection,
): section is Extract<StandardSection, { image: CmsMediaItem }> {
  return "image" in section;
}

function isGallerySection(
  section: StandardSection,
): section is Extract<StandardSection, { type: "gallery" }> {
  return section.type === "gallery";
}

const homeImages = {
  heroSlides: [
    defaultMediaLibrary.hero,
    defaultMediaLibrary.cliff,
    defaultMediaLibrary.heartMid,
    defaultMediaLibrary.furClose,
  ] as const,
  intro: defaultMediaLibrary.cliff,
  visualChapters: [
    defaultMediaLibrary.furSeated,
    defaultMediaLibrary.stage,
    defaultMediaLibrary.heartClose,
  ] as const,
  heritage: defaultMediaLibrary.microphone,
  rise: [defaultMediaLibrary.heartClose, defaultMediaLibrary.crowd] as const,
  campaignFeature: defaultMediaLibrary.aerialCrowd,
  campaignSupport: [defaultMediaLibrary.stage, defaultMediaLibrary.furSeated] as const,
} as const;

const aboutImages = {
  hero: defaultMediaLibrary.cliff,
  sections: [
    defaultMediaLibrary.furSeated,
    defaultMediaLibrary.stage,
    defaultMediaLibrary.microphone,
  ] as const,
} as const;

export const homeResearchSignals = [
  {
    label: "Album",
    title: "Meteriyaye",
    detail:
      "Apple Music and SoundCloud both list Meteriyaye as a Veronica Adane album from 2024.",
  },
  {
    label: "Track count",
    title: "12 songs",
    detail:
      "Apple Music lists 12 songs and SoundCloud lists 12 tracks for the same project.",
  },
  {
    label: "Interview theme",
    title: "Love, hope, unity",
    detail:
      "In SBS Amharic, Veronica described the album around love, hope, unity, patriotism, and peace for Ethiopia.",
  },
] as const;

const researchedHomePageContent: HomePageContent = {
  hero: {
    verticalLabel: "VERONICA ADANE / OFFICIAL",
    headlineTop: "Veronica Adane",
    headlineLines: ["music, catalogue,", "and official imagery"],
    primaryAction: { href: "/about", label: "Read Biography" },
    secondaryAction: { href: "/media", label: "View Official Images" },
    slides: [
      {
        eyebrow: "Meteriyaye",
        title: "Meteriyaye sits at the center of the current public catalogue.",
        copy:
          "Apple Music and SoundCloud both present Meteriyaye as Veronica Adane's 2024 album, which makes it the clearest anchor for the homepage.",
        image: homeImages.heroSlides[0],
        stat: "2024 album",
        accent: "Album era",
      },
      {
        eyebrow: "Release history",
        title: "The catalogue already shows a steady run of singles before the album.",
        copy:
          "Apple Music lists earlier singles including Tewu in 2021, Kurfya in 2022, and Enaney and Abebaye in 2023 before the album arrives.",
        image: homeImages.heroSlides[1],
        stat: "2021 to 2024",
        accent: "Release line",
      },
      {
        eyebrow: "Interview",
        title: "Veronica's own words give the album its clearest meaning.",
        copy:
          "In SBS Amharic, Veronica described Meteriyaye as an album centered on love, hope, unity, patriotism, and peace for Ethiopia.",
        image: homeImages.heroSlides[2],
        stat: "SBS Amharic",
        accent: "Message",
      },
      {
        eyebrow: "Official platform",
        title: "One place for biography, music, press, and selected imagery.",
        copy:
          "The homepage now does a simpler job: show the verified release history, keep the wording grounded, and let the official visuals lead.",
        image: homeImages.heroSlides[3],
        stat: "Music / media / archive",
        accent: "Official site",
      },
    ],
  },
  intro: {
    eyebrow: "Overview",
    title: "A homepage built around the catalogue and the official image library.",
    paragraphs: [
      "Veronica Adane is an Ethiopian singer with a public catalogue that includes singles, music videos, and the 2024 album Meteriyaye.",
      "Apple Music lists Meteriyaye as a 12-song release running 51 minutes, and SoundCloud also presents it as a 12-track album from late August 2024.",
      "That gives the homepage a clear job: introduce the current music era, surface official visuals, and route visitors into the biography, media grid, and music pages.",
    ],
    image: homeImages.intro,
    stats: [
      {
        value: "12",
        label: "Songs on the album",
        detail: "Apple Music lists 12 songs and SoundCloud lists 12 tracks for Meteriyaye.",
      },
      {
        value: "51 min",
        label: "Album runtime",
        detail: "Apple Music lists Meteriyaye at 51 minutes.",
      },
      {
        value: "2021",
        label: "Earlier listed singles",
        detail: "Apple Music shows singles before the album, including releases from 2021 onward.",
      },
    ],
  },
  visualChapters: {
    eyebrow: "Selected Images",
    title: "Official portraiture and campaign imagery",
    description:
      "Official portraits and campaign stills now do the visual work while the text stays close to the release history.",
    chips: ["Portraits", "Meteriyaye", "Press", "Campaigns"],
    items: [
      {
        title: "Official portrait",
        era: "Biography",
        note: "A restrained studio image for biography, press, and first impressions.",
        image: homeImages.visualChapters[0],
      },
      {
        title: "Album-era styling",
        era: "Meteriyaye",
        note: "A cinematic look that supports the current release period.",
        image: homeImages.visualChapters[1],
      },
      {
        title: "Campaign colour",
        era: "Public image",
        note: "A sharper glamour direction for artwork, features, and press-facing moments.",
        image: homeImages.visualChapters[2],
      },
    ],
  },
  testimonials: {
    eyebrow: "",
    title: "",
    description: "",
    items: [],
  },
  heritage: {
    eyebrow: "Catalogue focus",
    title: "The home page should stay close to the music and the official visuals.",
    description:
      "That keeps the story honest. Instead of padded claims, visitors get the album, the release history, the interview framing, and the selected image archive.",
    tags: ["Meteriyaye", "Singles", "Videos", "Official images"],
    image: homeImages.heritage,
  },
  rise: {
    eyebrow: "Release line",
    title: "The release history is clearer than generic marketing language.",
    description:
      "Apple Music already gives the homepage a simple timeline: earlier singles in 2021, 2022, and 2023, followed by the full album cycle in 2024.",
    nationalNote:
      "Apple Music lists Tewu and Tefet Alegn in 2021, Kurfya in 2022, and Enaney and Abebaye in 2023 before Meteriyaye.",
    internationalNote:
      "Apple Music also shows a 2025 live-performance release, so the catalogue now reads as an active timeline rather than a single isolated project.",
    images: [...homeImages.rise],
  },
  campaign: {
    eyebrow: "Current Focus",
    title: "Music, press, and image now need to work as one clean public system.",
    description:
      "The strongest version of the homepage is straightforward: verified release history, official photography, and direct links into deeper pages.",
    featureImage: homeImages.campaignFeature,
    supportingImages: [...homeImages.campaignSupport],
  },
  pathways: {
    eyebrow: "Go Deeper",
    title: "Open the biography, the catalogue, and the image archive.",
    description:
      "Once the introduction is clear, the rest of the site should move people directly into the most useful destinations.",
    items: [
      {
        title: "About",
        href: "/about",
        accent: "Biography",
        description:
          "Read the fuller profile page and keep the homepage focused on the catalogue, the visuals, and the core introduction.",
        note: "Longer artist profile",
      },
      {
        title: "Music & Videos",
        href: "/music",
        accent: "Catalogue",
        description:
          "Move straight into the releases, videos, and songs that make up the public discography.",
        note: "Singles, album, videos",
      },
      {
        title: "Media",
        href: "/media",
        accent: "Official images",
        description:
          "View the selected image grid without extra filler, so press and partners can find approved visuals fast.",
        note: "Selected image archive",
      },
    ],
  },
  archive: {
    eyebrow: "Official Presence",
    title: "The site now keeps the story concise and the imagery forward.",
    description:
      "Instead of overexplaining Veronica, the platform now lets the clearest release facts and the official images do the work together.",
    primaryAction: { href: "/media", label: "Open Media Grid" },
    secondaryAction: { href: "/about", label: "Read About Veronica" },
    credits: [
      {
        label: "2024 album listing",
        note: "Meteriyaye appears on both Apple Music and SoundCloud as the central album-era project.",
      },
      {
        label: "12-song tracklist",
        note: "Apple Music and SoundCloud both show the album as a 12-song or 12-track release.",
      },
      {
        label: "51-minute runtime",
        note: "Apple Music gives the album a concrete runtime that helps the page stay factual.",
      },
      {
        label: "Singles before the album",
        note: "Apple Music shows releases from 2021, 2022, and 2023 leading into Meteriyaye.",
      },
      {
        label: "SBS interview framing",
        note: "Veronica described the album around love, hope, unity, patriotism, and peace.",
      },
      {
        label: "Official images",
        note: "The public image library now carries more of the introduction without added filler.",
      },
    ],
  },
};

const researchedAboutPageContent: StandardPageContent = {
  hero: {
    eyebrow: "About Veronica",
    title: "A story grounded in Addis Ababa, family legacy, study, and music.",
    description:
      "The clearest published picture of Veronica Adane begins with Addis Ababa, carries through journalism and communication studies, and arrives at a catalogue now defined by the Meteriyaye era.",
    highlightWords: ["Addis Ababa", "study", "music"],
    image: aboutImages.hero,
    imageMotionPreset: "from-right",
    imageLabel: "Official Veronica Adane portrait",
    noteTitle: "Public biography",
    noteText:
      "This page is written around public profiles, album coverage, and Veronica's own interview language around Meteriyaye.",
    primaryCta: { href: "/music", label: "Explore Music" },
    secondaryCta: { href: "/media", label: "View Media Grid" },
  },
  sections: [
    {
      id: "roots",
      type: "split",
      theme: "paper",
      eyebrow: "Roots",
      title: "Born and raised in Addis Ababa, with music already close to home.",
      description:
        "Public profile material describes Veronica as an Addis Ababa artist and links her to the performance legacy of her father, Adane Teka. That gives the biography cultural context before the newer release milestones even begin.",
      body: [
        "Her public story is strongest when it starts with place, family, and a creative identity that was not built from nowhere.",
        "It also helps explain why the site should feel intentional and dignified rather than crowded with generic marketing language.",
      ],
      image: aboutImages.sections[0],
      imageSide: "right",
      imageMotionPreset: "from-right",
      tallImage: true,
      cards: [
        {
          title: "Addis Ababa",
          description: "The city remains the grounding reference point in public profiles.",
        },
        {
          title: "Adane Teka",
          description: "Family legacy matters because performance was already part of the story.",
        },
        {
          title: "Identity",
          description: "The public image works best when culture and polish are shown together.",
        },
      ],
      cardVariant: "note",
    },
    {
      id: "trajectory",
      type: "timeline",
      theme: "dark",
      eyebrow: "Trajectory",
      title: "Study, early releases, and a wider breakthrough.",
      description:
        "These are the recurring milestones that give Veronica Adane's biography real shape.",
      items: [
        "Born and raised in Addis Ababa.",
        "Studied journalism and communication at Mekelle University.",
        "Built early visibility through spiritual songs, mashups, and cover videos shared online.",
        "Released the single Nalegn in 2020 and kept expanding the catalogue through later singles.",
        "Released the 12-track album Meteriyaye in August 2024; Addis Insight reported its acquisition by Zojak Worldwide in a record-setting deal.",
      ],
    },
    {
      id: "meteriyaye",
      type: "cards",
      theme: "paper",
      eyebrow: "Meteriyaye",
      title: "The project that sharpened the public narrative.",
      description:
        "Recent coverage gives the site three concrete anchors for the current era.",
      items: [
        {
          title: "12-track album",
          description:
            "SoundCloud lists Meteriyaye as a 12-track project released in late August 2024.",
        },
        {
          title: "Zojak Worldwide acquisition",
          description:
            "Addis Insight reported a record-setting deal that linked the album to wider distribution.",
        },
        {
          title: "Love, hope, unity, and peace",
          description:
            "SBS Amharic described Veronica's own framing of the album around love, hope, unity, patriotism, and peace for Ethiopia.",
        },
      ],
      columns: 3,
      cardVariant: "note",
    },
    {
      id: "public-presence",
      type: "split",
      theme: "dark",
      eyebrow: "Public presence",
      title: "A modern artist identity built across songs, visuals, and media visibility.",
      description:
        "What emerges from recent profiles is not just a catalogue, but a broader public presence: polished visuals, emotionally direct songs, and a biography that keeps returning to discipline, study, and steady growth.",
      image: aboutImages.sections[2],
      imageSide: "left",
      imageMotionPreset: "from-left",
      tallImage: true,
      cards: [
        {
          title: "Music",
          description: "The catalogue gives the story its emotional center.",
        },
        {
          title: "Image",
          description: "Official portraits and campaign visuals now carry more of the introduction.",
        },
        {
          title: "Press",
          description: "Biography, album coverage, and selected imagery now align more cleanly.",
        },
      ],
      cardVariant: "dark-note",
    },
  ],
};

export function getHomePageContent(source?: HomePageContent): HomePageContent {
  return {
    ...researchedHomePageContent,
    hero: {
      ...researchedHomePageContent.hero,
      slides: researchedHomePageContent.hero.slides.map((slide, index) => ({
        ...slide,
        image: mergeMediaItem(source?.hero?.slides?.[index]?.image, homeImages.heroSlides[index]),
      })),
    },
    intro: {
      ...researchedHomePageContent.intro,
      image: mergeMediaItem(source?.intro?.image, homeImages.intro),
    },
    visualChapters: {
      ...researchedHomePageContent.visualChapters,
      items: researchedHomePageContent.visualChapters.items.map((item, index) => ({
        ...item,
        image: mergeMediaItem(source?.visualChapters?.items?.[index]?.image, homeImages.visualChapters[index]),
      })),
    },
    heritage: {
      ...researchedHomePageContent.heritage,
      image: mergeMediaItem(source?.heritage?.image, homeImages.heritage),
    },
    rise: {
      ...researchedHomePageContent.rise,
      images: mergeMediaList(source?.rise?.images, homeImages.rise),
    },
    campaign: {
      ...researchedHomePageContent.campaign,
      featureImage: mergeMediaItem(source?.campaign?.featureImage, homeImages.campaignFeature),
      supportingImages: mergeMediaList(source?.campaign?.supportingImages, homeImages.campaignSupport),
    },
  };
}

export function getAboutPageContent(source?: StandardPageContent): StandardPageContent {
  const sourceSectionImages = Array.isArray(source?.sections)
    ? source.sections.filter(hasImageSection).map((section) => section.image)
    : [];

  let imageIndex = 0;

  return {
    hero: {
      ...researchedAboutPageContent.hero,
      image: mergeMediaItem(source?.hero?.image, aboutImages.hero),
    },
    sections: researchedAboutPageContent.sections.map((section) => {
      if (!hasImageSection(section)) {
        return section;
      }

      const mergedSection = {
        ...section,
        image: mergeMediaItem(sourceSectionImages[imageIndex], section.image),
      };

      imageIndex += 1;
      return mergedSection;
    }),
  };
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
