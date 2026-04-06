import type { StandardPageContent } from "@/lib/cms-types";
import { defaultMediaLibrary } from "@/lib/cms-defaults/shared";

export const defaultAboutPageContent: StandardPageContent = {
  hero: {
    eyebrow: "About Veronica",
    title: "A biography rooted in purpose, discipline, family, and identity.",
    description:
      "This biography page is designed to feel like a long-form artist profile: heritage, discipline, and public milestones arranged with more visual weight and less template noise.",
    highlightWords: ["purpose", "family", "identity"],
    image: defaultMediaLibrary.cliff,
    imageMotionPreset: "from-right",
    imageLabel: "Official full-length studio portrait",
    noteTitle: "Biography standard",
    noteText:
      "The biography should read with dignity and emotional weight, holding real milestones without turning the page into a resume.",
    primaryCta: { href: "/media", label: "View press positioning" },
    secondaryCta: { href: "/music", label: "Explore releases" },
  },
  sections: [
    {
      id: "narrative-frame",
      type: "split",
      theme: "paper",
      eyebrow: "Narrative frame",
      title:
        "Veronica Adane's story should feel carried by heritage, courage, and deliberate self-definition.",
      description:
        "The strongest version of this page balances biography with atmosphere. It acknowledges family legacy, academic rigor, and the long period of independent work that turned local momentum into national and international reach.",
      image: defaultMediaLibrary.furSeated,
      imageSide: "right",
      imageMotionPreset: "from-right",
      tallImage: true,
      cards: [
        { title: "Faith", description: "Faith and discipline sit at the center of the story." },
        { title: "Identity", description: "Azmari heritage is presented with pride, not apology." },
        {
          title: "Study",
          description: "Academic and artistic identity are treated as part of one narrative.",
        },
      ],
      cardVariant: "note",
    },
    {
      id: "story-layers",
      type: "timeline",
      theme: "dark",
      eyebrow: "Story layers",
      title: "The public story is strongest when it carries both tenderness and stature.",
      description:
        "Reclaiming the Azmari identity, supporting family, excelling in journalism, and building a music career independently are not separate facts. Together they create the emotional architecture of the brand.",
      items: [
        "Raised in Addis Ababa and shaped by the musical legacy of Adane Teka.",
        "Graduated from Mekelle University in journalism and communication with strong academic performance.",
        "Started sharing cover performances online using only a mobile phone while supporting family and studies.",
        "Moved from event leadership into full-time music, funding releases through live performance income.",
        "Expanded from national recognition to international tours, awards, acting, and advocacy.",
      ],
    },
    {
      id: "biography-atmosphere",
      type: "banner",
      theme: "dark",
      eyebrow: "Biography atmosphere",
      title: "The biography should feel like a sequence of public moments, not a column of facts.",
      image: defaultMediaLibrary.stage,
      imageMotionPreset: "settle-left",
    },
    {
      id: "biography-chapters",
      type: "cards",
      theme: "paper",
      eyebrow: "Biography chapter",
      title: "Key foundations of the Veronica Adane story.",
      items: [
        {
          title: "Azmari heritage with global reach",
          description:
            "Veronica proudly reclaims the Azmari identity through the legacy of her father, Adane Teka, one of Ethiopia's respected traditional performers and storytellers.",
        },
        {
          title: "Journalism, leadership, and research discipline",
          description:
            "Her academic background in journalism and communication adds depth to how she tells stories, uses media, and advocates for truth, women, and children.",
        },
        {
          title: "A career built independently",
          description:
            "From recording covers on a single phone to funding music through nonstop live performances, her trajectory is grounded in grit, faith, and self-belief.",
        },
      ],
    },
  ],
};

