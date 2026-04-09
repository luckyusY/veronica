import type { HomePageContent } from "@/lib/cms-types";
import { defaultMediaLibrary } from "@/lib/cms-defaults/shared";
import { officialYouTubePlaylists } from "@/lib/youtube-playlists";

export const defaultHomePageContent: HomePageContent = {
  hero: {
    verticalLabel: "VERONICA ADANE / OFFICIAL",
    headlineTop: "Veronica Adane",
    headlineLines: ["from Addis Ababa", "to global stages"],
    primaryAction: { href: "/about", label: "Read Full Biography" },
    secondaryAction: { href: "/music", label: "Explore Music" },
    slides: [
      {
        eyebrow: "Origins",
        title: "Born in Addis Ababa and shaped by faith, sacrifice, and purpose.",
        copy:
          "Veronica Adane built her life and career on belief in God, hard work, and a refusal to let humble beginnings define the size of her future.",
        image: defaultMediaLibrary.cliff,
        stat: "Addis Ababa",
        accent: "The beginning",
      },
      {
        eyebrow: "Heritage",
        title: "The daughter of Adane Teka chose pride over shame.",
        copy:
          "Raised inside the legacy of a respected traditional singer, Veronica later reclaimed the word Azmari in public and turned heritage into one of the strongest parts of her identity.",
        image: defaultMediaLibrary.microphone,
        stat: "Azmari heritage",
        accent: "Family legacy",
      },
      {
        eyebrow: "Independent rise",
        title: "A music journey that started with one phone and no safety net.",
        copy:
          "While still a university student, she recorded cover songs with only a mobile phone, worked as a private tutor to support her family, and slowly built the audience that changed her life.",
        image: defaultMediaLibrary.crowd,
        stat: "One phone",
        accent: "Self-made story",
      },
      {
        eyebrow: "Global chapter",
        title: "Tours, awards, advocacy, and a multilingual chapter are already underway.",
        copy:
          "National demand, diaspora tours, a 41M+ album run for Meteriyaye, African Union recognition, and major awards now point to a much larger future.",
        image: defaultMediaLibrary.heartMid,
        stat: "2025 recognition",
        accent: "What comes next",
      },
    ],
  },
  intro: {
    eyebrow: "Overview",
    title: "An Ethiopian artist whose story joins faith, scholarship, performance, and public impact.",
    paragraphs: [
      "Veronica Adane is an Ethiopian singer, songwriter, actress, journalist, and one of the most influential female artists in Ethiopia today. Born and raised in Addis Ababa, she is known as a woman who started from nothing and built her name through discipline, courage, and belief in God.",
      "She earned a Bachelor's Degree in Journalism and Communication from Mekelle University with strong academic results, and her research on freedom of speech was placed in the university library as a reference paper for future students.",
      "That mix of faith, study, work ethic, and public purpose now shapes her music, film work, advocacy, brand partnerships, and growing international profile.",
    ],
    image: defaultMediaLibrary.cliff,
    stats: [
      {
        value: "1 phone",
        label: "How the journey began",
        detail: "She started posting cover songs online with no studio, no team, and only one mobile phone.",
      },
      {
        value: "41M+",
        label: "Meteriyaye album views",
        detail: "Her debut album Meteriyaye passed more than 41 million YouTube views within one year.",
      },
      {
        value: "1.8M+",
        label: "TikTok community",
        detail: "Her social platform includes more than 1.8 million TikTok followers alongside strong Instagram and Facebook reach.",
      },
    ],
  },
  visualChapters: {
    eyebrow: "Public image",
    title: "A visual identity built from heritage, stage authority, and modern Ethiopian glamour.",
    description:
      "The imagery around Veronica now holds multiple roles at once: biography, stage power, press presence, and a wider global ambition.",
    chips: ["Biography", "Performance", "Press", "Future"],
    items: [
      {
        title: "Roots and resolve",
        era: "Biography",
        note: "Portraits that foreground faith, discipline, and the dignity of her Addis Ababa beginning.",
        image: defaultMediaLibrary.furSeated,
      },
      {
        title: "Live authority",
        era: "Performance",
        note: "Images for the artist who became one of Ethiopia's most in-demand live performers, often taking multiple shows in one night.",
        image: defaultMediaLibrary.stage,
      },
      {
        title: "Global presence",
        era: "Press and future",
        note: "A polished image system for tours, interviews, awards, film work, and brand partnerships.",
        image: defaultMediaLibrary.heartClose,
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
    eyebrow: "Heritage",
    title: "Adane Teka's daughter turned heritage into strength, not apology.",
    description:
      "Adane Teka's life as a masinko performer and freestyle storyteller gave Veronica more than inspiration. It gave her a living connection to Ethiopian history, cultural education, and the Azmari identity she later defended with public pride.",
    tags: ["Adane Teka", "Masinko", "Azmari", "Addis Ababa"],
    image: defaultMediaLibrary.microphone,
  },
  rise: {
    eyebrow: "Independent rise",
    title: "Her career moved from campus cover videos to the busiest live stages in the country.",
    description:
      "Before the biggest songs, Veronica balanced university life, private tutoring, professional leadership, and early online covers. After graduation she worked at DCT Entertainment, performed at the ETRSS-1 satellite celebration on December 20, 2019, and later left a stable job to follow music full time.",
    nationalNote:
      "Before releasing her album, she toured Addis Ababa, Gondar, Hawassa, Harar, Dire Dawa, Bahir Dar, Arba Minch, Dilla, and many other cities across Ethiopia.",
    internationalNote:
      "Diaspora demand later took her to Dubai, Abu Dhabi, Qatar, Bahrain, Israel, major cities across the United States, and the Meteriyaye tour across Europe, where many shows sold out.",
    images: [defaultMediaLibrary.crowd, defaultMediaLibrary.aerialCrowd],
  },
  campaign: {
    eyebrow: "Recognition and impact",
    title: "Awards, acting, advocacy, and brand leadership widened the story beyond music.",
    description:
      "In 2025 she was welcomed as a Special Guest at the African Union, later received two major Zikomo Awards, earned AFRIMA recognition in Nigeria, starred in Key Mesmer, and kept using her platform for women, children, and the voiceless.",
    featureImage: defaultMediaLibrary.heartMid,
    supportingImages: [defaultMediaLibrary.stage, defaultMediaLibrary.furClose],
  },
  playlists: {
    eyebrow: "Screening room",
    title: "Official playlists for the album, hit songs, visuals, and behind-the-scenes footage.",
    description:
      "From Meteriyaye to the songs that built her audience, the playlist grid gives visitors a fast route into the official channel without losing context.",
    highlights: ["4 featured playlists", "Official YouTube", "Direct playback"],
    channelAction: {
      href: "https://youtube.com/@veronica_adane?si=l5aWL2XoK4xlqGDk",
      label: "Open YouTube channel",
    },
    items: officialYouTubePlaylists.map((item) => ({ ...item })),
  },
  pathways: {
    eyebrow: "Explore",
    title: "Biography, music, and official imagery in one place.",
    description:
      "The official site should move quickly between the life story, the catalogue, and the approved visual archive without losing the truth of how the career was built.",
    items: [
      {
        title: "About",
        href: "/about",
        accent: "Biography",
        description:
          "Read the full story: Addis Ababa roots, Mekelle University, Azmari identity, journalism, acting, advocacy, and the journey from one phone to international stages.",
        note: "Roots, study, mission",
      },
      {
        title: "Music & Videos",
        href: "/music",
        accent: "Catalogue",
        description:
          "Move through hit songs, official playlists, album visuals, and the music that built local and diaspora demand.",
        note: "Singles, album, playlists",
      },
      {
        title: "Media",
        href: "/media",
        accent: "Official Images",
        description:
          "Open approved portraits and press-ready imagery for interviews, features, and partner use.",
        note: "Portraits, press, archive",
      },
    ],
  },
  archive: {
    eyebrow: "The next chapter",
    title: "This is not the end. This is only the beginning.",
    description:
      "Veronica is now working on a five-song multilingual EP and dreams of building a foundation for women, youth, and people in need while growing into a global African artist and businesswoman.",
    primaryAction: { href: "/about", label: "Read Biography" },
    secondaryAction: { href: "/music", label: "Open Music & Videos" },
    credits: [
      {
        label: "Addis Ababa",
        note: "Born and raised in the Ethiopian capital, where faith, family, and discipline shaped the foundation of the story.",
      },
      {
        label: "Mekelle University",
        note: "Earned a degree in Journalism and Communication, with a freedom-of-speech research paper preserved in the university library.",
      },
      {
        label: "One phone",
        note: "Started posting cover songs online with almost no resources while tutoring students and helping support her family.",
      },
      {
        label: "Touring force",
        note: "Built demand through nonstop live performances across Ethiopia before expanding to the Middle East, the United States, and Europe.",
      },
      {
        label: "Meteriyaye",
        note: "Her debut album gained more than 41 million YouTube views within one year and became the highest paid album deal for an Ethiopian artist at the time.",
      },
      {
        label: "2025 recognition",
        note: "African Union recognition, Zikomo Awards wins, AFRIMA recognition, and a growing advocacy voice marked a wider pan-African chapter.",
      },
    ],
  },
};
