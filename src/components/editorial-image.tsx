"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type EditorialImageAsset = {
  src: string;
  alt: string;
  position?: string;
};

type EditorialImageProps = {
  image: EditorialImageAsset;
  sizes: string;
  className?: string;
  priority?: boolean;
  strength?: number;
  overlayClassName?: string;
};

export function EditorialImage({
  image,
  sizes,
  className = "",
  priority = false,
  strength = 52,
  overlayClassName = "bg-gradient-to-t from-black/30 via-black/8 to-transparent",
}: EditorialImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
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

  return (
    <div className={`relative overflow-hidden ${className}`.trim()} ref={containerRef}>
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { y, scale }}
      >
        <Image
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          src={image.src}
          style={{ objectFit: "cover", objectPosition: image.position ?? "center" }}
        />
      </motion.div>
      <div className={`pointer-events-none absolute inset-0 ${overlayClassName}`.trim()} />
    </div>
  );
}
