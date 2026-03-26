import Link from "next/link";
import { navigationItems } from "@/lib/site-data";

const tickerItems = [
  "Official Veronica Adane digital house",
  "Addis Ababa heritage with global ambition",
  "Music, merch, tickets, press, and partnerships",
  "Built for a premium live and media presence",
];

const navDescriptions: Record<string, string> = {
  "/": "Landing",
  "/about": "Story",
  "/music": "Releases",
  "/events": "Tour",
  "/shop": "Drops",
  "/collaborations": "Brands",
  "/media": "Press",
  "/contact": "Direct",
};

const quickPanels = [
  {
    title: "Booking Open",
    detail: "Concerts, festivals, private events, and routing requests.",
  },
  {
    title: "Media Ready",
    detail: "Press kits, interviews, sponsor requests, and visibility assets.",
  },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 pt-3">
      <div className="section-shell space-y-3">
        <div className="chrome-shell rounded-full px-3 py-2 sm:px-4">
          <div className="flex items-center gap-4">
            <div className="ticker-wrap min-w-0 flex-1">
              <div className="ticker-track">
                {[...tickerItems, ...tickerItems].map((item, index) => (
                  <span className="ticker-item" key={`${item}-${index}`}>
                    <span className="ticker-dot" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-2">
              <span className="meta-chip">2026 Vision</span>
              <span className="meta-chip meta-chip--accent">Global African Artist</span>
            </div>
          </div>
        </div>

        <div className="header-stage">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <Link aria-label="Veronica Adane home" className="brand-monogram" href="/">
                VA
              </Link>

              <div className="space-y-3">
                <span className="brand-crest">Official Digital House</span>
                <div>
                  <Link
                    className="display-title text-4xl text-white transition hover:text-[var(--gold-soft)] sm:text-5xl"
                    href="/"
                  >
                    Veronica Adane
                  </Link>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">
                    Singer, songwriter, actress, journalist, and one of
                    Ethiopia&apos;s most visible cultural voices, framed here
                    with the presence of a global entertainment brand.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[24rem]">
              {quickPanels.map((panel) => (
                <div className="chrome-mini-card" key={panel.title}>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                    {panel.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/66">
                    {panel.detail}
                  </p>
                </div>
              ))}
              <Link className="primary-button sm:col-span-2" href="/contact">
                Booking, Press & Management
              </Link>
            </div>
          </div>

          <div className="mt-6 nav-rail" data-lenis-prevent="true">
            {navigationItems.map((item, index) => (
              <Link className="nav-rail-link" href={item.href} key={item.href}>
                <div>
                  <p className="nav-rail-label">{item.label}</p>
                  <p className="nav-rail-sub">{navDescriptions[item.href]}</p>
                </div>
                <span className="nav-rail-index">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
