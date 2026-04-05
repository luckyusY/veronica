import Link from "next/link";
import {
  CalendarClock,
  CloudUpload,
  Disc3,
  FileJson,
  LayoutDashboard,
  Newspaper,
  Package,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { getAdminOverviewData } from "@/lib/admin-screen-data";

export const dynamic = "force-dynamic";

const workspaces = [
  {
    href: "/admin/content",
    label: "Page Content",
    icon: FileJson,
    desc: "Edit public pages",
  },
  {
    href: "/admin/settings",
    label: "Global Settings",
    icon: Settings2,
    desc: "Site-wide copy & links",
  },
  {
    href: "/admin/media",
    label: "Media Library",
    icon: CloudUpload,
    desc: "Images and videos",
  },
  {
    href: "/admin/releases",
    label: "Releases",
    icon: Disc3,
    desc: "Music pipeline",
  },
  {
    href: "/admin/events",
    label: "Events",
    icon: CalendarClock,
    desc: "Tour workflow",
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
    desc: "Commerce desk",
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    icon: Newspaper,
    desc: "Press & booking",
  },
] as const;

export default async function AdminPage() {
  const { counts, cmsPages, mediaAssets, cloudinaryReady, databaseStatus } =
    await getAdminOverviewData();

  const stats = [
    { label: "CMS Pages", value: cmsPages.length, icon: FileJson },
    { label: "Media Assets", value: mediaAssets.length, icon: CloudUpload },
    { label: "Releases", value: counts.releases, icon: Disc3 },
    { label: "Inquiries", value: counts.inquiries, icon: Newspaper },
  ];

  return (
    <div className="admin-page-stack">
      <header className="admin-page-head">
        <div className="admin-page-head-left">
          <div className="admin-page-head-icon">
            <LayoutDashboard size={16} />
          </div>
          <h1 className="admin-page-title">Dashboard</h1>
        </div>
        <span
          className={`status-pill ${
            databaseStatus.tone === "ok" ? "status-pill--ok" : "status-pill--warn"
          }`}
        >
          <ShieldCheck size={13} />
          {databaseStatus.label}
        </span>
      </header>

      <div className="admin-stats-row">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="admin-stat-box" key={stat.label}>
              <Icon className="admin-stat-icon" size={14} />
              <span className="admin-stat-value">{stat.value}</span>
              <span className="admin-stat-label">{stat.label}</span>
            </div>
          );
        })}
      </div>

      <div className="admin-v2-section">
        <p className="admin-v2-section-title">Workspaces</p>
        <div className="admin-workspace-grid">
          {workspaces.map((ws) => {
            const Icon = ws.icon;
            const count =
              ws.href === "/admin/releases"
                ? counts.releases
                : ws.href === "/admin/events"
                  ? counts.events
                  : ws.href === "/admin/products"
                    ? counts.products
                    : ws.href === "/admin/inquiries"
                      ? counts.inquiries
                      : ws.href === "/admin/media"
                        ? mediaAssets.length
                        : cmsPages.length;

            return (
              <Link className="admin-workspace-card" href={ws.href} key={ws.href}>
                <div className="admin-workspace-card-head">
                  <div className="admin-workspace-icon">
                    <Icon size={15} />
                  </div>
                  <span className="admin-workspace-count">{count}</span>
                </div>
                <p className="admin-workspace-label">{ws.label}</p>
                <p className="admin-workspace-desc">{ws.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {!cloudinaryReady && (
        <div className="admin-banner">
          Cloudinary environment variables are missing — media uploads are unavailable.
        </div>
      )}
    </div>
  );
}
