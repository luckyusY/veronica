import Link from "next/link";
import { navigationItems } from "@/lib/site-data";

const footerLinks = [
  ...navigationItems.filter((item) => item.href !== "/collaborations").slice(0, 5),
  { href: "/collaborations", label: "Partnerships" },
];

export function SiteFooter() {
  return (
    <footer className="editorial-site-footer">
      <div className="section-shell py-8 sm:py-10">
        <div className="editorial-mini-footer">
          <Link className="editorial-mini-footer-brand" href="/">
            <span className="brand-script">Veronica</span>
            <span className="brand-didot">ADANE</span>
          </Link>
          <p className="editorial-mini-footer-copy">
            Official platform for biography, music, live performance, press, and partnerships.
          </p>
          <nav aria-label="Footer navigation" className="editorial-mini-footer-nav">
            {footerLinks.map((item) => (
              <Link className="editorial-mini-footer-link" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="editorial-mini-footer-base">
          <p>Addis Ababa, Ethiopia</p>
          <p>Bookings and press via contact</p>
        </div>
      </div>
    </footer>
  );
}
