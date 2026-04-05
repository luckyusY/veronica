import Link from "next/link";
import { FileJson } from "lucide-react";
import { getAdminWorkspaceData } from "@/lib/admin-screen-data";
import { formatUpdatedAt, getStatusConfig, summarizePageContent } from "@/lib/cms-admin-ui";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const { cmsPages } = await getAdminWorkspaceData();

  return (
    <div className="admin-page-stack">
      <header className="admin-page-head">
        <div className="admin-page-head-left">
          <div className="admin-page-head-icon">
            <FileJson size={16} />
          </div>
          <h1 className="admin-page-title">Page Content</h1>
        </div>
        <span className="status-pill status-pill--ok">{cmsPages.length} routes</span>
      </header>

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
                <span className="admin-content-route">{page.route}</span>
                <span className={`status-pill ${status.className}`}>{status.label}</span>
              </div>
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
