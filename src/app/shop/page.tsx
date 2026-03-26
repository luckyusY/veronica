import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
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
    <main className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="Shop"
        highlightWords={["premium", "store", "era"]}
        title="The store should feel premium, selective, and connected to each music era."
        description="This commerce structure is designed for apparel, digital releases, and future exclusives. It is intentionally lean enough for launch and flexible enough for larger drops later."
        primaryCta={{ href: "/music", label: "Align With Releases" }}
        secondaryCta={{ href: "/events", label: "Bundle Event Offers" }}
      />

      <section className="section-shell py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {shopHighlights.map((item) => (
            <article className="panel rounded-[1.75rem] p-6" key={item.title}>
              <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/68">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="panel rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="section-label">Commerce Foundation</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {commerceStack.map((item) => (
              <article
                className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5"
                key={item}
              >
                <p className="text-sm leading-7 text-white/68">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
