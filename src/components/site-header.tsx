import Link from "next/link";
import { CalendarRange, MicVocal, Newspaper, Sparkles } from "lucide-react";
import { navigationItems } from "@/lib/site-data";

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
    title: "Booking Concierge",
    detail: "Concerts, festival offers, private performances, and routing requests.",
    icon: CalendarRange,
  },
  {
    title: "Press Concierge",
    detail: "Press kits, editorial requests, sponsor visibility, and media assets.",
    icon: Newspaper,
  },
];

const brandSignals = ["Singer", "Songwriter", "Actress", "Journalist"];

export function SiteHeader() {
  return (
    <>
      <header className="pt-4">
        <div className="section-shell">
          <div className="header-stage">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Link aria-label="Veronica Adane home" className="brand-monogram" href="/">
                  VA
                </Link>

                <div className="space-y-3">
                  <span className="brand-crest">
                    <Sparkles size={14} strokeWidth={1.8} />
                    Official Digital House
                  </span>
                  <div>
                    <Link
                      className="display-title text-4xl text-white transition hover:text-[var(--gold-soft)] sm:text-5xl"
                      href="/"
                    >
                      Veronica Adane
                    </Link>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">
                      A luxury digital house for music, live performance, press,
                      and partnerships shaped with stronger contrast, quieter
                      details, and a more elegant rhythm.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {brandSignals.map((item) => (
                        <span className="meta-chip" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {quickPanels.map((panel) => {
                  const Icon = panel.icon;

                  return (
                  <div className="chrome-mini-card" key={panel.title}>
                    <div className="flex items-center gap-3">
                      <span className="admin-nav-icon">
                        <Icon size={16} strokeWidth={1.8} />
                      </span>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                        {panel.title}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/66">
                      {panel.detail}
                    </p>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="section-shell sticky top-3 z-50 mt-4">
        <div className="chrome-shell rounded-[1.6rem] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 xl:w-[16rem]">
              <p className="text-beam text-xs uppercase tracking-[0.32em]">
                Navigation Dock
              </p>
              <Link
                className="display-title mt-2 block text-2xl text-white transition hover:text-[var(--gold-soft)]"
                href="/"
              >
                Veronica Adane
              </Link>
              <div className="mt-3 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-white/52">
                <MicVocal size={14} strokeWidth={1.8} />
                Global Artist Platform
              </div>
            </div>

            <nav aria-label="Primary" className="nav-rail flex-1" data-lenis-prevent="true">
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
            </nav>

            <Link className="primary-button xl:ml-4" href="/contact">
              Booking Desk
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
