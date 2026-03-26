import Link from "next/link";
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

export default function Home() {
  return (
    <main className="pb-16 sm:pb-20">
      <section className="section-shell relative overflow-hidden py-10 sm:py-14 lg:py-20">
        <div className="pointer-events-none absolute inset-x-10 top-4 -z-10 h-[26rem] rounded-[2.5rem] bg-[radial-gradient(circle_at_top,_rgba(212,175,106,0.22),_rgba(217,79,43,0.12),_transparent_66%)] blur-2xl" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:items-end">
          <div className="space-y-6">
            <p className="section-label">Luxury artist platform</p>
            <h1 className="display-title max-w-5xl text-5xl text-balance sm:text-6xl xl:text-7xl">
              Veronica Adane moves between heritage, faith, performance, and
              global ambition.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
              This build is designed as an all-in-one destination for music,
              videos, tour dates, merchandise, media storytelling, and brand
              partnerships. The visual language leans cinematic, dark, and
              premium, inspired by event-led entertainment layouts while staying
              tailored to Veronica&apos;s identity.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="primary-button" href="/music">
                Explore Music
              </Link>
              <Link className="secondary-button" href="/events">
                View Tour Structure
              </Link>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {[
                "Singer, songwriter, actress, journalist",
                "Proud Azmari daughter with strong cultural positioning",
                "Built for Vercel, GitHub, MongoDB, and future e-commerce growth",
              ].map((item) => (
                <div
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm leading-7 text-white/70"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="panel rounded-[2rem] p-6 sm:p-7">
            <p className="section-label">Artist Snapshot</p>
            <div className="mt-5 space-y-5">
              <div className="rounded-[1.5rem] border border-[rgba(217,79,43,0.34)] bg-[linear-gradient(135deg,rgba(217,79,43,0.14),rgba(212,175,106,0.08))] p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">
                  Current direction
                </p>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  A multilingual EP, a stronger international footprint, and a
                  platform that unifies artistry, commerce, advocacy, and fan
                  connection.
                </p>
              </div>
              <div className="space-y-4 text-sm text-white/68">
                <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                  <span>Origin</span>
                  <span className="text-white">Addis Ababa, Ethiopia</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                  <span>Legacy</span>
                  <span className="text-right text-white">
                    Daughter of Adane Teka
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                  <span>Recognition</span>
                  <span className="text-right text-white">
                    African Union + AFRIMA
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Platform goal</span>
                  <span className="text-right text-white">
                    Music, tickets, merch, media
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredStats.map((item) => (
            <article className="panel rounded-[1.75rem] px-5 py-6" key={item.label}>
              <p className="display-title text-4xl text-[var(--gold)]">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/68">{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="Biography"
          title="A story that began with one phone and became a national movement."
          description="The About section should feel editorial and emotional rather than corporate. It can carry Veronica's academic discipline, family heritage, early struggle, national rise, and international recognition with layered storytelling blocks."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {journeyMoments.map((item) => (
            <article className="panel rounded-[1.75rem] p-6" key={item.title}>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">
                Core Chapter
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/68">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
          <div>
            <SectionHeading
              eyebrow="Music & Video"
              title="Releases should feel alive, not archived."
              description="This area is ready for featured tracks, album storytelling, embedded video premieres, and premium listening moments backed by MongoDB content models and a streaming-friendly media layer."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {releaseHighlights.map((item) => (
                <article className="panel rounded-[1.75rem] p-6" key={item.title}>
                  <p className="section-label">{item.accent}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <aside className="panel rounded-[2rem] p-6 sm:p-7">
            <p className="section-label">Future Streaming Layer</p>
            <h3 className="mt-4 text-3xl font-semibold text-white">
              Player-ready structure
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/68">
              MongoDB can hold metadata for tracks, videos, releases, and press
              assets while Vercel serves the app shell and a dedicated media
              service handles heavier streaming workloads.
            </p>
            <div className="mt-6 space-y-4">
              {[
                "Editorial release notes and credits",
                "Tracklists, cover art, and visual metadata",
                "Featured video carousels and premiere banners",
              ].map((item) => (
                <div
                  className="rounded-[1.25rem] border border-white/8 bg-black/20 px-4 py-4 text-sm text-white/68"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell py-12">
        <SectionHeading
          eyebrow="Tour & Tickets"
          title="Event pages should sell the feeling before they sell the seat."
          description="The events architecture is set up for city pages, QR ticket delivery, premium tiers, and clean booking CTAs. This is where the black-and-gold live-show energy becomes most visible."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {upcomingEvents.map((item) => (
            <article className="panel rounded-[1.75rem] p-6" key={item.region}>
              <p className="section-label">{item.region}</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {item.cities}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/68">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            <SectionHeading
              eyebrow="Shop"
              title="Merchandise and digital products should feel like extensions of the brand."
              description="The commerce layer is planned for apparel, premium downloads, and limited releases. MongoDB can drive product data, orders, ticket ownership, and customer dashboards."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {shopHighlights.map((item) => (
                <article className="panel rounded-[1.75rem] p-6" key={item.title}>
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <aside className="panel rounded-[2rem] p-6 sm:p-7">
            <p className="section-label">Commerce Notes</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/68">
              <p>
                Products, orders, events, and customer profiles can all live in
                one database model.
              </p>
              <p>
                Future VIP memberships and mentorship products can expand from
                the same account layer.
              </p>
              <p>
                Vercel preview deployments will make merch drops easy to stage
                and approve before launch.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Collaborations"
              title="The site should work for sponsors and press, not only fans."
              description="This area is built to support brand deals, downloadable assets, campaign positioning, and fast inquiry routing for management teams and agency partners."
            />
            <div className="mt-8 space-y-4">
              {collaborationTracks.map((item) => (
                <article className="panel rounded-[1.75rem] p-6" key={item.title}>
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Media & Press"
              title="Every milestone needs a clean place to live."
              description="Awards, speeches, interviews, advocacy work, and film appearances all deserve a polished press environment with verified facts and visual assets."
            />
            <div className="mt-8 space-y-4">
              {pressHighlights.map((item) => (
                <article className="panel rounded-[1.75rem] p-6" key={item.title}>
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="panel rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
          <p className="section-label">Next Step</p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="display-title text-4xl text-balance sm:text-5xl">
                The foundation is ready for data models, admin workflows, and
                real content ingestion.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/72">
                From here we can wire real MongoDB collections for releases,
                products, events, and inquiries, then connect checkout, media
                delivery, and a custom dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="primary-button" href="/about">
                Review Site Structure
              </Link>
              <Link className="secondary-button" href="/contact">
                Open Contact Flow
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
