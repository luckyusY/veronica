import type { Metadata } from "next";
import { ExternalLink, Music } from "lucide-react";
import { listAdminCollection } from "@/lib/admin-store";
import type { AdminRecord } from "@/lib/admin-schema";

export const metadata: Metadata = {
  title: "Music & Videos — Veronica Adane",
  description: "Official music releases, singles, and video premieres by Veronica Adane.",
};

export const revalidate = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;
    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname === "www.youtube.com" || parsed.hostname === "youtube.com") {
      videoId = parsed.pathname.startsWith("/shorts/")
        ? parsed.pathname.split("/shorts/")[1]?.split("/")[0] ?? null
        : parsed.searchParams.get("v");
    }
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}

function hasVideo(release: AdminRecord): boolean {
  return Boolean(release.videoUrl) || Boolean(getYouTubeEmbedUrl(release.link ?? ""));
}

function statusMeta(status: string): { cls: string } {
  const s = status.toLowerCase();
  if (s === "live" || s === "released" || s === "published") return { cls: "ev-badge--confirmed" };
  if (s === "review" || s === "coming soon")                  return { cls: "ev-badge--planning"  };
  if (s === "draft")                                          return { cls: "ev-badge--default"   };
  return                                                             { cls: "ev-badge--default"   };
}

// ─── Video Card ───────────────────────────────────────────────────────────────

function VideoCard({ release }: { release: AdminRecord }) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(release.link ?? "");
  const hasCloudinary   = Boolean(release.videoUrl);
  const hasYouTube      = Boolean(youtubeEmbedUrl);
  const { cls }         = statusMeta(release.status);

  return (
    <article className="mv-card">
      {/* ── Video media ── */}
      <div className="mv-card-media">
        {hasCloudinary ? (
          <video
            className="mv-card-video"
            controls
            playsInline
            poster={release.bannerImage ?? undefined}
            preload="metadata"
            src={release.videoUrl}
          />
        ) : hasYouTube ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="mv-card-iframe"
            loading="lazy"
            src={youtubeEmbedUrl!}
            title={release.title}
          />
        ) : null}

        {/* Status badge overlaid on video */}
        <span className={`ev-badge ${cls}`}>
          <span className="ev-badge-dot" />
          {release.status}
        </span>
      </div>

      {/* ── Info ── */}
      <div className="mv-card-body">
        <div className="mv-card-meta">
          {release.subtitle ? (
            <span className="mv-card-format">{release.subtitle}</span>
          ) : null}
          {release.highlight ? (
            <span className="mv-card-views">{release.highlight}</span>
          ) : null}
        </div>

        <h2 className="mv-card-title">{release.title}</h2>

        {release.notes ? (
          <p className="mv-card-notes">{release.notes}</p>
        ) : null}

        {release.link ? (
          <a
            className="mv-card-link"
            href={release.link}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink size={12} />
            <span>{hasYouTube ? "Open on YouTube" : "Watch / Listen"}</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MusicPage() {
  const releases     = await listAdminCollection("releases");
  const videoReleases = releases.filter(hasVideo);

  return (
    <main className="mv-page">
      {/* Header */}
      <div className="mv-header section-shell">
        <p className="section-label">Official releases</p>
        <h1 className="display-title mv-page-title">Music &amp; Videos</h1>
        <p className="mv-page-subtitle">
          Singles, music videos, and live performances.
        </p>
      </div>

      {/* Grid */}
      {videoReleases.length > 0 ? (
        <section className="mv-grid-section section-shell">
          <div className="mv-grid">
            {videoReleases.map((release) => (
              <VideoCard key={release.id} release={release} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mv-empty section-shell">
          <Music size={32} />
          <p>No videos available yet. Check back soon.</p>
        </div>
      )}
    </main>
  );
}
