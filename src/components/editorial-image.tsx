"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type EditorialImageAsset = {
  src: string;
  alt: string;
  position?: string;
  placeholderBase?: string;
  placeholderHighlight?: string;
};

type EditorialImageProps = {
  image: EditorialImageAsset;
  sizes: string;
  className?: string;
  priority?: boolean;
  strength?: number;
  overlayClassName?: string;
};

function createBlurDataURL(base: string, highlight: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${base}" />
          <stop offset="55%" stop-color="${highlight}" />
          <stop offset="100%" stop-color="${base}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="1600" fill="url(#g)" />
      <rect width="1200" height="1600" fill="rgba(5,7,10,0.22)" />
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function EditorialImage({
  image,
  sizes,
  className = "",
  priority = false,
  strength = 52,
  overlayClassName = "bg-gradient-to-t from-black/38 via-black/10 to-transparent",
}: EditorialImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [-strength, strength],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1, 1] : [1.12, 1.02],
  );
  const blurDataURL = useMemo(
    () =>
      createBlurDataURL(
        image.placeholderBase ?? "#141012",
        image.placeholderHighlight ?? "#8e6b43",
      ),
    [image.placeholderBase, image.placeholderHighlight],
  );

  return (
    <div
      className={`editorial-image-shell ${isLoaded ? "is-loaded" : ""} ${className}`.trim()}
      ref={containerRef}
    >
      <motion.div
        className="editorial-image-canvas"
        style={reducedMotion ? undefined : { y, scale }}
      >
        <Image
          alt={image.alt}
          blurDataURL={blurDataURL}
          className="editorial-image-element"
          fill
          loading={priority ? undefined : "lazy"}
          onLoad={() => setIsLoaded(true)}
          placeholder="blur"
          priority={priority}
          quality={90}
          sizes={sizes}
          src={image.src}
          style={{ objectFit: "cover", objectPosition: image.position ?? "center" }}
        />
      </motion.div>
      <div className={`editorial-image-overlay ${overlayClassName}`.trim()} />
      <div className="editorial-image-matte" />
      <div className="editorial-image-grain" />
    </div>
  );
}
