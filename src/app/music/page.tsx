import type { Metadata } from "next";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { PageHero } from "@/components/page-hero";
import { editorialImages } from "@/lib/editorial-home";
import { releaseHighlights } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Music & Videos",
};

const musicExperiences = [
  "Featured album storytelling with credits, visuals, and release notes.",
  "Track cards with metadata, streaming links, and premium editions.",
  "Video premieres and visual playlists arranged for editorial browsing.",
];

export default function MusicPage() {
  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <PageHero
        description="This section should behave like a release archive with atmosphere: image-led, emotionally paced, and capable of holding albums, singles, videos, and future exclusive drops."
        eyebrow="Music & Videos"
        highlightWords={["immersive", "release", "space"]}
        image={editorialImages.stage}
        imageLabel="Open stage photography used to test the release atmosphere"
        noteText="Music pages should feel cinematic and editorial before a single embed appears. The frame sets the value of the release."
        noteTitle="Release experience"
        primaryCta={{ href: "/events", label: "Pair releases with tour" }}
        secondaryCta={{ href: "/shop", label: "Open product layer" }}
        title="The music section should feel like an immersive release space, not a simple list of embeds."
      />

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <RevealBlock className="editorial-dark-panel">
            <p className="section-label">Release shelves</p>
            <div className="mt-6 grid gap-3">
              {releaseHighlights.map((item) => (
                <article className="editorial-release-row" key={item.title}>
                  <div>
                    <p className="section-label">{item.accent}</p>
                    <h2 className="display-title mt-3 text-3xl text-white sm:text-4xl">
                      {item.title}
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock className="editorial-photo-block editorial-photo-block--tall" delay={0.08}>
            <EditorialImage
              className="editorial-photo-shell"
              image={editorialImages.microphone}
              sizes="(max-width: 1024px) 100vw, 40vw"
              strength={68}
            />
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <RevealBlock className="editorial-quote-banner">
          <EditorialImage
            className="editorial-quote-media"
            image={editorialImages.aerialCrowd}
            sizes="100vw"
            strength={80}
          />
          <div className="editorial-quote-copy">
            <p className="section-label text-white/80">Music direction</p>
            <h2 className="display-title mt-4 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl">
              Release eras should land like chapters with memory, scale, and replay value.
            </h2>
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell py-10">
        <RevealBlock className="editorial-paper-panel">
          <p className="section-label">Experience layers</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {musicExperiences.map((item) => (
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