export const defaultMusicPageContent: StandardPageContent = {
  hero: {
    eyebrow: "Music & Videos",
    title: "The music section should feel like an immersive release space, not a simple list of embeds.",
    description:
      "This section should behave like a release archive with atmosphere: image-led, emotionally paced, and capable of holding albums, singles, videos, and future exclusive drops.",
    highlightWords: ["immersive", "release", "space"],
    image: defaultMediaLibrary.heartMid,
    imageMotionPreset: "from-left",
    imageLabel: "Official scarlet campaign portrait",
    noteTitle: "Release experience",
    noteText:
      "Music pages should feel cinematic and editorial before a single embed appears. The frame sets the value of the release.",
    primaryCta: { href: "/events", label: "Pair releases with tour" },
    secondaryCta: { href: "/shop", label: "Open product layer" },
  },
  sections: [
    {
      id: "release-shelves",
      type: "split",
      theme: "dark",
      eyebrow: "Release shelves",
      title: "Major songs and albums should read like eras with their own weight.",
      description:
        "Track cards, platform links, visuals, and release notes should all feel authored, not just listed.",
      image: defaultMediaLibrary.furClose,
      imageSide: "right",
      imageMotionPreset: "from-right",
      tallImage: true,
      cards: [
        {
          title: "Meteriyaye",
          accent: "Album Era",
          description:
            "Debut album distributed with Zojak Worldwide, built around personal storytelling and emotionally rooted songwriting.",
        },
        {
          title: "Enaney",
          accent: "33M+ Views",
          description:
            "One of her biggest YouTube records and a strong example of how her sound lands both emotionally and commercially.",
        },
        {
          title: "Abebaye",
          accent: "17M+ Views",
          description:
            "A fan-favorite hit that blends Ethiopian identity, vocal control, and polished mainstream appeal.",
        },
        {
          title: "Tefet Alegn",
          accent: "23M+ Views",
          description:
            "High-energy replay value with strong streaming traction and wide live-show recognition.",
        },
      ],
      cardVariant: "release",
    },
    {
      id: "music-direction",
      type: "banner",
      theme: "dark",
      eyebrow: "Music direction",
      title: "Release eras should land like chapters with memory, scale, and replay value.",
      image: defaultMediaLibrary.aerialCrowd,
      imageMotionPreset: "settle-left",
    },
    {
      id: "experience-layers",
      type: "cards",
      theme: "paper",
      eyebrow: "Experience layers",
      title: "How the release environment should expand over time.",
      items: [
        {
          title: "Featured album storytelling",
          description: "Lead with credits, visuals, release notes, and emotionally framed release pages.",
        },
        {
          title: "Track cards and metadata",
          description: "Give singles and videos richer cards with links, streaming notes, and premium editions.",
        },
        {
          title: "Video premieres",
          description: "Support playlists, premiere drops, and future exclusive visual collections.",
        },
      ],
    },
  ],
};

export const defaultEventsPageContent: StandardPageContent = {
  hero: {
    eyebrow: "Events",
    title: "Tour pages should carry the electricity of the live show before checkout even begins.",
    description:
      "Tour pages should feel live before checkout even starts. This section is being shaped to hold city narratives, premium tiers, QR entry, and sponsor-ready show pages.",
    highlightWords: ["electricity", "live", "checkout"],
    image: defaultMediaLibrary.aerialCrowd,
    imageMotionPreset: "settle-right",
    imageLabel: "Official campaign image for live-show energy",
    noteTitle: "Live system",
    noteText:
      "The events layer should translate live demand into a polished ticketing experience without losing the emotional charge of performance.",
    primaryCta: { href: "/contact", label: "Book live performance" },
    secondaryCta: { href: "/shop", label: "Bundle merch strategy" },
  },
  sections: [
    {
      id: "tour-map",
      type: "cards",
      theme: "paper",
      eyebrow: "Tour map",
      title: "Key regions where live demand is already proven.",
      items: [
        {
          title: "Ethiopia",
          description:
            "Addis Ababa, Gondar, Hawassa, Bahir Dar, Harar, and Dire Dawa are ideal for city pages, routing info, and premium ticket tiers.",
        },
        {
          title: "United States",
          description:
            "Atlanta, DMV, Los Angeles, Seattle, Denver, and Oakland support diaspora-driven rollout, merch bundling, and fan follow-up.",
        },
        {
          title: "Europe",
          description:
            "Amsterdam, Paris, Zurich, Oslo, Frankfurt, and Stockholm fit sponsor activations and itinerary-led marketing.",
        },
      ],
      cardVariant: "route",
    },
    {
      id: "ticket-flow",
      type: "split",
      theme: "dark",
      eyebrow: "Ticketing flow",
      title: "Ticketing should feel premium, legible, and ready for real routing complexity.",
      description:
        "The best event layer keeps routing, venue details, and checkout simple while still feeling aligned with the luxury public brand.",
      image: defaultMediaLibrary.crowd,
      imageSide: "left",
      imageMotionPreset: "from-left",
      tallImage: true,
      cards: [
        {
          title: "City pages",
          description: "Upcoming city pages with event descriptions, venue details, and ticket tiers.",
        },
        {
          title: "Checkout and QR tickets",
          description: "Purchases can flow into QR delivery and account-based ticket history.",
        },
        {
          title: "Post-event analytics",
          description: "Attendance, strong cities, and merch attach rate can later feed the admin dashboard.",
        },
      ],
      cardVariant: "dark-note",
    },
  ],
};

