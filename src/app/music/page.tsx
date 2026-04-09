import type { Metadata } from "next";
import { ArrowUpRight, Music, Play } from "lucide-react";
import { YouTubeFacade } from "@/components/youtube-facade";
import {
  fetchPlaylistVideos,
  formatPublished,
  formatViews,
  officialYouTubePlaylists,
  type OfficialYouTubePlaylist,
  type PlaylistVideo,
} from "@/lib/youtube-playlists";

export const metadata: Metadata = {
  title: "Music & Videos - Veronica Adane",
  description: "Official Veronica Adane playlists, videos, and music releases.",
};

export const revalidate = 3600;

const CHANNEL_ID = "UCfpttsgc_FkvxZrI8_wuuCA";

type PlaylistSection = OfficialYouTubePlaylist & {
  feedTitle: string;
  items: PlaylistVideo[];
};

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
    officialYouTubePlaylists.map(async (playlist) => ({
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
