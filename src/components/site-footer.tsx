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
      <div className="section-shell py-10 sm:py-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div className="site-footer-social-row" aria-label="Social reach" style={{ display: 'flex', gap: '1rem' }}>
          <a href="https://youtube.com/@veronica_adane?si=l5aWL2XoK4xlqGDk" target="_blank" rel="noreferrer" aria-label="YouTube" className="site-footer-social-chip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem', borderRadius: '50%' }}>
            <YoutubeIcon width={22} height={22} />
          </a>
          <a href="https://www.facebook.com/share/19KHyCQSkL/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook" className="site-footer-social-chip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem', borderRadius: '50%' }}>
            <FacebookIcon width={22} height={22} />
          </a>
          <a href="https://www.instagram.com/veronica_adane?igsh=djhzenc2NTZseWRn" target="_blank" rel="noreferrer" aria-label="Instagram" className="site-footer-social-chip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem', borderRadius: '50%' }}>
            <InstagramIcon width={22} height={22} />
          </a>
        </div>

        <div className="editorial-footer-markline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 0, border: 'none', paddingTop: 0, opacity: 0.7 }}>
          <p>Developed by <a href="https://madocreatives.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Mado Creatives</a> as web developer.</p>
        </div>
      </div>
    </footer>
  );
}
