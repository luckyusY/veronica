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

const adminNavGroups = [
  {
    label: "Publishing",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/content", label: "Page Content", icon: FileJson },
      { href: "/admin/settings", label: "Global Settings", icon: Settings2 },
      { href: "/admin/media", label: "Media Library", icon: CloudUpload },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/releases", label: "Releases", icon: Disc3 },
      { href: "/admin/events", label: "Events", icon: CalendarRange },
      { href: "/admin/products", label: "Products", icon: ShoppingBag },
      { href: "/admin/inquiries", label: "Inquiries", icon: Newspaper },
    ],
  },
] as const;

function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="admin-nav-groups">
      {adminNavGroups.map((group) => (
        <div className="admin-nav-group" key={group.label}>
          <p className="admin-nav-group-title">{group.label}</p>
          <nav aria-label={group.label} className="space-y-2">
            {group.items.map((item) => {
              const Icon = item.icon;

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
