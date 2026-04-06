import { AdminSiteSettingsPanel } from "@/components/admin-site-settings-panel";
import { getAdminWorkspaceData } from "@/lib/admin-screen-data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { siteSettings, mediaAssets } = await getAdminWorkspaceData();

  return (
    <AdminSiteSettingsPanel
      initialMediaAssets={mediaAssets}
      initialSiteSettings={siteSettings}
    />
  );
}
