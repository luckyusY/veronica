import { AdminPageCmsPanel } from "@/components/admin-page-cms-panel";
import { getAdminWorkspaceData } from "@/lib/admin-screen-data";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const { cmsPages, mediaAssets } = await getAdminWorkspaceData();

  return <AdminPageCmsPanel initialMediaAssets={mediaAssets} initialPages={cmsPages} />;
}
