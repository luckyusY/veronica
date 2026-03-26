import Link from "next/link";
import { navigationItems } from "@/lib/site-data";

const footerNotes = [
  "Official platform",
  "Biography / Music / Performance",
  "Press / Partnerships",
];

export function SiteFooter() {
  return (
    <footer className="editorial-site-footer">
      <div className="section-shell py-10 sm:py-12">
        <div className="editorial-footer-stage">
          <div className="editorial-classic-topline editorial-classic-topline--footer">
            {footerNotes.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>

          <div className="editorial-brand-stage editorial-brand-stage--footer">
            <p className="section-label editorial-brand-label">Veronica Adane</p>
            <Link
              className="editorial-classic-wordmark editorial-classic-wordmark--centered"
              href="/"
            >
              <span className="brand-script">Veronica</span>
              <span className="brand-didot">ADANE</span>
            </Link>
            <p className="editorial-brand-copy editorial-brand-copy--footer">
              Official platform for biography, releases, live performance, press, and partnerships.
            </p>
          </div>

          <div className="editorial-nav-shell editorial-nav-shell--footer">
            <nav aria-label="Footer navigation" className="editorial-nav-gridline">
              {navigationItems.map((item) => (
                <Link className="editorial-nav-button" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="editorial-nav-utility">
              <Link className="editorial-nav-button editorial-nav-button--accent" href="/shop">
                Shop
              </Link>
              <Link className="editorial-nav-button" href="/contact">
                Management
              </Link>
            </div>
          </div>
        </div>

        <div className="editorial-footer-markline">
          <p>Official Veronica Adane platform.</p>
          <p>Addis Ababa to global audiences.</p>
        </div>
      </div>
    </footer>
  );
}
