import Link from "next/link";
import { ArrowUpRight, CalendarRange, Newspaper, Sparkles } from "lucide-react";
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
    detail: "Concerts, festivals, private events, and international routing.",
    icon: CalendarRange,
  },
  {
    title: "Press & Interviews",
    detail: "Editorial requests, red carpet appearances, and media assets.",
    icon: Newspaper,
  },
  {
    title: "Brand Partnerships",
    detail: "Ambassador campaigns, launch activations, and sponsor storytelling.",
    icon: Sparkles,
  },
];

const footerSignals = [
  "Heritage",
  "Performance",
  "Press",
  "Tour",
  "Partnerships",
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/8 bg-[#0B0F14]">
      <div className="section-shell py-12 sm:py-14">
        <div className="footer-stage">
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="footer-grid-card">
              <p className="section-label text-beam">Veronica Adane</p>
              <h2 className="display-title mt-4 text-4xl text-balance text-white sm:text-5xl">
                Built for music, tour, commerce, and long-term cultural legacy.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-white/70 sm:text-base">
                The closing section should feel calm, premium, and decisive.
                It gives management, press, and partners a direct line into the
                brand while keeping the visual language elegant and high-contrast.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="primary-button" href="/contact">
                  Contact Management
                </Link>
                <Link className="secondary-button" href="/music">
                  Explore Releases
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {footerSignals.map((item) => (
                  <span className="meta-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {footerStats.map((item) => (
                <div className="footer-stat" key={item.value}>
                  <p className="display-title text-3xl text-[var(--gold-soft)]">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
            <div className="footer-grid-card">
              <p className="section-label">Site Map</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {navigationItems.map((item, index) => (
                  <Link className="footer-link-card" href={item.href} key={item.href}>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/88">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/48">
                        Main destination
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
                {directLines.map((item) => {
                  const Icon = item.icon;

                  return (
                  <div className="footer-link-card" key={item.title}>
                    <div className="flex items-start gap-3">
                      <span className="admin-nav-icon">
                        <Icon size={16} strokeWidth={1.8} />
                      </span>
                      <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--gold-soft)]">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/68">
                        {item.detail}
                      </p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} strokeWidth={1.8} className="text-white/38" />
                  </div>
                  );
                })}
              </div>
            </div>

            <div className="footer-grid-card">
              <p className="section-label">Closing Note</p>
              <div className="mt-6 rounded-[1.25rem] border border-white/8 bg-[#18202A] px-5 py-6">
                <p className="display-title text-3xl text-white sm:text-4xl">
                  Heritage. Elegance. Presence.
                </p>
                <p className="display-title mt-2 text-3xl text-[var(--gold-soft)] sm:text-4xl">
                  This is only the beginning.
                </p>
                <p className="mt-4 text-sm leading-7 text-white/68">
                  Veronica Adane&apos;s digital platform should feel prepared for
                  global releases, sold-out rooms, premium partnerships, and a
                  lasting archive of milestones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
