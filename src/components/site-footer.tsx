import Link from "next/link";
import { YoutubeIcon, FacebookIcon, InstagramIcon } from "@/components/social-icons";
import { VeronicaWordmark } from "@/components/veronica-wordmark";
import type { CmsSiteSettings } from "@/lib/cms-types";

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
            <p className="site-footer-overline">Official Veronica Adane platform</p>
            <Link className="editorial-classic-wordmark editorial-classic-wordmark--centered" href="/">
              <VeronicaWordmark className="site-footer-wordmark" />
            </Link>
            <p className="editorial-brand-copy editorial-brand-copy--footer">
              {settings.description}
            </p>

            <div className="site-footer-cta-row">
              <div className="site-footer-social-row" aria-label="Social reach" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <a href="https://youtube.com/@veronica_adane?si=l5aWL2XoK4xlqGDk" target="_blank" rel="noreferrer" aria-label="YouTube" className="site-footer-social-chip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%' }}>
                  <YoutubeIcon width={20} height={20} />
                </a>
                <a href="https://www.facebook.com/share/19KHyCQSkL/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook" className="site-footer-social-chip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%' }}>
                  <FacebookIcon width={20} height={20} />
                </a>
                <a href="https://www.instagram.com/veronica_adane?igsh=djhzenc2NTZseWRn" target="_blank" rel="noreferrer" aria-label="Instagram" className="site-footer-social-chip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%' }}>
                  <InstagramIcon width={20} height={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="site-footer-divider" aria-hidden="true" />
        </div>

        <div className="editorial-footer-markline">
          <p>&copy; {year} Veronica Adane.</p>
          <p>{settings.copyrightTagline}</p>
          <p>Management &amp; Booking curated through the official site.</p>
          <p>Developed by <a href="https://madocreatives.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Mado Creatives</a> as web developer.</p>
        </div>
      </div>
    </footer>
  );
}
