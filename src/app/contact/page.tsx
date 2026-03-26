import type { Metadata } from "next";
import { RevealBlock } from "@/components/animated-text";
import { PageHero } from "@/components/page-hero";
import { editorialImages } from "@/lib/editorial-home";
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
    <main className="editorial-home pb-16 sm:pb-20">
      <PageHero
        description="This page is becoming the clear intake point for bookings, brand work, and media coordination, with a calmer editorial tone and stronger hierarchy for high-value inquiries."
        eyebrow="Contact"
        highlightWords={["booking", "media", "premium"]}
        image={editorialImages.cliff}
        imageMotionPreset="settle-right"
        imageLabel="Open portrait photography used to test contact-page mood"
        noteText="Clarity matters here more than decoration. The experience should feel direct, elevated, and easy for management, promoters, and journalists to trust."
        noteTitle="Inquiry pathway"
        primaryCta={{ href: "/events", label: "See events direction" }}
        secondaryCta={{ href: "/collaborations", label: "Review collaborations" }}
        title="Booking, management, and media pathways should feel premium and clear."
      />

      <section className="section-shell py-10">
        <RevealBlock className="editorial-paper-panel" variant="left">
          <p className="section-label">Contact channels</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {contactChannels.map((item) => (
              <article className="editorial-route-card" key={item.title}>
                <p className="section-label">{item.title}</p>
                <p className="mt-4 text-sm leading-7 text-[#4b4138] sm:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell py-10">
        <RevealBlock className="editorial-dark-panel" variant="right">
          <p className="section-label">Implementation notes</p>
          <h2 className="display-title mt-5 max-w-4xl text-4xl text-white sm:text-5xl">
            The next build layer can connect these pathways to stored inquiries, team routing, and faster follow-up.
          </h2>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {workflow.map((item, index) => (
              <article className="editorial-dark-note" key={item}>
                <p className="editorial-timeline-index">
                  {(index + 1).toString().padStart(2, "0")}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
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
