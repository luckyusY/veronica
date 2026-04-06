export type CmsPageSlug =
  | "home"
  | "about"
  | "music"
  | "events"
  | "shop"
  | "collaborations"
  | "media"
  | "contact";

export const cmsPageSlugs = [
  "home",
  "about",
  "music",
  "events",
  "shop",
  "collaborations",
  "media",
  "contact",
] as const satisfies readonly CmsPageSlug[];

export type CmsMediaResourceType = "image" | "video";

export type CmsMediaItem = {
  url: string;
  alt: string;
  publicId?: string;
  resourceType?: CmsMediaResourceType;
  position?: string;
  label?: string;
  placeholderBase?: string;
  placeholderHighlight?: string;
};

export type CmsAction = {
  label: string;
  href: string;
};

export type CmsHeroSlide = {
  eyebrow: string;
  title: string;
  copy: string;
  stat: string;
  accent: string;
  image: CmsMediaItem;
};

export type CmsStat = {
  value: string;
  label: string;
  detail: string;
};

export type CmsTextCard = {
  title: string;
  description: string;
  accent?: string;
  href?: string;
  note?: string;
};

export type CmsCredit = {
  label: string;
  note: string;
};

export type CmsTestimonial = {
  quote: string;
  name: string;
  role: string;
};

export type HomePageContent = {
  hero: {
    verticalLabel: string;
    headlineTop: string;
    headlineLines: string[];
    primaryAction: CmsAction;
    secondaryAction: CmsAction;
    slides: CmsHeroSlide[];
  };
  intro: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: CmsMediaItem;
    stats: CmsStat[];
  };
  visualChapters: {
    eyebrow: string;
    title: string;
    description: string;
    chips: string[];
    items: Array<{
      title: string;
      era: string;
      note: string;
      image: CmsMediaItem;
    }>;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    items: CmsTestimonial[];
  };
  heritage: {
    eyebrow: string;
    title: string;
    description: string;
    tags: string[];
    image: CmsMediaItem;
  };
  rise: {
    eyebrow: string;
    title: string;
    description: string;
    nationalNote: string;
    internationalNote: string;
    images: CmsMediaItem[];
  };
  campaign: {
    eyebrow: string;
    title: string;
    description: string;
    featureImage: CmsMediaItem;
    supportingImages: CmsMediaItem[];
  };
  pathways: {
    eyebrow: string;
    title: string;
    description: string;
    items: CmsTextCard[];
  };
  archive: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: CmsAction;
    secondaryAction: CmsAction;
    credits: CmsCredit[];
  };
};

export type StandardHeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  highlightWords?: string[];
  primaryCta?: CmsAction;
  secondaryCta?: CmsAction;
  image: CmsMediaItem;
  imageMotionPreset?:
    | "vertical"
    | "from-left"
    | "from-right"
    | "settle-left"
    | "settle-right";
  imageLabel?: string;
  noteTitle?: string;
  noteText?: string;
};

export type StandardSection =
  | {
      id: string;
      type: "split";
      theme: "paper" | "dark";
      eyebrow: string;
      title: string;
      description: string;
      body?: string[];
      image: CmsMediaItem;
      imageSide: "left" | "right";
      imageMotionPreset?:
        | "vertical"
        | "from-left"
        | "from-right"
        | "settle-left"
        | "settle-right";
      cards?: CmsTextCard[];
      cardVariant?: "note" | "route" | "release" | "dark-note";
      tallImage?: boolean;
    }
  | {
      id: string;
      type: "cards";
      theme: "paper" | "dark";
      eyebrow: string;
      title: string;
      description?: string;
      items: CmsTextCard[];
      columns?: 2 | 3;
      cardVariant?: "note" | "route" | "release" | "dark-note";
    }
  | {
      id: string;
      type: "banner";
      theme: "dark" | "light";
      eyebrow: string;
      title: string;
      description?: string;
      image: CmsMediaItem;
      imageMotionPreset?:
        | "vertical"
        | "from-left"
        | "from-right"
        | "settle-left"
        | "settle-right"
        | "zoom-burst";
    }
  | {
      id: string;
      type: "timeline";
      theme: "paper" | "dark";
      eyebrow: string;
      title: string;
      description?: string;
      items: string[];
    }
  | {
      id: string;
      type: "gallery";
      theme: "paper" | "dark";
      eyebrow: string;
      title: string;
      description?: string;
      /** Images chosen by admin via the media picker */
      items: CmsMediaItem[];
      columns?: 2 | 3 | 4;
    };

export type StandardPageContent = {
  hero: StandardHeroContent;
  sections: StandardSection[];
};

export type CmsPageContentMap = {
  home: HomePageContent;
  about: StandardPageContent;
  music: StandardPageContent;
  events: StandardPageContent;
  shop: StandardPageContent;
  collaborations: StandardPageContent;
  media: StandardPageContent;
  contact: StandardPageContent;
};

export type CmsPageDocument<TContent = unknown> = {
  slug: CmsPageSlug;
  name: string;
  summary: string;
  route: string;
  content: TContent;
  updatedAt: string;
};

export type CmsPageStatus = "published" | "draft-pending" | "never-published";

export type CmsPagePublishedSnapshot<TContent = unknown> = {
  content: TContent | null;
  publishedAt: string | null;
  publishedBy: string | null;
};

export type CmsPageDraftSnapshot<TContent = unknown> = {
  content: TContent | null;
  savedAt: string | null;
  savedBy: string | null;
};

export type CmsPageWorkspaceDocument<TContent = unknown> = {
  slug: CmsPageSlug;
  name: string;
  summary: string;
  route: string;
  content: TContent;
  published: CmsPagePublishedSnapshot<TContent>;
  draft: CmsPageDraftSnapshot<TContent>;
  status: CmsPageStatus;
  updatedAt: string;
};

export type CmsPageEditorInput<TContent = unknown> = {
  name: string;
  summary: string;
  content: TContent;
};

export type CmsSiteSettings = {
  header: {
    brandKicker: string;
    bookingLabel: string;
    shopLabel: string;
  };
  footer: {
    notes: string[];
    description: string;
    socialSignals: string[];
    utilityLinks: CmsAction[];
    copyrightTagline: string;
  };
};

export type CmsMediaAsset = {
  id: string;
  title: string;
  alt: string;
  publicId: string;
  secureUrl: string;
  resourceType: CmsMediaResourceType;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  createdAt: string;
  updatedAt: string;
};

export type CmsMediaUsageEntry = {
  route: CmsPageSlug;
  section: string;
  field: string;
  isDraft: boolean;
};

export type CmsMediaUsageRecord = {
  publicId: string;
  usedIn: CmsMediaUsageEntry[];
  pageCount: number;
  updatedAt: string;
};
