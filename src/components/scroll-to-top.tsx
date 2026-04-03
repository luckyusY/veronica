"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const checkScroll = () => {
      frame = 0;
      setVisible(window.scrollY > 600);
    };

    const handleScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(checkScroll);
    };

    checkScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          animate={{ opacity: 1, y: 0, scale: 1 }}
          aria-label="Scroll to top"
          className="scroll-to-top-button"
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          onClick={scrollUp}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          type="button"
        >
          <ArrowUp size={18} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
