"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useMotionLite } from "@/components/providers";
import { VeronicaWordmark } from "@/components/veronica-wordmark";
import type { CmsSiteSettings } from "@/lib/cms-types";
import { navigationItems } from "@/lib/site-data";

const primaryNavigation = navigationItems.filter(
  (item) => item.href !== "/shop" && item.href !== "/contact",
);

const actionNavigation = [
  { href: "/shop", label: "Shop" },
];

const itemEase = [0.22, 1, 0.36, 1] as const;

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

type SiteHeaderProps = {
  settings: CmsSiteSettings["header"];
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();
  const motionLite = useMotionLite();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateScrollState = () => {
      frame = 0;
      setScrollProgress(Math.min(window.scrollY / 160, 1));
    };

    const handleScroll = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const isScrolled = scrollProgress > 0.08;
  const headerStyle: CSSProperties = {
    backgroundColor: motionLite
      ? `rgba(13, 9, 7, ${(0.78 + scrollProgress * 0.16).toFixed(3)})`
      : `rgba(13, 9, 7, ${(scrollProgress * 0.85).toFixed(3)})`,
    backdropFilter: motionLite
      ? "none"
      : `blur(${(scrollProgress * 18).toFixed(2)}px) saturate(${(
          100 +
          scrollProgress * 24
        ).toFixed(0)}%)`,
    WebkitBackdropFilter: motionLite
      ? "none"
      : `blur(${(scrollProgress * 18).toFixed(2)}px) saturate(${(
          100 +
          scrollProgress * 24
        ).toFixed(0)}%)`,
    boxShadow:
      scrollProgress > 0
        ? `0 14px 40px rgba(0, 0, 0, ${(scrollProgress * 0.18).toFixed(3)})`
        : "none",
  };

  return (
    <header
      className={`site-header-shell ${isScrolled ? "is-scrolled" : ""}`.trim()}
      style={headerStyle}
    >
      <div className="section-shell">
        <div className="site-header-inner">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="site-header-brand"
            initial={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.68, delay: 0.08, ease: itemEase }}
          >
            <Link className="site-header-logo" href="/" onClick={() => setMenuOpen(false)}>
              <span aria-hidden="true" className="site-header-logo-mark">
                VA
              </span>
              <span className="site-header-logo-copy site-header-logo-copy--stacked">
                <span className="site-header-logo-rail">
                  <span className="site-header-logo-kicker">{settings.brandKicker}</span>
                  <span className="site-header-logo-note">Addis Ababa • Global stage</span>
                </span>
                <VeronicaWordmark className="site-header-wordmark" />
              </span>
            </Link>
          </motion.div>

          <nav aria-label="Primary navigation" className="site-header-nav">
            {primaryNavigation.map((item, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -12 }}
                key={item.href}
                transition={{ duration: 0.58, delay: 0.16 + index * 0.08, ease: itemEase }}
              >
                <Link
                  className={`site-header-link ${
                    isActivePath(pathname, item.href) ? "is-active" : ""
                  }`.trim()}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="site-header-right">
            {actionNavigation.map((item, index) => {
              const label =
                item.href === "/contact" ? settings.bookingLabel : settings.shopLabel;

              return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -12 }}
                key={item.href}
                transition={{ duration: 0.58, delay: 0.7 + index * 0.08, ease: itemEase }}
              >
                <Link
                  className={`site-header-action ${
                    item.href === "/shop" ? "site-header-action--accent" : ""
                  } ${isActivePath(pathname, item.href) ? "is-active" : ""}`.trim()}
                  href={item.href}
                >
                  {label}
                </Link>
              </motion.div>
              );
            })}
          </div>

          <div className="site-header-mobile">
            <Link className="site-header-mobile-logo" href="/" onClick={() => setMenuOpen(false)}>
              <span aria-hidden="true" className="site-header-mobile-mark">
                VA
              </span>
              <span className="site-header-mobile-logo-copy">
                <span className="site-header-mobile-kicker">{settings.brandKicker}</span>
                <VeronicaWordmark className="site-header-mobile-wordmark" />
              </span>
            </Link>

            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="site-header-menu-button"
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden="true"
              className="site-header-backdrop"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              transition={{ duration: 0.28 }}
            />
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="site-header-mobile-panel"
              exit={{ opacity: 0, y: -18 }}
              initial={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.34, ease: itemEase }}
            >
              <div className="section-shell">
                <nav aria-label="Mobile navigation" className="site-header-mobile-list">
                  {primaryNavigation.map((item, index) => (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: -12 }}
                      key={item.href}
                      transition={{
                        duration: 0.34,
                        delay: 0.06 + index * 0.05,
                        ease: itemEase,
                      }}
                    >
                      <Link
                        className={`site-header-mobile-link ${
                          isActivePath(pathname, item.href) ? "is-active" : ""
                        }`.trim()}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="site-header-mobile-actions">
                  {actionNavigation.map((item, index) => {
                    const label =
                      item.href === "/contact" ? settings.bookingLabel : settings.shopLabel;

                    return (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: -12 }}
                      key={item.href}
                      transition={{
                        duration: 0.34,
                        delay: 0.28 + index * 0.06,
                        ease: itemEase,
                      }}
                    >
                      <Link
                        className={`site-header-mobile-link site-header-mobile-link--action ${
                          item.href === "/shop" ? "site-header-mobile-link--accent" : ""
                        } ${isActivePath(pathname, item.href) ? "is-active" : ""}`.trim()}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