export const defaultShopPageContent: StandardPageContent = {
  hero: {
    eyebrow: "Shop",
    title: "The store should feel premium, selective, and connected to each music era.",
    description:
      "The store is being positioned as a selective extension of each music era: fewer generic storefront cues, more atmosphere, and a cleaner bridge between merchandise and identity.",
    highlightWords: ["premium", "store", "era"],
    image: defaultMediaLibrary.crowd,
    imageMotionPreset: "from-left",
    imageLabel: "Official fashion image for the shop atmosphere",
    noteTitle: "Commerce direction",
    noteText:
      "Commerce should feel considered and collectible, not crowded. The strongest version connects every product drop to a release era or live moment.",
    primaryCta: { href: "/music", label: "Align with releases" },
    secondaryCta: { href: "/events", label: "Bundle event offers" },
  },
  sections: [
    {
      id: "collection-layers",
      type: "split",
      theme: "paper",
      eyebrow: "Collection layers",
      title: "Merch, digital drops, and collector items should all feel curated.",
      description:
        "The shop starts lean, but it should already communicate how product connects to releases, performances, and future private access.",
      image: defaultMediaLibrary.furClose,
      imageSide: "left",
      imageMotionPreset: "from-right",
      tallImage: true,
      cards: [
        {
          title: "Signature Apparel",
          description: "Luxury streetwear, tour drops, and capsule collections built around album eras.",
        },
        {
          title: "Digital Releases",
          description:
            "Premium downloads, exclusive versions, behind-the-scenes cuts, and lyric bundles.",
        },
        {
          title: "Collector Editions",
          description: "Signed memorabilia, limited posters, and visual story packs for superfans.",
        },
      ],
      cardVariant: "note",
    },
    {
      id: "commerce-foundation",
      type: "cards",
      theme: "dark",
      eyebrow: "Commerce foundation",
      title: "The shop should be lean at launch, but structured for bigger drops and private access later.",
      items: [
        {
          title: "Collections",
          description: "Separate merch, collector drops, and digital bundles into clear premium groups.",
        },
        {
          title: "Order records",
          description: "Keep orders and purchase history tied to accounts for later dashboards and member experiences.",
        },
        {
          title: "Expansion path",
          description: "Prepare the structure for VIP memberships, limited launches, and future mentorship products.",
        },
      ],
      cardVariant: "dark-note",
    },
  ],
};

export const defaultCollaborationsPageContent: StandardPageContent = {
  hero: {
    eyebrow: "Collaborations",
    title: "A partnership page built for premium brands, event promoters, and media decision-makers.",
    description:
      "This page is being rebuilt for brand decision-makers: concise, elegant, and immediate enough to communicate audience value, public trust, and campaign flexibility in only a few screens.",
    highlightWords: ["premium", "brands", "media"],
    image: defaultMediaLibrary.furSeated,
    imageMotionPreset: "settle-right",
    imageLabel: "Official fashion portrait for brand-facing pages",
    noteTitle: "Partner language",
    noteText:
      "Brands should understand Veronica's stature quickly. The page should feel commercially ready without losing the editorial identity of the site.",
    primaryCta: { href: "/contact", label: "Start partnership inquiry" },
    secondaryCta: { href: "/media", label: "Open media & press" },
  },
  sections: [
    {
      id: "partnership-tracks",
      type: "split",
      theme: "dark",
      eyebrow: "Partnership tracks",
      title: "How Veronica's platform translates into activation formats.",
      description:
        "The collaboration page should communicate trust, audience value, and format flexibility in language that brand teams can use immediately.",
      image: defaultMediaLibrary.stage,
      imageSide: "right",
      imageMotionPreset: "from-left",
      tallImage: true,
      cards: [
        {
          title: "Brand ambassador campaigns",
          description:
            "Launch pages, sponsored visuals, and storytelling-led activations for premium partners.",
        },
        {
          title: "Event and festival partnerships",
          description:
            "Ticket promotions, backstage hospitality, co-branded media, and sponsor placement.",
        },
        {
          title: "Media kit and press delivery",
          description:
            "Downloadable assets, approved bios, award highlights, and direct inquiry routing.",
        },
      ],
      cardVariant: "release",
    },
    {
      id: "activation-formats",
      type: "cards",
      theme: "paper",
      eyebrow: "Activation formats",
      title: "A brand-facing page that still feels editorial and selective.",
      items: [
        {
          title: "Ambassador campaigns",
          description: "Visual storytelling and social rollout support tailored to premium partners.",
        },
        {
          title: "Launch experiences",
          description: "Concert-backed takeovers, backstage integrations, and branded event moments.",
        },
        {
          title: "Media kit delivery",
          description: "One-sheets, biography downloads, sponsor decks, and direct inquiry flows.",
        },
      ],
    },
  ],
};

