"use client";

import Image from "next/image";

type CollabImageStripProps = {
  images: string[];
};

export function CollabImageStrip({ images }: CollabImageStripProps) {
  if (images.length === 0) return null;

  // duplicate for seamless loop
  const doubled = [...images, ...images];

  return (
    <div className="collab-strip-root" aria-hidden="true">
      <div className="collab-strip-fade collab-strip-fade--left" />
      <div className="collab-strip-fade collab-strip-fade--right" />
      <div className="collab-strip-viewport">
        <div className="collab-strip-track">
          {doubled.map((src, i) => (
            <div className="collab-strip-item" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="collab-strip-img"
                loading="lazy"
                src={src}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
