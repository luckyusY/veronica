import type { Metadata } from "next";
import { CmsStandardPage } from "@/components/cms-standard-page";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";

export const metadata: Metadata = {
  title: "Events",
};

export default async function EventsPage() {
  const page = await getCmsPage("events");

  return <CmsStandardPage content={page.content as StandardPageContent} />;
}
