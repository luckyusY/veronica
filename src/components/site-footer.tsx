import Link from "next/link";
import Image from "next/image";
import { YoutubeIcon, FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/social-icons";
import { VeronicaWordmark } from "@/components/veronica-wordmark";
import type { CmsSiteSettings } from "@/lib/cms-types";

type SiteFooterProps = {
  settings: CmsSiteSettings["footer"];
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="editorial-site-footer">
      <div className="section-shell py-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        
        <div className="editorial-brand-stage editorial-brand-stage--footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem' }}>
          <p className="site-footer-overline" style={{ marginBottom: 0 }}>Official Veronica Adane platform</p>
          <Link className="editorial-classic-wordmark editorial-classic-wordmark--centered" href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0.04) 70%, transparent 100%)',
              border: '1px solid rgba(201,169,110,0.22)',
              boxShadow: '0 0 24px rgba(201,169,110,0.15)'
            }}>
              <Image src="/logo.png" alt="VA Logo" width={54} height={54} style={{ objectFit: 'contain' }} />
            </span>
            <VeronicaWordmark className="site-footer-wordmark" />
          </Link>
          <p className="editorial-brand-copy editorial-brand-copy--footer" style={{ maxWidth: '340px', margin: 0 }}>
            {settings.description}
          </p>
        </div>

        <div className="site-footer-social-row" aria-label="Social reach" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="https://youtube.com/@veronica_adane?si=l5aWL2XoK4xlqGDk" target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube" className="header-social-icon" style={{ width: '2.4rem', height: '2.4rem' }}>
            <YoutubeIcon width={20} height={20} />
          </a>
          <a href="https://www.tiktok.com/@veronicaadane?_r=1&_t=ZS-95Kt36szYxt" target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok" className="header-social-icon" style={{ width: '2.4rem', height: '2.4rem' }}>
            <TikTokIcon width={18} height={18} />
          </a>
          <a href="https://www.facebook.com/share/19KHyCQSkL/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook" className="header-social-icon" style={{ width: '2.4rem', height: '2.4rem' }}>
            <FacebookIcon width={20} height={20} />
          </a>
          <a href="https://www.instagram.com/veronica_adane?igsh=djhzenc2NTZseWRn" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="header-social-icon" style={{ width: '2.4rem', height: '2.4rem' }}>
            <InstagramIcon width={20} height={20} />
          </a>
        </div>

        <div style={{ opacity: 0.55, fontSize: '0.6rem', letterSpacing: '0.08em', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>Developed by <a href="https://madocreatives.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Mado Creatives</a> as web developer.</p>
        </div>
      </div>
    </footer>
  );
}
