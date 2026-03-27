import Link from "next/link";
import { navigationItems } from "@/lib/site-data";

const footerNotes = [
  "Official platform",
  "Biography / Music / Performance",
  "Press / Partnerships",
];

const socialSignals = ["Instagram 800K+", "TikTok 1.8M+", "Facebook 500K+"];

export function SiteFooter() {
  const year = new Date().getFullYear();

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

            <div className="site-footer-cta-row">
              <div className="site-footer-social-row" aria-label="Social reach">
                {socialSignals.map((item) => (
                  <span className="site-footer-social-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>

              <div className="site-footer-utility-row">
                <Link className="site-footer-utility-link" href="/contact">
                  Bookings
                </Link>
                <Link className="site-footer-utility-link" href="/media">
                  Press Kit
                </Link>
                <Link className="site-footer-utility-link" href="/events">
                  Event Inquiries
                </Link>
              </div>
            </div>
          </div>

          <div className="site-footer-divider" aria-hidden="true" />

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
          <p>&copy; {year} Veronica Adane.</p>
          <p>Addis Ababa to global audiences.</p>
        </div>
      </div>
    </footer>
  );
}
