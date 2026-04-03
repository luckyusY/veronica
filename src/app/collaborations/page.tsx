import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("collaborations");
  return {
    title: page.name,
    description: page.summary,
  };
}

export const revalidate = 60;

export default async function CollaborationsPage() {
  const page = await getCmsPage("collaborations");

  return <CmsStandardPage content={page.content as StandardPageContent} />;
}
