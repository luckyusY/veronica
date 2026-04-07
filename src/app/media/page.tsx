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
      {/* ── Page Header ── */}
      <div className="section-shell pt-32 pb-6 sm:pt-40 sm:pb-10">
        <p className="section-label">Official Press Archive</p>
        <h1 className="display-title mt-4 text-4xl sm:text-5xl text-white">Media Collection</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
          A verified archive of official photography, campaign imagery, and live performance moments. 
          Use shift-click to select multiple images for bulk download, or click an image to view in high resolution.
        </p>
      </div>

      <section className="section-shell pb-16 sm:pb-24">
        <MediaGalleryClient items={items} />
      </section>
    </main>
  );
}
