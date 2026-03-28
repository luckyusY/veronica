import Link from "next/link";
import type { CmsSiteSettings } from "@/lib/cms-types";
import { navigationItems } from "@/lib/site-data";

type SiteFooterProps = {
  settings: CmsSiteSettings["footer"];
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="editorial-site-footer">
      <div className="section-shell py-10 sm:py-12">
        <div className="editorial-footer-stage">
          <div className="editorial-classic-topline editorial-classic-topline--footer">
            {settings.notes.map((item) => (
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
              {settings.description}
            </p>

            <div className="site-footer-cta-row">
              <div className="site-footer-social-row" aria-label="Social reach">
                {settings.socialSignals.map((item) => (
                  <span className="site-footer-social-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>

              <div className="site-footer-utility-row">
                {settings.utilityLinks.map((item) => (
                  <Link className="site-footer-utility-link" href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                ))}
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
          <p>{settings.copyrightTagline}</p>
        </div>
      </div>
    </footer>
  );
}
