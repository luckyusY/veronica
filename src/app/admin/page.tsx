import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  Disc3,
  Mic2,
  Newspaper,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  adminKpis,
  brandStandards,
  commerceSignals,
  contentCollections,
  eventOperations,
  inboxPriority,
  releasePipeline,
} from "@/lib/admin-data";
import { pingDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

async function getDatabaseStatus() {
  try {
    await pingDatabase();

    return {
      label: "MongoDB Connected",
      detail: "Content and commerce infrastructure is available for live data.",
      tone: "ok" as const,
    };
  } catch {
    return {
      label: "Database Check Needed",
      detail: "Dashboard layout is ready, but the database connection should be verified.",
      tone: "warn" as const,
    };
  }
}

export default async function AdminPage() {
  const databaseStatus = await getDatabaseStatus();

  return (
    <>
      <section className="admin-surface admin-hero">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="section-label text-beam">Veronica Adane Admin</p>
            <h1 className="display-title mt-4 text-5xl text-white sm:text-6xl">
              A luxury control room for releases, routing, commerce, and press.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
              This dashboard is designed to hold the operational side of the
              brand with the same high-contrast elegance as the public site. It
              gives management a focused view of what is live, what is next,
              and where attention is needed most.
            </p>
          </div>

          <div className="space-y-3 xl:w-[22rem]">
            <div
              className={`status-pill ${
                databaseStatus.tone === "ok" ? "status-pill--ok" : "status-pill--warn"
              }`}
            >
              <ShieldCheck size={16} strokeWidth={1.8} />
              <span>{databaseStatus.label}</span>
            </div>
            <p className="text-sm leading-7 text-white/68">{databaseStatus.detail}</p>
            <div className="flex flex-wrap gap-3">
              <Link className="primary-button" href="/contact">
                Open Booking Desk
              </Link>
              <Link className="secondary-button" href="/music">
                Review Releases
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {adminKpis.map((item) => (
          <article className="admin-kpi" key={item.label}>
            <p className="section-label">Operational Signal</p>
            <p className="admin-kpi-value">{item.value}</p>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/86">
              {item.label}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/66">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className="admin-surface">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Content System</p>
              <h2 className="display-title mt-3 text-4xl text-white">
                Premium collections ready for management.
              </h2>
            </div>
            <span className="admin-badge">
              <Sparkles size={14} strokeWidth={1.8} />
              Editor View
            </span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {contentCollections.map((item) => (
              <article className="solid-note-card" key={item.title}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                  {item.title}
                </p>
                <p className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/72">
                  {item.status}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/68">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="admin-surface">
          <p className="section-label">Quick Actions</p>
          <div className="mt-5 space-y-3">
            <Link className="admin-action-link" href="/music">
              <span className="admin-action-copy">
                <Disc3 size={16} strokeWidth={1.8} />
                Queue release update
              </span>
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </Link>
            <Link className="admin-action-link" href="/events">
              <span className="admin-action-copy">
                <CalendarClock size={16} strokeWidth={1.8} />
                Review upcoming routing
              </span>
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </Link>
            <Link className="admin-action-link" href="/shop">
              <span className="admin-action-copy">
                <Package size={16} strokeWidth={1.8} />
                Check inventory and orders
              </span>
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </Link>
            <Link className="admin-action-link" href="/media">
              <span className="admin-action-copy">
                <Newspaper size={16} strokeWidth={1.8} />
                Refresh press kit assets
              </span>
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-2">
        <div className="admin-surface">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Release Pipeline</p>
              <h2 className="display-title mt-3 text-4xl text-white">
                What is moving through the next launch cycle.
              </h2>
            </div>
            <span className="admin-badge">
              <Mic2 size={14} strokeWidth={1.8} />
              Music Ops
            </span>
          </div>

          <div className="admin-table mt-6">
            {releasePipeline.map((item) => (
              <div className="admin-table-row" key={item.title}>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-white/62">{item.owner}</p>
                </div>
                <p className="text-sm uppercase tracking-[0.14em] text-[var(--gold-soft)]">
                  {item.stage}
                </p>
                <p className="text-sm text-white/64">{item.window}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-surface">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Event Operations</p>
              <h2 className="display-title mt-3 text-4xl text-white">
                Markets, formats, and routing status at a glance.
              </h2>
            </div>
            <span className="admin-badge">
              <CalendarClock size={14} strokeWidth={1.8} />
              Tour Ops
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {eventOperations.map((item) => (
              <article className="admin-list-row" key={item.market}>
                <div>
                  <p className="font-semibold uppercase tracking-[0.16em] text-white/86">
                    {item.market}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/66">{item.detail}</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-sm uppercase tracking-[0.16em] text-[var(--gold-soft)]">
                    {item.format}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/54">
                    {item.status}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[0.95fr_1.05fr]">
        <div className="admin-surface">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Commerce Mix</p>
              <h2 className="display-title mt-3 text-4xl text-white">
                High-contrast visibility into the store layer.
              </h2>
            </div>
            <span className="admin-badge">
              <ShoppingBag size={14} strokeWidth={1.8} />
              Store Ops
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {commerceSignals.map((item) => (
              <article className="admin-metric-row" key={item.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold uppercase tracking-[0.16em] text-white/86">
                    {item.label}
                  </p>
                  <span className="text-sm font-semibold text-[var(--gold-soft)]">
                    {item.value}
                  </span>
                </div>
                <div className="admin-progress">
                  <div className="admin-progress-fill" style={{ width: item.value }} />
                </div>
                <p className="text-sm leading-7 text-white/66">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="admin-surface">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Priority Inbox</p>
              <h2 className="display-title mt-3 text-4xl text-white">
                Booking, brand, and press requests needing action.
              </h2>
            </div>
            <span className="admin-badge">
              <Newspaper size={14} strokeWidth={1.8} />
              Management
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            {inboxPriority.map((item) => (
              <article className="admin-list-row" key={`${item.title}-${item.source}`}>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-white/66">
                    {item.source} | {item.type}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                  {item.window}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-surface">
        <p className="section-label">Brand Standards</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {brandStandards.map((item) => (
            <article className="solid-note-card" key={item}>
              <p className="text-sm leading-7 text-white/70">{item}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
