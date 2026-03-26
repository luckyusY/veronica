import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { collaborationTracks } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Collaborations",
};

const partnershipFormats = [
  "Ambassador campaigns with visual storytelling and social rollout support.",
  "Brand-backed concerts, city takeovers, launch experiences, and backstage integrations.",
  "Media kit distribution, executive one-sheets, biography downloads, and sponsor inquiries.",
];

export default function CollaborationsPage() {
  return (
    <main className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="Collaborations"
        highlightWords={["premium", "brands", "media"]}
        title="A partnership page built for premium brands, event promoters, and media decision-makers."
        description="This section should help brands understand Veronica's audience, positioning, credibility, and campaign value in just a few scrolls. It is where storytelling meets commercial readiness."
        primaryCta={{ href: "/contact", label: "Start Partnership Inquiry" }}
        secondaryCta={{ href: "/media", label: "Open Media & Press" }}
      />

      <section className="section-shell py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {collaborationTracks.map((item) => (
            <article className="panel rounded-[1.75rem] p-6" key={item.title}>
              <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/68">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="panel rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="section-label">Activation Formats</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {partnershipFormats.map((item) => (
              <article
                className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5"
                key={item}
              >
                <p className="text-sm leading-7 text-white/68">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
