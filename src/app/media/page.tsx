import type { Metadata } from "next";
import Image from "next/image";
import { getSelectedMediaGridItems } from "@/lib/artist-page-content";
import { getCmsPage } from "@/lib/cms-store";
import type { StandardPageContent } from "@/lib/cms-types";
import { createSvgBlurDataURL } from "@/lib/image-utils";

export const metadata: Metadata = {
  title: "Veronica Adane Media",
  description: "Selected official Veronica Adane images presented in a clean grid.",
};

export const revalidate = 60;

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
        <div className="media-grid-gallery">
          {items.map((item, index) => (
            <figure className="media-grid-tile" key={item.publicId ?? `${item.url}-${index}`}>
              <Image
                alt={item.alt}
                blurDataURL={createSvgBlurDataURL(
                  item.placeholderBase ?? "#171111",
                  item.placeholderHighlight ?? "#c29a67",
                )}
                className="media-grid-photo"
                fill
                placeholder="blur"
                priority={index < 4}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={item.url}
                style={{ objectPosition: item.position ?? "center center" }}
              />
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
