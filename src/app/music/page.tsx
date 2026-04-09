import type { Metadata } from "next";
import { ArrowUpRight, Music, Play } from "lucide-react";
import { YouTubeFacade } from "@/components/youtube-facade";

export const metadata: Metadata = {
  title: "Music & Videos - Veronica Adane",
  description: "Official Veronica Adane playlists, videos, and music releases.",
};

export const revalidate = 3600;

const CHANNEL_ID = "UCfpttsgc_FkvxZrI8_wuuCA";

const PLAYLISTS = [
  {
    playlistId: "PLj1hYyBldtFP7FOekaLAnobf40NCRdAnw",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFP7FOekaLAnobf40NCRdAnw&si=C8upd-PXUMPJXbg8",
    title: "Meteriyaye Album",
    accent: "Album playlist",
    description:
      "The full Meteriyaye album collected in one place, with the complete sequence presented as a dedicated release chapter.",
  },
  {
    playlistId: "PLj1hYyBldtFNWtKPPz20xGULybnTZjAXT",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFNWtKPPz20xGULybnTZjAXT&si=H2pQrGYKahV9aH8U",
    title: "Meteriyaye Album Music Video Clips",
    accent: "Video clips",
    description:
      "The visual extension of the album era, grouped as a focused video playlist instead of getting lost inside the broader channel feed.",
  },
  {
    playlistId: "PLj1hYyBldtFN-jNTdW57IeQ898Z2efccd",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFN-jNTdW57IeQ898Z2efccd&si=HTiu4REORFYg-RQB",
    title: "Veronica Adane Hit Singles (102M Views)",
    accent: "Hit singles",
    description:
      "The biggest official uploads grouped together for fast listening, replay, and sharing across the strongest public records.",
  },
  {
    playlistId: "PLj1hYyBldtFPOSCDsVEBxhXTlyhGTl7bD",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFPOSCDsVEBxhXTlyhGTl7bD&si=ixkbAbTof-_G9BVI",
    title: "Veronica Adane Music Video Clips Behind the Scenes",
    accent: "Behind the scenes",
    description:
      "A lighter backstage collection that gives the music page range and shows the making-of layer around the official releases.",
  },
] as const;

type PlaylistVideo = {
  id: string;
  title: string;
  published: string;
  url: string;
  thumbnail: string;
  views: string;
};

type PlaylistSection = (typeof PLAYLISTS)[number] & {
  feedTitle: string;
  items: PlaylistVideo[];
};

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

async function fetchPlaylistVideos(playlistId: string): Promise<{ feedTitle: string; items: PlaylistVideo[] }> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) {
      return { feedTitle: "", items: [] };
    }

    const xml = await res.text();
    const feedHeader = xml.split("<entry>")[0] ?? "";
    const feedTitle = decodeHtml(feedHeader.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];

    return {
      feedTitle,
      items: entries
        .map((entry, index) => {
          const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
          const rawTitle = entry.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
          const published = entry.match(/<published>(.*?)<\/published>/)?.[1] ?? "";
          const thumbnail =
            entry.match(/<media:thumbnail url="(.*?)"/)?.[1] ??
            `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
          const views = entry.match(/<media:statistics views="(.*?)"/)?.[1] ?? "";

          return {
            id,
            title: decodeHtml(rawTitle),
            published,
            thumbnail,
            views,
            url: `https://www.youtube.com/watch?v=${id}&list=${playlistId}&index=${index + 1}`,
          };
        })
        .filter((item) => item.id),
    };
  } catch {
    return { feedTitle: "", items: [] };
  }
}

function formatPublished(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function formatViews(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "";
  }

  return `${new Intl.NumberFormat("en-US").format(parsed)} views`;
}

