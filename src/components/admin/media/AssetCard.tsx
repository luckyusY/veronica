"use client";

import Image from "next/image";
import { AlertTriangle, Copy, ImageIcon, Trash2, Video } from "lucide-react";
import type { CmsMediaAsset, CmsMediaUsageRecord } from "@/lib/cms-types";
import { cloudinaryThumb } from "@/lib/cloudinary-url";

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
  const thumbSrc = cloudinaryThumb(asset.secureUrl, { width: 480, height: 320, crop: "fill" });

  return (
    <article className="admin-media-asset-card">
      <div className="admin-media-asset-preview">
        {asset.resourceType === "video" ? (
          <div className="admin-media-asset-video-thumb">
            <Video size={22} />
            <span>Video</span>
          </div>
        ) : (
          <Image
            alt={asset.alt}
            className="admin-media-asset-img"
            height={320}
            loading="lazy"
            src={thumbSrc}
            unoptimized
            width={480}
          />
        )}

        {/* Usage badge overlay */}
        <div className="admin-media-asset-overlay">
          <span className={`status-pill ${usageCount > 0 ? "status-pill--draft" : "status-pill--neutral"}`}>
            {usageCount > 0 ? `Used · ${usageCount}p` : "Unused"}
          </span>
          {usage ? (
            <button
              className="admin-icon-button"
              onClick={() => onViewUsage(usage)}
              title="View usage"
              type="button"
            >
              <ImageIcon size={13} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="admin-media-asset-body">
        <div className="admin-media-asset-info">
          <p className="admin-media-asset-title">{asset.title}</p>
          <p className="admin-media-asset-id">{asset.publicId}</p>
        </div>

        <div className="admin-media-asset-actions">
          <button
            className="admin-icon-button"
            onClick={() => onCopyUrl(asset.secureUrl)}
            title="Copy URL"
            type="button"
          >
            <Copy size={13} />
          </button>
          <button
            className="admin-icon-button"
            onClick={() => onCopyId(asset.publicId)}
            title="Copy public ID"
            type="button"
          >
            <Copy size={13} />
          </button>
          <button
            className={`admin-icon-button ${usageCount > 0 ? "admin-icon-button--warn" : "admin-icon-button--danger"}`}
            onClick={() => onDelete(asset)}
            title={usageCount > 0 ? "Delete (in use — check usage first)" : "Delete"}
            type="button"
          >
            {usageCount > 0 ? <AlertTriangle size={13} /> : <Trash2 size={13} />}
          </button>
        </div>
      </div>
    </article>
  );
}
