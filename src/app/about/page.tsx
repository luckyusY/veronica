import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const page = await getCmsPage("about");

  return <CmsStandardPage content={page.content as StandardPageContent} />;
}
