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
    description: "Track songs, campaigns, video drops, and rollout notes without page-CMS noise.",
    meta: "Music pipeline",
    icon: Disc3,
  },
  {
    href: "/admin/events",
    label: "Operations",
    title: "Events",
    description: "Manage routing, venues, ticket links, and live show status in a dedicated view.",
    meta: "Tour workflow",
    icon: CalendarClock,
  },
  {
    href: "/admin/products",
    label: "Operations",
    title: "Products",
    description: "Keep merch, bundles, and storefront records organized in their own workspace.",
    meta: "Commerce desk",
    icon: Package,
  },
  {
    href: "/admin/inquiries",
    label: "Operations",
    title: "Inquiries",
    description: "Separate booking, press, and management conversations into one focused queue.",
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
      label: "Admin Modules",
      value: adminModules.length.toString().padStart(2, "0"),
      detail: "Publishing and operations are now divided into dedicated routes.",
    },
    {
      icon: FileJson,
      label: "CMS Pages",
      value: cmsPages.length.toString().padStart(2, "0"),
      detail: "Every public page has its own editable document in MongoDB.",
    },
    {
      icon: CloudUpload,
      label: "Media Assets",
      value: mediaAssets.length.toString().padStart(2, "0"),
      detail: "Cloudinary-backed images and videos ready for direct usage.",
    },
    {
      icon: Sparkles,
      label: cloudinaryReady ? "Cloudinary" : "Cloudinary Missing",
      value: cloudinaryReady ? "LIVE" : "ENV",
      detail: cloudinaryReady
        ? "Uploads and sync tooling are available from the media workspace."
        : "Add Cloudinary environment variables before using admin uploads.",
    },
  ];

  const focusCards = [
    {
      href: "/admin/content",
      label: "Publishing Priority",
      title: "Keep the public story current.",
      stat: `${cmsPages.length} routes`,
      copy: "Review homepage, biography, and campaign sections before each major release or appearance.",
    },
    {
      href: "/admin/media",
      label: "Media Direction",
      title: "Maintain a polished visual library.",
      stat: `${mediaAssets.length} assets`,
      copy: "Upload hero-ready portraits, campaign stills, and short-form clips without mixing them into page editing.",
    },
    {
      href: "/admin/inquiries",
      label: "Team Response",
      title: "Move quickly on booking and press.",
      stat: `${counts.inquiries} inquiries`,
      copy: "Give management and brand requests a dedicated queue so high-value conversations never disappear inside content tasks.",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="admin-surface admin-overview-hero">
        <div className="admin-overview-hero-grid">
          <div className="space-y-4">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <LayoutDashboard size={15} />
                <span>Overview</span>
              </span>
              <span
                className={`status-pill ${
                  databaseStatus.tone === "ok" ? "status-pill--ok" : "status-pill--warn"
                }`}
              >
                <ShieldCheck size={15} />
                <span>{databaseStatus.label}</span>
              </span>
            </div>
            <div>
              <h1 className="display-title text-4xl text-white sm:text-5xl">
                One backstage for content, media, and operations.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-white/66 sm:text-base">
                Use this space to update the public story, manage working assets,
                and keep the team&apos;s release, event, product, and inquiry records in order.
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
                  <Icon size={15} />
                  <span>{item.label}</span>
                </span>
                <p className="admin-kpi-value">{item.value}</p>
                <p className="mt-3 text-sm leading-7 text-white/68">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="admin-surface">
        <div className="admin-panel-header">
          <div className="space-y-3">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <Sparkles size={15} />
                <span>Today&apos;s Focus</span>
              </span>
            </div>
            <div>
              <h2 className="display-title text-4xl text-white sm:text-5xl">
                Start with the work that moves the site today.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                These are usually the first touchpoints for management and content teams:
                what is live, what supports it, and who needs a response next.
              </p>
            </div>
          </div>
        </div>

        <div className="luxury-divider my-5" />

        <div className="admin-focus-grid">
          {focusCards.map((item) => (
            <Link className="admin-focus-card" href={item.href} key={item.href}>
              <p className="admin-focus-card-topline">{item.label}</p>
              <h3 className="display-title text-3xl text-white">{item.title}</h3>
              <p className="admin-focus-copy">{item.copy}</p>
              <div className="admin-focus-stat">
                <span>{item.stat}</span>
                <span>Open workspace</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-surface">
        <div className="admin-panel-header">
          <div className="space-y-3">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <Sparkles size={15} />
                <span>Workspace Directory</span>
              </span>
            </div>
            <div>
              <h2 className="display-title text-4xl text-white sm:text-5xl">
                Choose the right workspace for the task at hand.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Publishing tools control the public site. Operations tools keep the
                business side organized without mixing records into page editing.
              </p>
            </div>
          </div>
        </div>

        <div className="luxury-divider my-5" />

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
                    <Icon size={15} />
                    <span>{module.label}</span>
                  </span>
                  <span className="admin-directory-meta">{count} items</span>
                </div>
                <div>
                  <h3 className="display-title text-3xl text-white">{module.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/66">
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
