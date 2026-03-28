"use client";

import Image from "next/image";
import { AlertTriangle, Copy, ImageIcon, Trash2, Video } from "lucide-react";
import type { CmsMediaAsset, CmsMediaUsageRecord } from "@/lib/cms-types";

type AssetCardProps = {
  asset: CmsMediaAsset;
  onCopyId: (value: string) => void;
  onCopyUrl: (value: string) => void;
  onDelete: (asset: CmsMediaAsset) => void;
  onViewUsage: (usage: CmsMediaUsageRecord) => void;
  usage: CmsMediaUsageRecord | null;
};

export function AssetCard({
  asset,
  onCopyId,
  onCopyUrl,
  onDelete,
  onViewUsage,
  usage,
}: AssetCardProps) {
  const usageCount = usage?.pageCount ?? 0;

  return (
    <article className="admin-media-asset-card">
      <div className="admin-media-asset-preview">
        {asset.resourceType === "video" ? (
          <video
            className="aspect-[4/5] h-full w-full object-cover"
            controls
            preload="metadata"
            src={asset.secureUrl}
          />
        ) : (
          <Image
            alt={asset.alt}
            className="aspect-[4/5] h-full w-full object-cover"
            height={asset.height ?? 1200}
            loading="lazy"
            src={asset.secureUrl}
            unoptimized
            width={asset.width ?? 960}
          />
        )}
      </div>

      <div className="admin-record-copy">
        <div className="admin-panel-meta">
          <span className="admin-badge">
            {asset.resourceType === "video" ? <Video size={15} /> : <ImageIcon size={15} />}
            <span>{asset.resourceType}</span>
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">{asset.title}</h3>
          <p className="mt-2 text-sm leading-7 text-white/60">{asset.alt}</p>
        </div>

        <div className="admin-media-asset-id">{asset.publicId}</div>

        <div className="admin-media-asset-usage">
          <span className={`status-pill ${usageCount > 0 ? "status-pill--draft" : "status-pill--neutral"}`}>
            Used in {usageCount} page{usageCount === 1 ? "" : "s"}
          </span>
          {usage ? (
            <button className="admin-button admin-button--ghost" onClick={() => onViewUsage(usage)} type="button">
              <span>View</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <button className="admin-button admin-button--ghost" onClick={() => onCopyUrl(asset.secureUrl)} type="button">
          <Copy size={15} />
          <span>Copy URL</span>
        </button>
        <button className="admin-button admin-button--ghost" onClick={() => onCopyId(asset.publicId)} type="button">
          <Copy size={15} />
          <span>Copy ID</span>
        </button>
        <button className="admin-button admin-button--ghost" onClick={() => onDelete(asset)} type="button">
          {usageCount > 0 ? <AlertTriangle size={15} /> : <Trash2 size={15} />}
          <span>{usageCount > 0 ? "Delete with warning" : "Delete"}</span>
        </button>
      </div>
    </article>
  );
}
