"use client";

import { useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { useMotionLite } from "@/components/providers";
import { createSvgBlurDataURL } from "@/lib/image-utils";

type EditorialImageAsset = {
  src?: string | StaticImageData;
  url?: string;
  alt: string;
  position?: string;
  placeholderBase?: string;
  placeholderHighlight?: string;
};

type ImageMotionPreset =
  | "vertical"
  | "from-left"
  | "from-right"
  | "settle-left"
  | "settle-right"
  | "zoom-burst"
  | "diagonal";

type EditorialImageProps = {
  image: EditorialImageAsset;
  sizes: string;
  className?: string;
  priority?: boolean;
  strength?: number;
  overlayClassName?: string;
  motionPreset?: ImageMotionPreset;
  /** Enable 3-D tilt on pointer hover */
  tilt?: boolean;
  /** Strength of the shimmer scan (0 = off) */
  shimmer?: boolean;
};



export function EditorialImage({
  image,
  sizes,
  className = "",
  priority = false,
  strength = 52,
  overlayClassName = "bg-gradient-to-t from-black/38 via-black/10 to-transparent",
  motionPreset = "vertical",
  tilt = false,
  shimmer = true,
}: EditorialImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const motionLite = useMotionLite();
  const reducedMotion = Boolean(prefersReducedMotion || motionLite);
  const [isLoaded, setIsLoaded] = useState(false);

  // -- Scroll-based parallax --------------------------------------------------
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const motionFrames = useMemo(() => {
    if (reducedMotion) {
      return { x: [0, 0, 0], y: [0, 0, 0], scale: [1, 1, 1], rotate: [0, 0, 0] };
    }

    switch (motionPreset) {
      case "from-left":
        return {
          x: [-strength * 1.6, 0, strength * 0.5],
          y: [-strength * 0.35, 0, strength * 0.2],
          scale: [1.22, 1.1, 1.02],
          rotate: [-1.6, 0, 0.5],
        };
      case "from-right":
        return {
          x: [strength * 1.6, 0, -strength * 0.5],
          y: [-strength * 0.35, 0, strength * 0.2],
          scale: [1.22, 1.1, 1.02],
          rotate: [1.6, 0, -0.5],
        };
      case "settle-left":
        return {
          x: [-strength * 1.0, 0, -strength * 0.22],
          y: [-strength * 0.6, 0, strength * 0.28],
          scale: [1.2, 1.08, 1.02],
          rotate: [-0.8, 0, 0],
        };
      case "settle-right":
        return {
          x: [strength * 1.0, 0, strength * 0.22],
          y: [-strength * 0.6, 0, strength * 0.28],
          scale: [1.2, 1.08, 1.02],
          rotate: [0.8, 0, 0],
        };
      case "zoom-burst":
        return {
          x: [0, 0, 0],
          y: [0, 0, 0],
          scale: [1.4, 1.1, 1.0],
          rotate: [0, 0, 0],
        };
      case "diagonal":
        return {
          x: [-strength * 0.9, 0, strength * 0.35],
          y: [-strength * 0.9, 0, strength * 0.35],
          scale: [1.28, 1.1, 1.02],
          rotate: [-1.1, 0, 0.4],
        };
      case "vertical":
      default:
        return {
          x: [0, 0, 0],
          y: [-strength * 1.1, 0, strength * 1.1],
          scale: [1.18, 1.1, 1.02],
          rotate: [0, 0, 0],
        };
    }
  }, [motionPreset, reducedMotion, strength]);

  // Spring-smoothed transforms for buttery parallax
  const rawX = useTransform(scrollYProgress, [0, 0.5, 1], motionFrames.x);
  const rawY = useTransform(scrollYProgress, [0, 0.5, 1], motionFrames.y);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], motionFrames.scale);
  const rawRotate = useTransform(scrollYProgress, [0, 0.5, 1], motionFrames.rotate);

  const springCfg = { stiffness: 60, damping: 22, mass: 0.6 };
  const x = useSpring(rawX, springCfg);
  const y = useSpring(rawY, springCfg);
  const scale = useSpring(rawScale, springCfg);
  const rotate = useSpring(rawRotate, springCfg);

  // -- Viewport entrance (diagonal clip-path wipe) ----------------------------
  const inView = useInView(containerRef, { once: true, amount: 0.12 });

  const blurDataURL = useMemo(
    () =>
      createSvgBlurDataURL(
        image.placeholderBase ?? "#141012",
        image.placeholderHighlight ?? "#8e6b43",
      ),
    [image.placeholderBase, image.placeholderHighlight],
  );

  const shimmerActive = !reducedMotion && shimmer && isLoaded && inView;
  const imageSrc = image.src ?? image.url ?? "";

  // -- 3-D tilt state ---------------------------------------------------------
  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({});

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!tilt || reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / rect.width) * 2;   // -1 to 1
    const dy = ((e.clientY - cy) / rect.height) * 2;  // -1 to 1
    setTiltStyle({
      transform: `perspective(1100px) rotateY(${dx * 6}deg) rotateX(${-dy * 5}deg) scale(1.018)`,
    });
  }

  function handleMouseLeave() {
    setTiltStyle({});
  }

  const entranceVariants: Variants | undefined = reducedMotion
    ? undefined
    : {
        hidden: {
          clipPath: "polygon(0 100%, 44% 100%, 0 56%, 0 100%)",
          opacity: 0,
          scale: 0.97,
        },
        visible: {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          opacity: 1,
          scale: 1,
          transition: {
            clipPath: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.55, ease: "easeOut" },
            scale: { duration: 0.82, ease: [0.16, 1, 0.3, 1] },
          },
        },
      };

  return (
    <motion.div
      className={`editorial-image-shell editorial-scroll-reveal${isLoaded ? " is-loaded" : ""}${inView ? " img-in-view" : ""}${tilt && !reducedMotion ? " image-hover-glow" : ""} ${className}`.trim()}
      ref={containerRef}
      style={
        tilt && !reducedMotion
          ? {
              ...tiltStyle,
              transition: tiltStyle.transform
                ? "none"
                : "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }
          : undefined
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={entranceVariants}
      initial={reducedMotion ? { opacity: 0 } : "hidden"}
      animate={reducedMotion ? { opacity: 1 } : inView ? "visible" : "hidden"}
    >
      <motion.div
        className="editorial-image-canvas"
        style={reducedMotion ? undefined : { x, y, scale, rotate }}
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
          quality={92}
          sizes={sizes}
          src={imageSrc}
          style={{ objectFit: "cover", objectPosition: image.position ?? "center" }}
        />
      </motion.div>

      {/* Shimmer scan stripe — sweeps left-to-right once on load */}
      {shimmer && !reducedMotion ? (
        <div className={`editorial-image-shimmer${shimmerActive ? " run" : ""}`} />
      ) : null}

      <div className={`editorial-image-overlay ${overlayClassName}`.trim()} />
      <div className="editorial-image-matte" />
      <div className="editorial-image-grain" />
    </motion.div>
  );
}
