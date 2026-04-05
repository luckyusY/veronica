"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
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
      <div className="admin-shell-grid section-shell py-6 lg:py-8">
        <aside className="admin-sidebar">
          <Link className="admin-brand-row" href="/admin">
            <div className="brand-monogram">VA</div>
            <div>
              <p className="admin-brand-name">Admin</p>
              <p className="admin-brand-sub">Veronica Adane</p>
            </div>
          </Link>

          <div className="admin-sidebar-divider" />

          {user ? <AdminSidebarNav role={user.role} /> : null}

          <div className="admin-sidebar-bottom">
            <Link className="admin-site-link" href="/" target="_blank">
              <span>View site</span>
              <ArrowUpRight size={13} />
            </Link>
            {user ? (
              <AdminSessionFooter
                email={user.email}
                name={user.name}
                role={user.role}
              />
            ) : null}
          </div>
        </aside>

        <div className="admin-main-column">{children}</div>
      </div>
    </main>
  );
}
