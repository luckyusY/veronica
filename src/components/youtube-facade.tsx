"use client";

import { useRef, useState } from "react";

type Props = {
  title: string;
  videoId?: string;
  playlistId?: string;
  thumbnailUrl?: string;
  loading?: "eager" | "lazy";
  className?: string;
  fullscreenOnPlay?: boolean;
};

export function YouTubeFacade({
  title,
  videoId,
  playlistId,
  thumbnailUrl,
  loading = "lazy",
  className,
  fullscreenOnPlay = false,
}: Props) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const embedSrc = playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1&autoplay=1&playsinline=0&fs=1`
    : videoId
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&playsinline=0&fs=1`
      : null;
  const fallbackThumb =
    thumbnailUrl ?? (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

  if (!embedSrc || !fallbackThumb) {
    return null;
  }

  const requestBestEffortFullscreen = () => {
    const container = containerRef.current as
      | (HTMLDivElement & {
          webkitRequestFullscreen?: () => Promise<void> | void;
          msRequestFullscreen?: () => Promise<void> | void;
        })
      | null;

    if (!container) {
      return;
    }

    const requestFullscreen =
      container.requestFullscreen ??
      container.webkitRequestFullscreen ??
      container.msRequestFullscreen;

    if (!requestFullscreen) {
      return;
    }

    try {
      const result = requestFullscreen.call(container);

      if (result && typeof (result as Promise<void>).catch === "function") {
        void (result as Promise<void>).catch(() => {
          // Best-effort only: some browsers reject iframe fullscreen requests.
        });
      }
    } catch {
      // Ignore unsupported fullscreen attempts and keep inline playback working.
    }
  };

  const handleActivate = () => {
    if (fullscreenOnPlay) {
      requestBestEffortFullscreen();
    }

    setActive(true);
  };

  return (
    <div
      className={`${className ?? "mv-card-iframe"} mv-yt-facade-shell`.trim()}
      ref={containerRef}
    >
      {active ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="mv-yt-facade-frame"
          src={embedSrc}
          title={title}
        />
      ) : (
        <button
          aria-label={`Play ${title} on YouTube`}
          className="mv-yt-facade"
          onClick={handleActivate}
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={title}
            className="mv-yt-facade-thumb"
            loading={loading}
            src={fallbackThumb}
          />
          <div className="mv-yt-facade-overlay" />
          <div className="mv-yt-facade-btn">
            {/* YouTube play button shape */}
            <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
              <path
                className="mv-yt-facade-btn-bg"
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
              />
              <path className="mv-yt-facade-btn-arrow" d="M45.25 24 27 14v20" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
