"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";

type ProvidersProps = {
  children: ReactNode;
};

const MotionLiteContext = createContext(false);

export function useMotionLite() {
  return useContext(MotionLiteContext);
}

export function Providers({ children }: ProvidersProps) {
  const [motionLite, setMotionLite] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(pointer: coarse), (max-width: 820px), (prefers-reduced-motion: reduce)",
    );

    const updateMotionMode = () => {
      const nextValue = media.matches;
      setMotionLite(nextValue);
      document.documentElement.classList.toggle("motion-lite", nextValue);
    };

    updateMotionMode();
    media.addEventListener("change", updateMotionMode);

    return () => {
      media.removeEventListener("change", updateMotionMode);
      document.documentElement.classList.remove("motion-lite");
    };
  }, []);

  useEffect(() => {
    if (motionLite) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1,
      overscroll: true,
      prevent: (node) =>
        node instanceof HTMLElement && !!node.closest("[data-lenis-prevent]"),
    });

    return () => {
      lenis.destroy();
    };
  }, [motionLite]);

  return (
    <MotionLiteContext.Provider value={motionLite}>
      <MotionConfig reducedMotion={motionLite ? "always" : "user"}>{children}</MotionConfig>
    </MotionLiteContext.Provider>
  );
}
