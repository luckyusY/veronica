import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
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

export default function AboutPage() {
  return (
    <main className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="About Veronica"
        highlightWords={["purpose", "family", "identity"]}
        title="A biography rooted in purpose, discipline, family, and identity."
        description="This page is meant to carry Veronica's full story with dignity and emotional weight. It should read like an artist profile, not a resume, while still preserving concrete milestones and cultural context."
        primaryCta={{ href: "/media", label: "View Press Positioning" }}
        secondaryCta={{ href: "/music", label: "Explore Releases" }}
      />

      <section className="section-shell py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {journeyMoments.map((item) => (
            <article className="panel rounded-[1.75rem] p-6" key={item.title}>
              <p className="section-label">Story Layer</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/68">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="panel rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="section-label">Narrative Timeline</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {timeline.map((item, index) => (
              <article className="solid-note-card" key={item}>
                <p className="text-sm font-semibold text-[var(--accent)]">
                  0{index + 1}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/68">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
