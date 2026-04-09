import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getAboutPageContent } from "@/lib/artist-page-content";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export const metadata: Metadata = {
  title: "About Veronica Adane",
  description:
    "Biography of Veronica Adane, from Addis Ababa roots and Azmari heritage to journalism, touring, advocacy, and international recognition.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const page = await getCmsPage("about");
  const content = getAboutPageContent(page.content as StandardPageContent);

  return <CmsStandardPage content={content} />;
}
