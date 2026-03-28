import { AdminMediaLibraryPanel } from "@/components/admin-media-library-panel";
import { getAdminWorkspaceData } from "@/lib/admin-screen-data";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const { mediaAssets, cloudinaryReady } = await getAdminWorkspaceData();

  return (
    <AdminMediaLibraryPanel
      cloudinaryReady={cloudinaryReady}
      initialMediaAssets={mediaAssets}
    />
  );
}
