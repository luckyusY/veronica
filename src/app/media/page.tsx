import type { Metadata } from "next";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { PageHero } from "@/components/page-hero";
import { editorialImages } from "@/lib/editorial-home";
import { pressHighlights } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Media & Press",
};

const gallerySections = [
  "Editorial portraits and stage photography.",
  "Press coverage, interview links, and verified milestones.",
  "Approved biography blocks and downloadable campaign assets.",
];

export default function MediaPage() {
  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <PageHero
        description="The press environment is being shaped for trust: fast to scan, visually composed, and capable of carrying awards, advocacy, interviews, film work, and approved biography materials."
        eyebrow="Media & Press"
        highlightWords={["milestone", "trusted", "home"]}
        image={editorialImages.microphone}
        imageMotionPreset="from-left"
        imageLabel="Official editorial close-up portrait"
        noteText="A strong press page helps journalists verify the story quickly while still feeling clearly connected to the artist's broader visual identity."
        noteTitle="Press standard"
        primaryCta={{ href: "/contact", label: "Request media access" }}
        secondaryCta={{ href: "/about", label: "Read biography" }}
        title="A polished press environment gives every milestone a trusted home."
      />

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[1.04fr_0.96fr]">
          <RevealBlock className="editorial-paper-panel" variant="left">
            <p className="section-label">Press highlights</p>
            <div className="mt-6 grid gap-4">
              {pressHighlights.map((item) => (
                <article className="editorial-note" key={item.title}>
                  <p className="section-label">{item.title}</p>
                  <p className="mt-4 text-sm leading-7 text-[#4b4138] sm:text-base">
                    {item.description}
                  </p>
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
              sizes="(max-width: 1024px) 100vw, 40vw"
              strength={62}
            />
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <RevealBlock className="editorial-dark-panel" variant="scale">
          <p className="section-label">Press kit structure</p>
          <h2 className="display-title mt-5 max-w-4xl text-4xl text-white sm:text-5xl">
            This archive should make media access simple without flattening the story into generic publicity language.
          </h2>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {gallerySections.map((item) => (
              <article className="editorial-dark-note" key={item}>
                <p className="text-sm leading-7 text-white/70 sm:text-base">
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
