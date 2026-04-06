import Link from "next/link";
import {
  ArrowUpRight,
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
    desc: "Edit public pages, structured sections, and publishing status.",
    group: "Publishing",
  },
  {
    href: "/admin/settings",
    label: "Global Settings",
    icon: Settings2,
    desc: "Keep header labels, footer copy, and utility links aligned.",
    group: "Publishing",
  },
  {
    href: "/admin/media",
    label: "Media Library",
    icon: CloudUpload,
    desc: "Upload, search, and track images and videos across the site.",
    group: "Publishing",
  },
  {
    href: "/admin/releases",
    label: "Releases",
    icon: Disc3,
    desc: "Manage music campaigns, rollouts, and launch notes.",
    group: "Operations",
  },
  {
    href: "/admin/events",
    label: "Events",
    icon: CalendarClock,
    desc: "Track routing, dates, venues, and ticket destinations.",
    group: "Operations",
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
    desc: "Maintain merch, bundles, and storefront highlights.",
    group: "Operations",
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    icon: Newspaper,
    desc: "Review booking, press, and brand requests in one queue.",
    group: "Operations",
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
            <LayoutDashboard size={18} />
          </div>
          <h1 className="admin-page-title">Overview</h1>
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

      <section className="admin-surface admin-overview-hero">
        <div className="admin-overview-hero-grid">
          <div>
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <LayoutDashboard size={15} />
                <span>Control Room</span>
              </span>
              <span className="status-pill status-pill--neutral">
                {cloudinaryReady ? "Cloudinary ready" : "Uploads paused"}
              </span>
            </div>

            <div className="mt-5">
              <h2 className="display-title text-4xl text-white sm:text-5xl">
                A quieter control room for publishing, media, and operations.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Review site health, move between workspaces, and keep every public surface aligned
                without losing track of the live system state.
              </p>
            </div>

            <div className="admin-button-row mt-5">
              <Link className="admin-button" href="/admin/content">
                <FileJson size={15} />
                <span>Open page content</span>
              </Link>
              <Link className="admin-button admin-button--ghost" href="/admin/media">
                <CloudUpload size={15} />
                <span>Browse media</span>
              </Link>
            </div>
          </div>

          <article className="admin-overview-status-card">
            <p className="section-label">System status</p>
            <h3 className="admin-overview-status-title">{databaseStatus.label}</h3>
            <p className="admin-note">{databaseStatus.detail}</p>
            <div className="admin-key-list">
              <span className="admin-key-chip">{cmsPages.length} mapped pages</span>
              <span className="admin-key-chip">{mediaAssets.length} media assets</span>
              <span className="admin-key-chip">
                {counts.releases + counts.events + counts.products + counts.inquiries} ops records
              </span>
            </div>
          </article>
        </div>

        <div className="admin-overview-kpi-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className="admin-kpi" key={stat.label}>
                <div className="admin-stat-icon-wrap">
                  <Icon size={18} />
                </div>
                <span className="admin-kpi-value">{stat.value}</span>
                <span className="admin-stat-label">{stat.label}</span>
              </article>
            );
          })}
        </div>
      </section>

      <div className="admin-v2-section">
        <p className="admin-v2-section-title">Workspaces</p>
        <div className="admin-focus-grid">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            const count =
              workspace.href === "/admin/releases"
                ? counts.releases
                : workspace.href === "/admin/events"
                  ? counts.events
                  : workspace.href === "/admin/products"
                    ? counts.products
                    : workspace.href === "/admin/inquiries"
                      ? counts.inquiries
                      : workspace.href === "/admin/media"
                        ? mediaAssets.length
                        : cmsPages.length;

            return (
              <Link className="admin-focus-card" href={workspace.href} key={workspace.href}>
                <div className="admin-focus-card-topline">
                  <span>{workspace.group}</span>
                  <span>{count} items</span>
                </div>

                <div className="admin-workspace-card-head">
                  <div className="admin-workspace-icon">
                    <Icon size={18} />
                  </div>
                  <span className="admin-workspace-count">{count}</span>
                </div>

                <p className="admin-workspace-label">{workspace.label}</p>
                <p className="admin-focus-copy">{workspace.desc}</p>

                <div className="admin-focus-stat">
                  <span>Open workspace</span>
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {!cloudinaryReady && (
        <div className="admin-banner">
          Cloudinary environment variables are missing and uploads are currently unavailable.
        </div>
      )}
    </div>
  );
}
