"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { AnimatePresence, motion } from "motion/react";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SitePreloader } from "@/components/site-preloader";

type AppShellProps = {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
};

export function AppShell({ children, header, footer }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      <NextTopLoader
        color="#F2D28B"
        crawlSpeed={180}
        height={2}
        initialPosition={0.12}
        shadow="0 0 12px rgba(242, 210, 139, 0.85), 0 0 24px rgba(217, 79, 43, 0.28)"
        showSpinner={false}
      />

      {!isAdminRoute && <SitePreloader />}

      {isAdminRoute ? (
        <div className="min-h-screen">{children}</div>
      ) : (
        <div className="flex min-h-screen flex-col">
          {header}
          <AnimatePresence mode="wait">
            <motion.div
              className="flex-1 flex flex-col"
              key={pathname}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
          {footer}
          <ScrollToTop />
        </div>
      )}
    </>
  );
}
