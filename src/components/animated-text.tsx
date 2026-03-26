"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

type HeadingTag = "h1" | "h2" | "h3";

const headingMap: Record<HeadingTag, typeof motion.h1> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

const viewport = {
  once: true,
  amount: 0.18,
};

function normalizeWord(word: string) {
  return word.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

type RevealVariant = "up" | "left" | "right" | "scale" | "down";

function getRevealState(
  reducedMotion: boolean,
  variant: RevealVariant = "up",
  distance = 30,
) {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    };
  }

  switch (variant) {
    case "left":
      return {
        initial: {
          opacity: 0,
          x: -distance,
          clipPath: "inset(0 18% 0 0 round 0.9rem)",
          filter: "blur(10px)",
        },
        animate: {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0 0 0 round 0.9rem)",
          filter: "blur(0px)",
        },
      };
    case "right":
      return {
        initial: {
          opacity: 0,
          x: distance,
          clipPath: "inset(0 0 0 18% round 0.9rem)",
          filter: "blur(10px)",
        },
        animate: {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0 0 0 round 0.9rem)",
          filter: "blur(0px)",
        },
      };
    case "down":
      return {
        initial: {
          opacity: 0,
          y: -distance,
          clipPath: "inset(14% 0 0 0 round 0.9rem)",
          filter: "blur(10px)",
        },
        animate: {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0 0 round 0.9rem)",
          filter: "blur(0px)",
        },
      };
    case "scale":
      return {
        initial: {
          opacity: 0,
          scale: 0.9,
          clipPath: "inset(8% 8% 8% 8% round 1.1rem)",
          filter: "blur(12px)",
        },
        animate: {
          opacity: 1,
          scale: 1,
          clipPath: "inset(0 0 0 0 round 1.1rem)",
          filter: "blur(0px)",
        },
      };
    case "up":
    default:
      return {
        initial: {
          opacity: 0,
          y: distance,
          clipPath: "inset(0 0 18% 0 round 0.9rem)",
          filter: "blur(10px)",
        },
        animate: {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0 0 round 0.9rem)",
          filter: "blur(0px)",
        },
      };
  }
}

function getRevealTransition(delay = 0, reducedMotion = false): Transition {
  if (reducedMotion) {
    return { duration: 0.24, ease: [0.16, 1, 0.3, 1], delay };
  }

  return {
    delay,
    opacity: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
    clipPath: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    filter: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
    x: { type: "spring", stiffness: 120, damping: 18, mass: 0.78 },
    y: { type: "spring", stiffness: 120, damping: 18, mass: 0.78 },
    scale: { type: "spring", stiffness: 126, damping: 18, mass: 0.74 },
  };
}

type AnimatedEyebrowProps = {
  children: string;
  className?: string;
  delay?: number;
  distance?: number;
};

export function AnimatedEyebrow({
  children,
  className = "",
  delay = 0,
  distance = 18,
}: AnimatedEyebrowProps) {
  const reducedMotion = useReducedMotion();
  const state = getRevealState(!!reducedMotion, "up", distance);

  return (
    <motion.p
      className={`section-label text-beam will-change-transform ${className}`.trim()}
      initial={state.initial}
      transition={getRevealTransition(delay, !!reducedMotion)}
      viewport={viewport}
      whileInView={state.animate}
    >
      {children}
    </motion.p>
  );
}

type AnimatedHeadlineProps = {
  text: string;
  as?: HeadingTag;
  className?: string;
  highlightWords?: string[];
  delay?: number;
  distance?: number;
};

export function AnimatedHeadline({
  text,
  as = "h2",
  className = "",
  highlightWords = [],
  delay = 0,
  distance = 36,
}: AnimatedHeadlineProps) {
  const MotionTag = headingMap[as];
  const reducedMotion = useReducedMotion();
  const normalizedHighlights = new Set(highlightWords.map(normalizeWord));
  const words = text.split(" ");

  return (
    <MotionTag
      className={`will-change-transform ${className}`.trim()}
      initial={
        reducedMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: distance,
              filter: "blur(14px)",
              clipPath: "polygon(0 100%, 100% 82%, 100% 100%, 0 100%)",
            }
      }
      transition={{
        delay,
        opacity: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
        y: reducedMotion
          ? { duration: 0.2, ease: "easeOut" }
          : { type: "spring", stiffness: 112, damping: 17, mass: 0.84 },
        filter: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
        clipPath: { duration: 1.02, ease: [0.16, 1, 0.3, 1] },
      }}
      viewport={viewport}
      whileInView={
        reducedMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            }
      }
    >
      {words.map((word, index) => {
        const normalized = normalizeWord(word);
        const highlighted = normalizedHighlights.has(normalized);

        return (
          <span
            className={`inline ${highlighted ? "text-gradient-brand" : ""}`.trim()}
            key={`${word}-${index}`}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </MotionTag>
  );
}

type AnimatedParagraphProps = {
  text: string;
  className?: string;
  delay?: number;
  distance?: number;
};

export function AnimatedParagraph({
  text,
  className = "",
  delay = 0,
  distance = 26,
}: AnimatedParagraphProps) {
  const reducedMotion = useReducedMotion();
  const state = getRevealState(!!reducedMotion, "up", distance);

  return (
    <motion.p
      className={`will-change-transform ${className}`.trim()}
      initial={state.initial}
      transition={getRevealTransition(delay, !!reducedMotion)}
      viewport={viewport}
      whileInView={state.animate}
    >
      {text}
    </motion.p>
  );
}

type RevealBlockProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  lenisPrevent?: boolean;
  variant?: RevealVariant;
  distance?: number;
};

export function RevealBlock({
  children,
  className = "",
  delay = 0,
  lenisPrevent = false,
  variant = "up",
  distance = 32,
}: RevealBlockProps) {
  const reducedMotion = useReducedMotion();
  const state = getRevealState(!!reducedMotion, variant, distance);

  return (
    <motion.div
      className={`will-change-transform ${className}`.trim()}
      data-lenis-prevent={lenisPrevent ? "true" : undefined}
      initial={state.initial}
      transition={getRevealTransition(delay, !!reducedMotion)}
      viewport={viewport}
      whileInView={state.animate}
    >
      {children}
    </motion.div>
  );
}
