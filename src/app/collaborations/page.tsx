import type { Metadata } from "next";
import { Music2, Briefcase, CalendarDays, Newspaper, Star, Zap, Globe2 } from "lucide-react";
import { CollabForm } from "@/components/collab-form";
import { CollabImageStrip } from "@/components/collab-image-strip";
import { getCmsSiteSettings } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "Collaborations — Veronica Adane",
  description:
    "Reach out to Veronica Adane for music projects, brand partnerships, events, and press opportunities.",
};

export const revalidate = 60;

const STATS = [
  { value: "41M+",  label: "Album views",          icon: Zap   },
  { value: "1.8M+", label: "TikTok followers",     icon: Star  },
  { value: "4",     label: "Global tour regions",  icon: Globe2 },
  { value: "2",     label: "Industry awards",      icon: Star  },
];

const TRACKS = [
  {
    Icon: Music2,
    title: "Music collaborations",
    desc: "Features, songwriting, production partnerships, and joint releases.",
  },
  {
    Icon: Briefcase,
    title: "Brand partnerships",
    desc: "Ambassador campaigns, sponsored content, and launch activations.",
  },
  {
    Icon: CalendarDays,
    title: "Event partnerships",
    desc: "Festival co-headlining, private events, and diaspora tours.",
  },
  {
    Icon: Newspaper,
    title: "Media & press",
    desc: "Interviews, editorial features, and official press kit delivery.",
  },
];

export default async function CollaborationsPage() {
  const settings = await getCmsSiteSettings();
  const collabImages = settings.collabImages ?? [];

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

      {/* ── Image strip (only shown when images are configured) ────── */}
      {collabImages.length > 0 && (
        <CollabImageStrip images={collabImages} />
      )}

      {/* ── Split: info + form ─────────────────────────────────────── */}
      <section className="collab-split section-shell">

        {/* Left — context panel */}
        <div className="collab-info">

          {/* Stats */}
          <div className="collab-stats">
            {STATS.map((s) => (
              <div className="collab-stat" key={s.label}>
                <span className="collab-stat-value">{s.value}</span>
                <span className="collab-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="collab-info-divider" />

          {/* Track list with lucide icons */}
          <div className="collab-tracks">
            {TRACKS.map(({ Icon, title, desc }) => (
              <div className="collab-track" key={title}>
                <span className="collab-track-icon-wrap">
                  <Icon size={15} strokeWidth={2} />
                </span>
                <div>
                  <p className="collab-track-title">{title}</p>
                  <p className="collab-track-desc">{desc}</p>
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
              Fill in the details and we&apos;ll respond within 48 hours.
            </p>
          </div>
          <CollabForm />
        </div>

      </section>
    </main>
  );
}
