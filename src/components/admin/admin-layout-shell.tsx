"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Users } from "lucide-react";
import { type AdminRole } from "@/lib/admin-access";
import { AdminRouteNotice } from "@/components/admin/admin-route-notice";
import { AdminSessionFooter } from "@/components/admin/admin-session-footer";
import { AdminSidebarNav } from "@/components/admin-sidebar-nav";

type AdminLayoutShellProps = {
  children: ReactNode;
  user:
    | {
        email: string;
        name: string;
        role: AdminRole;
      }
    | null;
};

export function AdminLayoutShell({ children, user }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <main className="admin-layout min-h-screen">
        <AdminRouteNotice />
        <div className="section-shell flex min-h-screen items-center justify-center py-8">
          <div className="w-full max-w-5xl">{children}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-layout">
      <AdminRouteNotice />

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
                    A structured publishing and operations workspace for pages,
                    media, releases, events, commerce, and inquiries.
                  </p>
                </div>
                <div className="admin-shell-pill-row">
                  <span className="admin-shell-pill">Private workspace</span>
                  <span className="admin-shell-pill">Role-aware access</span>
                </div>
              </div>
            </div>

            <div className="luxury-divider my-5" />

            {user ? <AdminSidebarNav role={user.role} /> : null}

            <div className="luxury-divider my-5" />

            <div className="space-y-3">
              <div className="admin-sidebar-panel">
                <p className="section-label">Workspace Standard</p>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  Keep publishing tasks separate from day-to-day operations so
                  the team can manage the site faster and with less clutter.
                </p>
              </div>

              <div className="admin-sidebar-panel">
                <div className="flex items-start gap-3">
                  <span className="admin-nav-icon">
                    <Sparkles size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                      Publishing Flow
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/68">
                      Update page content, global settings, and media from
                      dedicated screens instead of one oversized dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="admin-sidebar-panel">
                <div className="flex items-start gap-3">
                  <span className="admin-nav-icon">
                    <Users size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                      Team Access
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/68">
                      Booking, management, content, and media teams can move
                      through their own sections without stepping on each other.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {user ? (
              <div className="mt-5 space-y-3">
                <AdminSessionFooter
                  email={user.email}
                  name={user.name}
                  role={user.role}
                />

                <div className="admin-sidebar-actions">
                  <Link className="admin-secondary-link" href="/">
                    Return To Site
                  </Link>
                  <Link className="admin-secondary-link" href="/admin/content">
                    Open CMS
                  </Link>
                </div>
              </div>
            ) : null}
          </aside>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
