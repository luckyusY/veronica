import type {
  CmsMediaItem,
  CmsPageSlug,
  CmsSiteSettings,
} from "@/lib/cms-types";

const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
  process.env.CLOUDINARY_CLOUD_NAME ??
  "dxeo0ewmw";

function imageUrl(publicId: string) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
}

function videoUrl(publicId: string) {
  return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto:good,vc_auto,f_auto/${publicId}`;
}

function image(
  publicId: string,
  alt: string,
  extras: Partial<CmsMediaItem> = {},
): CmsMediaItem {
  return {
    url: imageUrl(publicId),
    alt,
    publicId,
    resourceType: "image",
    ...extras,
  };
}

export const defaultMediaLibrary = {
  hero: image(
    "veronica/images/img_8078",
    "Veronica Adane reclining in a crystal-styled bath inside a gilded marble interior.",
    {
      label: "Crystal bath portrait",
      position: "center 24%",
      placeholderBase: "#20140f",
      placeholderHighlight: "#d1b187",
    },
  ),
  cliff: image(
    "veronica/images/img_8029",
    "Veronica Adane standing in a black off-shoulder gown against a clean studio backdrop.",
    {
      label: "Signature black gown portrait",
      position: "center 18%",
      placeholderBase: "#161111",
      placeholderHighlight: "#cbbfb3",
    },
  ),
  stage: image(
    "veronica/images/img_8077",
    "Veronica Adane styled in crystal couture inside a marble-and-gold bath set.",
    {
      label: "Gilded couture portrait",
      position: "center 30%",
      placeholderBase: "#23160f",
      placeholderHighlight: "#d7bf96",
    },
  ),
  microphone: image(
    "veronica/images/img_8027",
    "Close portrait of Veronica Adane in a black editorial look with feather trim.",
    {
      label: "Classic close-up portrait",
      position: "center 14%",
      placeholderBase: "#130f10",
      placeholderHighlight: "#d7cdc5",
    },
  ),
  crowd: image(
    "veronica/images/img_8081",
    "Veronica Adane seated in a brown fur coat over black tailoring on a warm studio set.",
    {
      label: "Fur studio portrait",
      position: "center 18%",
      placeholderBase: "#1f130f",
      placeholderHighlight: "#8f5d41",
    },
  ),
  aerialCrowd: image(
    "veronica/images/img_8094",
    "Veronica Adane in a crimson gown with white opera gloves framed by red heart balloons.",
    {
      label: "Scarlet campaign portrait",
      position: "center 24%",
      placeholderBase: "#260909",
      placeholderHighlight: "#b92324",
    },
  ),
  furSeated: image(
    "veronica/images/img_8079",
    "Veronica Adane posed in a deep brown fur coat with black tailoring against a caramel studio background.",
    {
      label: "Couture fur portrait",
      position: "center 20%",
      placeholderBase: "#251611",
      placeholderHighlight: "#8a583e",
    },
  ),
  furClose: image(
    "veronica/images/img_8080",
    "Veronica Adane seated in a rich brown fur coat and black tailored look.",
    {
      label: "Winter couture close-up",
      position: "center 18%",
      placeholderBase: "#241510",
      placeholderHighlight: "#8b5a40",
    },
  ),
  heartMid: image(
    "veronica/images/img_8095",
    "Veronica Adane in a red gown against a wall of red heart balloons.",
    {
      label: "Heart-wall glamour portrait",
      position: "center 24%",
      placeholderBase: "#2a090a",
      placeholderHighlight: "#c22529",
    },
  ),
  heartClose: image(
    "veronica/images/img_8096",
    "Close glamour portrait of Veronica Adane in a red gown and white gloves framed by heart balloons.",
    {
      label: "Scarlet close-up portrait",
      position: "center 22%",
      placeholderBase: "#24090a",
      placeholderHighlight: "#c02327",
    },
  ),
} as const;

export const defaultVideoLibrary = {
  kedemenaw: videoUrl("veronica/videos/kedemenaw"),
  meteriyaye: videoUrl("veronica/videos/meteriyaye"),
  tenager: videoUrl("veronica/videos/tenager"),
  kanteLela: videoUrl("veronica/videos/kante-lela"),
  goneDer: videoUrl("veronica/videos/gone-der"),
} as const;

export const defaultSiteSettings: CmsSiteSettings = {
  header: {
    brandKicker: "Official Artist House",
    bookingLabel: "Booking",
    shopLabel: "Shop",
  },
  footer: {
    notes: [
      "Official platform",
      "Biography / Music / Performance",
      "Press / Partnerships",
    ],
    description:
      "Official platform for biography, releases, live performance, press, and partnerships.",
    socialSignals: ["Instagram 800K+", "TikTok 1.8M+", "Facebook 500K+"],
    utilityLinks: [
      { href: "/contact", label: "Bookings" },
      { href: "/media", label: "Press Kit" },
      { href: "/events", label: "Event Inquiries" },
    ],
    copyrightTagline: "Addis Ababa to global audiences.",
  },
};

export const defaultPageSummaries: Record<
  CmsPageSlug,
  { name: string; route: string; summary: string }
> = {
  home: {
    name: "Home",
    route: "/",
    summary: "Editorial homepage with hero slides, story sections, testimonials, and archive CTA.",
  },
  about: {
    name: "About",
    route: "/about",
    summary: "Biography page focused on heritage, identity, and personal timeline.",
  },
  music: {
    name: "Music & Videos",
    route: "/music",
    summary: "Release archive positioning for albums, visuals, and platform storytelling.",
  },
  events: {
    name: "Events",
    route: "/events",
    summary: "Tour routing, ticket flow, and live performance narrative.",
  },
  shop: {
    name: "Shop",
    route: "/shop",
    summary: "Commerce page for merch, collector drops, and premium bundles.",
  },
  collaborations: {
    name: "Collaborations",
    route: "/collaborations",
    summary: "Brand-facing page for partnerships, activations, and sponsor-ready messaging.",
  },
  media: {
    name: "Media & Press",
    route: "/media",
    summary: "Press archive with verified milestones, imagery, and biography assets.",
  },
  contact: {
    name: "Contact",
    route: "/contact",
    summary: "Clear premium pathways for bookings, management, and press requests.",
  },
};
