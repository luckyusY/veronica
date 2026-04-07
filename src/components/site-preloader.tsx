"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VeronicaWordmark } from "@/components/veronica-wordmark";

export function SitePreloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // hide after fonts + first paint settle
    const id = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(id);
  }, []);

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

          <div className="preloader-body">
            <motion.div
              className="preloader-logo"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
                transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
