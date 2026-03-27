"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigationItems } from "@/lib/site-data";

const topNotes = [
  "Official platform",
  "Addis Ababa, Ethiopia",
  "Music / Press / Performance",
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-masthead">
        <div className="section-shell py-4 sm:py-5">
          <div className="site-masthead-top hidden sm:flex">
            {topNotes.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <Link className="site-masthead-top-link" href="/contact">
              Management / Booking
            </Link>
          </div>

          <div className="site-masthead-brand">
            <p className="site-masthead-subtitle">Singer / Songwriter / Actress / Journalist</p>
            <Link className="site-masthead-wordmark" href="/" onClick={() => setMenuOpen(false)}>
              <span className="brand-script">Veronica</span>
              <span className="brand-didot">ADANE</span>
            </Link>
            <p className="site-masthead-note">
              Music, live performance, biography, and official artist storytelling.
            </p>
          </div>
        </div>
      </header>

      <div className="site-nav-wrap">
        <div className="section-shell">
          <div className="site-nav-bar">
            <div className="site-nav-mobile sm:hidden">
              <Link className="site-nav-mobile-brand" href="/" onClick={() => setMenuOpen(false)}>
                <span className="brand-script">Veronica</span>
                <span className="brand-didot">ADANE</span>
              </Link>

              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="site-nav-toggle"
                onClick={() => setMenuOpen((value) => !value)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

            <nav aria-label="Primary navigation" className="site-nav-list hidden sm:flex">
              {navigationItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={`site-nav-link ${active ? "is-active" : ""}`.trim()}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link className="site-nav-link site-nav-link--accent" href="/shop">
                Shop
              </Link>
            </nav>
          </div>

          {menuOpen && (
            <div className="site-nav-mobile-panel sm:hidden">
              <nav aria-label="Mobile navigation" className="site-nav-mobile-list">
                {navigationItems.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      className={`site-nav-mobile-link ${active ? "is-active" : ""}`.trim()}
                      href={item.href}
                      key={item.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <Link
                  className="site-nav-mobile-link site-nav-mobile-link--accent"
                  href="/shop"
                  onClick={() => setMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  className="site-nav-mobile-link"
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                >
                  Management / Booking
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
