"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImageIcon, Search, Video } from "lucide-react";
import type { CmsMediaAsset, CmsMediaItem } from "@/lib/cms-types";

type ImagePickerFieldProps = {
  label: string;
  value: CmsMediaItem;
  assets: CmsMediaAsset[];
  onChange: (value: CmsMediaItem) => void;
  error?: string;
};

function getPreviewAsset(value: CmsMediaItem, assets: CmsMediaAsset[]) {
  return (
    assets.find((asset) => asset.publicId === value.publicId) ??
    assets.find((asset) => asset.secureUrl === value.url)
  );
}

export function ImagePickerField({
  label,
  value,
  assets,
  onChange,
  error,
}: ImagePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const currentAsset = useMemo(() => getPreviewAsset(value, assets), [assets, value]);
  const visibleAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return assets;
    }

    return assets.filter((asset) =>
      [asset.title, asset.alt, asset.publicId].some((candidate) =>
        candidate.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [assets, query]);

  function updateField(field: keyof CmsMediaItem, nextValue: string) {
    onChange({
      ...value,
      [field]: nextValue,
    });
  }

  function applyAsset(asset: CmsMediaAsset) {
    onChange({
      ...value,
      url: asset.secureUrl,
      alt: value.alt || asset.alt || asset.title,
      publicId: asset.publicId,
      resourceType: asset.resourceType,
      label: value.label || asset.title,
    });
    setIsOpen(false);
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className={`admin-media-field ${error ? "is-invalid" : ""}`.trim()}>
        <div className="admin-media-field-preview">
          {currentAsset?.resourceType === "video" || value.resourceType === "video" ? (
            <div className="admin-media-field-fallback">
              <Video size={18} />
              <span>{currentAsset?.title ?? value.label ?? "Video asset"}</span>
            </div>
          ) : value.url ? (
            <Image
              alt={value.alt || label}
              className="admin-media-field-image"
              height={280}
              src={value.url}
              unoptimized
              width={280}
            />
          ) : (
            <div className="admin-media-field-fallback">
              <ImageIcon size={18} />
              <span>No media selected</span>
            </div>
          )}
        </div>

        <div className="admin-media-field-copy">
          <div className="admin-button-row">
            <button className="admin-button admin-button--ghost" onClick={() => setIsOpen(true)} type="button">
              <ImageIcon size={15} />
              <span>Change</span>
            </button>
          </div>

          <div className="admin-media-field-grid">
            <div className="admin-field">
              <label>URL</label>
              <input
                className="admin-input"
                onChange={(event) => updateField("url", event.target.value)}
                value={value.url}
              />
            </div>

            <div className="admin-field">
              <label>Alt text</label>
              <input
                className="admin-input"
                onChange={(event) => updateField("alt", event.target.value)}
                value={value.alt}
              />
            </div>

            <div className="admin-field">
              <label>Public ID</label>
              <input
                className="admin-input"
                onChange={(event) => updateField("publicId", event.target.value)}
                value={value.publicId ?? ""}
              />
            </div>

            <div className="admin-field">
              <label>Label</label>
              <input
                className="admin-input"
                onChange={(event) => updateField("label", event.target.value)}
                value={value.label ?? ""}
              />
            </div>

            <div className="admin-field">
              <label>Position</label>
              <input
                className="admin-input"
                onChange={(event) => updateField("position", event.target.value)}
                value={value.position ?? ""}
              />
            </div>

            <div className="admin-field">
              <label>Resource type</label>
              <select
                className="admin-input"
                onChange={(event) =>
                  onChange({
                    ...value,
                    resourceType: event.target.value === "video" ? "video" : "image",
                  })
                }
                value={value.resourceType ?? "image"}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {error ? <p className="admin-field-error">{error}</p> : null}

      {isOpen ? (
        <div className="admin-modal-overlay" role="presentation">
          <div className="admin-modal admin-modal--wide">
            <div className="admin-panel-header">
              <div>
                <p className="section-label">Media picker</p>
                <h3 className="display-title mt-3 text-3xl text-white">Choose an asset</h3>
              </div>
              <button className="admin-button admin-button--ghost" onClick={() => setIsOpen(false)} type="button">
                <span>Close</span>
              </button>
            </div>

            <div className="admin-media-picker-search">
              <Search size={15} />
              <input
                className="admin-input"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, alt text, or public ID"
                value={query}
              />
            </div>

            <div className="admin-media-picker-grid">
              {visibleAssets.map((asset) => (
                <button
                  className="admin-media-picker-card"
                  key={asset.publicId}
                  onClick={() => applyAsset(asset)}
                  type="button"
                >
                  <div className="admin-media-picker-card-preview">
                    {asset.resourceType === "video" ? (
                      <div className="admin-media-field-fallback">
                        <Video size={18} />
                        <span>Video</span>
                      </div>
                    ) : (
                      <Image
                        alt={asset.alt}
                        className="admin-media-field-image"
                        height={180}
                        src={asset.secureUrl}
                        unoptimized
                        width={180}
                      />
                    )}
                  </div>
                  <div className="admin-media-picker-card-copy">
                    <strong>{asset.title}</strong>
                    <span>{asset.publicId}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
