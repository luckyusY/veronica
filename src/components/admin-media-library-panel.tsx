"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CloudUpload, Copy, ImageIcon, LoaderCircle, RefreshCcw, Sparkles, Video } from "lucide-react";
import type { CmsMediaAsset } from "@/lib/cms-types";

type AdminMediaLibraryPanelProps = {
  cloudinaryReady: boolean;
  initialMediaAssets: CmsMediaAsset[];
};

type FeedbackState = {
  tone: "ok" | "error";
  message: string;
} | null;

type MediaFilter = "all" | "image" | "video";

async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

function mergeMediaAssets(current: CmsMediaAsset[], incoming: CmsMediaAsset[]) {
  const merged = new Map<string, CmsMediaAsset>();

  [...incoming, ...current].forEach((asset) => {
    merged.set(asset.publicId, asset);
  });

  return [...merged.values()].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function AdminMediaLibraryPanel({
  cloudinaryReady,
  initialMediaAssets,
}: AdminMediaLibraryPanelProps) {
  const [mediaAssets, setMediaAssets] = useState(initialMediaAssets);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const visibleMedia = useMemo(() => {
    if (mediaFilter === "all") {
      return mediaAssets;
    }

    return mediaAssets.filter((asset) => asset.resourceType === mediaFilter);
  }, [mediaAssets, mediaFilter]);

  async function syncBundledAssets() {
    setBusyKey("sync-library");
    setFeedback(null);

    const response = await fetch("/api/admin/media/sync", { method: "POST" });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as { count: number; items: CmsMediaAsset[]; skipped?: unknown[] };
    setMediaAssets((current) => mergeMediaAssets(current, payload.items));
    setBusyKey(null);
    setFeedback({
      tone: "ok",
      message: `${payload.count} bundled asset${payload.count === 1 ? "" : "s"} synced to Cloudinary.`,
    });
  }

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    setBusyKey("upload");
    setFeedback(null);

    const uploaded: CmsMediaAsset[] = [];

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", file.type.startsWith("video/") ? "veronica/videos" : "veronica/images");
      formData.append("title", file.name.replace(/\.[^.]+$/, ""));
      formData.append("alt", file.name.replace(/\.[^.]+$/, ""));

      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });

      if (!response.ok) {
        setBusyKey(null);
        setFeedback({ tone: "error", message: await readApiError(response) });
        return;
      }

      const payload = (await response.json()) as { item: CmsMediaAsset };
      uploaded.push(payload.item);
    }

    setMediaAssets((current) => mergeMediaAssets(current, uploaded));
    setBusyKey(null);
    setFeedback({
      tone: "ok",
      message: `${uploaded.length} media asset${uploaded.length > 1 ? "s" : ""} uploaded.`,
    });
  }

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback({ tone: "ok", message: `${label} copied.` });
    } catch {
      setFeedback({ tone: "error", message: `Unable to copy ${label.toLowerCase()}.` });
    }
  }

  return (
    <div className="admin-stack">
      {feedback ? (
        <div
          className={`admin-feedback ${
            feedback.tone === "ok" ? "admin-feedback--ok" : "admin-feedback--error"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <section className="admin-surface">
        <div className="admin-panel-header">
          <div className="space-y-3">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <CloudUpload size={15} />
                <span>Cloudinary media</span>
              </span>
              <span className={`status-pill ${cloudinaryReady ? "status-pill--ok" : "status-pill--warn"}`}>
                {cloudinaryReady ? "Cloudinary ready" : "Cloudinary env missing"}
              </span>
            </div>
            <div>
              <h1 className="display-title text-4xl text-white sm:text-5xl">
                Manage the full Veronica media library.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Sync the bundled project library, upload new assets, and reuse direct delivery URLs
                across the site.
              </p>
            </div>
          </div>
        </div>

        <div className="luxury-divider my-5" />

        <div className="admin-media-shell">
          <div className="admin-media-controls">
            <article className="admin-upload-panel">
              <div className="admin-panel-meta">
                <span className="admin-badge">
                  <RefreshCcw size={15} />
                  <span>Bundled library</span>
                </span>
              </div>
              <p className="admin-note mt-4">
                Sync the real Veronica images and videos already bundled with the project.
              </p>
              <div className="admin-button-row mt-4">
                <button
                  className="admin-button"
                  disabled={!cloudinaryReady || busyKey === "sync-library"}
                  onClick={() => void syncBundledAssets()}
                  type="button"
                >
                  {busyKey === "sync-library" ? (
                    <LoaderCircle className="animate-spin" size={15} />
                  ) : (
                    <RefreshCcw size={15} />
                  )}
                  <span>{busyKey === "sync-library" ? "Syncing..." : "Sync bundled assets"}</span>
                </button>
              </div>
            </article>

            <article className="admin-upload-panel">
              <div className="admin-panel-meta">
                <span className="admin-badge">
                  <Sparkles size={15} />
                  <span>Fresh upload</span>
                </span>
              </div>
              <p className="admin-note mt-4">
                Add new photos, posters, and videos directly into Cloudinary from the admin.
              </p>
              <div className="admin-button-row mt-4">
                <label className="admin-button cursor-pointer">
                  {busyKey === "upload" ? (
                    <LoaderCircle className="animate-spin" size={15} />
                  ) : (
                    <CloudUpload size={15} />
                  )}
                  <span>{busyKey === "upload" ? "Uploading..." : "Upload media"}</span>
                  <input
                    accept="image/*,video/*"
                    className="sr-only"
                    disabled={!cloudinaryReady || busyKey === "upload"}
                    multiple
                    onChange={(event) => void uploadFiles(event.target.files)}
                    type="file"
                  />
                </label>
              </div>
            </article>
          </div>

          <div className="admin-filter-row">
            {(["all", "image", "video"] as const).map((item) => (
              <button
                className={`admin-filter-pill ${mediaFilter === item ? "is-active" : ""}`.trim()}
                key={item}
                onClick={() => setMediaFilter(item)}
                type="button"
              >
                {item === "all" ? "All assets" : `${item}s`}
              </button>
            ))}
            <span className="status-pill status-pill--ok">
              {visibleMedia.length} visible asset{visibleMedia.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {visibleMedia.map((asset) => (
              <article className="admin-record-card" key={asset.publicId}>
                <div className="overflow-hidden rounded-[1.15rem] border border-white/8 bg-black/30">
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
                  <div className="admin-key-list">
                    <span className="admin-key-chip">{asset.publicId}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <button
                    className="admin-button admin-button--ghost"
                    onClick={() => void copyValue(asset.secureUrl, "Asset URL")}
                    type="button"
                  >
                    <Copy size={15} />
                    <span>Copy URL</span>
                  </button>
                  <button
                    className="admin-button admin-button--ghost"
                    onClick={() => void copyValue(asset.publicId, "Public ID")}
                    type="button"
                  >
                    <Copy size={15} />
                    <span>Copy public ID</span>
                  </button>
                </div>
              </article>
            ))}

            {visibleMedia.length === 0 ? (
              <div className="admin-empty">No assets match the current media filter.</div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
