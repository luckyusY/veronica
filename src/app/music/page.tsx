import type { Metadata } from "next";
import { ExternalLink, Music } from "lucide-react";
import { listAdminCollection } from "@/lib/admin-store";
import type { AdminRecord } from "@/lib/admin-schema";
import { YouTubeFacade } from "@/components/youtube-facade";

export const metadata: Metadata = {
  title: "Music & Videos — Veronica Adane",
  description: "Official music releases, singles, and video premieres by Veronica Adane.",
};

export const revalidate = 60;

const CHANNEL_ID = "UCfpttsgc_FkvxZrI8_wuuCA";
// Uploads playlist = replace UC → UU
const CHANNEL_PLAYLIST = "UU" + CHANNEL_ID.slice(2);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.hostname === "www.youtube.com" || parsed.hostname === "youtube.com") {
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1]?.split("/")[0] ?? null;
      }
      return parsed.searchParams.get("v");
    }
    return null;
  } catch {
    return null;
  }
}

function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
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
  const youtubeVideoId  = getYouTubeVideoId(release.link ?? "");
  const hasCloudinary   = Boolean(release.videoUrl);
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
            preload="none"
            src={release.videoUrl}
          />
        ) : youtubeVideoId ? (
          <YouTubeFacade
            className="mv-card-iframe"
            title={release.title}
            videoId={youtubeVideoId}
          />
        ) : null}

        {/* Status badge */}
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
            <span>{youtubeVideoId ? "Open on YouTube" : "Watch / Listen"}</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MusicPage() {
  const releases      = await listAdminCollection("releases");
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

      {/* Individual release cards */}
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

      {/* Full YouTube channel embed */}
      <section className="mv-channel-section section-shell">
        <div className="mv-channel-header">
          <p className="section-label">Full channel</p>
          <h2 className="mv-channel-title">All Videos</h2>
          <p className="mv-channel-desc">Browse every upload directly from the YouTube channel.</p>
        </div>
        <div className="mv-channel-embed-wrap">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="mv-channel-iframe"
            loading="lazy"
            src={`https://www.youtube.com/embed/videoseries?list=${CHANNEL_PLAYLIST}&rel=0&modestbranding=1`}
            title="Veronica Adane — YouTube channel"
          />
        </div>
        <a
          className="mv-channel-link"
          href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink size={13} />
          Open full channel on YouTube
        </a>
      </section>
    </main>
  );
}
