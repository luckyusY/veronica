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
    title: "Heritage first",
    description:
      "The platform leads with identity, family legacy, and a clearer sense of Veronica's artistic world.",
  },
  {
    title: "Luxury contrast",
    description:
      "Darker surfaces, brighter typography, and quieter accents create a more premium visual standard.",
  },
  {
    title: "Operationally ready",
    description:
      "The site is positioned to support releases, events, merchandise, press, and management workflows together.",
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
  "Release shelves can evolve into live collections powered by MongoDB-backed content.",
  "Poster-style framing works for songs, films, tours, collaborations, and collector products.",
  "The new system is strong enough for premieres, campaigns, VIP drops, and future membership layers.",
];

export default function Home() {
  return (
    <main className="pb-16 sm:pb-20">
      <section className="section-shell relative overflow-hidden py-10 sm:py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_24rem] lg:items-start">
          <div className="space-y-6">
            <AnimatedEyebrow>Official digital house</AnimatedEyebrow>
            <AnimatedHeadline
              as="h1"
              className="display-title max-w-5xl text-5xl text-balance sm:text-6xl xl:text-7xl"
              highlightWords={["luxury", "music", "legacy"]}
              text="A luxury digital house for music, stage, press, and legacy."
            />
            <AnimatedParagraph
              className="max-w-3xl text-base leading-8 text-white/72 sm:text-lg"
              delay={0.14}
              text="Built around Veronica Adane's voice, heritage, and global ambition, the platform now carries a sharper, more elegant standard across releases, live routing, partnerships, and media presentation."
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
                description="A premium introduction for new listeners, promoters, diaspora audiences, and brand partners arriving from stage, social, or press."
                eyebrow="Featured Frame"
                highlightWords={["luxury", "presence"]}
                meta={["Hero trailers", "Live show feel", "Premium storytelling"]}
                size="feature"
                title="A more refined and luxurious digital era begins here."
                tone="gold"
              />
            </RevealBlock>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <RevealBlock delay={0.28}>
                <article className="signal-tile">
                  <p className="meta-chip meta-chip--accent">Burnt Orange Accent</p>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    Reserved for urgency, action, and featured emphasis so the
                    palette stays elegant rather than over-decorated.
                  </p>
                </article>
              </RevealBlock>
              <RevealBlock delay={0.34}>
                <article className="signal-tile">
                  <p className="meta-chip">Classy visual rhythm</p>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    Cleaner spacing, more deliberate cards, and stronger contrast
                    give the site a calmer luxury feel.
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
          description="Each chapter of Veronica's story now sits in a more editorial presentation so heritage, discipline, and growth feel worthy of the legacy they represent."
          eyebrow="Biography"
          highlightWords={["story", "chapters"]}
          title="Featured chapters from a journey built on faith, identity, and discipline."
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
          description="The release floor is structured to spotlight major songs, visual eras, and audience favorites with a more elegant rhythm."
          eyebrow="Music & Video"
          highlightWords={["release", "era", "archive"]}
          title="A release archive that feels curated, elevated, and ready for the next era."
        />

        <RevealBlock className="rail-scroll mt-8" delay={0.08} lenisPrevent>
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
                highlightWords={["releases", "visuals", "campaigns"]}
                text="The platform is ready for real releases, launch visuals, and campaign storytelling."
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
                className="solid-note-card text-sm leading-7 text-white/68"
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
          description="Tour destinations now carry more atmosphere and hierarchy so ticketing, routing, and VIP presentation feel worthy of the live experience."
          eyebrow="Tour & Tickets"
          highlightWords={["tour", "destinations"]}
          title="Tour destinations designed to feel prestigious, active, and worth entering."
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
          description="The commerce layer now feels closer to a premium artist boutique with room for apparel, collector products, and exclusive digital releases."
          eyebrow="Shop"
          highlightWords={["premium", "collectible"]}
          title="A premium commerce floor for apparel, exclusives, and collector releases."
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
              description="Campaigns, sponsorships, and ambassador work now sit inside a cleaner and more partner-ready visual frame."
              eyebrow="Collaborations"
              highlightWords={["premium", "fan-facing"]}
              title="Partner-facing storytelling deserves the same premium standard as fan-facing pages."
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
              description="Awards, advocacy, interviews, and film work are presented with more editorial dignity and stronger visual order."
              eyebrow="Media & Press"
              highlightWords={["press", "shelf"]}
              title="A press and recognition shelf built for trust, visibility, and long-term archive value."
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
                highlightWords={["luxury", "content", "control"]}
                text="The platform now holds a stronger luxury standard and a clearer operational backbone."
              />
              <AnimatedParagraph
                className="mt-4 text-base leading-8 text-white/72"
                delay={0.14}
                text="From here, real photography, live collections, and content operations can be managed through the new admin layer while the public site stays elegant and high-contrast."
              />
            </div>
            <RevealBlock className="flex flex-wrap gap-3" delay={0.2}>
              <Link className="primary-button" href="/about">
                Review Story Structure
              </Link>
              <Link className="secondary-button" href="/admin">
                Enter Admin Suite
              </Link>
            </RevealBlock>
          </div>
        </RevealBlock>
      </section>
    </main>
  );
}
