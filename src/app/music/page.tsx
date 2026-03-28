import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export const metadata: Metadata = {
  title: "Music & Videos",
};

export default async function MusicPage() {
  const page = await getCmsPage("music");

  return <CmsStandardPage content={page.content as StandardPageContent} />;
}
