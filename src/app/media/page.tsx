import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export const metadata: Metadata = {
  title: "Media & Press",
};

export default async function MediaPage() {
  const page = await getCmsPage("media");

  return <CmsStandardPage content={page.content as StandardPageContent} />;
}
