"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Compass } from "lucide-react";
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
  const workspaceLabel =
    pathname === "/admin"
      ? "Overview"
      : pathname.replace("/admin/", "").split("/")[0]?.replace(/-/g, " ") ?? "Workspace";

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
            <Link className="admin-shell-brand-block" href="/admin">
              <div className="admin-brand">
                <div className="brand-monogram">VA</div>
                <div className="space-y-2">
                  <span className="brand-crest">Control Room</span>
                  <div>
                    <p className="display-title text-3xl text-white">Admin Suite</p>
                    <p className="mt-2 text-sm leading-7 text-white/66">
                      Calm publishing and operations for Veronica Adane&apos;s team.
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="admin-shell-meta">
              <div className="admin-shell-pill-row">
                <span className="admin-shell-pill">Private</span>
                <span className="admin-shell-pill">Role-aware</span>
              </div>
              <div className="admin-shell-context-card">
                <div className="admin-shell-context-topline">
                  <span className="admin-nav-icon">
                    <Compass size={15} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="section-label">Current workspace</p>
                    <p className="admin-shell-context-title">{workspaceLabel}</p>
                  </div>
                </div>
                <p className="admin-shell-context-copy">
                  Keep publishing, media, and operations in separate lanes so
                  the team can move quickly without losing clarity.
                </p>
              </div>
            </div>

            {user ? <AdminSidebarNav role={user.role} /> : null}

            {user ? (
              <div className="mt-5 space-y-3">
                <div className="admin-sidebar-actions">
                  <Link className="admin-secondary-link" href="/">
                    <span>Return to site</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <Link className="admin-secondary-link" href="/admin/content">
                    Open CMS
                  </Link>
                </div>

                <AdminSessionFooter
                  email={user.email}
                  name={user.name}
                  role={user.role}
                />
              </div>
            ) : null}
          </aside>

          <div className="admin-main-column">{children}</div>
        </div>
      </div>
    </main>
  );
}
