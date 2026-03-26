import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
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
    <main className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="Events"
        highlightWords={["electricity", "live", "checkout"]}
        title="Tour pages should carry the electricity of the live show before checkout even begins."
        description="The events area is designed for flexible city listings, premium ticket tiers, QR validation, and sponsor-ready concert pages. It follows the strongest parts of entertainment templates without feeling generic."
        primaryCta={{ href: "/contact", label: "Book Live Performance" }}
        secondaryCta={{ href: "/shop", label: "Bundle Merch Strategy" }}
      />

      <section className="section-shell py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {upcomingEvents.map((item) => (
            <article className="panel rounded-[1.75rem] p-6" key={item.region}>
              <p className="section-label">{item.region}</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                {item.cities}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/68">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="panel rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="section-label">Ticketing System</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {ticketFlow.map((item) => (
              <article className="solid-note-card" key={item}>
                <p className="text-sm leading-7 text-white/68">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
