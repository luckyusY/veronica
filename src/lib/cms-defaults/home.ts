import type { HomePageContent } from "@/lib/cms-types";
import { defaultMediaLibrary } from "@/lib/cms-defaults/shared";

export const defaultHomePageContent: HomePageContent = {
  hero: {
    verticalLabel: "VERONICA ADANE / OFFICIAL",
    headlineTop: "Voice of a generation.",
    headlineLines: ["Born in Addis Ababa.", "Heard across the world."],
    primaryAction: { href: "/music", label: "Listen to Meteriyaye" },
    secondaryAction: { href: "/media", label: "View Official Images" },
    slides: [
      {
        eyebrow: "2024 Album",
        title: "The record-setting album that changed everything.",
        copy:
          "Meteriyaye — 12 songs, 51 minutes — acquired by Zojak Worldwide in a landmark deal reported by Addis Insight. The defining record of her generation.",
        image: defaultMediaLibrary.hero,
        stat: "Record-Setting Deal",
        accent: "Out Now",
      },
      {
        eyebrow: "Heritage",
        title: "Born into music as Adane Teka's daughter.",
        copy:
          "Her father's legacy lives in every note. Adane Teka — celebrated Ethiopian performer — gave Veronica not just a name, but a calling. The inheritance runs deep.",
        image: defaultMediaLibrary.stage,
        stat: "Addis Ababa",
        accent: "The Inheritance",
      },
      {
        eyebrow: "Meteriyaye",
        title: "Love, hope, unity, patriotism, and peace.",
        copy:
          "Her own words from SBS Amharic: Meteriyaye is an album for Ethiopia — built from love, threaded with hope, and offered in the spirit of unity and peace.",
        image: defaultMediaLibrary.heartMid,
        stat: "For Ethiopia",
        accent: "The Message",
      },
      {
        eyebrow: "2021 — 2025",
        title: "From Nalegn to Meteriyaye and beyond.",
        copy:
          "Nalegn (2020), Tewu (2021), Kurfya (2022), Enaney and Abebaye (2023) — each single a step toward the album that would change everything. And still the story continues.",
        image: defaultMediaLibrary.furClose,
        stat: "Active Catalogue",
        accent: "The Journey",
      },
    ],
  },
  intro: {
    eyebrow: "Veronica Adane",
    title: "Heritage, voice, and the Meteriyaye era.",
    paragraphs: [
      "Veronica Adane is the daughter of Adane Teka — one of Ethiopia's most celebrated performers. Born and raised in Addis Ababa, she grew up inside the music, shaped by a legacy that demanded nothing less than greatness.",
      "After studying journalism and communication at Mekelle University, she returned to music on her own terms. Beginning with spiritual songs and covers shared online, she built a steady catalogue of singles before arriving at Meteriyaye — the 12-track album that defines her era.",
      "Meteriyaye was acquired by Zojak Worldwide in a record-setting deal reported by Addis Insight. Released August 2024, it announced Veronica Adane to the world not as a promise, but as a presence.",
    ],
    image: defaultMediaLibrary.cliff,
    stats: [
      {
        value: "12",
        label: "Tracks",
        detail: "Meteriyaye is a 12-track album — every song a deliberate statement.",
      },
      {
        value: "51 min",
        label: "Album Runtime",
        detail: "Fifty-one minutes of love, hope, unity, patriotism, and peace for Ethiopia.",
      },
      {
        value: "2024",
        label: "Record Deal",
        detail: "Acquired by Zojak Worldwide in a record-setting deal. Addis Insight reported it.",
      },
    ],
  },
  visualChapters: {
    eyebrow: "Official Imagery",
    title: "Portraits from the Meteriyaye era.",
    description:
      "A visual world built around the music — fur coats, crystal baths, and gown portraits that carry the weight of the record they represent.",
    chips: ["Portraits", "Meteriyaye", "Campaign", "Press"],
    items: [
      {
        title: "Fur Coat",
        era: "Meteriyaye",
        note: "The signature fur portrait — commanding, elegant, and unmistakably Veronica.",
        image: defaultMediaLibrary.crowd,
      },
      {
        title: "Crystal Bath",
        era: "Official Visuals",
        note: "A crystalline campaign image that defines the visual language of the album era.",
        image: defaultMediaLibrary.stage,
      },
      {
        title: "Gown Portrait",
        era: "Press",
        note: "A formal gown portrait for press, editorial, and official biography contexts.",
        image: defaultMediaLibrary.heartClose,
      },
    ],
  },
  testimonials: {
    eyebrow: "The Reception",
    title: "Critics and fans agree: the live show is a mandatory experience.",
    description:
      "Whether it's in the studio or on the stage, the execution is flawless. Read what people are saying about the latest run of shows.",
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
    eyebrow: "The Inheritance",
    title: "Adane Teka's daughter carries the legacy forward.",
    description:
      "To be born in Addis Ababa as the daughter of a celebrated Ethiopian performer is to inherit both the weight and the wonder of performance. Veronica Adane didn't choose music — music chose her long before she had a say in the matter.",
    tags: ["Addis Ababa", "Adane Teka", "Ethiopia", "Legacy"],
    image: defaultMediaLibrary.aerialCrowd,
  },
  rise: {
    eyebrow: "The Timeline",
    title: "From first songs to Meteriyaye.",
    description:
      "Nalegn (2020) opened the story. Tewu, Kurfya, Enaney, and Abebaye followed — each single sharpening the voice and broadening the audience. Then came the album that made everything clear.",
    nationalNote:
      "Live performances across Ethiopia — from Addis Ababa to Gondar and Bahir Dar — built the foundation of an audience that knew every word before the album arrived.",
    internationalNote:
      "Acquired by Zojak Worldwide for global distribution, the catalogue is now active and expanding. A 2025 live-performance release confirms the story is still being written.",
    images: [defaultMediaLibrary.stage, defaultMediaLibrary.crowd],
  },
  campaign: {
    eyebrow: "Meteriyaye",
    title: "The album that defined a generation.",
    description:
      "Twelve tracks. Fifty-one minutes. A record-setting acquisition by Zojak Worldwide. Meteriyaye is the full statement — love, hope, unity, patriotism, and peace woven into every song.",
    featureImage: defaultMediaLibrary.hero,
    supportingImages: [defaultMediaLibrary.furSeated, defaultMediaLibrary.cliff],
  },
  pathways: {
    eyebrow: "Explore",
    title: "Biography, music, and official imagery.",
    description:
      "Three destinations. The full story, the full catalogue, and the official visual archive — everything you need in one place.",
    items: [
      {
        title: "About",
        href: "/about",
        accent: "Biography",
        description:
          "The full story: Addis Ababa, Adane Teka, Mekelle University, the singles, the album, and the record deal that followed.",
        note: "Heritage, journey, era",
      },
      {
        title: "Music & Videos",
        href: "/music",
        accent: "Catalogue",
        description:
          "Every release from Nalegn to Meteriyaye — singles, the album, and the growing live catalogue. Available on all major platforms.",
        note: "Singles, album, videos",
      },
      {
        title: "Media",
        href: "/media",
        accent: "Official Images",
        description:
          "High-resolution official portraits, campaign imagery, and press-ready visuals from the Meteriyaye era.",
        note: "Portraits, campaign, press",
      },
    ],
  },
  archive: {
    eyebrow: "Official Presence",
    title: "The full story lives here.",
    description:
      "From Addis Ababa to global stages — the biography, the catalogue, the images, and the legacy of Adane Teka's daughter. Everything is in one place.",
    primaryAction: { href: "/music", label: "Listen to Meteriyaye" },
    secondaryAction: { href: "/media", label: "View Official Images" },
    credits: [
      {
        label: "Meteriyaye",
        note: "The 12-track debut album — August 2024, 51 minutes, the defining record of her era.",
      },
      {
        label: "Adane Teka Heritage",
        note: "Born in Addis Ababa as the daughter of celebrated Ethiopian performer Adane Teka.",
      },
      {
        label: "SBS Interview",
        note: "In SBS Amharic, Veronica described Meteriyaye as built around love, hope, unity, patriotism, and peace.",
      },
      {
        label: "Zojak Worldwide",
        note: "Acquired by Zojak Worldwide in a record-setting deal reported by Addis Insight.",
      },
      {
        label: "Singles 2021–2023",
        note: "Tewu, Kurfya, Enaney, and Abebaye — the singles that built the audience before the album arrived.",
      },
      {
        label: "Official Imagery",
        note: "Portraits, campaign visuals, and press imagery from the Meteriyaye era — available in the media grid.",
      },
    ],
  },
};


