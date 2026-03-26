import Link from "next/link";
import { navigationItems } from "@/lib/site-data";

const footerStats = [
  { value: "Music", label: "Release shelves and visual launch moments." },
  { value: "Tour", label: "City pages, premium ticketing, and routing flow." },
  { value: "Press", label: "Editorial assets, milestones, and media trust." },
  { value: "Brand", label: "Partnership decks, campaigns, and sponsor access." },
];

const directLines = [
  {
    title: "Live Booking Desk",
    detail: "Concerts, festivals, premium private events, and international routing.",
  },
  {
    title: "Press & Interviews",
    detail: "Editorial requests, red carpet appearances, media assets, and speaking moments.",
  },
  {
    title: "Brand Partnerships",
    detail: "Ambassador campaigns, launch activations, and sponsor-led storytelling.",
  },
];

const platformCodes = [
  "Azmari heritage translated into a modern luxury digital identity.",
  "A visual system built for releases, diaspora energy, and cinematic storytelling.",
  "Commerce, press, tour, and fan connection held inside one signature brand house.",
];

const footerTicker = [
  "Veronica Adane official platform",
  "Heritage. Performance. Global African vision.",
  "Music x Tour x Press x Partnerships",
  "This is not the end. This is only the beginning.",
];

export function SiteFooter() {
  return (
    <footer className="section-shell mt-20 pb-10">
      <div className="footer-stage">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="footer-grid-card">
            <p className="section-label text-beam">Veronica Adane</p>
            <h2 className="display-title mt-4 text-4xl text-balance text-white sm:text-5xl">
              A closing section that feels like a final stage entrance, not an afterthought.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/68 sm:text-base">
              The footer is designed as Veronica&apos;s digital signature:
              part manifesto, part routing deck, part brand directory. It
              carries the same premium tension as the homepage instead of
              collapsing into generic links.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="primary-button" href="/contact">
                Open Direct Contact
              </Link>
              <Link className="secondary-button" href="/music">
                Enter Release Space
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {footerStats.map((item) => (
              <div className="footer-stat" key={item.value}>
                <p className="display-title text-3xl text-[var(--gold-soft)]">
                  {item.value}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/66">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.95fr_0.95fr]">
          <div className="footer-grid-card">
            <p className="section-label">Navigate The House</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {navigationItems.map((item, index) => (
                <Link className="footer-link-card" href={item.href} key={item.href}>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/88">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/46">
                      Signature Destination
                    </p>
                  </div>
                  <span className="footer-link-index">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-grid-card">
            <p className="section-label">Direct Lines</p>
            <div className="mt-6 space-y-3">
              {directLines.map((item) => (
                <div className="footer-link-card" key={item.title}>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--gold-soft)]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/66">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-grid-card">
            <p className="section-label">Platform Code</p>
            <div className="mt-6 space-y-3">
              {platformCodes.map((item, index) => (
                <div className="footer-link-card" key={item}>
                  <div className="flex items-start gap-4">
                    <span className="footer-link-index">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-7 text-white/66">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chrome-shell mt-4 rounded-[1.5rem] px-4 py-4 sm:px-5">
          <div className="ticker-wrap">
            <div className="ticker-track">
              {[...footerTicker, ...footerTicker].map((item, index) => (
                <span className="ticker-item" key={`${item}-${index}`}>
                  <span className="ticker-dot" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
