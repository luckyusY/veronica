import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
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
    <main className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="Music & Videos"
        highlightWords={["immersive", "release", "space"]}
        title="The music section should feel like an immersive release space, not a simple list of embeds."
        description="This structure supports album storytelling, featured tracks, video highlights, and future members-only drops. It gives room for both global polish and Ethiopian identity."
        primaryCta={{ href: "/events", label: "Pair Releases With Tour" }}
        secondaryCta={{ href: "/shop", label: "Open Product Layer" }}
      />

      <section className="section-shell py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {releaseHighlights.map((item) => (
            <article className="panel rounded-[1.75rem] p-6" key={item.title}>
              <p className="section-label">{item.accent}</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/68">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="panel rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="section-label">Experience Layers</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {musicExperiences.map((item) => (
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
