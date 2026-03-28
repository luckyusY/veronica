import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarRange,
  CloudUpload,
  Disc3,
  FileJson,
  LayoutDashboard,
  Newspaper,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
};

const adminNav = [
  { href: "/admin#overview", label: "Overview", icon: LayoutDashboard },
  { href: "/admin#content", label: "Page CMS", icon: FileJson },
  { href: "/admin#media-library", label: "Media Library", icon: CloudUpload },
  { href: "/admin#releases", label: "Release Floor", icon: Disc3 },
  { href: "/admin#events", label: "Event Routing", icon: CalendarRange },
  { href: "/admin#products", label: "Commerce", icon: ShoppingBag },
  { href: "/admin#inquiries", label: "Press & Booking", icon: Newspaper },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="admin-layout">
      <div className="section-shell py-6 sm:py-8 lg:py-10">
        <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="admin-sidebar">
            <div className="admin-brand">
              <div className="brand-monogram">VA</div>
              <div className="space-y-2">
                <span className="brand-crest">Control Room</span>
                <div>
                  <p className="display-title text-3xl text-white">Admin Suite</p>
                  <p className="mt-2 text-sm leading-7 text-white/66">
                    A premium workspace for content, media, releases, commerce,
                    events, and press operations.
                  </p>
                </div>
              </div>
            </div>

            <div className="luxury-divider my-5" />

            <nav className="space-y-2" aria-label="Admin">
              {adminNav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link className="admin-nav-link" href={item.href} key={item.href}>
                    <span className="admin-nav-icon">
                      <Icon size={16} strokeWidth={1.8} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="luxury-divider my-5" />

            <div className="space-y-3">
              <div className="admin-surface">
                <p className="section-label">Workspace Standard</p>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  Editorial on the public side, operational on the inside,
                  with content, media, and live business data in one place.
                </p>
              </div>

              <div className="admin-surface">
                <div className="flex items-start gap-3">
                  <span className="admin-nav-icon">
                    <Sparkles size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                      Brand Integrity
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/68">
                      Keep release art, press copy, partnerships, and commerce
                      consistent across every page.
                    </p>
                  </div>
                </div>
              </div>

              <div className="admin-surface">
                <div className="flex items-start gap-3">
                  <span className="admin-nav-icon">
                    <Users size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                      Team Access
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/68">
                      Booking, management, content, and media teams can all work
                      from one dashboard standard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="primary-button" href="/">
                Return To Site
              </Link>
            </div>
          </aside>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
