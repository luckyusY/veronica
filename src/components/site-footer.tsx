import Link from "next/link";
import { ArrowUpRight, CalendarRange, Newspaper, Sparkles } from "lucide-react";
import { navigationItems } from "@/lib/site-data";

const footerSignals = [
  "Biography-led homepage",
  "Tour-ready structure",
  "Press-built trust",
  "Luxury commerce foundation",
];

const directLines = [
  {
    title: "Live Booking",
    detail: "Concerts, festivals, routing, and private performance inquiries.",
    href: "/contact",
    icon: CalendarRange,
  },
  {
    title: "Press Access",
    detail: "Interviews, official photography, biography requests, and coverage.",
    href: "/media",
    icon: Newspaper,
  },
  {
    title: "Brand Partnerships",
    detail: "Campaigns, ambassador work, event sponsorship, and launch activations.",
    href: "/collaborations",
    icon: Sparkles,
  },
];

export function SiteFooter() {
  return (
    <footer className="editorial-site-footer">
      <div className="section-shell py-14 sm:py-16">
        <div className="editorial-footer-lead">
          <div className="space-y-5">
            <p className="section-label">Closing chapter</p>
            <h2 className="display-title max-w-5xl text-4xl text-balance text-white sm:text-5xl lg:text-6xl">
              Built like an artist publication, not a generic entertainment template.
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-8 text-white/72 sm:text-base">
            The footer should finish the experience with calm authority: a
            direct path for management, partners, and press, and a final reminder
            that this platform is designed to carry Veronica Adane&apos;s story with
            clarity, scale, and cultural weight.
          </p>
        </div>

        <div className="editorial-footer-grid">
          <section className="editorial-footer-paper">
            <p className="section-label text-[#6b5336]">House notes</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {footerSignals.map((item) => (
                <span className="editorial-paper-stamp" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link className="primary-button" href="/contact">
                Contact management
              </Link>
              <Link className="secondary-button" href="/music">
                Enter music archive
              </Link>
            </div>
          </section>

          <section className="editorial-footer-dark">
            <p className="section-label">Navigate</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {navigationItems.map((item) => (
                <Link className="editorial-footer-link" href={item.href} key={item.href}>
                  <span>{item.label}</span>
                  <ArrowUpRight size={16} strokeWidth={1.7} />
                </Link>
              ))}
            </div>
          </section>

          <section className="editorial-footer-dark">
            <p className="section-label">Direct lines</p>
            <div className="mt-6 grid gap-3">
              {directLines.map((item) => {
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
          </section>
        </div>

        <div className="editorial-footer-base">
          <p>Veronica Adane official platform concept. Story, live performance, press, and commerce.</p>
          <p>Addis Ababa to global audiences.</p>
        </div>
      </div>
    </footer>
  );
}
