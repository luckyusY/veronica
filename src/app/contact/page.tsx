import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { contactChannels } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact",
};

const workflow = [
  "Route inquiries by category so live booking, brand partnerships, and press requests stay separated.",
  "Store inquiries in MongoDB for internal tracking and dashboard visibility.",
  "Connect transactional email later for acknowledgements, booking follow-up, and VIP invitations.",
];

export default function ContactPage() {
  return (
    <main className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="Contact"
        highlightWords={["booking", "media", "premium"]}
        title="Booking, management, and media pathways should feel premium and clear."
        description="This page is prepared to become the intake point for live shows, partnership outreach, and press coordination. The next phase can connect it to MongoDB-backed inquiries and notification workflows."
        primaryCta={{ href: "/events", label: "See Events Direction" }}
        secondaryCta={{ href: "/collaborations", label: "Review Collaborations" }}
      />

      <section className="section-shell py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {contactChannels.map((item) => (
            <article className="panel rounded-[1.75rem] p-6" key={item.title}>
              <p className="section-label">Inquiry Type</p>
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
          <p className="section-label">Implementation Notes</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {workflow.map((item) => (
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
