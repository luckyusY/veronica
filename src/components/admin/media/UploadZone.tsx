"use client";

import { useMemo, useState } from "react";
import { CloudUpload, LoaderCircle, Trash2 } from "lucide-react";
import type { CmsMediaAsset } from "@/lib/cms-types";

type UploadNotice = {
  tone: "ok" | "error";
  message: string;
};

type UploadQueueItem = {
  id: string;
  file: File;
  title: string;
  alt: string;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
};

type UploadZoneProps = {
  cloudinaryReady: boolean;
  onNotice: (notice: UploadNotice) => void;
  onUploaded: (items: CmsMediaAsset[]) => void;
};

function filenameBase(value: string) {
  return value.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
}

function createQueueItem(file: File): UploadQueueItem {
  const label = filenameBase(file.name);
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    file,
    title: label,
    alt: label,
    progress: 0,
    status: "queued",
  };
}

function uploadFileWithProgress(
  item: UploadQueueItem,
  onProgress: (progress: number) => void,
) {
  return new Promise<CmsMediaAsset>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        try {
          const payload = JSON.parse(xhr.responseText) as { error?: string };
          reject(new Error(payload.error ?? "Upload failed."));
        } catch {
          reject(new Error("Upload failed."));
        }
        return;
      }

      const payload = JSON.parse(xhr.responseText) as { item: CmsMediaAsset };
      resolve(payload.item);
    };

    const formData = new FormData();
    formData.append("file", item.file);
    formData.append(
      "folder",
      item.file.type.startsWith("video/") ? "veronica/videos" : "veronica/images",
    );
    formData.append("title", item.title);
    formData.append("alt", item.alt);
    xhr.send(formData);
  });
}

export function UploadZone({ cloudinaryReady, onNotice, onUploaded }: UploadZoneProps) {
  const [items, setItems] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const queuedItems = useMemo(
    () => items.filter((item) => item.status === "queued" || item.status === "error"),
    [items],
  );

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    const nextItems = Array.from(fileList).map(createQueueItem);
    setItems((current) => {
      const known = new Set(current.map((item) => item.id));
      return [...current, ...nextItems.filter((item) => !known.has(item.id))];
    });
  }

  async function uploadAll() {
    if (!queuedItems.length) {
      return;
    }

    setIsUploading(true);
    const uploaded: CmsMediaAsset[] = [];
    let failed = 0;

    for (const item of queuedItems) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, status: "uploading", progress: 0, error: undefined }
            : entry,
        ),
      );

      try {
        const uploadedAsset = await uploadFileWithProgress(item, (progress) => {
          setItems((current) =>
            current.map((entry) =>
              entry.id === item.id ? { ...entry, progress } : entry,
            ),
          );
        });

        uploaded.push(uploadedAsset);
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, status: "done", progress: 100 } : entry,
          ),
        );
      } catch (error) {
        failed += 1;
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed.",
                }
              : entry,
          ),
        );
      }
    }

    setIsUploading(false);

    if (uploaded.length > 0) {
      onUploaded(uploaded);
    }

    onNotice({
      tone: failed > 0 ? "error" : "ok",
      message:
        failed > 0
          ? `${uploaded.length} uploaded, ${failed} failed.`
          : `${uploaded.length} media asset${uploaded.length === 1 ? "" : "s"} uploaded.`,
    });
  }

  return (
    <div className="admin-upload-zone-shell">
      <div
        className={`admin-upload-dropzone ${isDragging ? "is-dragging" : ""}`.trim()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <CloudUpload size={20} />
        <div>
          <strong>Drag and drop files here</strong>
          <p>Photos and videos will upload directly to Cloudinary.</p>
        </div>
        <label className="admin-button cursor-pointer">
          <span>Choose files</span>
          <input
            accept="image/*,video/*"
            className="sr-only"
            disabled={!cloudinaryReady || isUploading}
            multiple
            onChange={(event) => addFiles(event.target.files)}
            type="file"
          />
        </label>
      </div>

      {items.length > 0 ? (
        <div className="admin-upload-queue">
          {items.map((item) => (
            <article className="admin-upload-item" key={item.id}>
              <div className="admin-upload-item-topline">
                <div>
                  <strong>{item.file.name}</strong>
                  <p>{Math.round(item.file.size / 1024)} KB</p>
                </div>
                <button
                  className="admin-icon-button admin-icon-button--danger"
                  disabled={item.status === "uploading"}
                  onClick={() =>
                    setItems((current) => current.filter((entry) => entry.id !== item.id))
                  }
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="admin-upload-item-grid">
                <div className="admin-field">
                  <label>Title</label>
                  <input
                    className="admin-input"
                    disabled={item.status === "uploading" || item.status === "done"}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((entry) =>
                          entry.id === item.id ? { ...entry, title: event.target.value } : entry,
                        ),
                      )
                    }
                    value={item.title}
                  />
                </div>
                <div className="admin-field">
                  <label>Alt text</label>
                  <input
                    className="admin-input"
                    disabled={item.status === "uploading" || item.status === "done"}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((entry) =>
                          entry.id === item.id ? { ...entry, alt: event.target.value } : entry,
                        ),
                      )
                    }
                    value={item.alt}
                  />
                </div>
              </div>

              <div className="admin-progress">
                <div className="admin-progress-fill" style={{ width: `${item.progress}%` }} />
              </div>
              <p className="admin-upload-status">
                {item.status === "uploading" ? (
                  <>
                    <LoaderCircle className="animate-spin" size={14} /> Uploading...
                  </>
                ) : item.status === "done" ? (
                  "Uploaded"
                ) : item.status === "error" ? (
                  item.error ?? "Upload failed."
                ) : (
                  "Queued"
                )}
              </p>
            </article>
          ))}

          <div className="admin-button-row">
            <button
              className="admin-button"
              disabled={!cloudinaryReady || isUploading || queuedItems.length === 0}
              onClick={() => void uploadAll()}
              type="button"
            >
              {isUploading ? <LoaderCircle className="animate-spin" size={15} /> : <CloudUpload size={15} />}
              <span>{isUploading ? "Uploading..." : "Upload queued files"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
