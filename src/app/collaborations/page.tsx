import type { Metadata } from "next";
import { CollabForm } from "@/components/collab-form";

export const metadata: Metadata = {
  title: "Collaborations — Veronica Adane",
  description:
    "Reach out to Veronica Adane for music projects, brand partnerships, events, and press opportunities.",
};

const COLLAB_TRACKS = [
  {
    title: "Music collaborations",
    description:
      "Features, songwriting, production partnerships, and joint releases with established and emerging artists.",
  },
  {
    title: "Brand partnerships",
    description:
      "Ambassador campaigns, sponsored content, product launches, and long-form brand activations.",
  },
  {
    title: "Event partnerships",
    description:
      "Festival co-headlining, private events, diaspora tours, VIP packages, and live activations.",
  },
  {
    title: "Media & press",
    description:
      "Interviews, editorial features, red carpet appearances, and official press kit delivery.",
  },
];

export default function CollaborationsPage() {
  return (
    <main className="collab-page">
      {/* Header */}
      <div className="collab-header section-shell">
        <p className="section-label">Work with Veronica</p>
        <h1 className="display-title collab-page-title">Collaborations</h1>
        <p className="collab-page-subtitle">
          Reach out for music projects, brand partnerships, events, and press opportunities.
          All inquiries go directly to the team.
        </p>
      </div>

      {/* Inquiry form */}
      <section className="collab-form-section section-shell">
        <CollabForm />
      </section>

      {/* What we work on */}
      <section className="collab-tracks-section section-shell">
        <p className="section-label">What we work on</p>
        <div className="collab-tracks-grid">
          {COLLAB_TRACKS.map((track) => (
            <div className="collab-track-card" key={track.title}>
              <h3 className="collab-track-title">{track.title}</h3>
              <p className="collab-track-desc">{track.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
