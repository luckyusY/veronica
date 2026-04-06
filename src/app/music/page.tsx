import type { Metadata } from "next";
import { Music, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Music & Videos — Veronica Adane",
  description: "Official music releases, singles, and video premieres by Veronica Adane.",
};

export const revalidate = 3600;

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
        const id       = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
        const rawTitle = entry.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
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

function formatPublished(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
      .format(new Date(iso));
  } catch { return ""; }
}

// ─── Channel Video Card ───────────────────────────────────────────────────────

function ChannelVideoCard({ video }: { video: ChannelVideo }) {
  return (
    <a className="mv-ch-card" href={video.url} rel="noreferrer" target="_blank">
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
          <Play fill="white" size={20} strokeWidth={0} />
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
  const channelVideos = await fetchChannelVideos();

  return (
    <main className="mv-page">
      {/* Header */}
      <div className="mv-header section-shell">
        <p className="section-label">YouTube channel</p>
        <h1 className="display-title mv-page-title">Music &amp; Videos</h1>
        <p className="mv-page-subtitle">
          Singles, music videos, and live performances. Click any video to watch on YouTube.
        </p>
      </div>

      {/* YouTube channel thumbnail grid */}
      <section className="mv-channel-section section-shell">
        {channelVideos.length > 0 ? (
          <div className="mv-ch-grid">
            {channelVideos.map((video) => (
              <ChannelVideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="mv-ch-empty">
            <Music size={32} />
            <p>Could not load videos. Check back soon.</p>
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
