import type { Metadata } from "next";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { PageHero } from "@/components/page-hero";
import { editorialImages } from "@/lib/editorial-home";
import { journeyMoments } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About",
};

const timeline = [
  "Raised in Addis Ababa and shaped by the musical legacy of Adane Teka.",
  "Graduated from Mekelle University in journalism and communication with strong academic performance.",
  "Started sharing cover performances online using only a mobile phone while supporting family and studies.",
  "Moved from event leadership into full-time music, funding releases through live performance income.",
  "Expanded from national recognition to international tours, awards, acting, and advocacy.",
];

const biographyNotes = [
  "Faith and discipline sit at the center of the story.",
  "Azmari heritage is presented with pride, not apology.",
  "Academic and artistic identity are treated as part of one narrative.",
];

export default function AboutPage() {
  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <PageHero
        description="This biography page is designed to feel like a long-form artist profile: heritage, discipline, and public milestones arranged with more visual weight and less template noise."
        eyebrow="About Veronica"
        highlightWords={["purpose", "family", "identity"]}
        image={editorialImages.cliff}
        imageMotionPreset="from-right"
        imageLabel="Open placeholder portrait used for editorial concepting"
        noteText="The biography should read with dignity and emotional weight, holding real milestones without turning the page into a resume."
        noteTitle="Biography standard"
        primaryCta={{ href: "/media", label: "View press positioning" }}
        secondaryCta={{ href: "/music", label: "Explore releases" }}
        title="A biography rooted in purpose, discipline, family, and identity."
      />

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <RevealBlock className="editorial-paper-panel" variant="left">
            <p className="section-label">Narrative frame</p>
            <h2 className="display-title mt-5 max-w-4xl text-4xl text-[#1f1914] sm:text-5xl">
              Veronica Adane&apos;s story should feel carried by heritage, courage, and deliberate self-definition.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#3a332d]">
              The strongest version of this page balances biography with
              atmosphere. It acknowledges family legacy, academic rigor, and the
              long period of independent work that turned local momentum into
              national and international reach.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {biographyNotes.map((item) => (
                <article className="editorial-note" key={item}>
                  <p className="text-sm leading-7 text-[#4b4138]">{item}</p>
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
              image={editorialImages.hero}
              motionPreset="from-right"
              sizes="(max-width: 1024px) 100vw, 42vw"
              strength={66}
            />
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <RevealBlock className="editorial-dark-panel" variant="left">
            <p className="section-label">Story layers</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
              The public story is strongest when it carries both tenderness and stature.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/74">
              Reclaiming the Azmari identity, supporting family, excelling in
              journalism, and building a music career independently are not
              separate facts. Together they create the emotional architecture of
              the brand.
            </p>
          </RevealBlock>

          <RevealBlock className="editorial-timeline-panel" delay={0.08} variant="right">
            <p className="section-label">Narrative timeline</p>
            <div className="mt-6 grid gap-4">
              {timeline.map((item, index) => (
                <article className="editorial-timeline-item" key={item}>
                  <p className="editorial-timeline-index">
                    {(index + 1).toString().padStart(2, "0")}
                  </p>
                  <p className="text-sm leading-7 text-[#3e362e] sm:text-base">
                    {item}
                  </p>
                </article>
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <RevealBlock className="editorial-quote-banner" variant="scale">
          <EditorialImage
            className="editorial-quote-media"
            image={editorialImages.stage}
            motionPreset="settle-left"
            sizes="100vw"
            strength={78}
          />
          <div className="editorial-quote-copy">
            <p className="section-label text-white/80">Biography atmosphere</p>
            <h2 className="display-title mt-4 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl">
              The biography should feel like a sequence of public moments, not a column of facts.
            </h2>
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-3">
          {journeyMoments.map((item, index) => (
            <RevealBlock
              className={index === 1 ? "editorial-dark-panel" : "editorial-paper-panel"}
              delay={0.06 + index * 0.05}
              variant={index === 0 ? "left" : index === 1 ? "scale" : "right"}
              key={item.title}
            >
              <p className="section-label">Biography chapter</p>
              <h2
                className={`display-title mt-5 text-4xl sm:text-5xl ${
                  index === 1 ? "text-white" : "text-[#1f1914]"
                }`}
              >
                {item.title}
              </h2>
              <p
                className={`mt-6 text-base leading-8 ${
                  index === 1 ? "text-white/72" : "text-[#3a332d]"
                }`}
              >
                {item.description}
              </p>
            </RevealBlock>
          ))}
        </div>
      </section>
    </main>
  );
}
