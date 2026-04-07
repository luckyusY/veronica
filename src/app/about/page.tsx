import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getAboutPageContent } from "@/lib/artist-page-content";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export const metadata: Metadata = {
  title: "About Veronica Adane",
  description:
    "A researched biography of Veronica Adane, covering her Addis Ababa roots, education, and the Meteriyaye era.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const page = await getCmsPage("about");
  const content = getAboutPageContent(page.content as StandardPageContent);

  return <CmsStandardPage content={content} />;
}
