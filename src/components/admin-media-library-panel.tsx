"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CloudUpload, LoaderCircle, RefreshCcw } from "lucide-react";
import { AssetCard } from "@/components/admin/media/AssetCard";
import { SearchBar } from "@/components/admin/media/SearchBar";
import { UploadZone } from "@/components/admin/media/UploadZone";
import { UsagePopover } from "@/components/admin/media/UsagePopover";
import type {
  CmsMediaAsset,
  CmsMediaUsageRecord,
} from "@/lib/cms-types";

type AdminMediaLibraryPanelProps = {
  cloudinaryReady: boolean;
  initialMediaAssets: CmsMediaAsset[];
  initialMediaUsage: CmsMediaUsageRecord[];
};

type FeedbackState = {
  tone: "ok" | "error";
  message: string;
} | null;

type MediaFilter = "all" | "image" | "video";
type MediaSort = "newest" | "oldest" | "name";

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

function createUsageMap(items: CmsMediaUsageRecord[]) {
  return new Map(items.map((item) => [item.publicId, item] as const));
}

export function AdminMediaLibraryPanel({
  cloudinaryReady,
  initialMediaAssets,
  initialMediaUsage,
}: AdminMediaLibraryPanelProps) {
  const [mediaAssets, setMediaAssets] = useState(initialMediaAssets);
  const [usageMap, setUsageMap] = useState(() => createUsageMap(initialMediaUsage));
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [mediaSort, setMediaSort] = useState<MediaSort>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [usageItem, setUsageItem] = useState<CmsMediaUsageRecord | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<CmsMediaAsset | null>(null);

  const visibleMedia = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = mediaAssets.filter((asset) => {
      const matchesType = mediaFilter === "all" || asset.resourceType === mediaFilter;
      const matchesQuery =
        !normalizedQuery ||
        [asset.title, asset.alt, asset.publicId].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return matchesType && matchesQuery;
    });

    return filtered.sort((left, right) => {
      if (mediaSort === "name") {
        return left.title.localeCompare(right.title);
      }

      const leftTime = new Date(left.updatedAt).getTime();
      const rightTime = new Date(right.updatedAt).getTime();
      return mediaSort === "oldest" ? leftTime - rightTime : rightTime - leftTime;
    });
  }, [mediaAssets, mediaFilter, mediaSort, searchQuery]);

  async function syncBundledAssets() {
    setBusyKey("sync-library");
    setFeedback(null);

    const response = await fetch("/api/admin/media/sync", { method: "POST" });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as {
      count: number;
      items: CmsMediaAsset[];
      skipped?: Array<{ filename: string; reason: string }>;
    };

    setMediaAssets((current) => mergeMediaAssets(current, payload.items));
    setBusyKey(null);
    setFeedback({
      tone: "ok",
      message: `${payload.count} asset${payload.count === 1 ? "" : "s"} synced, ${
        payload.skipped?.length ?? 0
      } skipped.`,
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

  async function deleteAsset() {
    if (!deleteCandidate) {
      return;
    }

    setBusyKey(`delete:${deleteCandidate.id}`);
    setFeedback(null);

    const response = await fetch(`/api/admin/media?id=${encodeURIComponent(deleteCandidate.id)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as {
      item: CmsMediaAsset;
      usage?: CmsMediaUsageRecord | null;
      message?: string;
    };

    setMediaAssets((current) =>
      current.filter((asset) => asset.id !== payload.item.id),
    );
    setUsageMap((current) => {
      const next = new Map(current);
      next.delete(payload.item.publicId);
      return next;
    });
    setDeleteCandidate(null);
    setBusyKey(null);
    setFeedback({
      tone: "ok",
      message: payload.message ?? `${payload.item.title} deleted.`,
    });
  }

  const deleteUsage = deleteCandidate ? usageMap.get(deleteCandidate.publicId) ?? null : null;

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
              <h1 className="admin-page-title">Media library.</h1>
              <p className="admin-page-subtitle">
                Search, track usage, upload in batches, and avoid deleting media that is already live on the site.
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
                Sync the real Veronica images and videos already bundled with the project and add
                them to the library index.
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
                  <CloudUpload size={15} />
                  <span>Upload queue</span>
                </span>
              </div>
              <p className="admin-note mt-4">
                Drag files in, edit the suggested title and alt text, then upload them with
                progress tracking.
              </p>
              <div className="mt-4">
                <UploadZone
                  cloudinaryReady={cloudinaryReady}
                  onNotice={setFeedback}
                  onUploaded={(items) => {
                    setMediaAssets((current) => mergeMediaAssets(current, items));
                  }}
                />
              </div>
            </article>
          </div>

          <SearchBar
            filter={mediaFilter}
            onFilterChange={setMediaFilter}
            onQueryChange={setSearchQuery}
            onSortChange={setMediaSort}
            query={searchQuery}
            resultCount={visibleMedia.length}
            sort={mediaSort}
          />

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {visibleMedia.map((asset) => (
              <AssetCard
                asset={asset}
                key={asset.publicId}
                onCopyId={(value) => void copyValue(value, "Public ID")}
                onCopyUrl={(value) => void copyValue(value, "Asset URL")}
                onDelete={setDeleteCandidate}
                onViewUsage={setUsageItem}
                usage={usageMap.get(asset.publicId) ?? null}
              />
            ))}

            {visibleMedia.length === 0 ? (
              <div className="admin-empty">No assets match the current filters.</div>
            ) : null}
          </div>
        </div>
      </section>

      {usageItem ? <UsagePopover item={usageItem} onClose={() => setUsageItem(null)} /> : null}

      {deleteCandidate ? (
        <div className="admin-modal-overlay" role="presentation">
          <div className="admin-modal">
            <div className="admin-panel-header">
              <div>
                <p className="section-label">Delete media</p>
                <h3 className="display-title mt-3 text-3xl text-white">
                  Delete {deleteCandidate.title}?
                </h3>
              </div>
            </div>

            <div className="admin-validation-list mt-5">
              {deleteUsage?.usedIn.length ? (
                <>
                  <article className="admin-validation-item">
                    <strong>This asset is currently in use</strong>
                    <span>
                      Deleting it will break {deleteUsage.pageCount} page
                      {deleteUsage.pageCount === 1 ? "" : "s"} until those sections are updated.
                    </span>
                  </article>
                  {deleteUsage.usedIn.map((usage, index) => (
                    <article className="admin-validation-item" key={`${usage.field}-${index}`}>
                      <strong>
                        {usage.route} / {usage.section}
                      </strong>
                      <span>
                        {usage.field} {usage.isDraft ? "(draft)" : "(published)"}
                      </span>
                    </article>
                  ))}
                </>
              ) : (
                <article className="admin-validation-item">
                  <strong>Unused asset</strong>
                  <span>This asset is not currently referenced by any page content.</span>
                </article>
              )}
            </div>

            <div className="admin-button-row mt-5">
              <button
                className="admin-button admin-button--ghost"
                onClick={() => setDeleteCandidate(null)}
                type="button"
              >
                <span>Cancel</span>
              </button>
              <button
                className="admin-button"
                disabled={busyKey === `delete:${deleteCandidate.id}`}
                onClick={() => void deleteAsset()}
                type="button"
              >
                {busyKey === `delete:${deleteCandidate.id}` ? (
                  <LoaderCircle className="animate-spin" size={15} />
                ) : (
                  <AlertTriangle size={15} />
                )}
                <span>Delete asset</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
