import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, Tag } from "lucide-react";
import { listAdminCollection } from "@/lib/admin-store";
import type { AdminRecord } from "@/lib/admin-schema";
import { ShopCardSwiper } from "@/components/shop-image-swiper";

export const metadata: Metadata = {
  title: "Shop — Veronica Adane",
  description:
    "Official merch, apparel, digital releases, and collector editions by Veronica Adane.",
};

export const revalidate = 60;

function ProductCard({ product }: { product: AdminRecord }) {
  const available =
    product.status?.toLowerCase() !== "sold out" &&
    product.status?.toLowerCase() !== "inactive";

  // all images: banner first, then gallery
  const allImages = [
    ...(product.bannerImage ? [product.bannerImage] : []),
    ...(product.galleryImages ?? []),
  ];

  return (
    <Link className="shop-card" href={`/shop/${product.id}`}>
      {/* ── Media area ── */}
      <div className="shop-card-media">
        {allImages.length > 0 ? (
          <ShopCardSwiper images={allImages} title={product.title} />
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

        {!available && (
          <span className="shop-card-unavailable-badge">
            {product.status}
          </span>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="shop-card-body">
        <h2 className="shop-card-title">{product.title}</h2>
        {product.highlight ? (
          <p className="shop-card-price">{product.highlight}</p>
        ) : null}
        {product.notes ? (
          <p className="shop-card-notes">{product.notes}</p>
        ) : null}

        <span className="shop-card-cta">
          {available ? (
            <>
              <ShoppingBag size={13} strokeWidth={2} />
              View product
            </>
          ) : (
            "Sold out"
          )}
        </span>
      </div>
    </Link>
  );
}

export default async function ShopPage() {
  let products: AdminRecord[] = [];
  try {
    products = await listAdminCollection("products");
    products = products.filter((p) => p.status?.toLowerCase() !== "inactive");
  } catch {
    // DB unavailable — show empty state
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
