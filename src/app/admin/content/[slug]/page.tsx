import { notFound } from "next/navigation";
import { AdminPageCmsPanel } from "@/components/admin-page-cms-panel";
import { getAdminWorkspaceData } from "@/lib/admin-screen-data";
import { cmsPageSlugs, type CmsPageSlug } from "@/lib/cms-types";

export const dynamic = "force-dynamic";

type AdminContentEditorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return cmsPageSlugs.map((slug) => ({ slug }));
}

export default async function AdminContentEditorPage({
  params,
}: AdminContentEditorPageProps) {
  const { slug } = await params;

  if (!cmsPageSlugs.includes(slug as CmsPageSlug)) {
    notFound();
  }

  const { cmsPages, mediaAssets } = await getAdminWorkspaceData();

  return (
    <AdminPageCmsPanel
      initialMediaAssets={mediaAssets}
      initialPages={cmsPages}
      selectedSlug={slug as CmsPageSlug}
    />
  );
}
