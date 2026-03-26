"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/site-data";
import { Menu, X } from "lucide-react";

const topNotes = [
  "Official platform",
  "Addis Ababa, Ethiopia",
  "Music / Tour / Press / Partnerships",
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="editorial-site-header">
      <div className="section-shell py-5 sm:py-6">
        <div className="editorial-classic-topline editorial-classic-topline--header hidden sm:flex">
          {topNotes.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>

        <div className="editorial-brand-stage">
          <p className="section-label editorial-brand-label">
            Singer / Songwriter / Actress / Journalist
          </p>
          <Link className="editorial-classic-wordmark editorial-classic-wordmark--centered" href="/">
            <span className="brand-script">Veronica</span>
            <span className="brand-didot">ADANE</span>
          </Link>
          <p className="editorial-brand-copy">
            A classic editorial home for biography, releases, live
            performance, and long-form cultural presence.
          </p>
        </div>
      </div>

      <div className="editorial-nav-dock">
        <div className="section-shell py-4">
          <div className="editorial-nav-shell">
            <div className="flex items-center justify-between gap-3 sm:hidden">
              <Link
                aria-label="Veronica home"
                className="brand-monogram"
                href="/"
                onClick={() => setMenuOpen(false)}
              >
                V
              </Link>
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="editorial-nav-toggle"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

            <nav
              aria-label="Primary navigation"
              className="editorial-nav-gridline hidden sm:grid"
            >
              {navigationItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={`editorial-nav-button ${active ? "is-active" : ""}`.trim()}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="editorial-nav-utility hidden sm:flex">
              <Link className="editorial-nav-button editorial-nav-button--accent" href="/shop">
                Shop
              </Link>
              <Link className="editorial-nav-button" href="/contact">
                Management
              </Link>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[70] sm:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute inset-y-3 left-3 right-3 overflow-auto chrome-shell rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <Link
                aria-label="Veronica home"
                className="brand-monogram"
                href="/"
                onClick={() => setMenuOpen(false)}
              >
                V
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                className="editorial-nav-toggle"
                onClick={() => setMenuOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-6 grid gap-3" aria-label="Mobile primary navigation">
              {navigationItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={`editorial-nav-button w-full ${active ? "is-active" : ""}`.trim()}
                    href={item.href}
                    key={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-2 grid gap-3">
                <Link
                  className="editorial-nav-button editorial-nav-button--accent w-full"
                  href="/shop"
                  onClick={() => setMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  className="editorial-nav-button w-full"
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                >
                  Management
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
