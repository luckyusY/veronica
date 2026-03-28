"use client";

import { useEffect, useState } from "react";
import { VeronicaWordmark } from "@/components/veronica-wordmark";

const progressStops = [8, 22, 39, 56, 74, 88, 96];

export function SitePreloader() {
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    let frame = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let stopIndex = 0;

    const step = () => {
      setProgress((current) => {
        const target = progressStops[Math.min(stopIndex, progressStops.length - 1)] ?? 96;

        if (current >= target) {
          stopIndex += 1;
          timeoutId = setTimeout(() => {
            frame = window.requestAnimationFrame(step);
          }, 120);
          return current;
        }

        const next = Math.min(target, current + Math.max(1, Math.ceil((target - current) / 6)));
        frame = window.requestAnimationFrame(step);
        return next;
      });
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <main
      aria-label="Loading Veronica Adane official website"
      className="site-preloader"
      role="status"
    >
      <div className="site-preloader-panel">
        <p className="site-preloader-label">Official artist house</p>
        <VeronicaWordmark className="site-preloader-wordmark" />
        <div className="site-preloader-progress-head">
          <span className="site-preloader-progress-copy">Preparing editorial experience</span>
          <span className="site-preloader-progress-value">{progress}%</span>
        </div>
        <div aria-hidden="true" className="site-preloader-progress-track">
          <span className="site-preloader-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="site-preloader-stage-list" aria-hidden="true">
          <span>Imagery</span>
          <span>Story</span>
          <span>Performance</span>
        </div>
        <p className="site-preloader-note">Loading the Veronica Adane experience</p>
      </div>
    </main>
  );
}
