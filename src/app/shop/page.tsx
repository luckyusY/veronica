import type { Metadata } from "next";
import Image from "next/image";
import { ShoppingBag, Tag } from "lucide-react";
import { listAdminCollection } from "@/lib/admin-store";
import type { AdminRecord } from "@/lib/admin-schema";

export const metadata: Metadata = {
  title: "Shop — Veronica Adane",
  description:
    "Official merch, apparel, digital releases, and collector editions by Veronica Adane.",
};

export const revalidate = 60;

function ProductCard({ product }: { product: AdminRecord }) {
  const available = product.status?.toLowerCase() !== "sold out" &&
    product.status?.toLowerCase() !== "inactive";

  return (
    <div className="shop-card">
      <div className="shop-card-media">
        {product.bannerImage ? (
          <Image
            alt={product.title}
            className="shop-card-img"
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={product.bannerImage}
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : (
          <div className="shop-card-placeholder">
            <ShoppingBag size={28} strokeWidth={1.5} />
          </div>
        )}
        {product.subtitle ? (
          <span className="shop-card-category">
            <Tag size={9} strokeWidth={2} />
            {product.subtitle}
          </span>
        ) : null}
      </div>

      <div className="shop-card-body">
        <h2 className="shop-card-title">{product.title}</h2>
        {product.highlight ? (
          <p className="shop-card-price">{product.highlight}</p>
        ) : null}
        {product.notes ? <p className="shop-card-notes">{product.notes}</p> : null}

        {product.link && available ? (
          <a
            className="shop-buy-btn"
            href={product.link}
            rel="noreferrer"
            target="_blank"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            <span>Buy now</span>
          </a>
        ) : !available ? (
          <span className="shop-sold-out">Sold out</span>
        ) : (
          <span className="shop-coming-soon">Coming soon</span>
        )}
      </div>
    </div>
  );
}

export default async function ShopPage() {
  let products: AdminRecord[] = [];
  try {
    products = await listAdminCollection("products");
    // filter out inactive/hidden
    products = products.filter(
      (p) => p.status?.toLowerCase() !== "inactive",
    );
  } catch {
    // DB might be unavailable; show empty state
  }

  return (
    <main className="shop-page">
      {/* Header */}
      <div className="shop-header section-shell">
        <p className="section-label">Official store</p>
        <h1 className="display-title shop-page-title">Shop</h1>
        <p className="shop-page-subtitle">
          Apparel, digital releases, and collector editions. New drops added regularly.
        </p>
      </div>

      {/* Product grid */}
      <section className="shop-grid-section section-shell">
        {products.length > 0 ? (
          <div className="shop-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="shop-empty">
            <ShoppingBag size={36} strokeWidth={1.2} />
            <p>New drops coming soon. Check back shortly.</p>
          </div>
        )}
      </section>
    </main>
  );
}
