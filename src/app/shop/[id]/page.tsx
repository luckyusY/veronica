import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingBag, Tag, Package } from "lucide-react";
import { getAdminRecord } from "@/lib/admin-store";
import { ShopDetailSwiper } from "@/components/shop-image-swiper";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getAdminRecord("products", id).catch(() => null);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} — Veronica Adane Shop`,
    description: product.notes || `Shop ${product.title} from Veronica Adane's official store.`,
  };
}

export const dynamic = "force-dynamic";

export default async function ShopProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getAdminRecord("products", id).catch(() => null);

  if (!product || product.status?.toLowerCase() === "inactive") notFound();

  // collect all images (banner + gallery)
  const allImages = [
    ...(product.bannerImage ? [product.bannerImage] : []),
    ...(product.galleryImages ?? []),
  ];

  const available =
    product.status?.toLowerCase() !== "sold out" &&
    product.status?.toLowerCase() !== "inactive";

  return (
    <main className="sdp-page">
      {/* Back link */}
      <div className="sdp-back section-shell">
        <Link className="sdp-back-link" href="/shop">
          <ArrowLeft size={14} strokeWidth={2} />
          Back to shop
        </Link>
      </div>

      <div className="sdp-layout section-shell">
        {/* ── Left — images ── */}
        <div className="sdp-media">
          {allImages.length > 0 ? (
            <ShopDetailSwiper images={allImages} title={product.title} />
          ) : (
            <div className="sdp-no-image">
              <Package size={40} strokeWidth={1.2} />
            </div>
          )}
        </div>

        {/* ── Right — info ── */}
        <div className="sdp-info">
          {product.subtitle ? (
            <span className="sdp-category">
              <Tag size={10} strokeWidth={2} />
              {product.subtitle}
            </span>
          ) : null}

          <h1 className="sdp-title">{product.title}</h1>

          {product.highlight ? (
            <p className="sdp-price">{product.highlight}</p>
          ) : null}

          {product.notes ? (
            <p className="sdp-notes">{product.notes}</p>
          ) : null}

          <div className="sdp-divider" />

          {/* Status badge */}
          <div className="sdp-status-row">
            <span className={`sdp-status-badge sdp-status-badge--${product.status?.toLowerCase().replace(/\s+/g, "-") ?? "active"}`}>
              {product.status || "Available"}
            </span>
          </div>

          {/* CTA */}
          {product.link && available ? (
            <a
              className="sdp-buy-btn"
              href={product.link}
              rel="noreferrer"
              target="_blank"
            >
              <ShoppingBag size={17} strokeWidth={2} />
              Buy now
            </a>
          ) : !available ? (
            <div className="sdp-unavailable">
              <ShoppingBag size={17} strokeWidth={1.5} />
              {product.status === "sold out" ? "Sold out" : "Currently unavailable"}
            </div>
          ) : (
            <div className="sdp-coming-soon">Link coming soon — check back shortly.</div>
          )}

          <p className="sdp-guarantee">
            Official Veronica Adane merchandise. All purchases processed securely.
          </p>
        </div>
      </div>
    </main>
  );
}