function PlaylistVideoCard({
  playlistId,
  video,
  index,
}: {
  playlistId: string;
  video: PlaylistVideo;
  index: number;
}) {
  const published = formatPublished(video.published);
  const views = formatViews(video.views);

  return (
    <a
      className="mv-pl-video-card"
      href={`https://www.youtube.com/watch?v=${video.id}&list=${playlistId}&index=${index + 1}`}
      rel="noreferrer"
      target="_blank"
    >
      <div className="mv-pl-video-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={video.title}
          className="mv-pl-video-img"
          loading="lazy"
          src={video.thumbnail}
        />
        <span className="mv-pl-video-index">{String(index + 1).padStart(2, "0")}</span>
        <div className="mv-pl-video-overlay" />
        <div className="mv-pl-video-play">
          <Play fill="white" size={18} strokeWidth={0} />
        </div>
      </div>
      <div className="mv-pl-video-body">
        <p className="mv-pl-video-title">{video.title}</p>
        {published || views ? (
          <p className="mv-pl-video-meta">
            {[published, views].filter(Boolean).join(" • ")}
          </p>
        ) : null}
      </div>
    </a>
  );
}

function PlaylistShowcase({
  playlist,
  index,
}: {
  playlist: PlaylistSection;
  index: number;
}) {
  const leadThumbnail = playlist.items[0]?.thumbnail;
  const playlistCountLabel = `${playlist.items.length} ${playlist.items.length === 1 ? "video" : "videos"}`;

  return (
    <section className="mv-playlist-section section-shell" key={playlist.playlistId}>
      <div
        className={`mv-playlist-spotlight mv-playlist-spotlight--${index % 2 === 0 ? "left" : "right"}`}
      >
        <div className="mv-playlist-player">
          <YouTubeFacade
            className="mv-playlist-embed"
            fullscreenOnPlay
            loading={index === 0 ? "eager" : "lazy"}
            playlistId={playlist.playlistId}
            thumbnailUrl={leadThumbnail}
            title={playlist.title}
          />
        </div>

        <div className="mv-playlist-copy">
          <div className="mv-playlist-copy-top">
            <p className="section-label">Playlist {String(index + 1).padStart(2, "0")}</p>
            <h2 className="display-title mv-playlist-title">{playlist.title}</h2>
          </div>

          <p className="mv-playlist-description">{playlist.description}</p>

          <div className="mv-playlist-chips">
            <span className="mv-playlist-chip">{playlist.accent}</span>
            <span className="mv-playlist-chip">{playlistCountLabel}</span>
            {playlist.feedTitle && playlist.feedTitle !== playlist.title ? (
              <span className="mv-playlist-chip">{playlist.feedTitle}</span>
            ) : null}
          </div>

          <a
            className="primary-button mv-playlist-link"
            href={playlist.href}
            rel="noreferrer"
            target="_blank"
          >
            <span>Open playlist on YouTube</span>
            <ArrowUpRight size={16} strokeWidth={2.1} />
          </a>
        </div>
      </div>

      {playlist.items.length > 0 ? (
        <div className="mv-playlist-grid">
          {playlist.items.map((video, videoIndex) => (
            <PlaylistVideoCard
              index={videoIndex}
              key={`${playlist.playlistId}-${video.id}`}
              playlistId={playlist.playlistId}
              video={video}
            />
          ))}
        </div>
      ) : (
        <div className="mv-ch-empty mv-playlist-empty">
          <Music size={28} />
          <p>Could not load this playlist right now. Please try again shortly.</p>
        </div>
      )}
    </section>
  );
}

export default async function MusicPage() {
  const playlists = await Promise.all(
    PLAYLISTS.map(async (playlist) => ({
      ...playlist,
      ...(await fetchPlaylistVideos(playlist.playlistId)),
    })),
  );

  return (
    <main className="mv-page">
      <div className="mv-header section-shell">
        <p className="section-label">Official YouTube playlists</p>
        <h1 className="display-title mv-page-title">Music &amp; Videos</h1>
        <p className="mv-page-subtitle">
          The music page now breaks the channel into full official playlists, so each release era
          can be opened, played, and browsed the way it lives on YouTube.
        </p>
      </div>

      <div className="mv-playlists-shell">
        {playlists.map((playlist, index) => (
          <PlaylistShowcase index={index} key={playlist.playlistId} playlist={playlist} />
        ))}
      </div>

      <div className="mv-channel-footer section-shell">
        <a
          className="mv-channel-link"
          href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
          rel="noreferrer"
          target="_blank"
        >
          View full channel on YouTube
        </a>
      </div>
    </main>
  );
}
