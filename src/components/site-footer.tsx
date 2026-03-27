import Link from "next/link";
import { navigationItems } from "@/lib/site-data";

type FooterIconProps = {
  className?: string;
};

function InstagramIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
    >
      <rect height="16" rx="5" stroke="currentColor" strokeWidth="1.5" width="16" x="4" y="4" />
      <circle cx="12" cy="12" r="3.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.35" cy="6.65" fill="currentColor" r="1.1" />
    </svg>
  );
}

function TikTokIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
    >
      <path
        d="M14 4v8.35a4.35 4.35 0 1 1-3.15-4.18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M14 4c.55 1.55 1.87 3.52 4 4.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function FacebookIcon({ className }: FooterIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
    >
      <path
        d="M13.2 20v-7.1h2.4l.4-2.9h-2.8V8.1c0-.82.23-1.38 1.4-1.38H16V4.14c-.23-.03-1-.1-1.9-.1-1.88 0-3.16 1.15-3.16 3.25V10H8.5v2.9h2.44V20"
        fill="currentColor"
      />
    </svg>
  );
}

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "TikTok", href: "https://tiktok.com", Icon: TikTokIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
] as const;

const footerColumns = [
  {
    heading: "Profile",
    items: navigationItems.slice(0, 3),
  },
  {
    heading: "Experience",
    items: navigationItems.slice(3, 6),
  },
  {
    heading: "Access",
    items: navigationItems.slice(6),
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="editorial-site-footer">
      <div className="section-shell site-footer-curtain">
        <div className="site-footer-logotype-wrap">
          <Link className="site-footer-logotype" href="/">
            VERONICA ADANE
          </Link>
        </div>

        <div aria-hidden="true" className="site-footer-gold-rule" />

        <div className="site-footer-nav-columns">
          {footerColumns.map((column) => (
            <div className="site-footer-nav-column" key={column.heading}>
              <p className="site-footer-nav-heading">{column.heading}</p>
              <nav className="site-footer-nav-list">
                {column.items.map((item) => (
                  <Link className="site-footer-nav-link" href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="site-footer-gold-rule" />

        <div className="site-footer-meta-row">
          <div aria-label="Social media" className="site-footer-social-icons">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                aria-label={label}
                className="site-footer-social-link"
                href={href}
                key={label}
                rel="noreferrer"
                target="_blank"
              >
                <Icon className="site-footer-social-svg" />
              </a>
            ))}
          </div>

          <p className="site-footer-copyright">&copy; {year} Veronica Adane</p>
        </div>

        <div aria-hidden="true" className="site-footer-gold-rule" />

        <p className="site-footer-management">
          Management &amp; Booking — management@veronicaadane.com
        </p>
      </div>
    </footer>
  );
}
