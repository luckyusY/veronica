import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Users } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin-sidebar-nav";

export const metadata: Metadata = {
  title: "Admin",
};

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
                    A structured publishing and operations workspace for pages, media,
                    releases, events, commerce, and inquiries.
                  </p>
                </div>
              </div>
            </div>

            <div className="luxury-divider my-5" />

            <AdminSidebarNav />

            <div className="luxury-divider my-5" />

            <div className="space-y-3">
              <div className="admin-surface">
                <p className="section-label">Workspace Standard</p>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  Keep publishing tasks separate from day-to-day operations so the
                  team can manage the site faster and with less clutter.
                </p>
              </div>

              <div className="admin-surface">
                <div className="flex items-start gap-3">
                  <span className="admin-nav-icon">
                    <Sparkles size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                      Publishing Flow
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/68">
                      Update page content, global settings, and media from dedicated
                      screens instead of one oversized dashboard.
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
                      Booking, management, content, and media teams can move through
                      their own sections without stepping on each other.
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
