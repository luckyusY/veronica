import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export const metadata: Metadata = {
  title: "Shop",
};

export default async function ShopPage() {
  const page = await getCmsPage("shop");

  return <CmsStandardPage content={page.content as StandardPageContent} />;
}
