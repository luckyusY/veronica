"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarRange,
  CloudUpload,
  Disc3,
  FileJson,
  LayoutDashboard,
  Newspaper,
  Settings2,
  ShoppingBag,
} from "lucide-react";
import {
  getVisibleAdminNavGroups,
  type AdminNavIconKey,
  type AdminRole,
} from "@/lib/admin-access";

const iconMap: Record<AdminNavIconKey, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  content: FileJson,
  settings: Settings2,
  media: CloudUpload,
  releases: Disc3,
  events: CalendarRange,
  products: ShoppingBag,
  inquiries: Newspaper,
};

function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

type AdminSidebarNavProps = {
  role: AdminRole;
};

export function AdminSidebarNav({ role }: AdminSidebarNavProps) {
  const pathname = usePathname();
  const visibleGroups = getVisibleAdminNavGroups(role);

  return (
    <div className="admin-nav-groups">
      {visibleGroups.map((group) => (
        <div className="admin-nav-group" key={group.label}>
          <p className="admin-nav-group-title">{group.label}</p>
          <nav aria-label={group.label} className="space-y-2">
            {group.items.map((item) => {
              const Icon = iconMap[item.iconKey];

              return (
                <Link
                  className={`admin-nav-link ${
                    isActivePath(pathname, item.href) ? "is-active" : ""
                  }`.trim()}
                  href={item.href}
                  key={item.href}
                >
                  <span className="admin-nav-icon">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}
