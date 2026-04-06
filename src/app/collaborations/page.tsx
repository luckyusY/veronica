import type { Metadata } from "next";
import { CollabForm } from "@/components/collab-form";

export const metadata: Metadata = {
  title: "Collaborations — Veronica Adane",
  description:
    "Reach out to Veronica Adane for music projects, brand partnerships, events, and press opportunities.",
};

const STATS = [
  { value: "41M+",  label: "Album views"         },
  { value: "1.8M+", label: "TikTok followers"    },
  { value: "4",     label: "Global tour regions" },
  { value: "2",     label: "Industry awards"     },
];

const TRACKS = [
  {
    icon: "🎵",
    title: "Music collaborations",
    desc: "Features, songwriting, production partnerships, and joint releases.",
  },
  {
    icon: "🤝",
    title: "Brand partnerships",
    desc: "Ambassador campaigns, sponsored content, and launch activations.",
  },
  {
    icon: "🎤",
    title: "Event partnerships",
    desc: "Festival co-headlining, private events, and diaspora tours.",
  },
  {
    icon: "📰",
    title: "Media & press",
    desc: "Interviews, editorial features, and official press kit delivery.",
  },
];

export default function CollaborationsPage() {
  return (
    <main className="collab-page">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div className="collab-hero section-shell">
        <p className="section-label">Work with Veronica</p>
        <h1 className="display-title collab-hero-title">Collaborations</h1>
        <p className="collab-hero-sub">
          Reach out for music projects, brand partnerships, events, and press.
          Every inquiry goes directly to the team.
        </p>
      </div>

      {/* ── Split: info + form ─────────────────────────────────────── */}
      <section className="collab-split section-shell">

        {/* Left — context panel */}
        <div className="collab-info">

          {/* Stats row */}
          <div className="collab-stats">
            {STATS.map((s) => (
              <div className="collab-stat" key={s.label}>
                <span className="collab-stat-value">{s.value}</span>
                <span className="collab-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="collab-info-divider" />

          {/* Tracks */}
          <div className="collab-tracks">
            {TRACKS.map((t) => (
              <div className="collab-track" key={t.title}>
                <span className="collab-track-icon">{t.icon}</span>
                <div>
                  <p className="collab-track-title">{t.title}</p>
                  <p className="collab-track-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="collab-quote">
            "The project feels premium end to end — from imagery to every touchpoint."
            <cite>— Tour Coordinator</cite>
          </blockquote>
        </div>

        {/* Right — form card */}
        <div className="collab-form-card">
          <div className="collab-form-card-header">
            <h2 className="collab-form-card-title">Send an inquiry</h2>
            <p className="collab-form-card-sub">
              Fill in the details and we'll respond within 48 hours.
            </p>
          </div>
          <CollabForm />
        </div>

      </section>
    </main>
  );
}
