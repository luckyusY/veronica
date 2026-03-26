import Link from "next/link";
import { navigationItems } from "@/lib/site-data";

const directLinks = [
  { href: "/contact", label: "Live Booking" },
  { href: "/media", label: "Press Access" },
  { href: "/collaborations", label: "Brand Partnerships" },
];

const houseNotes = [
  "Biography-led homepage",
  "High-contrast editorial system",
  "Tour, press, and commerce ready",
];

export function SiteFooter() {
  return (
    <footer className="editorial-site-footer">
      <div className="section-shell py-14 sm:py-16">
        <div className="editorial-classic-footer-brand">
          <p className="section-label">Veronica Adane</p>
          <Link className="editorial-classic-footer-wordmark" href="/">
            Veronica Adane
          </Link>
          <p className="editorial-classic-footer-copy">
            Built as a classic artist publication: clear, refined, and prepared
            to hold biography, music, live performance, press, and long-term
            brand growth with dignity.
          </p>
        </div>

        <div className="editorial-classic-footer-grid">
          <section className="editorial-classic-footer-column">
            <p className="section-label">Navigate</p>
            <div className="mt-5 grid gap-3">
              {navigationItems.map((item) => (
                <Link className="editorial-classic-footer-link" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="editorial-classic-footer-column">
            <p className="section-label">Direct</p>
            <div className="mt-5 grid gap-3">
              {directLinks.map((item) => (
                <Link className="editorial-classic-footer-link" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="editorial-classic-footer-column">
            <p className="section-label">House Notes</p>
            <div className="mt-5 grid gap-3">
              {houseNotes.map((item) => (
                <p className="editorial-classic-footer-note" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </section>
        </div>

        <div className="editorial-classic-footer-base">
          <p>Official platform concept for Veronica Adane.</p>
          <p>Addis Ababa to global audiences.</p>
        </div>
      </div>
    </footer>
  );
}
