import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export const metadata: Metadata = {
  title: "Collaborations",
};

export default async function CollaborationsPage() {
  const page = await getCmsPage("collaborations");

  return <CmsStandardPage content={page.content as StandardPageContent} />;
}
