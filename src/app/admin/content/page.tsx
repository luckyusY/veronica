import Link from "next/link";
import { FileJson, Sparkles } from "lucide-react";
import { getAdminWorkspaceData } from "@/lib/admin-screen-data";
import { formatUpdatedAt, getStatusConfig, summarizePageContent } from "@/lib/cms-admin-ui";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const { cmsPages } = await getAdminWorkspaceData();

  return (
    <div className="space-y-6">
      <section className="admin-surface">
        <div className="admin-panel-header">
          <div className="space-y-3">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <FileJson size={15} />
                <span>Page Content</span>
              </span>
              <span className="status-pill status-pill--ok">{cmsPages.length} routes</span>
            </div>
            <div>
              <h1 className="display-title text-4xl text-white sm:text-5xl">
                Choose a page, then edit it in a dedicated workspace.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Each public route now opens in its own editor page so nested sections,
                repeatable fields, and media objects stay visible and manageable.
              </p>
            </div>
          </div>
        </div>

        <div className="luxury-divider my-5" />

        <div className="admin-directory-grid admin-directory-grid--content">
          {cmsPages.map((page) => {
            const summary = summarizePageContent(page.content);
            const status = getStatusConfig(page.status);

            return (
              <Link
                className="admin-directory-card admin-directory-card--content"
                href={`/admin/content/${page.slug}`}
                key={page.slug}
              >
                <div className="admin-directory-card-header">
                  <span className="admin-badge">
                    <Sparkles size={15} />
                    <span>{page.slug}</span>
                  </span>
                  <span className={`status-pill ${status.className}`}>{status.label}</span>
                </div>

                <div>
                  <p className="admin-page-card-route">{page.route}</p>
                  <h2 className="display-title mt-3 text-3xl text-white">{page.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/66">{page.summary}</p>
                </div>

                <div className="admin-directory-metric-grid">
                  <div className="admin-directory-metric">
                    <span className="admin-directory-meta">Sections</span>
                    <strong>{summary.sectionKeys.length}</strong>
                  </div>
                  <div className="admin-directory-metric">
                    <span className="admin-directory-meta">Media refs</span>
                    <strong>{summary.mediaRefs}</strong>
                  </div>
                  <div className="admin-directory-metric">
                    <span className="admin-directory-meta">Updated</span>
                    <strong>{formatUpdatedAt(page.updatedAt)}</strong>
                  </div>
                </div>

                <div className="admin-route-note">
                  <span>Open editor</span>
                  <span>Structured fields</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
