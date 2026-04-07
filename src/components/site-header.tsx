"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useMotionLite } from "@/components/providers";
import { VeronicaWordmark } from "@/components/veronica-wordmark";
import { YoutubeIcon, FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/social-icons";
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
              <span aria-hidden="true" className="site-header-logo-mark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none' }}>
                <Image src="/logo.png" alt="VA" width={36} height={36} style={{ objectFit: 'contain' }} />
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
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.58, delay: 0.4, ease: itemEase }}
              className="site-header-desktop-socials"
              style={{ display: 'flex', gap: '0.75rem', marginRight: '0.5rem', alignItems: 'center' }}
            >
              <a href="https://youtube.com/@veronica_adane?si=l5aWL2XoK4xlqGDk" target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube" className="header-social-icon"><YoutubeIcon width={18} height={18} /></a>
              <a href="https://www.tiktok.com/@veronicaadane?_r=1&_t=ZS-95Kt36szYxt" target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok" className="header-social-icon"><TikTokIcon width={16} height={16} /></a>
              <a href="https://www.facebook.com/share/19KHyCQSkL/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook" className="header-social-icon"><FacebookIcon width={18} height={18} /></a>
              <a href="https://www.instagram.com/veronica_adane?igsh=djhzenc2NTZseWRn" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="header-social-icon"><InstagramIcon width={18} height={18} /></a>
            </motion.div>
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
              <span aria-hidden="true" className="site-header-mobile-mark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none' }}>
                <Image src="/logo.png" alt="VA" width={32} height={32} style={{ objectFit: 'contain' }} />
              </span>
              <span className="site-header-mobile-logo-copy">
                <span className="site-header-mobile-kicker">{settings.brandKicker}</span>
                <VeronicaWordmark className="site-header-mobile-wordmark" />
              </span>
            </Link>

            <div className="site-header-mobile-right">
              <div className="site-header-mobile-socials">
                <a href="https://youtube.com/@veronica_adane?si=l5aWL2XoK4xlqGDk" target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube" className="mobile-social-icon"><YoutubeIcon width={16} height={16} /></a>
                <a href="https://www.tiktok.com/@veronicaadane?_r=1&_t=ZS-95Kt36szYxt" target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok" className="mobile-social-icon"><TikTokIcon width={14} height={14} /></a>
                <a href="https://www.facebook.com/share/19KHyCQSkL/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook" className="mobile-social-icon"><FacebookIcon width={16} height={16} /></a>
                <a href="https://www.instagram.com/veronica_adane?igsh=djhzenc2NTZseWRn" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="mobile-social-icon"><InstagramIcon width={16} height={16} /></a>
                <button
                  aria-controls="mobile-navigation"
                  aria-expanded={menuOpen}
                  aria-label="Toggle navigation menu"
                  title="Menu"
                  className={`site-header-nav-toggle ${menuOpen ? "is-active" : ""}`.trim()}
                  onClick={() => setMenuOpen(!menuOpen)}
                  type="button"
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>
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
