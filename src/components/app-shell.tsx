"use client";

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { AnimatePresence, motion } from "motion/react";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SitePreloader } from "@/components/site-preloader";

type AppShellProps = {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
};

const INITIAL_PRELOADER_MS = 1800;
const ROUTE_PRELOADER_MS = 850;
const CLICK_FALLBACK_MS = 4200;

export function AppShell({ children, header, footer }: AppShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdminRoute = pathname.startsWith("/admin");
  const routeKey = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);
  const [preloaderVisible, setPreloaderVisible] = useState(() => !isAdminRoute);
  const [preloaderStage, setPreloaderStage] = useState<"initial" | "transition">("initial");
  const initialLoadHandledRef = useRef(false);
  const previousRouteRef = useRef(routeKey);
  const hideTimerRef = useRef<number | null>(null);

  const clearHideTimer = useEffectEvent(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  });

  const scheduleHide = useEffectEvent((delay: number) => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setPreloaderVisible(false);
      hideTimerRef.current = null;
    }, delay);
  });

  useEffect(() => {
    return () => clearHideTimer();
  }, []);

  useEffect(() => {
    if (isAdminRoute) {
      clearHideTimer();
      previousRouteRef.current = routeKey;
      initialLoadHandledRef.current = true;
      return;
    }

    if (!initialLoadHandledRef.current) {
      initialLoadHandledRef.current = true;
      previousRouteRef.current = routeKey;
      scheduleHide(INITIAL_PRELOADER_MS);
      return;
    }

    if (previousRouteRef.current !== routeKey) {
      previousRouteRef.current = routeKey;
      const frame = window.requestAnimationFrame(() => {
        setPreloaderStage("transition");
        setPreloaderVisible(true);
        scheduleHide(ROUTE_PRELOADER_MS);
      });

      return () => window.cancelAnimationFrame(frame);
    }
  }, [isAdminRoute, routeKey]);

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);

      if (nextUrl.origin !== window.location.origin || nextUrl.pathname.startsWith("/admin")) {
        return;
      }

      const currentRoute = `${window.location.pathname}${window.location.search}`;
      const nextRoute = `${nextUrl.pathname}${nextUrl.search}`;

      if (currentRoute === nextRoute) {
        return;
      }

      setPreloaderStage("transition");
      setPreloaderVisible(true);
      scheduleHide(CLICK_FALLBACK_MS);
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isAdminRoute]);

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

      {!isAdminRoute && <SitePreloader stage={preloaderStage} visible={preloaderVisible} />}

      {isAdminRoute ? (
        <div className="min-h-screen">{children}</div>
      ) : (
        <div className="flex min-h-screen flex-col">
          {header}
          <AnimatePresence mode="wait">
            <motion.div
              className="flex-1 flex flex-col"
              key={routeKey}
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
