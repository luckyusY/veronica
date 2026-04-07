"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import type { CmsMediaItem } from "@/lib/cms-types";
import { createSvgBlurDataURL } from "@/lib/image-utils";
import { cloudinaryOptimized } from "@/lib/cloudinary-url";

type MediaGalleryClientProps = {
  items: CmsMediaItem[];
};

export function MediaGalleryClient({ items }: MediaGalleryClientProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const lastClickedRef = useRef<number | null>(null);

  /* ── Keyboard handling ── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i !== null ? Math.min(i + 1, items.length - 1) : null));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i !== null ? Math.max(i - 1, 0) : null));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, items.length]);

  /* ── Lock body scroll when lightbox is open ── */
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  /* ── Toggle individual item ── */
  const toggleSelect = useCallback((index: number, shiftKey: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (shiftKey && lastClickedRef.current !== null) {
        // Range select
        const lo = Math.min(lastClickedRef.current, index);
        const hi = Math.max(lastClickedRef.current, index);
        for (let i = lo; i <= hi; i++) {
          if (prev.has(lastClickedRef.current)) {
            next.add(i);
          } else {
            next.delete(i);
          }
        }
      } else {
        if (next.has(index)) next.delete(index);
        else next.add(index);
      }

      lastClickedRef.current = index;
      return next;
    });
  }, []);

  /* ── Select all / clear ── */
  const toggleAll = useCallback(() => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((_, i) => i)));
    }
  }, [selectedIds.size, items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectMode(false);
  }, []);

  /* ── Download selected ── */
  const downloadSelected = useCallback(() => {
    const toDownload = [...selectedIds].map((i) => items[i]).filter(Boolean);
    for (const item of toDownload) {
      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.alt || "veronica-image";
      link.target = "_blank";
      link.rel = "noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [selectedIds, items]);

  /* ── Click on tile ── */
  const handleTileClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      if (selectMode || e.shiftKey || selectedIds.size > 0) {
        toggleSelect(index, e.shiftKey);
        if (!selectMode) setSelectMode(true);
      } else {
        setLightboxIndex(index);
      }
    },
    [selectMode, selectedIds.size, toggleSelect],
  );

  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;
  const selectionCount = selectedIds.size;

  return (
    <>
      {/* ── Selection toolbar ── */}
      {selectionCount > 0 && (
        <div
          aria-live="polite"
          className="media-select-toolbar"
          role="toolbar"
        >
          <span className="media-select-toolbar-count">
            <Check size={14} strokeWidth={2.5} />
            {selectionCount} selected
          </span>

          <div className="media-select-toolbar-actions">
            <button
              className="media-select-toolbar-btn"
              onClick={toggleAll}
              type="button"
            >
              {selectionCount === items.length ? "Deselect all" : "Select all"}
            </button>
            <button
              className="media-select-toolbar-btn media-select-toolbar-btn--download"
              onClick={downloadSelected}
              type="button"
            >
              <Download size={14} />
              Download
            </button>
            <button
              aria-label="Clear selection"
              className="media-select-toolbar-btn media-select-toolbar-btn--clear"
              onClick={clearSelection}
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Image grid ── */}
      <div className="media-grid-gallery">
        {items.map((item, index) => {
          const isSelected = selectedIds.has(index);
          return (
            <figure
              aria-label={item.alt}
              className={`media-grid-tile media-grid-tile--interactive ${isSelected ? "media-grid-tile--selected" : ""}`}
              key={item.publicId ?? `${item.url}-${index}`}
              onClick={(e) => handleTileClick(index, e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTileClick(index, e as unknown as React.MouseEvent);
                }
              }}
            >
              <Image
                alt={item.alt}
                blurDataURL={createSvgBlurDataURL(
                  item.placeholderBase ?? "#171111",
                  item.placeholderHighlight ?? "#c29a67",
                )}
                className="media-grid-photo"
                fill
                placeholder="blur"
                priority={index < 6}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={cloudinaryOptimized(item.url)}
                style={{ objectPosition: item.position ?? "center center" }}
              />

              {/* Checkbox overlay */}
              <span
                aria-checked={isSelected}
                className={`media-grid-checkbox ${isSelected ? "media-grid-checkbox--checked" : ""}`}
                role="checkbox"
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </span>

              {/* Hover hint */}
              {!selectMode && selectionCount === 0 && (
                <span className="media-grid-open-hint" aria-hidden="true">
                  View
                </span>
              )}
            </figure>
          );
        })}
      </div>

      {/* ── Lightbox ── */}
      {activeItem && lightboxIndex !== null && (
        <div
          aria-label="Image lightbox"
          aria-modal="true"
          className="media-lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
        >
          {/* Close */}
          <button
            aria-label="Close lightbox"
            className="media-lightbox-close"
            onClick={() => setLightboxIndex(null)}
            type="button"
          >
            <X size={22} />
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              aria-label="Previous image"
              className="media-lightbox-nav media-lightbox-nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i !== null ? i - 1 : null));
              }}
              type="button"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <div
            className="media-lightbox-frame"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              alt={activeItem.alt}
              blurDataURL={createSvgBlurDataURL(
                activeItem.placeholderBase ?? "#171111",
                activeItem.placeholderHighlight ?? "#c29a67",
              )}
              className="media-lightbox-image"
              fill
              placeholder="blur"
              priority
              sizes="100vw"
              src={cloudinaryOptimized(activeItem.url)}
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </div>

          {/* Caption */}
          <div className="media-lightbox-caption" onClick={(e) => e.stopPropagation()}>
            <p className="media-lightbox-caption-text">{activeItem.alt}</p>
            <span className="media-lightbox-counter">
              {lightboxIndex + 1} / {items.length}
            </span>
          </div>

          {/* Next */}
          {lightboxIndex < items.length - 1 && (
            <button
              aria-label="Next image"
              className="media-lightbox-nav media-lightbox-nav--next"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i !== null ? i + 1 : null));
              }}
              type="button"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
