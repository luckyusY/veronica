"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Images, Search, Trash2, X } from "lucide-react";
import type { CmsMediaAsset, CmsMediaItem } from "@/lib/cms-types";
import { cloudinaryThumb } from "@/lib/cloudinary-url";

type MultiImagePickerFieldProps = {
  label: string;
  value: CmsMediaItem[];
  assets: CmsMediaAsset[];
  onChange: (value: CmsMediaItem[]) => void;
  error?: string;
};

export function MultiImagePickerField({
  label,
  value,
  assets,
  onChange,
  error,
}: MultiImagePickerFieldProps) {
  const [query, setQuery] = useState("");

  const imageAssets = useMemo(
    () => assets.filter((a) => a.resourceType === "image"),
    [assets],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return imageAssets;
    return imageAssets.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.alt.toLowerCase().includes(q) ||
        a.publicId.toLowerCase().includes(q),
    );
  }, [imageAssets, query]);

  // Key on publicId or secureUrl to detect selection
  function isSelected(asset: CmsMediaAsset) {
    return value.some(
      (item) => item.publicId === asset.publicId || item.url === asset.secureUrl,
    );
  }

  function toggle(asset: CmsMediaAsset) {
    if (isSelected(asset)) {
      onChange(
        value.filter((item) => item.publicId !== asset.publicId && item.url !== asset.secureUrl),
      );
    } else {
      const newItem: CmsMediaItem = {
        url: asset.secureUrl,
        alt: asset.alt || asset.title,
        publicId: asset.publicId,
        resourceType: asset.resourceType,
        label: asset.title,
      };
      onChange([...value, newItem]);
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  const thumbSrc = (url: string) =>
    cloudinaryThumb(url, { width: 180, height: 130, crop: "fill" });

  return (
    <div className="admin-field">
      <label>
        {label}
        <span className="multi-img-picker-count">
          {value.length > 0 ? ` · ${value.length} selected` : ""}
        </span>
      </label>

      {error ? <p className="admin-field-error">{error}</p> : null}

      {/* Search */}
      <div className="multi-img-picker-search">
        <Search className="multi-img-picker-search-icon" size={13} strokeWidth={2} />
        <input
          className="cip-search"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, alt or ID…"
          type="text"
          value={query}
        />
        {query && (
          <button className="cip-search-clear" onClick={() => setQuery("")} type="button">
            <X size={12} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Asset grid */}
      {imageAssets.length === 0 ? (
        <div className="cip-empty">
          <Images size={24} strokeWidth={1.2} />
          <p>No images in the media library yet.</p>
          <p className="cip-empty-sub">Upload via Admin → Media first.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="cip-empty">
          <p>No images match &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="cip-grid">
          {filtered.map((asset) => {
            const sel = isSelected(asset);
            return (
              <button
                className={`cip-thumb${sel ? " is-selected" : ""}`}
                key={asset.id}
                onClick={() => toggle(asset)}
                title={asset.title || asset.alt}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={asset.alt || asset.title}
                  className="cip-thumb-img"
                  loading="lazy"
                  src={thumbSrc(asset.secureUrl)}
                />
                {sel && (
                  <span className="cip-thumb-check">
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}
                <span className="cip-thumb-overlay" />
                <span className="multi-img-picker-title">{asset.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected strip */}
      {value.length > 0 && (
        <div className="cip-selected-strip">
          <p className="cip-selected-label">
            {value.length} image{value.length === 1 ? "" : "s"} selected — click a selected image
            above to deselect it, or use × to remove
          </p>
          <div className="cip-selected-list">
            {value.map((item, i) => (
              <div className="cip-sel-item" key={`${item.url}-${i}`}>
                <span className="cip-sel-num">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={item.alt} className="cip-sel-img" src={thumbSrc(item.url)} />
                <button
                  aria-label={`Remove ${item.alt || item.label || "image"}`}
                  className="cip-sel-remove"
                  onClick={() => remove(i)}
                  type="button"
                >
                  <X size={10} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
