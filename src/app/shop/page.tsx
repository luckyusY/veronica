import type { Metadata } from "next";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { PageHero } from "@/components/page-hero";
import { editorialImages } from "@/lib/editorial-home";
import { shopHighlights } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Shop",
};

const commerceStack = [
  "Product collections for merch drops, digital music, and collector bundles.",
  "MongoDB order records tied to user accounts for dashboards and history.",
  "Expandable structure for VIP memberships, limited launches, and mentorship products.",
];

export default function ShopPage() {
  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <PageHero
        description="The store is being positioned as a selective extension of each music era: fewer generic storefront cues, more atmosphere, and a cleaner bridge between merchandise and identity."
        eyebrow="Shop"
        highlightWords={["premium", "store", "era"]}
        image={editorialImages.hero}
        imageLabel="Open portrait photography used to test product-era mood"
        noteText="Commerce should feel considered and collectible, not crowded. The strongest version connects every product drop to a release era or live moment."
        noteTitle="Commerce direction"
        primaryCta={{ href: "/music", label: "Align with releases" }}
        secondaryCta={{ href: "/events", label: "Bundle event offers" }}
        title="The store should feel premium, selective, and connected to each music era."
      />

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.94fr_1.06fr]">
          <RevealBlock className="editorial-photo-block editorial-photo-block--tall">
            <EditorialImage
              className="editorial-photo-shell"
              image={editorialImages.cliff}
              sizes="(max-width: 1024px) 100vw, 40vw"
              strength={64}
            />
          </RevealBlock>

          <RevealBlock className="editorial-paper-panel" delay={0.08}>
            <p className="section-label">Collection layers</p>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {shopHighlights.map((item) => (
                <article className="editorial-note" key={item.title}>
                  <p className="section-label">{item.title}</p>
                  <p className="mt-4 text-sm leading-7 text-[#4b4138] sm:text-base">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <RevealBlock className="editorial-dark-panel">
          <p className="section-label">Commerce foundation</p>
          <h2 className="display-title mt-5 max-w-4xl text-4xl text-white sm:text-5xl">
            The shop should be lean at launch, but structured for bigger drops and private access later.
          </h2>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {commerceStack.map((item) => (
              <article className="editorial-dark-note" key={item}>
                <p className="text-sm leading-7 text-white/70 sm:text-base">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </RevealBlock>
      </section>
    </main>
  );
}
