import img8027 from "../../assets/IMG_8027.JPG.jpeg";
import img8029 from "../../assets/IMG_8029.JPG.jpeg";
import img8077 from "../../assets/IMG_8077.JPG.jpeg";
import img8078 from "../../assets/IMG_8078.JPG.jpeg";
import img8079 from "../../assets/IMG_8079.JPG (1).jpeg";
import img8080 from "../../assets/IMG_8080.JPG.jpeg";
import img8081 from "../../assets/IMG_8081.JPG.jpeg";
import img8094 from "../../assets/IMG_8094.JPG.jpeg";
import img8095 from "../../assets/IMG_8095.JPG.jpeg";
import img8096 from "../../assets/IMG_8096.JPG.jpeg";

export const editorialImages = {
  hero: {
    src: img8078,
    alt: "Veronica Adane reclining in a crystal-styled bath inside a gilded marble interior.",
    label: "Crystal bath portrait",
    position: "center 24%",
    placeholderBase: "#20140f",
    placeholderHighlight: "#d1b187",
  },
  cliff: {
    src: img8029,
    alt: "Veronica Adane standing in a black off-shoulder gown against a clean studio backdrop.",
    label: "Signature black gown portrait",
    position: "center 18%",
    placeholderBase: "#161111",
    placeholderHighlight: "#cbbfb3",
  },
  stage: {
    src: img8077,
    alt: "Veronica Adane styled in crystal couture inside a marble-and-gold bath set.",
    label: "Gilded couture portrait",
    position: "center 30%",
    placeholderBase: "#23160f",
    placeholderHighlight: "#d7bf96",
  },
  microphone: {
    src: img8027,
    alt: "Close portrait of Veronica Adane in a black editorial look with feather trim.",
    label: "Classic close-up portrait",
    position: "center 14%",
    placeholderBase: "#130f10",
    placeholderHighlight: "#d7cdc5",
  },
  crowd: {
    src: img8081,
    alt: "Veronica Adane seated in a brown fur coat over black tailoring on a warm studio set.",
    label: "Fur studio portrait",
    position: "center 18%",
    placeholderBase: "#1f130f",
    placeholderHighlight: "#8f5d41",
  },
  aerialCrowd: {
    src: img8094,
    alt: "Veronica Adane in a crimson gown with white opera gloves framed by red heart balloons.",
    label: "Scarlet campaign portrait",
    position: "center 24%",
    placeholderBase: "#260909",
    placeholderHighlight: "#b92324",
  },
  furSeated: {
    src: img8079,
    alt: "Veronica Adane posed in a deep brown fur coat with black tailoring against a caramel studio background.",
    label: "Couture fur portrait",
    position: "center 20%",
    placeholderBase: "#251611",
    placeholderHighlight: "#8a583e",
  },
  furClose: {
    src: img8080,
    alt: "Veronica Adane seated in a rich brown fur coat and black tailored look.",
    label: "Winter couture close-up",
    position: "center 18%",
    placeholderBase: "#241510",
    placeholderHighlight: "#8b5a40",
  },
  heartMid: {
    src: img8095,
    alt: "Veronica Adane in a red gown against a wall of red heart balloons.",
    label: "Heart-wall glamour portrait",
    position: "center 24%",
    placeholderBase: "#2a090a",
    placeholderHighlight: "#c22529",
  },
  heartClose: {
    src: img8096,
    alt: "Close glamour portrait of Veronica Adane in a red gown and white gloves framed by heart balloons.",
    label: "Scarlet close-up portrait",
    position: "center 22%",
    placeholderBase: "#24090a",
    placeholderHighlight: "#c02327",
  },
} as const;

export const editorialIntro = [
  "Veronica Adane is an Ethiopian singer, songwriter, actress, and journalist whose story is built on faith, discipline, sacrifice, and purpose.",
  "Born and raised in Addis Ababa, she rose from recording cover songs on a single phone to becoming one of Ethiopia's most influential female artists.",
  "Her world now stretches across music, film, advocacy, and international stages while staying rooted in family, culture, and the pride of Azmari heritage.",
];

export const editorialSignals = [
  {
    value: "41M+",
    label: "Album momentum",
    detail: "Meteriyaye reached more than 41 million YouTube views within one year.",
  },
  {
    value: "1.8M+",
    label: "Social reach",
    detail: "A fast-moving audience following her across TikTok, Instagram, Facebook, and beyond.",
  },
  {
    value: "Global",
    label: "Tour energy",
    detail: "From Ethiopian cities to diaspora venues across the US, Europe, and the Middle East.",
  },
];

