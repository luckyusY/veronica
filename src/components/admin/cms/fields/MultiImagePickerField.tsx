"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Images, Search, X } from "lucide-react";
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
    () => assets.filter((asset) => asset.resourceType === "image"),
    [assets],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return imageAssets;

    return imageAssets.filter(
      (asset) =>
        asset.title.toLowerCase().includes(q) ||
        asset.alt.toLowerCase().includes(q) ||
        asset.publicId.toLowerCase().includes(q),
    );
  }, [imageAssets, query]);

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
      return;
    }

    const newItem: CmsMediaItem = {
      url: asset.secureUrl,
      alt: asset.alt || asset.title,
      publicId: asset.publicId,
      resourceType: asset.resourceType,
      label: asset.title,
    };

    // Homepage sections like Tour Summary use the first image slots from this list.
    // Put new choices first so the editor's latest pick appears immediately.
    onChange([newItem, ...value]);
  }

  function remove(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= value.length) {
      return;
    }

    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    onChange(next);
  }

  const thumbSrc = (url: string) =>
    cloudinaryThumb(url, { width: 180, height: 130, crop: "fill" });

  return (
    <div className="admin-field">
      <label>
        {label}
        <span className="multi-img-picker-count">
          {value.length > 0 ? ` - ${value.length} selected` : ""}
        </span>
      </label>

      {error ? <p className="admin-field-error">{error}</p> : null}

      <div className="multi-img-picker-search">
        <Search className="multi-img-picker-search-icon" size={13} strokeWidth={2} />
        <input
          className="cip-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, alt or ID..."
          type="text"
          value={query}
        />
        {query ? (
          <button className="cip-search-clear" onClick={() => setQuery("")} type="button">
            <X size={12} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>

      {imageAssets.length === 0 ? (
        <div className="cip-empty">
          <Images size={24} strokeWidth={1.2} />
          <p>No images in the media library yet.</p>
          <p className="cip-empty-sub">Upload in the Admin Media section first.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="cip-empty">
          <p>No images match &quot;{query}&quot;</p>
        </div>
      ) : (
        <div className="cip-grid">
          {filtered.map((asset) => {
            const selected = isSelected(asset);

            return (
              <button
                className={`cip-thumb${selected ? " is-selected" : ""}`}
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
                {selected ? (
                  <span className="cip-thumb-check">
                    <Check size={13} strokeWidth={3} />
                  </span>
                ) : null}
                <span className="cip-thumb-overlay" />
                <span className="multi-img-picker-title">{asset.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {value.length > 0 ? (
        <div className="cip-selected-strip">
          <p className="cip-selected-label">
            {value.length} image{value.length === 1 ? "" : "s"} selected. The leftmost items are
            used first on the live page. New selections are added first, and you can reorder them
            below.
          </p>
          <div className="cip-selected-list">
            {value.map((item, index) => (
              <div className="cip-sel-item" key={`${item.url}-${index}`}>
                <span className="cip-sel-num">{index + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={item.alt} className="cip-sel-img" src={thumbSrc(item.url)} />
                <button
                  aria-label={`Remove ${item.alt || item.label || "image"}`}
                  className="cip-sel-remove"
                  onClick={() => remove(index)}
                  type="button"
                >
                  <X size={10} strokeWidth={3} />
                </button>
                <div className="cip-sel-order">
                  <button
                    aria-label={`Move ${item.alt || item.label || "image"} earlier`}
                    className="cip-sel-move"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    type="button"
                  >
                    <ChevronLeft size={10} strokeWidth={3} />
                  </button>
                  <button
                    aria-label={`Move ${item.alt || item.label || "image"} later`}
                    className="cip-sel-move"
                    disabled={index === value.length - 1}
                    onClick={() => move(index, 1)}
                    type="button"
                  >
                    <ChevronRight size={10} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
