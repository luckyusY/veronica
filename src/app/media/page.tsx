import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
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
    <main className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="Media & Press"
        title="A polished press environment gives every milestone a trusted home."
        description="This page is structured for interviews, photography, award highlights, advocacy moments, and fast media access. It should feel efficient for journalists while still carrying Veronica's signature visual identity."
        primaryCta={{ href: "/contact", label: "Request Media Access" }}
        secondaryCta={{ href: "/about", label: "Read Biography" }}
      />

      <section className="section-shell py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {pressHighlights.map((item) => (
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
          <p className="section-label">Press Kit Structure</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {gallerySections.map((item) => (
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
