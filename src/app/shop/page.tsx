import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("shop");
  return {
    title: page.name,
    description: page.summary,
  };
}

export const revalidate = 60;

export default async function ShopPage() {
  const page = await getCmsPage("shop");

  return <CmsStandardPage content={page.content as StandardPageContent} />;
}
