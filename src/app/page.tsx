import Link from "next/link";
import {
  AnimatedEyebrow,
  AnimatedHeadline,
  AnimatedParagraph,
  RevealBlock,
} from "@/components/animated-text";
import { CinematicCard } from "@/components/cinematic-card";
import { MetricCard } from "@/components/metric-card";
import { SectionHeading } from "@/components/section-heading";
import {
  collaborationTracks,
  featuredStats,
  journeyMoments,
  pressHighlights,
  releaseHighlights,
  shopHighlights,
  upcomingEvents,
} from "@/lib/site-data";

const heroSignals = [
  {
    title: "Story-first design",
    description:
      "The interface leads with mood, narrative, and visual hierarchy before it asks for any action.",
  },
  {
    title: "Entertainment rails",
    description:
      "Key sections now behave more like curated streaming collections than static content blocks.",
  },
  {
    title: "Luxury interaction",
    description:
      "Hover depth, layered gradients, and richer contrast make the platform feel more premium on desktop and mobile.",
  },
];

const statCaptions = [
  "Momentum that proves this brand can carry a premium homepage confidently.",
  "Social gravity that justifies bold release rails and high-visibility merch drops.",
  "Geographic spread that supports city-focused event cards and diaspora targeting.",
  "Recognition strong enough to shape a press-ready and sponsor-ready visual identity.",
];

const journeyMeta = [
  ["Identity", "Heritage", "Pride"],
  ["Research", "Voice", "Advocacy"],
  ["Faith", "Discipline", "Independence"],
];

const releaseMeta = [
  ["Featured Era", "Album Story", "Visual Launch"],
  ["Replay Value", "Audience Favorite", "Live Energy"],
  ["Cultural Warmth", "Fan Chorus", "Mainstream Appeal"],
  ["High Tempo", "Tour Setlist", "Streaming Pull"],
];

const releaseBadges = ["Editor's Pick", "Top Stream", "Core Favorite", "Stage Heat"];
const releaseTones = ["gold", "accent", "bronze", "accent"] as const;
const releaseHighlightsWords = [
  ["meteriyaye", "storytelling"],
  ["biggest", "commercially"],
  ["ethiopian", "appeal"],
  ["high-energy", "traction"],
];

const eventBadges = ["Tour Network", "Diaspora Pulse", "Festival Ready"];
const eventMeta = [
  ["QR Tickets", "VIP Tables", "City Pages"],
  ["Merch Bundles", "Meet & Greet", "Email Capture"],
  ["Sponsor Slots", "Press Moments", "Route Campaigns"],
];
const eventTones = ["gold", "accent", "bronze"] as const;

const shopBadges = ["Drop 01", "Digital", "Collectors"];
const shopMeta = [
  ["Premium Fabric", "Era-Based Capsule", "Fast Checkout"],
  ["Exclusive Audio", "Download Access", "Bonus Content"],
  ["Signed Pieces", "Limited Stock", "Fan Prestige"],
];
const shopTones = ["accent", "gold", "bronze"] as const;

const collaborationMeta = [
  ["Campaign Story", "Ambassador Fit", "Launch Visuals"],
  ["Partner Events", "Ticket Uplift", "On-site Branding"],
  ["Press Kit", "Approved Bio", "Direct Routing"],
];

const pressMeta = [
  ["Pan-African Positioning", "Leadership Signal", "Trust Layer"],
  ["Film Credit", "Public Voice", "Human Impact"],
  ["Editorial Assets", "Coverage Archive", "Verified Timeline"],
];

const streamingSignals = [
  "Featured release rails that can later pull from MongoDB data models.",
  "Poster-style cards that work for songs, videos, tours, and merch drops.",
  "A stronger visual language for premieres, countdowns, and future membership content.",
];