export const editorialStoryNotes = [
  {
    eyebrow: "Heritage",
    title: "An artist shaped by family, culture, and the courage to reclaim identity.",
    copy: "Veronica's story begins with her father's legacy and her decision to wear the Azmari identity with pride instead of shame. That foundation should be visible in the home experience from the first scroll.",
  },
  {
    eyebrow: "Discipline",
    title: "A career that started with one phone and grew through relentless live performance.",
    copy: "Before the sold-out rooms, the international routing, and the recognition, there was a student recording covers with minimal resources and funding the dream step by step.",
  },
];

export const editorialSections = [
  {
    title: "Music & Video",
    description:
      "Albums, singles, live visuals, and standout records presented as eras with emotional weight and visual identity.",
  },
  {
    title: "Events & Tours",
    description:
      "Tour dates, city routing, ticketing, and sold-out momentum shaped around Veronica's live-performance power.",
  },
  {
    title: "Media & Press",
    description:
      "Recognition, advocacy, interviews, film work, and official coverage collected in one trusted archive.",
  },
];

export const editorialHeroMoments = [
  {
    eyebrow: "Global Stage",
    title: "Faith, glamour, and a voice carrying Ethiopia far beyond its borders.",
    copy:
      "Veronica Adane stands at the meeting point of culture, discipline, and modern stardom. Her presence is cinematic, but the journey behind it is deeply earned.",
    image: editorialImages.hero,
    stat: "41M+ album views",
    accent: "Meteriyaye era",
  },
  {
    eyebrow: "Signature Portrait",
    title: "A woman whose elegance is matched by conviction, discipline, and purpose.",
    copy:
      "From journalism and advocacy to sold-out live performance, Veronica's public image is built on both beauty and substance.",
    image: editorialImages.cliff,
    stat: "1.8M+ TikTok followers",
    accent: "Official portraiture",
  },
  {
    eyebrow: "Scarlet Campaign",
    title: "Romance, spectacle, and release-era drama captured with confidence.",
    copy:
      "Her visual language can move from intimate portraiture to high-impact campaigns without losing the warmth and identity that make her recognisable.",
    image: editorialImages.heartMid,
    stat: "Multiple hit records",
    accent: "Release campaign",
  },
  {
    eyebrow: "Couture Studio",
    title: "Rooted in heritage, styled with luxury, and ready for an international audience.",
    copy:
      "Every frame should feel like a chapter in a growing legacy: Ethiopian, contemporary, and unmistakably Veronica.",
    image: editorialImages.furClose,
    stat: "Africa to diaspora tours",
    accent: "Brand-led imagery",
  },
] as const;

export const editorialGalleryMoments = [
  {
    title: "Crystal Couture",
    note: "A gilded portrait language for hero scenes and premiere moments.",
    image: editorialImages.stage,
  },
  {
    title: "Black Gown",
    note: "Clean portraiture that feels timeless, composed, and immediate.",
    image: editorialImages.microphone,
  },
  {
    title: "Brown Studio",
    note: "Warm tailoring and couture styling for commerce and partnerships.",
    image: editorialImages.crowd,
  },
  {
    title: "Scarlet Hearts",
    note: "Release-ready visuals that bring energy, desire, and campaign colour.",
    image: editorialImages.heartClose,
  },
  {
    title: "Full Portrait",
    note: "A modern icon framed with restraint and confidence.",
    image: editorialImages.furSeated,
  },
] as const;

export const editorialPathways = [
  {
    title: "Music & Videos",
    href: "/music",
    eyebrow: "Discography",
    description:
      "Enter the catalogue, watch featured visuals, and move through Veronica's major release eras.",
    note: "Albums, singles, visuals",
  },
  {
    title: "Events",
    href: "/events",
    eyebrow: "Live Performance",
    description:
      "Follow upcoming cities, tour momentum, and the performance world that made her one of Ethiopia's most in-demand live artists.",
    note: "Tours, tickets, routing",
  },
  {
    title: "Media & Press",
    href: "/media",
    eyebrow: "Recognition",
    description:
      "Open the archive of press, advocacy, interviews, awards, and official cultural milestones.",
    note: "Press, awards, advocacy",
  },
] as const;

export const editorialCredits = [
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
];
