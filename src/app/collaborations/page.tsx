import type { Metadata } from "next";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { PageHero } from "@/components/page-hero";
import { editorialImages } from "@/lib/editorial-home";
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
    <main className="editorial-home pb-16 sm:pb-20">
      <PageHero
        description="This page is being rebuilt for brand decision-makers: concise, elegant, and immediate enough to communicate audience value, public trust, and campaign flexibility in only a few screens."
        eyebrow="Collaborations"
        highlightWords={["premium", "brands", "media"]}
        image={editorialImages.furSeated}
        imageMotionPreset="settle-right"
        imageLabel="Official fashion portrait for brand-facing pages"
        noteText="Brands should understand Veronica's stature quickly. The page should feel commercially ready without losing the editorial identity of the site."
        noteTitle="Partner language"
        primaryCta={{ href: "/contact", label: "Start partnership inquiry" }}
        secondaryCta={{ href: "/media", label: "Open media & press" }}
        title="A partnership page built for premium brands, event promoters, and media decision-makers."
      />

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <RevealBlock className="editorial-dark-panel" variant="left">
            <p className="section-label">Partnership tracks</p>
            <div className="mt-6 grid gap-3">
              {collaborationTracks.map((item) => (
                <article className="editorial-release-row" key={item.title}>
                  <div>
                    <h2 className="display-title text-3xl text-white sm:text-4xl">
                      {item.title}
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock
            className="editorial-photo-block editorial-photo-block--tall"
            delay={0.08}
            variant="right"
          >
            <EditorialImage
              className="editorial-photo-shell"
              image={editorialImages.stage}
              motionPreset="from-left"
              sizes="(max-width: 1024px) 100vw, 40vw"
              strength={66}
            />
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <RevealBlock className="editorial-paper-panel" variant="scale">
          <p className="section-label">Activation formats</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {partnershipFormats.map((item) => (
              <article className="editorial-note" key={item}>
                <p className="text-sm leading-7 text-[#4b4138] sm:text-base">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </RevealBlock>
      </section>
    </main>
  );
}
