"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/site-data";

const topNotes = [
  "Official platform",
  "Addis Ababa, Ethiopia",
  "Music / Tour / Press / Partnerships",
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="editorial-site-header">
      <div className="section-shell py-5 sm:py-6">
        <div className="editorial-classic-topline editorial-classic-topline--header">
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
            <nav aria-label="Primary navigation" className="editorial-nav-gridline">
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

            <Link className="editorial-nav-button editorial-nav-button--accent" href="/contact">
              Management
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

