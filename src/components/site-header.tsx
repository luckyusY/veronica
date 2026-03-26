"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CalendarRange, Newspaper, Sparkles } from "lucide-react";
import { navigationItems } from "@/lib/site-data";

const navDescriptions: Record<string, string> = {
  "/": "Home",
  "/about": "Biography",
  "/music": "Archive",
  "/events": "Tour",
  "/shop": "Objects",
  "/collaborations": "Partners",
  "/media": "Press",
  "/contact": "Direct",
};

const mastheadSignals = [
  "Official digital house",
  "Addis Ababa rooted",
  "Global stage ambition",
];

const directAccess = [
  {
    title: "Live Booking",
    detail: "Concerts, festivals, private events, and routing requests.",
    href: "/contact",
    icon: CalendarRange,
  },
  {
    title: "Media Desk",
    detail: "Press access, interview requests, campaign assets, and approvals.",
    href: "/media",
    icon: Newspaper,
  },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="editorial-site-header">
      <div className="section-shell py-5 sm:py-6">
        <div className="editorial-headnote">
          <p>Official digital archive</p>
          <p>Music, tour, press, and partnerships</p>
        </div>

        <div className="editorial-masthead">
          <div className="space-y-5">
            <p className="section-label">Veronica Adane</p>
            <Link className="editorial-wordmark" href="/">
              Veronica Adane
            </Link>
            <p className="editorial-masthead-copy">
              An editorial digital house for biography, releases, live
              performance, and the long arc of cultural legacy.
            </p>

            <div className="flex flex-wrap gap-2">
              {mastheadSignals.map((item) => (
                <span className="editorial-stamp" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="editorial-masthead-rail">
            <div className="editorial-masthead-card">
              <p className="section-label">Current Direction</p>
              <h2 className="display-title mt-4 text-3xl text-white sm:text-4xl">
                Minimal, luxurious, image-led, and sharply contrasted.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/72 sm:text-base">
                The public site is being shaped like an artist publication:
                clean typography, deliberate image pacing, and less interface
                noise between the viewer and Veronica&apos;s story.
              </p>
              <Link className="editorial-inline-link mt-5" href="/about">
                Read biography
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </Link>
            </div>

            <div className="grid gap-3">
              {directAccess.map((item) => {
                const Icon = item.icon;

                return (
                  <Link className="editorial-direct-card" href={item.href} key={item.title}>
                    <div className="flex items-center gap-3">
                      <span className="editorial-direct-icon">
                        <Icon size={15} strokeWidth={1.8} />
                      </span>
                      <p className="text-xs uppercase tracking-[0.26em] text-[var(--gold-soft)]">
                        {item.title}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/66">
                      {item.detail}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="editorial-nav-dock">
        <div className="section-shell">
          <div className="editorial-nav-bar">
            <Link aria-label="Veronica Adane home" className="editorial-nav-mark" href="/">
              <span>VA</span>
              <Sparkles size={14} strokeWidth={1.7} />
            </Link>

            <nav aria-label="Primary navigation" className="editorial-nav-grid">
              {navigationItems.map((item, index) => {
                const active =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={`editorial-nav-link ${active ? "is-active" : ""}`.trim()}
                    href={item.href}
                    key={item.href}
                  >
                    <span className="editorial-nav-index">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span>{navDescriptions[item.href] ?? item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <Link className="editorial-nav-cta" href="/contact">
              Management
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
