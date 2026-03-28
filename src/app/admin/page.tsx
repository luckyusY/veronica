import { CalendarClock, Mic2, Package, ShieldCheck, Sparkles } from "lucide-react";
import { AdminConsole } from "@/components/admin-console";
import { AdminWorkspace } from "@/components/admin-workspace";
import { adminCollectionConfig } from "@/lib/admin-schema";
import { getAdminDashboardData } from "@/lib/admin-store";
import { getCloudinaryStatus } from "@/lib/cloudinary";
import { getCmsSiteSettings, listCmsMediaAssets, listCmsPages } from "@/lib/cms-store";
import { pingDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

async function getDatabaseStatus() {
  try {
    await pingDatabase();

    return {
      tone: "ok" as const,
      label: "MongoDB connected",
      detail:
        "Admin records are live and this control room is writing directly to your production database.",
    };
  } catch {
    return {
      tone: "warn" as const,
      label: "Database unavailable",
      detail:
        "The admin layout is ready, but MongoDB could not be reached. Check your environment variables and cluster access before publishing changes.",
    };
  }
}

export default async function AdminPage() {
  const [{ counts, sections }, databaseStatus, cmsPages, siteSettings, mediaAssets] = await Promise.all([
    getAdminDashboardData(),
    getDatabaseStatus(),
    listCmsPages(),
    getCmsSiteSettings(),
    listCmsMediaAssets(),
  ]);

  const cloudinaryReady = getCloudinaryStatus();

  const adminKpis = [
    {
      icon: Mic2,
      label: "CMS Pages",
      value: cmsPages.length.toString().padStart(2, "0"),
      detail: "Every public page now saves editable JSON content in MongoDB.",
    },
    {
      icon: CalendarClock,
      label: "Media Library",
      value: mediaAssets.length.toString().padStart(2, "0"),
      detail: "Cloudinary-backed image and video assets ready for direct page usage.",
    },
    {
      icon: Package,
      label: adminCollectionConfig.products.label,
      value: counts.products.toString().padStart(2, "0"),
      detail: "Commerce records remain editable alongside the new CMS workspace.",
    },
    {
      icon: Sparkles,
      label: cloudinaryReady ? "Cloudinary" : "Cloudinary Missing",
      value: cloudinaryReady ? "LIVE" : "ENV",
      detail: cloudinaryReady
        ? "Uploads are ready for the media library and page content workflows."
        : "Add Cloudinary environment variables before using media uploads in admin.",
    },
  ];

  return (
    <div className="space-y-6" id="overview">
      <section className="admin-surface admin-hero">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-4">
            <p className="section-label">Live Control Room</p>
            <div>
              <h1 className="display-title text-4xl text-white sm:text-5xl lg:text-6xl">
                Full content workspace for pages, media, releases, events, products, and inquiries.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-white/68 sm:text-base">
                This dashboard now combines a CMS, Cloudinary media library, and the
                operational collections already backed by MongoDB.
              </p>
            </div>
          </div>

          <div
            className={`status-pill ${
              databaseStatus.tone === "ok" ? "status-pill--ok" : "status-pill--warn"
            }`}
          >
            <ShieldCheck size={15} />
            <span>{databaseStatus.label}</span>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60">
          {databaseStatus.detail}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <AdminWorkspace
        cloudinaryReady={cloudinaryReady}
        initialMediaAssets={mediaAssets}
        initialPages={cmsPages}
        initialSiteSettings={siteSettings}
      />

      <AdminConsole initialSections={sections} />
    </div>
  );
}
