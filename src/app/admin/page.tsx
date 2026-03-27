import { CalendarClock, Mic2, Package, ShieldCheck, Sparkles } from "lucide-react";
import { AdminConsole } from "@/components/admin-console";
import { adminCollectionConfig } from "@/lib/admin-schema";
import { getAdminDashboardData } from "@/lib/admin-store";
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
  const [{ counts, sections }, databaseStatus] = await Promise.all([
    getAdminDashboardData(),
    getDatabaseStatus(),
  ]);

  const adminKpis = [
    {
      icon: Mic2,
      label: adminCollectionConfig.releases.label,
      value: counts.releases.toString().padStart(2, "0"),
      detail: "Songs, videos, and release-era records now editable from one place.",
    },
    {
      icon: CalendarClock,
      label: adminCollectionConfig.events.label,
      value: counts.events.toString().padStart(2, "0"),
      detail: "Routing, city planning, and ticket-ready event records available to the team.",
    },
    {
      icon: Package,
      label: adminCollectionConfig.products.label,
      value: counts.products.toString().padStart(2, "0"),
      detail: "Merch, bundles, and storefront offers can now be managed inside the admin.",
    },
    {
      icon: Sparkles,
      label: adminCollectionConfig.inquiries.label,
      value: counts.inquiries.toString().padStart(2, "0"),
      detail: "Brand, press, and booking conversations can be tracked operationally.",
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
                Functional admin for releases, events, products, and inquiries.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-white/68 sm:text-base">
                This dashboard is now backed by MongoDB. The team can create, edit,
                and delete operational records instead of working from placeholder cards.
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

      <AdminConsole initialSections={sections} />
    </div>
  );
}