export default function Home() {
  return (
    <main className="pb-16 sm:pb-20">
      <section className="section-shell relative overflow-hidden py-10 sm:py-14 lg:py-20">
        <div className="pointer-events-none absolute inset-x-8 top-4 -z-10 h-[28rem] rounded-[2.75rem] bg-[radial-gradient(circle_at_top,_rgba(212,175,106,0.24),_rgba(217,79,43,0.14),_transparent_68%)] blur-3xl" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_24rem] lg:items-start">
          <div className="space-y-6">
            <AnimatedEyebrow>Cinematic artist platform</AnimatedEyebrow>
            <AnimatedHeadline
              as="h1"
              className="display-title max-w-5xl text-5xl text-balance sm:text-6xl xl:text-7xl"
              highlightWords={["cinematic", "premium", "entertainment"]}
              text="Veronica Adane deserves a homepage that feels curated like premium entertainment."
            />
            <AnimatedParagraph
              className="max-w-3xl text-base leading-8 text-white/72 sm:text-lg"
              delay={0.14}
              text="The layout now leans harder into a streaming-inspired rhythm: stronger feature cards, more visual hierarchy, and sections that feel selected rather than simply stacked. It keeps the black and gold identity, but gives the experience more tension, depth, and motion."
            />

            <RevealBlock className="flex flex-wrap gap-3" delay={0.2}>
              <Link className="primary-button" href="/music">
                Explore Music
              </Link>
              <Link className="secondary-button" href="/events">
                View Tour Structure
              </Link>
            </RevealBlock>

            <RevealBlock className="flex flex-wrap gap-2 pt-2" delay={0.24}>
              {["Music", "Merch", "Tickets", "Media", "Brand Deals"].map((item) => (
                <span className="meta-chip" key={item}>
                  {item}
                </span>
              ))}
            </RevealBlock>

            <div className="grid gap-4 pt-4 md:grid-cols-3">
              {heroSignals.map((item, index) => (
                <RevealBlock delay={0.18 + index * 0.08} key={item.title}>
                  <article className="signal-tile">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                      0{index + 1}
                    </p>
                    <h2 className="mt-4 text-lg font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-white/66">
                      {item.description}
                    </p>
                  </article>
                </RevealBlock>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <RevealBlock delay={0.22}>
              <CinematicCard
                badge="Launch Layer"
                description="A stronger landing experience for new fans, partners, and diaspora audiences arriving from video, social, or press."
                eyebrow="Featured Mood"
                highlightWords={["cinematic", "era"]}
                meta={["Hero trailers", "Live show feel", "Premium storytelling"]}
                size="feature"
                title="Now entering a more cinematic visual era."
                tone="gold"
              />
            </RevealBlock>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <RevealBlock delay={0.28}>
                <article className="signal-tile">
                  <p className="meta-chip meta-chip--accent">Burnt Orange Focus</p>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    Used for urgency, hover states, featured badges, and
                    directional attention instead of random decoration.
                  </p>
                </article>
              </RevealBlock>
              <RevealBlock delay={0.34}>
                <article className="signal-tile">
                  <p className="meta-chip">Netflix-style rhythm</p>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    Bigger hero cards, cinematic rails, and cleaner content
                    grouping create a stronger premium entertainment flow.
                  </p>
                </article>
              </RevealBlock>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredStats.map((item, index) => (
            <MetricCard
              caption={statCaptions[index]}
              index={`0${index + 1}`}
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </section>

      <section className="section-shell py-12">
        <SectionHeading
          description="The biography area now aims to behave more like a premium editorial shelf. Each chapter gets more weight, mood, and visual identity while keeping the storytelling readable."
          eyebrow="Biography"
          highlightWords={["featured", "chapters"]}
          title="Story sections should feel like featured chapters, not generic content cards."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {journeyMoments.map((item, index) => (
            <CinematicCard
              badge={index === 0 ? "Core Identity" : index === 1 ? "Voice & Impact" : "Rise"}
              className="min-h-[20rem]"
              description={item.description}
              eyebrow="Story Chapter"
              highlightWords={index === 0 ? ["identity", "heritage"] : index === 1 ? ["voice", "discipline"] : ["career", "independently"]}
              key={item.title}
              meta={journeyMeta[index]}
              title={item.title}
              tone={index === 0 ? "bronze" : index === 1 ? "gold" : "accent"}
            />
          ))}
        </div>
      </section>

      <section className="section-shell py-12">
        <SectionHeading
          description="The first card takes the role of a featured title, while the rest act like a curated shelf. It is a much closer fit to the streaming-inspired feel you asked for."
          eyebrow="Music & Video"
          highlightWords={["release", "rail", "archive"]}
          title="This section now behaves like a release rail instead of a flat archive."
        />

        <RevealBlock className="rail-scroll mt-8" delay={0.08}>
          <div className="flex gap-4 pb-3">
            {releaseHighlights.map((item, index) => (
              <CinematicCard
                badge={releaseBadges[index]}
                className={
                  index === 0
                    ? "w-[min(35rem,90vw)] flex-none"
                    : "w-[min(24rem,82vw)] flex-none"
                }
                description={item.detail}
                eyebrow={item.accent}
                highlightWords={releaseHighlightsWords[index]}
                key={item.title}
                meta={releaseMeta[index]}
                rank={`0${index + 1}`}
                size={index === 0 ? "feature" : "default"}
                title={item.title}
                tone={releaseTones[index]}
              />
            ))}
          </div>
        </RevealBlock>

        <RevealBlock className="panel mt-8 rounded-[2rem] px-6 py-7 sm:px-8" delay={0.16}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <AnimatedEyebrow>Streaming-ready architecture</AnimatedEyebrow>
              <AnimatedHeadline
                as="h3"
                className="mt-4 text-3xl font-semibold text-white"
                highlightWords={["releases", "poster", "art"]}
                text="The card language is ready for real releases, previews, and poster art."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="meta-chip meta-chip--accent">Featured Shelf</span>
              <span className="meta-chip">Visual Metadata</span>
              <span className="meta-chip">Preview Moments</span>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {streamingSignals.map((item, index) => (
              <RevealBlock
                className="rounded-[1.35rem] border border-white/8 bg-black/20 px-4 py-4 text-sm leading-7 text-white/68"
                delay={0.18 + index * 0.06}
                key={item}
              >
                {item}
              </RevealBlock>
            ))}
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell py-12">
        <SectionHeading
          description="Each region now reads more like a featured tile. That creates better energy for tickets, routing, and premium event presentation."
          eyebrow="Tour & Tickets"
          highlightWords={["destinations", "clicking"]}
          title="Event cards should feel like destinations worth clicking."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {upcomingEvents.map((item, index) => (
            <CinematicCard
              badge={eventBadges[index]}
              className="min-h-[21rem]"
              description={item.note}
              eyebrow={item.region}
              highlightWords={index === 0 ? ["national", "VIP"] : index === 1 ? ["diaspora", "premium"] : ["sponsor", "activations"]}
              key={item.region}
              meta={eventMeta[index]}
              title={item.cities}
              tone={eventTones[index]}
            />
          ))}
        </div>
      </section>

      <section className="section-shell py-12">
        <SectionHeading
          description="The store cards now take cues from streaming and fashion drops: cleaner emphasis, better hierarchy, and stronger product mood without needing real inventory yet."
          eyebrow="Shop"
          highlightWords={["collectible", "catalog-heavy"]}
          title="Commerce tiles should feel collectible, not catalog-heavy."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {shopHighlights.map((item, index) => (
            <CinematicCard
              badge={shopBadges[index]}
              className="min-h-[20rem]"
              description={item.description}
              eyebrow="Product Layer"
              highlightWords={index === 0 ? ["signature", "apparel"] : index === 1 ? ["digital", "releases"] : ["collectors", "editions"]}
              key={item.title}
              meta={shopMeta[index]}
              title={item.title}
              tone={shopTones[index]}
            />
          ))}
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              description="This side now frames campaigns and brand work through stronger hero treatment and cleaner supporting cards."
              eyebrow="Collaborations"
              highlightWords={["premium", "fan-facing"]}
              title="Partner-facing content should feel as premium as fan-facing content."
            />
            <div className="mt-8 space-y-4">
              <CinematicCard
                badge="Brand Ready"
                description={collaborationTracks[0].description}
                eyebrow="Campaign Fit"
                highlightWords={["campaigns", "premium"]}
                meta={collaborationMeta[0]}
                size="feature"
                title={collaborationTracks[0].title}
                tone="gold"
              />
              <div className="grid gap-4 md:grid-cols-2">
                {collaborationTracks.slice(1).map((item, index) => (
                  <RevealBlock delay={0.12 + index * 0.06} key={item.title}>
                    <article className="signal-tile">
                      <p className="section-label">{item.title}</p>
                      <p className="mt-4 text-sm leading-7 text-white/68">
                        {item.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {collaborationMeta[index + 1].map((entry) => (
                          <span className="meta-chip" key={entry}>
                            {entry}
                          </span>
                        ))}
                      </div>
                    </article>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              description="Awards, advocacy, interviews, and film work now sit in a presentation style that feels closer to featured titles than simple notes."
              eyebrow="Media & Press"
              highlightWords={["cinematic", "shelf"]}
              title="Press highlights deserve a more cinematic shelf too."
            />
            <div className="mt-8 space-y-4">
              <CinematicCard
                badge="Press Anchor"
                description={pressHighlights[0].description}
                eyebrow="Recognition"
                highlightWords={["recognition", "voice"]}
                meta={pressMeta[0]}
                size="feature"
                title={pressHighlights[0].title}
                tone="accent"
              />
              <div className="grid gap-4 md:grid-cols-2">
                {pressHighlights.slice(1).map((item, index) => (
                  <RevealBlock delay={0.12 + index * 0.06} key={item.title}>
                    <article className="signal-tile">
                      <p className="section-label">{item.title}</p>
                      <p className="mt-4 text-sm leading-7 text-white/68">
                        {item.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {pressMeta[index + 1].map((entry) => (
                          <span className="meta-chip" key={entry}>
                            {entry}
                          </span>
                        ))}
                      </div>
                    </article>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12">
        <RevealBlock className="panel rounded-[2.2rem] px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <AnimatedEyebrow>Next Step</AnimatedEyebrow>
              <AnimatedHeadline
                as="h2"
                className="display-title mt-4 text-4xl text-balance sm:text-5xl"
                highlightWords={["premium", "content", "data"]}
                text="The UI now has a clearer premium direction, and it is ready for real content, posters, and commerce data."
              />
              <AnimatedParagraph
                className="mt-4 text-base leading-8 text-white/72"
                delay={0.14}
                text="From here we can replace gradient placeholders with real artist photography, wire MongoDB collections, and build an admin layer that controls these shelves and feature cards dynamically."
              />
            </div>
            <RevealBlock className="flex flex-wrap gap-3" delay={0.2}>
              <Link className="primary-button" href="/about">
                Review Story Structure
              </Link>
              <Link className="secondary-button" href="/contact">
                Open Booking Flow
              </Link>
            </RevealBlock>
          </div>
        </RevealBlock>
      </section>
    </main>
  );
}
