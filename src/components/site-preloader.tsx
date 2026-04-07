"use client";

import { motion, AnimatePresence } from "motion/react";
import { VeronicaWordmark } from "@/components/veronica-wordmark";

type SitePreloaderProps = {
  visible: boolean;
  stage?: "initial" | "transition";
};

export function SitePreloader({
  visible,
  stage = "initial",
}: SitePreloaderProps) {
  const lineDuration = stage === "initial" ? 1.4 : 0.9;
  const lineDelay = stage === "initial" ? 0.4 : 0.12;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-label="Loading Veronica Adane official website"
          aria-live="polite"
          key="preloader"
          className="preloader-root"
          role="status"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="preloader-glow" aria-hidden="true" />

          <div className={`preloader-body preloader-body--${stage}`.trim()}>
            <motion.div
              className="preloader-logo"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: stage === "initial" ? 0.9 : 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <VeronicaWordmark className="preloader-wordmark" />
            </motion.div>

            <motion.div
              className="preloader-line-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <motion.div
                className="preloader-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: lineDuration,
                  delay: lineDelay,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
