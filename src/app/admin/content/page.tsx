import Link from "next/link";
import { FileJson } from "lucide-react";
import { getAdminContentListData } from "@/lib/admin-screen-data";
import { formatUpdatedAt, getStatusConfig, summarizePageContent } from "@/lib/cms-admin-ui";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const { cmsPages } = await getAdminContentListData();
  const contentSummary = cmsPages.reduce(
    (accumulator, page) => {
      const summary = summarizePageContent(page.content);

      return {
        sections: accumulator.sections + summary.sectionKeys.length,
        media: accumulator.media + summary.mediaRefs,
        pending: accumulator.pending + (page.status === "draft-pending" ? 1 : 0),
      };
    },
    { sections: 0, media: 0, pending: 0 },
  );

  return (
    <div className="admin-page-stack">
      <header className="admin-page-head">
        <div className="admin-page-head-left">
          <div className="admin-page-head-icon">
            <FileJson size={18} />
          </div>
          <h1 className="admin-page-title">Page Content</h1>
        </div>
        <span className="status-pill status-pill--ok">{cmsPages.length} routes</span>
      </header>

      <section className="admin-surface">
        <div className="admin-panel-header">
          <div className="space-y-3">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <FileJson size={15} />
                <span>Content Directory</span>
              </span>
              <span className="status-pill status-pill--neutral">
                {contentSummary.pending} pending draft
                {contentSummary.pending === 1 ? "" : "s"}
              </span>
            </div>

            <div>
              <h2 className="display-title text-4xl text-white sm:text-5xl">
                Every public route, indexed for editorial updates.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Open any page to edit structured sections, media references, and publishing state
                from one consistent editorial workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="admin-editor-summary-strip mt-5">
          <article className="admin-editor-summary-item">
            <span className="admin-mini-stat-label">Routes</span>
            <strong>{cmsPages.length}</strong>
          </article>
          <article className="admin-editor-summary-item">
            <span className="admin-mini-stat-label">Sections</span>
            <strong>{contentSummary.sections}</strong>
          </article>
          <article className="admin-editor-summary-item">
            <span className="admin-mini-stat-label">Media refs</span>
            <strong>{contentSummary.media}</strong>
          </article>
          <article className="admin-editor-summary-item">
            <span className="admin-mini-stat-label">Pending drafts</span>
            <strong>{contentSummary.pending}</strong>
          </article>
        </div>
      </section>

      <div className="admin-content-grid">
        {cmsPages.map((page) => {
          const summary = summarizePageContent(page.content);
          const status = getStatusConfig(page.status);

          return (
            <Link
              className="admin-content-card"
              href={`/admin/content/${page.slug}`}
              key={page.slug}
            >
              <div className="admin-content-card-head">
                <div className="admin-content-card-icon">
                  <FileJson size={16} />
                </div>
                <span className={`status-pill ${status.className}`}>{status.label}</span>
              </div>
              <span className="admin-content-route">{page.route}</span>
              <p className="admin-content-name">{page.name}</p>
              <div className="admin-content-meta">
                <span>{summary.sectionKeys.length} sections</span>
                <span>{summary.mediaRefs} media</span>
                <span>{formatUpdatedAt(page.updatedAt)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
