"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/site-data";

const topNotes = [
  "Official website",
  "Addis Ababa, Ethiopia",
  "Music, tour, press, partnerships",
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="editorial-site-header">
      <div className="section-shell py-5 sm:py-6">
        <div className="editorial-classic-topline">
          {topNotes.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>

        <div className="editorial-classic-brand">
          <p className="section-label">Singer / Songwriter / Actress / Journalist</p>
          <Link className="editorial-classic-wordmark" href="/">
            <span className="brand-script">Veronica</span>
            <span className="brand-didot">ADANE</span>
          </Link>
          <p className="editorial-classic-subtitle">
            A classic editorial home for biography, releases, live
            performance, and long-form cultural presence.
          </p>
        </div>
      </div>

      <div className="editorial-nav-dock">
        <div className="section-shell">
          <div className="editorial-classic-nav">
            <nav aria-label="Primary navigation" className="editorial-classic-nav-list">
              {navigationItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={`editorial-classic-nav-link ${active ? "is-active" : ""}`.trim()}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link className="editorial-classic-nav-cta" href="/contact">
              Management
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

