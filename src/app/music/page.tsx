import type { Metadata } from "next";
import { ExternalLink, Music, Play } from "lucide-react";
import { listAdminCollection } from "@/lib/admin-store";
import type { AdminRecord } from "@/lib/admin-schema";
import { YouTubeFacade } from "@/components/youtube-facade";

export const metadata: Metadata = {
  title: "Music & Videos — Veronica Adane",
  description: "Official music releases, singles, and video premieres by Veronica Adane.",
};

export const revalidate = 3600; // revalidate channel videos every hour

const CHANNEL_ID = "UCfpttsgc_FkvxZrI8_wuuCA";

// ─── YouTube RSS fetch (no API key needed) ────────────────────────────────────

type ChannelVideo = {
  id: string;
  title: string;
  published: string;
  url: string;
  thumbnail: string;
};

async function fetchChannelVideos(): Promise<ChannelVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];
    return entries
      .map((entry) => {
        const id        = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
        const rawTitle  = entry.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
        const published = entry.match(/<published>(.*?)<\/published>/)?.[1] ?? "";
        const title = rawTitle
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"');
        return {
          id,
          title,
          published,
          url: `https://www.youtube.com/watch?v=${id}`,
          thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
        };
      })
      .filter((v) => v.id);
  } catch {
    return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || null;
    if (parsed.hostname === "www.youtube.com" || parsed.hostname === "youtube.com") {
      if (parsed.pathname.startsWith("/shorts/"))
        return parsed.pathname.split("/shorts/")[1]?.split("/")[0] ?? null;
      return parsed.searchParams.get("v");
    }
    return null;
  } catch {
    return null;
  }
}

function hasVideo(release: AdminRecord): boolean {
  return Boolean(release.videoUrl) || Boolean(getYouTubeVideoId(release.link ?? ""));
}

function statusMeta(status: string): { cls: string } {
  const s = status.toLowerCase();
  if (s === "live" || s === "released" || s === "published") return { cls: "ev-badge--confirmed" };
  if (s === "review" || s === "coming soon")                  return { cls: "ev-badge--planning"  };
  return                                                             { cls: "ev-badge--default"   };
}

function formatPublished(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
      .format(new Date(iso));
  } catch { return ""; }
}

// ─── Release Video Card ───────────────────────────────────────────────────────

function VideoCard({ release }: { release: AdminRecord }) {
  const youtubeVideoId = getYouTubeVideoId(release.link ?? "");
  const hasCloudinary  = Boolean(release.videoUrl);
  const { cls }        = statusMeta(release.status);

  return (
    <article className="mv-card">
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
          <YouTubeFacade className="mv-card-iframe" title={release.title} videoId={youtubeVideoId} />
        ) : null}
        <span className={`ev-badge ${cls}`}>
          <span className="ev-badge-dot" />
          {release.status}
        </span>
      </div>
      <div className="mv-card-body">
        <div className="mv-card-meta">
          {release.subtitle  ? <span className="mv-card-format">{release.subtitle}</span>  : null}
          {release.highlight ? <span className="mv-card-views">{release.highlight}</span>  : null}
        </div>
        <h2 className="mv-card-title">{release.title}</h2>
        {release.notes ? <p className="mv-card-notes">{release.notes}</p> : null}
        {release.link ? (
          <a className="mv-card-link" href={release.link} rel="noreferrer" target="_blank">
            <ExternalLink size={12} />
            <span>{youtubeVideoId ? "Open on YouTube" : "Watch / Listen"}</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

// ─── Channel Video Thumbnail Card ─────────────────────────────────────────────

function ChannelVideoCard({ video }: { video: ChannelVideo }) {
  return (
    <a
      className="mv-ch-card"
      href={video.url}
      rel="noreferrer"
      target="_blank"
    >
      <div className="mv-ch-card-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={video.title}
          className="mv-ch-card-img"
          loading="lazy"
          src={video.thumbnail}
        />
        <div className="mv-ch-card-overlay" />
        <div className="mv-ch-card-play">
          <Play fill="white" size={18} strokeWidth={0} />
        </div>
      </div>
      <div className="mv-ch-card-body">
        <p className="mv-ch-card-title">{video.title}</p>
        {video.published ? (
          <p className="mv-ch-card-date">{formatPublished(video.published)}</p>
        ) : null}
      </div>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MusicPage() {
  const [releases, channelVideos] = await Promise.all([
    listAdminCollection("releases"),
    fetchChannelVideos(),
  ]);
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

      {/* Featured release cards */}
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

      {/* YouTube channel grid */}
      <section className="mv-channel-section section-shell">
        <div className="mv-channel-header">
          <p className="section-label">YouTube channel</p>
          <h2 className="mv-channel-title">All Videos</h2>
          <p className="mv-channel-desc">Click any video to watch on YouTube.</p>
        </div>

        {channelVideos.length > 0 ? (
          <div className="mv-ch-grid">
            {channelVideos.map((video) => (
              <ChannelVideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="mv-ch-empty">
            <Music size={28} />
            <p>Could not load channel videos.</p>
          </div>
        )}

        <div className="mv-channel-footer">
          <a
            className="mv-channel-link"
            href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
            rel="noreferrer"
            target="_blank"
          >
            View full channel on YouTube →
          </a>
        </div>
      </section>
    </main>
  );
}
