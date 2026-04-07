"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  CalendarClock,
  CloudUpload,
  Disc3,
  FileJson,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { adminRoleLabels, type AdminRole } from "@/lib/admin-access";
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

type AdminShellContext = {
  eyebrow: string;
  icon: LucideIcon;
  pill: string;
  title: string;
  copy: string;
};

function getAdminShellContext(pathname: string): AdminShellContext {
  if (pathname.startsWith("/admin/content")) {
    return {
      eyebrow: "Publishing",
      icon: FileJson,
      pill: "Page Content",
      title: "Editorial page control",
      copy:
        "Move route by route, review structured content, and publish public pages with less noise.",
    };
  }

  if (pathname.startsWith("/admin/settings")) {
    return {
      eyebrow: "System Copy",
      icon: Settings2,
      pill: "Settings",
      title: "Shared site settings",
      copy:
        "Keep header labels, footer notes, and brand signals aligned from one quiet settings layer.",
    };
  }

  if (pathname.startsWith("/admin/media")) {
    return {
      eyebrow: "Library",
      icon: CloudUpload,
      pill: "Media",
      title: "Asset library and usage",
      copy:
        "Upload, search, and audit image and video assets before they reach any published surface.",
    };
  }

  if (pathname.startsWith("/admin/releases")) {
    return {
      eyebrow: "Operations",
      icon: Disc3,
      pill: "Releases",
      title: "Release planning desk",
      copy:
        "Track rollout timing, links, and campaign notes with the same restraint as the public brand.",
    };
  }

  if (pathname.startsWith("/admin/events")) {
    return {
      eyebrow: "Operations",
      icon: CalendarClock,
      pill: "Events",
      title: "Live routing workspace",
      copy:
        "Keep venue, timing, and booking details organized so touring decisions stay clear and current.",
    };
  }

  if (pathname.startsWith("/admin/products")) {
    return {
      eyebrow: "Commerce",
      icon: Package,
      pill: "Products",
      title: "Product release queue",
      copy:
        "Manage storefront items, highlights, and links with a single catalog view for the team.",
    };
  }

  if (pathname.startsWith("/admin/inquiries")) {
    return {
      eyebrow: "Communications",
      icon: MessageSquareQuote,
      pill: "Inquiries",
      title: "Conversation intake",
      copy:
        "Review booking, press, and brand requests in a streamlined queue built for fast triage.",
    };
  }

  return {
    eyebrow: "Control Room",
    icon: LayoutDashboard,
    pill: "Overview",
    title: "Admin overview",
    copy:
      "Scan publishing health, content volume, and the next operational move from one focused dashboard.",
  };
}

export function AdminLayoutShell({ children, user }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const context = getAdminShellContext(pathname);
  const ContextIcon = context.icon;
  const shortcutLink = user
    ? user.role === "bookings"
      ? { href: "/admin/events", label: "Go to bookings" }
      : user.role === "media"
        ? { href: "/admin/media", label: "Go to media" }
        : { href: "/admin/content", label: "Go to publishing" }
    : { href: "/admin", label: "Open admin" };

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
          <Link className="admin-brand-row admin-shell-brand-block" href="/admin">
            <div className="brand-monogram" style={{ background: 'transparent', border: 'none', padding: 0 }}>
              <Image src="/logo.png" alt="VA" width={90} height={20} style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <p className="admin-brand-name">Admin</p>
              <p className="admin-brand-sub">Veronica Adane</p>
            </div>
          </Link>

          <div className="admin-shell-meta">
            <div className="admin-shell-pill-row">
              <span className="admin-shell-pill">Admin</span>
              <span className="admin-shell-pill">{context.pill}</span>
              {user ? (
                <span className="admin-shell-pill">{adminRoleLabels[user.role]}</span>
              ) : null}
            </div>

            <div className="admin-shell-context-card">
              <div className="admin-shell-context-topline">
                <span className="admin-badge">
                  <ContextIcon size={14} />
                  <span>{context.eyebrow}</span>
                </span>
              </div>
              <div>
                <p className="admin-shell-context-title">{context.title}</p>
                <p className="admin-shell-context-copy">{context.copy}</p>
              </div>
            </div>
          </div>

          <div className="admin-sidebar-divider" />

          {user ? <AdminSidebarNav role={user.role} /> : null}

          <div className="admin-sidebar-bottom">
            <div className="admin-sidebar-actions">
              <Link className="admin-secondary-link" href="/admin">
                <span>Dashboard</span>
                <LayoutDashboard size={14} />
              </Link>
              <Link className="admin-secondary-link" href="/" target="_blank">
                <span>Open site</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <Link className="admin-site-link" href={shortcutLink.href}>
              <span>{shortcutLink.label}</span>
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
