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

function workspaceLabel(pathname: string) {
  if (pathname === "/admin") return "Overview";
  return (
    pathname.replace("/admin/", "").split("/")[0]?.replace(/-/g, " ") ?? "Workspace"
  );
}

export function AdminLayoutShell({ children, user }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const label = workspaceLabel(pathname);

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
        <div className="grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="admin-sidebar">
            {/* Brand */}
            <Link className="admin-shell-brand-block" href="/admin">
              <div className="admin-brand">
                <div className="brand-monogram">VA</div>
                <div>
                  <span className="brand-crest">Control Room</span>
                  <p className="admin-shell-brand-title">Admin</p>
                </div>
              </div>
            </Link>

            {/* Workspace indicator */}
            <div className="admin-shell-workspace">
              <span className="admin-nav-icon">
                <Compass size={13} strokeWidth={1.8} />
              </span>
              <span className="admin-shell-workspace-label">{label}</span>
            </div>

            {/* Navigation */}
            {user ? <AdminSidebarNav role={user.role} /> : null}

            {/* Footer actions */}
            {user ? (
              <div className="admin-sidebar-footer">
                <div className="admin-sidebar-actions">
                  <Link className="admin-secondary-link" href="/">
                    <span>View site</span>
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
