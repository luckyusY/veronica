"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

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
  distance = 22,
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
        initial: { opacity: 0, x: -distance },
        animate: { opacity: 1, x: 0 },
      };
    case "right":
      return {
        initial: { opacity: 0, x: distance },
        animate: { opacity: 1, x: 0 },
      };
    case "down":
      return {
        initial: { opacity: 0, y: -distance },
        animate: { opacity: 1, y: 0 },
      };
    case "scale":
      return {
        initial: { opacity: 0, scale: 0.94 },
        animate: { opacity: 1, scale: 1 },
      };
    case "up":
    default:
      return {
        initial: { opacity: 0, y: distance },
        animate: { opacity: 1, y: 0 },
      };
  }
}

type AnimatedEyebrowProps = {
  children: string;
  className?: string;
  delay?: number;
};

export function AnimatedEyebrow({
  children,
  className = "",
  delay = 0,
}: AnimatedEyebrowProps) {
  const reducedMotion = useReducedMotion();
  const state = getRevealState(!!reducedMotion, "up", 16);

  return (
    <motion.p
      className={`section-label text-beam will-change-transform ${className}`.trim()}
      initial={state.initial}
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1], delay }}
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
};

export function AnimatedHeadline({
  text,
  as = "h2",
  className = "",
  highlightWords = [],
  delay = 0,
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
          : { opacity: 0, y: 24, clipPath: "inset(0 0 100% 0 round 0.8rem)" }
      }
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={viewport}
      whileInView={
        reducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 0.8rem)" }
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
};

export function AnimatedParagraph({
  text,
  className = "",
  delay = 0,
}: AnimatedParagraphProps) {
  const reducedMotion = useReducedMotion();
  const state = getRevealState(!!reducedMotion, "up", 22);

  return (
    <motion.p
      className={`will-change-transform ${className}`.trim()}
      initial={state.initial}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay }}
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
  distance = 24,
}: RevealBlockProps) {
  const reducedMotion = useReducedMotion();
  const state = getRevealState(!!reducedMotion, variant, distance);

  return (
    <motion.div
      className={`will-change-transform ${className}`.trim()}
      data-lenis-prevent={lenisPrevent ? "true" : undefined}
      initial={state.initial}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={viewport}
      whileInView={state.animate}
    >
      {children}
    </motion.div>
  );
}