export const defaultMediaPageContent: StandardPageContent = {
  hero: {
    eyebrow: "Media & Press",
    title: "A polished press environment gives every milestone a trusted home.",
    description:
      "The press environment is being shaped for trust: fast to scan, visually composed, and capable of carrying awards, advocacy, interviews, film work, and approved biography materials.",
    highlightWords: ["milestone", "trusted", "home"],
    image: defaultMediaLibrary.microphone,
    imageMotionPreset: "from-left",
    imageLabel: "Official editorial close-up portrait",
    noteTitle: "Press standard",
    noteText:
      "A strong press page helps journalists verify the story quickly while still feeling clearly connected to the artist's broader visual identity.",
    primaryCta: { href: "/contact", label: "Request media access" },
    secondaryCta: { href: "/about", label: "Read biography" },
  },
  sections: [
    {
      id: "press-highlights",
      type: "split",
      theme: "paper",
      eyebrow: "Press highlights",
      title: "Recognition, advocacy, and film work should be visible at a glance.",
      description:
        "This archive should help journalists and partners verify major milestones quickly while still preserving tone and visual polish.",
      image: defaultMediaLibrary.hero,
      imageSide: "right",
      imageMotionPreset: "from-right",
      tallImage: true,
      cards: [
        {
          title: "African Union recognition",
          description:
            "A speaking and performance milestone that positions Veronica as a pan-African cultural voice, not only an entertainer.",
        },
        {
          title: "Film and advocacy presence",
          description:
            "Her acting and public advocacy expand the platform beyond music into impact, conversation, and representation.",
        },
        {
          title: "Press-ready storytelling",
          description:
            "Official photography, interview clips, biography layers, and verified career milestones can live together in one trusted archive.",
        },
      ],
      cardVariant: "note",
    },
    {
      id: "press-kit-structure",
      type: "cards",
      theme: "dark",
      eyebrow: "Press kit structure",
      title: "Media access should be simple without flattening the story into generic publicity language.",
      items: [
        {
          title: "Editorial portraits",
          description: "Approved stills and stage photography with clear usage context.",
        },
        {
          title: "Verified milestones",
          description: "Coverage, interviews, awards, advocacy moments, and film credits.",
        },
        {
          title: "Downloadable assets",
          description: "Approved biography blocks, campaign visuals, and brand-ready press materials.",
        },
      ],
      cardVariant: "dark-note",
    },
    {
      id: "press-gallery",
      type: "gallery",
      theme: "paper",
      eyebrow: "Press gallery",
      title: "Official photography and campaign imagery.",
      description:
        "High-resolution approved images for press, editorial, and media use. Add or update images via the admin media library.",
      items: [],
      columns: 3,
    },
  ],
};

export const defaultContactPageContent: StandardPageContent = {
  hero: {
    eyebrow: "Contact",
    title: "Booking, management, and media pathways should feel premium and clear.",
    description:
      "This page is becoming the clear intake point for bookings, brand work, and media coordination, with a calmer editorial tone and stronger hierarchy for high-value inquiries.",
    highlightWords: ["booking", "media", "premium"],
    image: defaultMediaLibrary.cliff,
    imageMotionPreset: "settle-right",
    imageLabel: "Official Veronica studio portrait",
    noteTitle: "Inquiry pathway",
    noteText:
      "Clarity matters here more than decoration. The experience should feel direct, elevated, and easy for management, promoters, and journalists to trust.",
    primaryCta: { href: "/events", label: "See events direction" },
    secondaryCta: { href: "/collaborations", label: "Review collaborations" },
  },
  sections: [
    {
      id: "contact-channels",
      type: "cards",
      theme: "paper",
      eyebrow: "Contact channels",
      title: "The clearest pathways for the highest-value requests.",
      items: [
        {
          title: "Live bookings",
          description: "Concerts, private events, festivals, and diaspora tour routing.",
        },
        {
          title: "Brand partnerships",
          description: "Endorsements, ambassador campaigns, launch events, and media integrations.",
        },
        {
          title: "Media and press",
          description: "Interviews, red carpet appearances, editorial requests, and official assets.",
        },
      ],
      cardVariant: "route",
    },
    {
      id: "implementation-notes",
      type: "cards",
      theme: "dark",
      eyebrow: "Implementation notes",
      title: "The next build layer can connect these pathways to stored inquiries, team routing, and faster follow-up.",
      items: [
        {
          title: "Category routing",
          description: "Separate live booking, brand partnerships, and press requests from the first click.",
        },
        {
          title: "Stored inquiry history",
          description: "Keep records in MongoDB for management visibility and internal follow-up.",
        },
        {
          title: "Transactional response flow",
          description: "Prepare for acknowledgement emails, booking follow-up, and VIP invitations.",
        },
      ],
      cardVariant: "dark-note",
    },
  ],
};
