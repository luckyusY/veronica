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
  Sparkles,
} from "lucide-react";
import { getAdminOverviewData } from "@/lib/admin-screen-data";

export const dynamic = "force-dynamic";

const adminModules = [
  {
    href: "/admin/content",
    label: "Publishing",
    title: "Page Content",
    description: "Edit hero sections, story blocks, and structured JSON for every public route.",
    meta: "8 editable routes",
    icon: FileJson,
  },
  {
    href: "/admin/settings",
    label: "Publishing",
    title: "Global Settings",
    description: "Control shared header labels, footer copy, utility links, and social signals.",
    meta: "Site-wide copy",
    icon: Settings2,
  },
  {
    href: "/admin/media",
    label: "Publishing",
    title: "Media Library",
    description: "Upload or sync Cloudinary assets and reuse them directly across the website.",
    meta: "Images and videos",
    icon: CloudUpload,
  },
  {
    href: "/admin/releases",
    label: "Operations",
    title: "Releases",
    description: "Track songs, campaigns, video drops, and rollout notes.",
    meta: "Music pipeline",
    icon: Disc3,
  },
  {
    href: "/admin/events",
    label: "Operations",
    title: "Events",
    description: "Manage venues, ticket links, and live show status.",
    meta: "Tour workflow",
    icon: CalendarClock,
  },
  {
    href: "/admin/products",
    label: "Operations",
    title: "Products",
    description: "Keep merch, bundles, and storefront records organized.",
    meta: "Commerce desk",
    icon: Package,
  },
  {
    href: "/admin/inquiries",
    label: "Operations",
    title: "Inquiries",
    description: "Separate booking, press, and management conversations into one queue.",
    meta: "Press and booking",
    icon: Newspaper,
  },
] as const;

export default async function AdminPage() {
  const { counts, cmsPages, mediaAssets, cloudinaryReady, databaseStatus } =
    await getAdminOverviewData();

  const adminKpis = [
    {
      icon: LayoutDashboard,
      label: "Modules",
      value: adminModules.length.toString().padStart(2, "0"),
      detail: "Publishing + operations workspaces",
    },
    {
      icon: FileJson,
      label: "CMS Pages",
      value: cmsPages.length.toString().padStart(2, "0"),
      detail: "Editable public routes",
    },
    {
      icon: CloudUpload,
      label: "Media Assets",
      value: mediaAssets.length.toString().padStart(2, "0"),
      detail: "Cloudinary-backed files",
    },
    {
      icon: Sparkles,
      label: cloudinaryReady ? "Cloudinary" : "Cloudinary",
      value: cloudinaryReady ? "LIVE" : "ENV",
      detail: cloudinaryReady
        ? "Uploads and sync available"
        : "Add Cloudinary env vars to enable uploads",
    },
  ];

  const focusCards = [
    {
      href: "/admin/content",
      label: "Publishing Priority",
      title: "Keep the public story current.",
      stat: `${cmsPages.length} routes`,
      copy: "Review homepage, biography, and campaign sections before each major release.",
    },
    {
      href: "/admin/media",
      label: "Media Direction",
      title: "Maintain a polished visual library.",
      stat: `${mediaAssets.length} assets`,
      copy: "Upload hero-ready portraits, campaign stills, and short-form clips.",
    },
    {
      href: "/admin/inquiries",
      label: "Team Response",
      title: "Move quickly on booking and press.",
      stat: `${counts.inquiries} inquiries`,
      copy: "Keep high-value conversations in their own queue so nothing gets buried.",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Status + KPIs */}
      <section className="admin-surface admin-overview-hero">
        <div className="admin-overview-hero-grid">
          <div className="space-y-3">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <LayoutDashboard size={14} />
                <span>Overview</span>
              </span>
              <span
                className={`status-pill ${
                  databaseStatus.tone === "ok" ? "status-pill--ok" : "status-pill--warn"
                }`}
              >
                <ShieldCheck size={14} />
                <span>{databaseStatus.label}</span>
              </span>
            </div>
            <div>
              <h1 className="admin-page-title">
                Content, media, and operations.
              </h1>
              <p className="admin-page-subtitle">
                Update the public story, manage assets, and keep release and booking records organized.
              </p>
            </div>
          </div>

          <div className="admin-overview-status-card">
            <p className="section-label">System health</p>
            <p className="admin-overview-status-title">{databaseStatus.label}</p>
            <p className="text-sm leading-7 text-white/62">{databaseStatus.detail}</p>
          </div>
        </div>

        <div className="admin-overview-kpi-grid">
          {adminKpis.map((item) => {
            const Icon = item.icon;

            return (
              <article className="admin-kpi" key={item.label}>
                <span className="admin-badge">
                  <Icon size={14} />
                  <span>{item.label}</span>
                </span>
                <p className="admin-kpi-value">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-white/66">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Today's focus */}
      <section className="admin-surface">
        <div className="admin-panel-header">
          <div className="space-y-2">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <Sparkles size={14} />
                <span>Today&apos;s Focus</span>
              </span>
            </div>
            <h2 className="admin-page-title">Where to start today.</h2>
          </div>
        </div>

        <div className="luxury-divider my-4" />

        <div className="admin-focus-grid">
          {focusCards.map((item) => (
            <Link className="admin-focus-card" href={item.href} key={item.href}>
              <p className="admin-focus-card-topline">{item.label}</p>
              <h3 className="admin-focus-card-heading">{item.title}</h3>
              <p className="admin-focus-copy">{item.copy}</p>
              <div className="admin-focus-stat">
                <span>{item.stat}</span>
                <span>Open workspace</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Workspace directory */}
      <section className="admin-surface">
        <div className="admin-panel-header">
          <div className="space-y-2">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <Sparkles size={14} />
                <span>Workspaces</span>
              </span>
            </div>
            <h2 className="admin-page-title">All workspaces.</h2>
          </div>
        </div>

        <div className="luxury-divider my-4" />

        <div className="admin-directory-grid">
          {adminModules.map((module) => {
            const Icon = module.icon;
            const count =
              module.href === "/admin/releases"
                ? counts.releases
                : module.href === "/admin/events"
                  ? counts.events
                  : module.href === "/admin/products"
                    ? counts.products
                    : module.href === "/admin/inquiries"
                      ? counts.inquiries
                      : module.href === "/admin/media"
                        ? mediaAssets.length
                        : cmsPages.length;

            return (
              <Link className="admin-directory-card" href={module.href} key={module.href}>
                <div className="admin-directory-card-header">
                  <span className="admin-badge">
                    <Icon size={14} />
                    <span>{module.label}</span>
                  </span>
                  <span className="admin-directory-meta">{count} items</span>
                </div>
                <div>
                  <h3 className="admin-card-title">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    {module.description}
                  </p>
                </div>
                <div className="admin-route-note">
                  <span>{module.meta}</span>
                  <span>Open workspace</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
