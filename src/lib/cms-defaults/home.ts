import type { HomePageContent } from "@/lib/cms-types";
import { defaultMediaLibrary } from "@/lib/cms-defaults/shared";

export const defaultHomePageContent: HomePageContent = {
  hero: {
    verticalLabel: "VERONICA ADANE / OFFICIAL",
    headlineTop: "Faith, glamour, and a voice",
    headlineLines: ["carrying Ethiopia", "far beyond its borders"],
    primaryAction: { href: "/about", label: "Read Biography" },
    secondaryAction: { href: "/music", label: "Enter Music Archive" },
    slides: [
      {
        eyebrow: "Global Stage",
        title: "Faith, glamour, and a voice carrying Ethiopia far beyond its borders.",
        copy:
          "Veronica Adane stands at the meeting point of culture, discipline, and modern stardom. Her presence is cinematic, but the journey behind it is deeply earned.",
        image: defaultMediaLibrary.hero,
        stat: "41M+ album views",
        accent: "Meteriyaye era",
      },
      {
        eyebrow: "Signature Portrait",
        title: "A woman whose elegance is matched by conviction, discipline, and purpose.",
        copy:
          "From journalism and advocacy to sold-out live performance, Veronica's public image is built on both beauty and substance.",
        image: defaultMediaLibrary.cliff,
        stat: "1.8M+ TikTok followers",
        accent: "Official portraiture",
      },
      {
        eyebrow: "Scarlet Campaign",
        title: "Romance, spectacle, and release-era drama captured with confidence.",
        copy:
          "Her visual language can move from intimate portraiture to high-impact campaigns without losing the warmth and identity that make her recognisable.",
        image: defaultMediaLibrary.heartMid,
        stat: "Multiple hit records",
        accent: "Release campaign",
      },
      {
        eyebrow: "Couture Studio",
        title: "Rooted in heritage, styled with luxury, and ready for an international audience.",
        copy:
          "Every frame should feel like a chapter in a growing legacy: Ethiopian, contemporary, and unmistakably Veronica.",
        image: defaultMediaLibrary.furClose,
        stat: "Africa to diaspora tours",
        accent: "Brand-led imagery",
      },
    ],
  },
  intro: {
    eyebrow: "Biography",
    title: "A journey shaped by faith, study, sacrifice, and the courage to keep going.",
    paragraphs: [
      "Veronica Adane is an Ethiopian singer, songwriter, actress, and journalist whose story is built on faith, discipline, sacrifice, and purpose.",
      "Born and raised in Addis Ababa, she rose from recording cover songs on a single phone to becoming one of Ethiopia's most influential female artists.",
      "Her world now stretches across music, film, advocacy, and international stages while staying rooted in family, culture, and the pride of Azmari heritage.",
    ],
    image: defaultMediaLibrary.cliff,
    stats: [
      {
        value: "41M+",
        label: "Album momentum",
        detail: "Meteriyaye reached more than 41 million YouTube views within one year.",
      },
      {
        value: "1.8M+",
        label: "Social reach",
        detail:
          "A fast-moving audience following her across TikTok, Instagram, Facebook, and beyond.",
      },
      {
        value: "Global",
        label: "Tour energy",
        detail:
          "From Ethiopian cities to diaspora venues across the US, Europe, and the Middle East.",
      },
    ],
  },
  visualChapters: {
    eyebrow: "Visual Chapters",
    title: "Meteriyaye",
    description:
      "Real imagery now drives the homepage with more drama, elegance, and character. Veronica's portraits move between black-tie studio clarity, gilded couture, warm brown fashion, and scarlet campaign energy.",
    chips: ["Portraiture", "Release Eras", "Couture", "Stage Presence"],
    items: [
      {
        title: "Full Portrait",
        era: "Official Portraiture",
        note: "A modern icon framed with restraint and confidence.",
        image: defaultMediaLibrary.furSeated,
      },
      {
        title: "Crystal Couture",
        era: "Meteriyaye Era",
        note: "A gilded portrait language for hero scenes and premiere moments.",
        image: defaultMediaLibrary.stage,
      },
      {
        title: "Scarlet Hearts",
        era: "Release Campaign",
        note: "Release-ready visuals that bring energy, desire, and campaign colour.",
        image: defaultMediaLibrary.heartClose,
      },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Press, producers, and audiences speak about the same thing: presence.",
    description:
      "Veronica's work lands through voice, image, discipline, and the feeling that every release belongs to a larger era.",
    items: [
      {
        quote:
          "Veronica's performances do not feel like entertainment first. They feel like a cultural chapter, photographed, paced, and delivered with intention.",
        name: "C. Desta",
        role: "Curator / Editorial Producer",
      },
      {
        quote:
          "The songwriting carries identity without overexplaining it. The visual direction onstage makes every release feel like a premiere.",
        name: "A. Alemu",
        role: "Press & Partnerships",
      },
      {
        quote:
          "A rare combination of discipline and stage presence. The project feels premium end to end, from imagery to ticket flow.",
        name: "N. Tesfaye",
        role: "Tour Coordinator",
      },
      {
        quote:
          "Every drop feels connected to an era. The experience reads like an artist's world, not a template storefront.",
        name: "M. Robinson",
        role: "Fan / Collector",
      },
    ],
  },
  heritage: {
    eyebrow: "Heritage",
    title: "An artist shaped by family, culture, and the courage to reclaim identity.",
    description:
      "Veronica's story begins with her father's legacy and her decision to wear the Azmari identity with pride instead of shame. That foundation should be visible in the home experience from the first scroll.",
    tags: ["Azmari", "Family Legacy", "Faith", "Identity"],
    image: defaultMediaLibrary.microphone,
  },
  rise: {
    eyebrow: "Rise",
    title: "A career that started with one phone and grew through relentless live performance.",
    description:
      "Before the sold-out rooms, the international routing, and the recognition, there was a student recording covers with minimal resources and funding the dream step by step.",
    nationalNote:
      "Addis Ababa, Gondar, Hawassa, Harar, Dire Dawa, Bahir Dar, Arba Minch, Dilla, and many more cities across Ethiopia.",
    internationalNote:
      "Atlanta, DMV, Los Angeles, Seattle, Denver, Oakland, Amsterdam, Paris, Zurich, Oslo, Frankfurt, and Stockholm.",
    images: [defaultMediaLibrary.heartClose, defaultMediaLibrary.crowd],
  },
  campaign: {
    eyebrow: "Presence",
    title:
      "Music, film, advocacy, and glamour now sit inside one unmistakable public identity.",
    description:
      "Veronica moves easily between performance, screen presence, and cultural advocacy. The home experience should carry that same range without losing elegance or restraint.",
    featureImage: defaultMediaLibrary.aerialCrowd,
    supportingImages: [defaultMediaLibrary.stage, defaultMediaLibrary.furSeated],
  },
  pathways: {
    eyebrow: "Explore",
    title: "Step deeper into the catalogue, the stage world, and the public archive.",
    description:
      "The strongest homepages do not stop at introduction. They guide people cleanly into music, live performance, and the verified story behind the artist.",
    items: [
      {
        title: "Music & Videos",
        href: "/music",
        accent: "Discography",
        description:
          "Enter the catalogue, watch featured visuals, and move through Veronica's major release eras.",
        note: "Albums, singles, visuals",
      },
      {
        title: "Events",
        href: "/events",
        accent: "Live Performance",
        description:
          "Follow upcoming cities, tour momentum, and the performance world that made her one of Ethiopia's most in-demand live artists.",
        note: "Tours, tickets, routing",
      },
      {
        title: "Media & Press",
        href: "/media",
        accent: "Recognition",
        description:
          "Open the archive of press, advocacy, interviews, awards, and official cultural milestones.",
        note: "Press, awards, advocacy",
      },
    ],
  },
  archive: {
    eyebrow: "Official Image Archive",
    title: "Veronica's own portrait library now gives the brand a clearer signature.",
    description:
      "The world now moves through signature black portraiture, crystal couture, warm studio fashion, and scarlet campaign imagery. That range gives the homepage more authority, emotion, and memorability.",
    primaryAction: { href: "/media", label: "Open Press Archive" },
    secondaryAction: { href: "/about", label: "Read Biography" },
    credits: [
      {
        label: "Signature Black Portrait",
        note: "Studio portraiture for biography, press, and timeless artist presentation.",
      },
      {
        label: "Crystal Couture Set",
        note: "Luxury marble-and-gold imagery for hero scenes and premiere moments.",
      },
      {
        label: "Fur Studio Series",
        note: "Warm brown fashion portraits supporting partnerships, commerce, and editorial storytelling.",
      },
      {
        label: "Scarlet Campaign Series",
        note: "High-saturation red visuals for releases, campaigns, and event storytelling.",
      },
      {
        label: "Performance Presence",
        note: "Imagery that balances glamour, stage energy, and emotional closeness.",
      },
      {
        label: "Official Veronica Imagery",
        note: "A consistent visual library built from Veronica's own portraits and campaign photography.",
      },
    ],
  },
};
