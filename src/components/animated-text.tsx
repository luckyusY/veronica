import type { ReactNode } from "react";
import * as motion from "motion/react-client";

type HeadingTag = "h1" | "h2" | "h3";

const headingMap: Record<HeadingTag, typeof motion.h1> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

const containerTransition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const,
};

const viewport = {
  once: true,
  amount: 0.45,
};

function normalizeWord(word: string) {
  return word.replace(/[^a-z0-9]/gi, "").toLowerCase();
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
  return (
    <motion.p
      className={`section-label text-beam ${className}`.trim()}
      initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
      transition={{ ...containerTransition, delay }}
      viewport={viewport}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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
  const normalizedHighlights = new Set(highlightWords.map(normalizeWord));
  const words = text.split(" ");

  return (
    <MotionTag
      className={className}
      initial="hidden"
      transition={{
        delayChildren: delay,
        staggerChildren: 0.045,
      }}
      viewport={viewport}
      whileInView="visible"
    >
      {words.map((word, index) => {
        const normalized = normalizeWord(word);
        const highlighted = normalizedHighlights.has(normalized);

        return (
          <span className="inline-block overflow-hidden align-top" key={`${word}-${index}`}>
            <motion.span
              className={`inline-block ${highlighted ? "text-gradient-brand" : ""}`.trim()}
              variants={{
                hidden: { y: "0.95em", opacity: 0, filter: "blur(10px)" },
                visible: {
                  y: "0em",
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: containerTransition,
                },
              }}
            >
              {word}
            </motion.span>
            {index < words.length - 1 ? <span>&nbsp;</span> : null}
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
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      transition={{ ...containerTransition, delay }}
      viewport={viewport}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    >
      {text}
    </motion.p>
  );
}

type RevealBlockProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function RevealBlock({
  children,
  className = "",
  delay = 0,
}: RevealBlockProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
      transition={{ ...containerTransition, delay }}
      viewport={viewport}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    >
      {children}
    </motion.div>
  );
}
