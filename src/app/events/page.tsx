import type { Metadata } from "next";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { PageHero } from "@/components/page-hero";
import { editorialImages } from "@/lib/editorial-home";
import { upcomingEvents } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Events",
};

const ticketFlow = [
  "Upcoming city page with event description, venue details, and ticket tiers.",
  "Checkout integration with QR ticket delivery and account-based order history.",
  "Post-event analytics for attendance, high-performing cities, and merchandise attach rate.",
];

export default function EventsPage() {
  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <PageHero
        description="Tour pages should feel live before checkout even starts. This section is being shaped to hold city narratives, premium tiers, QR entry, and sponsor-ready show pages."
        eyebrow="Events"
        highlightWords={["electricity", "live", "checkout"]}
        image={editorialImages.aerialCrowd}
        imageMotionPreset="settle-right"
        imageLabel="Official campaign image for live-show energy"
        noteText="The events layer should translate live demand into a polished ticketing experience without losing the emotional charge of performance."
        noteTitle="Live system"
        primaryCta={{ href: "/contact", label: "Book live performance" }}
        secondaryCta={{ href: "/shop", label: "Bundle merch strategy" }}
        title="Tour pages should carry the electricity of the live show before checkout even begins."
      />

      <section className="section-shell py-10">
        <RevealBlock className="editorial-paper-panel" variant="left">
          <p className="section-label">Tour map</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {upcomingEvents.map((item) => (
              <article className="editorial-route-card" key={item.region}>
                <p className="section-label">{item.region}</p>
                <h2 className="display-title mt-4 text-3xl text-[#1f1914] sm:text-4xl">
                  {item.cities}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#4b4138] sm:text-base">
                  {item.note}
                </p>
              </article>
            ))}
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <RevealBlock className="editorial-photo-block editorial-photo-block--tall" variant="left">
            <EditorialImage
              className="editorial-photo-shell"
              image={editorialImages.crowd}
              motionPreset="from-left"
              sizes="(max-width: 1024px) 100vw, 42vw"
              strength={72}
            />
          </RevealBlock>

          <RevealBlock className="editorial-dark-panel" delay={0.08} variant="right">
            <p className="section-label">Ticketing flow</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
              Ticketing should feel premium, legible, and ready for real routing complexity.
            </h2>
            <div className="mt-8 grid gap-3">
              {ticketFlow.map((item, index) => (
                <article className="editorial-release-row" key={item}>
                  <p className="editorial-timeline-index">
                    {(index + 1).toString().padStart(2, "0")}
                  </p>
                  <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                    {item}
                  </p>
                </article>
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>
    </main>
  );
}
