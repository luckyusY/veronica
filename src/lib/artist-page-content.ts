import { defaultMediaLibrary } from "@/lib/cms-defaults/shared";
import type {
  CmsMediaItem,
  HomePageContent,
  StandardPageContent,
  StandardSection,
} from "@/lib/cms-types";

// Public-facing narrative copy is grounded in published profiles and coverage,
// especially SBS Amharic and Addis Insight coverage around Meteriyaye.

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
    label: "Album rollout",
    title: "August 2024",
    detail:
      "Addis Insight reported Meteriyaye's August 24, 2024 release and its record-setting acquisition.",
  },
  {
    label: "Project scale",
    title: "12 tracks",
    detail:
      "SoundCloud lists Meteriyaye as a 12-track album, giving the site a clear anchor for the current era.",
  },
  {
    label: "Core message",
    title: "Love, hope, unity",
    detail:
      "SBS Amharic describes the album as carrying love, hope, unity, and a wish for peace in Ethiopia.",
  },
] as const;

const researchedHomePageContent: HomePageContent = {
  hero: {
    verticalLabel: "VERONICA ADANE / OFFICIAL",
    headlineTop: "Veronica Adane",
    headlineLines: ["music, image,", "and stage presence"],
    primaryAction: { href: "/about", label: "Read Biography" },
    secondaryAction: { href: "/media", label: "View Official Images" },
    slides: [
      {
        eyebrow: "Meteriyaye",
        title: "A major album era that pushed her story onto a larger stage.",
        copy:
          "Recent coverage around Meteriyaye framed Veronica Adane as an Ethiopian artist moving with bigger scale, sharper imagery, and stronger international distribution.",
        image: homeImages.heroSlides[0],
        stat: "17 million birr deal",
        accent: "Album era",
      },
      {
        eyebrow: "Artist story",
        title: "An Addis Ababa artist shaped by family legacy, study, and steady work.",
        copy:
          "Published profiles describe Veronica as born and raised in Addis Ababa, trained in journalism and communication, and shaped by the artistic legacy of her father, Adane Teka.",
        image: homeImages.heroSlides[1],
        stat: "Addis Ababa roots",
        accent: "Biography",
      },
      {
        eyebrow: "Voice and message",
        title: "Songs that pair polished imagery with emotional directness.",
        copy:
          "In SBS Amharic, Veronica described Meteriyaye as an album centered on love, hope, unity, patriotism, and peace for Ethiopia.",
        image: homeImages.heroSlides[2],
        stat: "Love, hope, unity",
        accent: "Message",
      },
      {
        eyebrow: "Official platform",
        title: "One place for biography, music, press, and selected imagery.",
        copy:
          "This site now focuses on the parts of the story that matter most: the artist background, the current catalogue, and the official visual archive.",
        image: homeImages.heroSlides[3],
        stat: "Music • media • archive",
        accent: "Official site",
      },
    ],
  },
  intro: {
    eyebrow: "Overview",
    title: "A contemporary Ethiopian artist whose public story is rooted in work, not filler.",
    paragraphs: [
      "Veronica Adane is an Ethiopian singer whose work now stretches across recorded music, performance, and a carefully built visual identity.",
      "Public profiles describe her as born and raised in Addis Ababa, the daughter of traditional artist Adane Teka, and a journalism and communication graduate of Mekelle University.",
      "That background meets a newer breakthrough in Meteriyaye, the 12-track project released in August 2024 and reported as a major acquisition by Zojak Worldwide.",
    ],
    image: homeImages.intro,
    stats: [
      {
        value: "12",
        label: "Tracks on Meteriyaye",
        detail: "SoundCloud lists the album at 12 tracks and a runtime of just over 51 minutes.",
      },
      {
        value: "Aug 2024",
        label: "Current album era",
        detail: "Addis Insight reported the album release for August 24, 2024.",
      },
      {
        value: "17M Birr",
        label: "Reported acquisition",
        detail:
          "Addis Insight described the Zojak Worldwide deal as worth more than 17 million birr.",
      },
    ],
  },
  visualChapters: {
    eyebrow: "Selected Images",
    title: "Official portraiture and campaign imagery",
    description:
      "The strongest homepage does not bury Veronica beneath generic copy. It lets the portraits, campaign stills, and album-era visuals carry part of the story.",
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
        note: "A cinematic look that supports the scale of the current release period.",
        image: homeImages.visualChapters[1],
      },
      {
        title: "Campaign colour",
        era: "Public image",
        note: "A sharper glamour direction for features, artwork, and press-facing moments.",
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
    eyebrow: "Roots",
    title: "Addis Ababa, family legacy, and a clear sense of identity.",
    description:
      "The biography that shows up most consistently in public sources starts in Addis Ababa, stays connected to family performance history, and carries that cultural grounding into a modern music career.",
    tags: ["Addis Ababa", "Adane Teka", "Mekelle University", "Music career"],
    image: homeImages.heritage,
  },
  rise: {
    eyebrow: "Trajectory",
    title: "From covers and early releases to a full album cycle.",
    description:
      "Public profiles point to an early period of spiritual songs, mashups, and cover videos before original releases and larger-scale recognition took hold.",
    nationalNote:
      "The story reads as gradual momentum: early online visibility, catalogue building, and steady audience growth inside Ethiopia.",
    internationalNote:
      "The Zojak Worldwide acquisition placed Meteriyaye inside a broader distribution conversation beyond the local market.",
    images: [...homeImages.rise],
  },
  campaign: {
    eyebrow: "Current Focus",
    title: "Music, press, and image now need to work as one clean public system.",
    description:
      "The homepage should help visitors understand Veronica quickly: who she is, where the current album sits, and where to go next for music, biography, and official images.",
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
          "Read the grounded version of Veronica Adane's background, education, and rise into the current album era.",
        note: "Roots, study, trajectory",
      },
      {
        title: "Music & Videos",
        href: "/music",
        accent: "Catalogue",
        description:
          "Move through releases, videos, and the songs currently shaping Veronica's public profile.",
        note: "Singles, albums, visuals",
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
      "Instead of overexplaining Veronica, the platform now lets the strongest facts and the official images do the work together.",
    primaryAction: { href: "/media", label: "Open Media Grid" },
    secondaryAction: { href: "/about", label: "Read About Veronica" },
    credits: [
      {
        label: "Addis Ababa roots",
        note: "A biography anchored in place, family history, and early discipline.",
      },
      {
        label: "Mekelle University",
        note: "Journalism and communication training remains part of the public story.",
      },
      {
        label: "Meteriyaye",
        note: "The current album era gives the site its clearest musical anchor.",
      },
      {
        label: "Zojak Worldwide",
        note: "A major acquisition story helped expand the album's public significance.",
      },
      {
        label: "Selected imagery",
        note: "Portraits and campaign stills now lead instead of fighting with filler text.",
      },
      {
        label: "Official routing",
        note: "Biography, music, and media now sit in cleaner public pathways.",
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
