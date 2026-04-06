export const adminCollectionOrder = [
  "releases",
  "events",
  "products",
  "inquiries",
] as const;

export type AdminCollectionKey = (typeof adminCollectionOrder)[number];

export type AdminRecordInput = {
  title: string;
  subtitle: string;
  status: string;
  highlight: string;
  link: string;
  notes: string;
  /** URL of the event banner / hero image (events only) */
  bannerImage?: string;
  /** Array of image URLs for the event gallery (events only) */
  galleryImages?: string[];
  /** Cloudinary video URL selected from the media library (releases only) */
  videoUrl?: string;
};

export type AdminRecord = AdminRecordInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type AdminCollectionConfig = {
  label: string;
  singular: string;
  description: string;
  defaultStatus: string;
  emptyTitle: string;
  fields: {
    title: string;
    subtitle: string;
    highlight: string;
    link: string;
    notes: string;
  };
};

export const adminCollectionConfig: Record<AdminCollectionKey, AdminCollectionConfig> = {
  releases: {
    label: "Releases",
    singular: "Release",
    description: "Track singles, videos, visual campaigns, and platform rollouts.",
    defaultStatus: "Draft",
    emptyTitle: "No releases yet",
    fields: {
      title: "Title",
      subtitle: "Format / platform",
      highlight: "Release window",
      link: "Streaming or video link",
      notes: "Campaign notes",
    },
  },
  events: {
    label: "Events",
    singular: "Event",
    description: "Manage city routing, venues, ticket links, and live performance status.",
    defaultStatus: "Planning",
    emptyTitle: "No events yet",
    fields: {
      title: "City / event title",
      subtitle: "Venue / routing detail",
      highlight: "Date or timing",
      link: "Ticket or routing link",
      notes: "Operations notes",
    },
  },
  products: {
    label: "Products",
    singular: "Product",
    description: "Control merch, digital bundles, collector drops, and storefront links.",
    defaultStatus: "Active",
    emptyTitle: "No products yet",
    fields: {
      title: "Product name",
      subtitle: "Category",
      highlight: "Price or offer",
      link: "Purchase link",
      notes: "Fulfillment notes",
    },
  },
  inquiries: {
    label: "Inquiries",
    singular: "Inquiry",
    description: "Track booking, brand, press, and management conversations in one queue.",
    defaultStatus: "Open",
    emptyTitle: "No inquiries yet",
    fields: {
      title: "Inquiry title",
      subtitle: "Source / type",
      highlight: "Priority or timing",
      link: "Reference link",
      notes: "Response notes",
    },
  },
};

export const adminStarterRecords: Record<AdminCollectionKey, AdminRecordInput[]> = {
  releases: [
    {
      title: "Meteriyaye rollout",
      subtitle: "Album / YouTube + streaming",
      status: "Live",
      highlight: "41M+ views",
      link: "https://youtube.com",
      notes: "Lead album-era storytelling and official rollout assets.",
    },
    {
      title: "Scarlet campaign visuals",
      subtitle: "Single campaign / social + press",
      status: "Review",
      highlight: "Next asset review",
      link: "",
      notes: "Heart-wall photography and premium teaser moments.",
    },
  ],
  events: [
    {
      title: "Addis Ababa headline show",
      subtitle: "Millennium Hall routing",
      status: "Confirmed",
      highlight: "May 18",
      link: "",
      notes: "Coordinate live band, promo rollout, and ticket release.",
    },
    {
      title: "Kigali diaspora festival",
      subtitle: "Festival guest performance",
      status: "Planning",
      highlight: "Q3 routing",
      link: "",
      notes: "Awaiting final slot timing and hospitality confirmation.",
    },
  ],
  products: [
    {
      title: "Signature apparel capsule",
      subtitle: "Merch / fashion",
      status: "Active",
      highlight: "$85 preview",
      link: "",
      notes: "Hero product group for the first premium storefront drop.",
    },
    {
      title: "Collector digital bundle",
      subtitle: "Music / digital",
      status: "Draft",
      highlight: "Launch prep",
      link: "",
      notes: "Bundle unreleased visuals, lyrics, and exclusive notes.",
    },
  ],
  inquiries: [
    {
      title: "Festival booking request",
      subtitle: "Kigali / Live",
      status: "Open",
      highlight: "2h ago",
      link: "",
      notes: "Awaiting management approval and technical rider follow-up.",
    },
    {
      title: "Beauty campaign partnership",
      subtitle: "Addis Ababa / Brand",
      status: "Follow up",
      highlight: "Today",
      link: "",
      notes: "Send deck, rates, and talent availability window.",
    },
  ],
};
