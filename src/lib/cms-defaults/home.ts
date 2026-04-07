import type { HomePageContent } from "@/lib/cms-types";
import { defaultMediaLibrary } from "@/lib/cms-defaults/shared";

export const defaultHomePageContent: HomePageContent = {
  hero: {
    verticalLabel: "VERONICA ADANE / OFFICIAL",
    headlineTop: "The new era of Ethiopian sound",
    headlineLines: ["Taking the stage", "across the globe"],
    primaryAction: { href: "/music", label: "Listen to Meteriyaye" },
    secondaryAction: { href: "/events", label: "View Tour Dates" },
    slides: [
      {
        eyebrow: "Meteriyaye Album",
        title: "The highly anticipated debut album is shattering streaming records.",
        copy:
          "Experience the project that is redefining the sound of modern Ethiopia. Stream Meteriyaye now on all platforms.",
        image: defaultMediaLibrary.hero,
        stat: "41M+ streams",
        accent: "Out Now",
      },
      {
        eyebrow: "Live Experience",
        title: "A stage presence that demands the room, backed by a world-class band.",
        copy:
          "From intimate venues to arena stages, Veronica's live show brings the emotion and energy of her records straight to the fans.",
        image: defaultMediaLibrary.stage,
        stat: "Global Tour",
        accent: "On the road",
      },
      {
        eyebrow: "Scarlet Campaign",
        title: "Romance, spectacle, and high-impact visuals.",
        copy:
          "Dive into the visual world built around the latest singles. A cinematic journey accompanying the music.",
        image: defaultMediaLibrary.heartMid,
        stat: "New Music Video",
        accent: "Watch Now",
      },
      {
        eyebrow: "Official Merch",
        title: "Exclusive collections dropping soon for fans around the world.",
        copy:
          "Sign up to get early access to limited edition drops, vinyl releases, and exclusive tour merchandise.",
        image: defaultMediaLibrary.furClose,
        stat: "Coming Soon",
        accent: "Store",
      },
    ],
  },
  intro: {
    eyebrow: "The Breakdown",
    title: "An unstoppable momentum defining the cultural moment.",
    paragraphs: [
      "Veronica Adane has rapidly become the central voice of a new generation. Her ability to blend traditional Ethiopian elements with contemporary pop records has earned her a fast-growing international audience.",
      "With the release of her smash hit album, Meteriyaye, the focus has shifted entirely to the stage, the fans, and pushing the boundaries of what is possible in East African music.",
    ],
    image: defaultMediaLibrary.cliff,
    stats: [
      {
        value: "41M+",
        label: "Album Views",
        detail: "Meteriyaye reached more than 41 million views in record time.",
      },
      {
        value: "1.8M+",
        label: "Social Reach",
        detail:
          "A massive digital community supporting every release.",
      },
      {
        value: "Sold Out",
        label: "Global Tour",
        detail:
          "Unprecedented demand across North America, Europe, and the Middle East.",
      },
    ],
  },
  visualChapters: {
    eyebrow: "Latest Visuals",
    title: "Watch the movement unfold",
    description:
      "A look into the cinematic side of Veronica's releases. High-production music videos and live sessions that translate the records into visual spectacle.",
    chips: ["Music Videos", "Live Sessions", "Behind the Scenes"],
    items: [
      {
        title: "Meteriyaye Tour",
        era: "Live on Stage",
        note: "Capturing the undeniable energy of a sold-out crowd.",
        image: defaultMediaLibrary.crowd,
      },
      {
        title: "Crystal Couture",
        era: "Official Visuals",
        note: "The signature look defining the current era of releases.",
        image: defaultMediaLibrary.stage,
      },
      {
        title: "Scarlet Hearts",
        era: "Music Video",
        note: "The visual counterpart to the fan-favorite anthem.",
        image: defaultMediaLibrary.heartClose,
      },
    ],
  },
  testimonials: {
    eyebrow: "The Reception",
    title: "Critics and fans agree: the live show is a mandatory experience.",
    description:
      "Whether it’s in the studio or on the stage, the execution is flawless. Read what people are saying about the latest run of shows.",
    items: [
      {
        quote:
          "One of the most commanding and energetic live sets we have seen this year. She owned the room from the first note.",
        name: "C. Desta",
        role: "Live Music Review",
      },
      {
        quote:
          "The album translated to the stage perfectly. A rare instance where the live vocals actually outshine the studio recordings.",
        name: "A. Alemu",
        role: "Music Critic",
      },
      {
        quote:
          "The crowd knew every single word. The connection she has with her audience is incredible to witness.",
        name: "N. Tesfaye",
        role: "Tour Promoter",
      },
      {
        quote:
          "Every visual, every outfit, every note feels intentional. She isn't just an artist, she's an entire era.",
        name: "M. Robinson",
        role: "Fan & Collector",
      },
    ],
  },
  heritage: {
    eyebrow: "Live Experience",
    title: "Bringing the sound of Ethiopia to stages worldwide.",
    description:
      "Every show is treated as a cultural event. With a full live band and breathtaking production, the current tour is designed to be an unforgettable, high-energy experience.",
    tags: ["Live Band", "Global Tour", "Stage Production", "Fan Connection"],
    image: defaultMediaLibrary.aerialCrowd,
  },
  rise: {
    eyebrow: "Tour Summary",
    title: "From intimate local venues to international arenas.",
    description:
      "The demand for live dates continues to grow as the music reaches new territories. Check the touring schedule regularly as more dates are added.",
    nationalNote:
      "Massive stadium and hall performances in Addis Ababa, Gondar, Bahir Dar, and across Ethiopia.",
    internationalNote:
      "Selling out premiere venues in major routing cities including Los Angeles, Atlanta, Amsterdam, Paris, and Stockholm.",
    images: [defaultMediaLibrary.stage, defaultMediaLibrary.crowd],
  },
  campaign: {
    eyebrow: "Discography",
    title:
      "Streaming everywhere. Hit singles, full-length projects, and visual albums.",
    description:
      "Dive into the catalogue that started the movement. Available across Apple Music, Spotify, YouTube, and all major digital platforms.",
    featureImage: defaultMediaLibrary.hero,
    supportingImages: [defaultMediaLibrary.furSeated, defaultMediaLibrary.cliff],
  },
  pathways: {
    eyebrow: "Explore",
    title: "Navigate the official Veronica Adane platform.",
    description:
      "Find everything you need below—from the full discography and tour dates, to official press resources.",
    items: [
      {
        title: "Music & Videos",
        href: "/music",
        accent: "Discography",
        description:
          "Stream the latest releases and watch the official music videos all in one place.",
        note: "Albums, singles, visuals",
      },
      {
        title: "Tour Dates",
        href: "/events",
        accent: "Live Shows",
        description:
          "Secure tickets to upcoming shows in your city before they sell out completely.",
        note: "Tickets, routing, VIP",
      },
      {
        title: "Official Media",
        href: "/media",
        accent: "Press Archive",
        description:
          "High-resolution official imagery and campaign assets available for press and media partners.",
        note: "Press, awards, advocacy",
      },
    ],
  },
  archive: {
    eyebrow: "Connect",
    title: "Join the community and stay updated on the latest drops.",
    description:
      "Follow Veronica across social platforms to see behind-the-scenes moments, studio sessions, and real-time tour updates.",
    primaryAction: { href: "/music", label: "Stream on Spotify" },
    secondaryAction: { href: "/events", label: "Find Tour Tickets" },
    credits: [
      {
        label: "TikTok",
        note: "Viral moments and direct fan interactions.",
      },
      {
        label: "Instagram",
        note: "Official photography, tour grids, and fashion moments.",
      },
      {
        label: "YouTube",
        note: "Music video premieres and live stage recordings.",
      },
      {
        label: "Spotify / Apple Music",
        note: "The primary streaming destinations for all official releases.",
      },
      {
        label: "Facebook",
        note: "Community connection and regional announcements.",
      },
      {
        label: "Official Store",
        note: "Merchandise, vinyl releases, and physical goods coming soon.",
      },
    ],
  },
};

