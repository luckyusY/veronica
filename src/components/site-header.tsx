import Link from "next/link";
import { navigationItems } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-black/60 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-6 py-4">
        <Link className="group flex flex-col" href="/">
          <span className="text-beam text-xs uppercase tracking-[0.36em]">
            Official Platform
          </span>
          <span className="font-[family-name:var(--font-cormorant)] text-xl tracking-[0.08em] text-white transition group-hover:text-[var(--accent)]">
            Veronica Adane
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-white/72 lg:flex">
          {navigationItems.map((item) => (
            <Link
              className="transition hover:text-[var(--gold-soft)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="primary-button hidden sm:inline-flex" href="/contact">
          Booking & Management
        </Link>
      </div>
    </header>
  );
}
