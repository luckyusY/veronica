import Link from "next/link";
import { navigationItems } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="section-shell mt-16 pb-10">
      <div className="panel rounded-[2rem] px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="section-label text-beam">Veronica Adane</p>
            <p className="display-title text-3xl sm:text-4xl">
              Heritage. Performance. Global African vision.
            </p>
            <p className="text-sm leading-7 text-white/65 sm:text-base">
              This starter build is structured for music releases, events,
              merch, media, and future membership or mobile app expansion.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-white/65">
            {navigationItems.map((item) => (
              <Link
                className="rounded-full border border-white/10 px-4 py-2 transition hover:border-[var(--accent)] hover:text-[var(--gold-soft)]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
