import type { Metadata } from "next";
import { getSelectedMediaGridItems } from "@/lib/artist-page-content";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";
import { MediaGalleryClient } from "@/components/media-gallery-client";

export const metadata: Metadata = {
  title: "Veronica Adane Media",
  description: "Selected official Veronica Adane images presented in a clean grid.",
};

export const revalidate = 120;

export default async function MediaPage() {
  const page = await getCmsPage("media");
  const items = getSelectedMediaGridItems(page.content as StandardPageContent);

  if (items.length === 0) {
    return (
      <main className="section-shell py-16 sm:py-20">
        <p className="media-grid-empty">No media images have been selected yet.</p>
      </main>
    );
  }

  return (
    <main className="media-grid-page">
      <section className="section-shell py-8 sm:py-10">
        <MediaGalleryClient items={items} />
      </section>
    </main>
  );
}
