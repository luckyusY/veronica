"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarClock,
  Check,
  Disc3,
  ExternalLink,
  Images,
  LoaderCircle,
  Newspaper,
  Package,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  adminCollectionConfig,
  adminCollectionOrder,
  type AdminCollectionKey,
  type AdminRecord,
  type AdminRecordInput,
} from "@/lib/admin-schema";
import type { CmsMediaAsset } from "@/lib/cms-types";

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminConsoleProps = {
  initialSections: Record<AdminCollectionKey, AdminRecord[]>;
  collections?: readonly AdminCollectionKey[];
};

type FeedbackState = {
  tone: "ok" | "error";
  message: string;
} | null;

type PickerMode = "single" | "multi";

type PickerState = {
  mode: PickerMode;
  onConfirm: (urls: string[]) => void;
} | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createBlankRecord(collection: AdminCollectionKey): AdminRecordInput {
  return {
    title: "",
    subtitle: "",
    status: adminCollectionConfig[collection].defaultStatus,
    highlight: "",
    link: "",
    notes: "",
  };
}

function sortRecords(records: AdminRecord[]) {
  return [...records].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

function thumbUrl(url: string, w = 160, h = 120): string {
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  return (
    url.slice(0, idx + marker.length) +
    `w_${w},h_${h},c_fill,q_auto,f_auto/` +
    url.slice(idx + marker.length)
  );
}

// ─── Collection UI config ─────────────────────────────────────────────────────

const collectionUi: Record<
  AdminCollectionKey,
  {
    headline: string;
    intro: string;
    icon: LucideIcon;
    sectionLabel: string;
    composerNote: string;
    hasImages: boolean;
    hasGallery: boolean;
  }
> = {
  releases: {
    headline: "Track each release with the same clarity as the public brand.",
    intro:
      "Capture launch windows, rollout notes, and destination links so release planning stays focused and current.",
    icon: Disc3,
    sectionLabel: "Music Operations",
    composerNote:
      "Add the next single, campaign, or rollout milestone, then refine the details in the list beside it.",
    hasImages: true,
    hasGallery: false,
  },
  events: {
    headline: "Keep routing, timing, and venue planning in one live board.",
    intro:
      "Use this workspace to manage confirmed dates, planning notes, and ticket destinations without losing the broader tour picture.",
    icon: CalendarClock,
    sectionLabel: "Live Operations",
    composerNote:
      "Draft upcoming shows and routing details here before pushing them into the broader schedule.",
    hasImages: true,
    hasGallery: true,
  },
  products: {
    headline: "Manage merch and offers with a cleaner product release queue.",
    intro:
      "Catalog each product, attach its live link, and keep highlights visible so the storefront stays easy to maintain.",
    icon: Package,
    sectionLabel: "Commerce",
    composerNote:
      "Create the next product record here, then edit notes and launch details directly in the directory.",
    hasImages: true,
    hasGallery: false,
  },
  inquiries: {
    headline: "Review incoming conversations in a single, lightweight queue.",
    intro:
      "Track booking, brand, press, and management conversations with clear status, timing, and response context.",
    icon: Newspaper,
    sectionLabel: "Communications",
    composerNote:
      "Capture the request first, then use the list to update status, references, and response notes.",
    hasImages: false,
    hasGallery: false,
  },
};

// ─── Media Picker Modal ───────────────────────────────────────────────────────

function MediaPickerModal({
  mode,
  assets,
  loading,
  onConfirm,
  onClose,
}: {
  mode: PickerMode;
  assets: CmsMediaAsset[];
  loading: boolean;
  onConfirm: (urls: string[]) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const overlayRef = useRef<HTMLDivElement>(null);

  const imageAssets = assets.filter((a) => a.resourceType === "image");
  const filtered = query.trim()
    ? imageAssets.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.alt.toLowerCase().includes(query.toLowerCase()),
      )
    : imageAssets;

  function toggle(url: string) {
    if (mode === "single") {
      onConfirm([url]);
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  function confirm() {
    onConfirm([...selected]);
  }

  // Close on overlay click
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="media-picker-overlay"
      onClick={handleOverlayClick}
      ref={overlayRef}
    >
      <div className="media-picker-modal">
        {/* Header */}
        <div className="media-picker-header">
          <div>
            <p className="section-label">Media library</p>
            <h3 className="display-title mt-1 text-2xl text-white">
              {mode === "single" ? "Choose image" : "Select images"}
            </h3>
          </div>
          <div className="media-picker-header-actions">
            {mode === "multi" && selected.size > 0 ? (
              <button className="admin-button" onClick={confirm} type="button">
                <Check size={14} />
                <span>Add {selected.size} image{selected.size === 1 ? "" : "s"}</span>
              </button>
            ) : null}
            <button className="admin-icon-button" onClick={onClose} type="button">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="media-picker-search">
          <Search size={14} />
          <input
            autoFocus
            className="media-picker-search-input"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or alt text…"
            type="text"
            value={query}
          />
        </div>

        {/* Grid */}
        <div className="media-picker-body">
          {loading ? (
            <div className="media-picker-loading">
              <LoaderCircle className="animate-spin" size={22} />
              <span>Loading media library…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="media-picker-empty">
              {query ? "No images match your search." : "No images in media library yet. Upload images first."}
            </div>
          ) : (
            <div className="media-picker-grid">
              {filtered.map((asset) => {
                const url = asset.secureUrl;
                const isSelected = selected.has(url);
                return (
                  <button
                    className={`media-picker-item ${isSelected ? "media-picker-item--selected" : ""}`}
                    key={asset.id}
                    onClick={() => toggle(url)}
                    title={asset.alt || asset.title}
                    type="button"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={asset.alt || asset.title}
                      className="media-picker-thumb"
                      src={thumbUrl(url)}
                    />
                    {isSelected ? (
                      <span className="media-picker-check">
                        <Check size={13} />
                      </span>
                    ) : null}
                    <span className="media-picker-label">{asset.title || asset.alt}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Image field sub-components ───────────────────────────────────────────────

function BannerImageField({
  value,
  onChange,
  onPickerOpen,
  label = "Banner image",
  hint = "Shown as the main image on the public page.",
}: {
  value: string;
  onChange: (url: string) => void;
  onPickerOpen: () => void;
  label?: string;
  hint?: string;
}) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className="admin-image-field">
        {value ? (
          <div className="admin-image-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Banner"
              className="admin-image-preview-thumb"
              src={thumbUrl(value, 200, 120)}
            />
            <button
              className="admin-image-preview-remove"
              onClick={() => onChange("")}
              title="Remove image"
              type="button"
            >
              <X size={12} />
            </button>
          </div>
        ) : null}
        <button
          className="admin-image-pick-btn"
          onClick={onPickerOpen}
          type="button"
        >
          <Images size={14} />
          <span>{value ? "Change image" : "Choose from library"}</span>
        </button>
      </div>
      <p className="admin-field-hint">{hint}</p>
    </div>
  );
}

function GalleryField({
  value,
  onChange,
  onPickerOpen,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  onPickerOpen: () => void;
}) {
  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className="admin-field">
      <label>Gallery images</label>
      {value.length > 0 ? (
        <div className="admin-gallery-thumbs">
          {value.map((url) => (
            <div className="admin-gallery-thumb-item" key={url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="admin-gallery-thumb-img"
                src={thumbUrl(url, 100, 80)}
              />
              <button
                className="admin-gallery-thumb-remove"
                onClick={() => remove(url)}
                title="Remove"
                type="button"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <button
        className="admin-image-pick-btn"
        onClick={onPickerOpen}
        type="button"
      >
        <Images size={14} />
        <span>{value.length > 0 ? `Add more images (${value.length} selected)` : "Choose gallery images"}</span>
      </button>
      <p className="admin-field-hint">Images shown in the gallery strip on the public page.</p>
    </div>
  );
}

// ─── Main AdminConsole ────────────────────────────────────────────────────────

export function AdminConsole({ initialSections, collections }: AdminConsoleProps) {
  const [sections, setSections] = useState(initialSections);

  // Create-form state
  const [forms, setForms] = useState<Record<AdminCollectionKey, AdminRecordInput>>({
    releases: createBlankRecord("releases"),
    events: createBlankRecord("events"),
    products: createBlankRecord("products"),
    inquiries: createBlankRecord("inquiries"),
  });
  // Gallery arrays for create forms (keyed by collection)
  const [formGallery, setFormGallery] = useState<Record<string, string[]>>({});

  // Edit-draft state
  const [editingId, setEditingId] = useState<Record<AdminCollectionKey, string | null>>({
    releases: null,
    events: null,
    products: null,
    inquiries: null,
  });
  const [drafts, setDrafts] = useState<Record<string, AdminRecordInput>>({});
  // Gallery arrays for edit drafts (keyed by record id)
  const [draftGallery, setDraftGallery] = useState<Record<string, string[]>>({});

  // UI state
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  // Media picker
  const [picker, setPicker] = useState<PickerState>(null);
  const [mediaAssets, setMediaAssets] = useState<CmsMediaAsset[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const mediaFetched = useRef(false);

  // Fetch media assets once when picker is first opened
  const openPicker = useCallback(
    (mode: PickerMode, onConfirm: (urls: string[]) => void) => {
      setPicker({ mode, onConfirm });
      if (!mediaFetched.current) {
        mediaFetched.current = true;
        setMediaLoading(true);
        fetch("/api/admin/media")
          .then((r) => r.json())
          .then((data: { items?: CmsMediaAsset[] }) => {
            setMediaAssets(data.items ?? []);
          })
          .catch(() => {/* silently fail */})
          .finally(() => setMediaLoading(false));
      }
    },
    [],
  );

  const closePicker = useCallback(() => setPicker(null), []);

  const visibleCollections = collections ?? adminCollectionOrder;

  // ── Form helpers ────────────────────────────────────────────────────────────

  function updateForm(collection: AdminCollectionKey, field: keyof AdminRecordInput, value: string) {
    setForms((c) => ({ ...c, [collection]: { ...c[collection], [field]: value } }));
  }

  function updateDraft(id: string, field: keyof AdminRecordInput, value: string) {
    setDrafts((c) => ({ ...c, [id]: { ...c[id], [field]: value } }));
  }

  // ── Edit lifecycle ──────────────────────────────────────────────────────────

  function beginEdit(collection: AdminCollectionKey, record: AdminRecord) {
    setEditingId((c) => ({ ...c, [collection]: record.id }));
    setDrafts((c) => ({
      ...c,
      [record.id]: {
        title: record.title,
        subtitle: record.subtitle,
        status: record.status,
        highlight: record.highlight,
        link: record.link,
        notes: record.notes,
        bannerImage: record.bannerImage ?? "",
      },
    }));
    setDraftGallery((c) => ({ ...c, [record.id]: record.galleryImages ?? [] }));
    setFeedback(null);
  }

  function cancelEdit(collection: AdminCollectionKey, id: string) {
    setEditingId((c) => ({ ...c, [collection]: null }));
    setDrafts((c) => { const n = { ...c }; delete n[id]; return n; });
  }

  // ── CRUD ────────────────────────────────────────────────────────────────────

  async function createRecord(collection: AdminCollectionKey) {
    setBusyKey(`${collection}:create`);
    setFeedback(null);

    const body: AdminRecordInput = { ...forms[collection] };
    const gallery = formGallery[collection] ?? [];
    if (gallery.length > 0) body.galleryImages = gallery;

    const response = await fetch(`/api/admin/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as { item: AdminRecord };
    setSections((c) => ({
      ...c,
      [collection]: sortRecords([payload.item, ...c[collection]]),
    }));
    setForms((c) => ({ ...c, [collection]: createBlankRecord(collection) }));
    setFormGallery((c) => ({ ...c, [collection]: [] }));
    setBusyKey(null);
    setFeedback({ tone: "ok", message: `${adminCollectionConfig[collection].singular} created.` });
  }

  async function saveEdit(collection: AdminCollectionKey, id: string) {
    setBusyKey(`${collection}:update:${id}`);
    setFeedback(null);

    const editPayload: AdminRecordInput = { ...drafts[id] };
    editPayload.galleryImages = draftGallery[id] ?? [];

    const response = await fetch(`/api/admin/${collection}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPayload),
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as { item: AdminRecord };
    setSections((c) => ({
      ...c,
      [collection]: sortRecords(c[collection].map((r) => (r.id === id ? payload.item : r))),
    }));
    cancelEdit(collection, id);
    setBusyKey(null);
    setFeedback({ tone: "ok", message: `${adminCollectionConfig[collection].singular} updated.` });
  }

  async function deleteRecord(collection: AdminCollectionKey, id: string) {
    setBusyKey(`${collection}:delete:${id}`);
    setFeedback(null);

    const response = await fetch(`/api/admin/${collection}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    setSections((c) => ({
      ...c,
      [collection]: c[collection].filter((r) => r.id !== id),
    }));
    cancelEdit(collection, id);
    setBusyKey(null);
    setFeedback({ tone: "ok", message: `${adminCollectionConfig[collection].singular} removed.` });
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Media picker modal */}
      {picker ? (
        <MediaPickerModal
          assets={mediaAssets}
          loading={mediaLoading}
          mode={picker.mode}
          onClose={closePicker}
          onConfirm={(urls) => {
            picker.onConfirm(urls);
            closePicker();
          }}
        />
      ) : null}

      <div className="admin-page-stack">
        {feedback ? (
          <div
            className={`admin-feedback ${
              feedback.tone === "ok" ? "admin-feedback--ok" : "admin-feedback--error"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        {visibleCollections.map((collection) => {
          const config = adminCollectionConfig[collection];
          const ui = collectionUi[collection];
          const Icon = ui.icon;
          const orderedRecords = sortRecords(sections[collection]);
          const linkedCount = orderedRecords.filter((r) => Boolean(r.link)).length;
          const highlightedCount = orderedRecords.filter((r) => Boolean(r.highlight)).length;
          const latestRecord = orderedRecords[0] ?? null;

          return (
            <section className="admin-page-stack" key={collection}>
              <header className="admin-page-head">
                <div className="admin-page-head-left">
                  <div className="admin-page-head-icon">
                    <Icon size={18} />
                  </div>
                  <h1 className="admin-page-title">{config.label}</h1>
                </div>
                <span className="status-pill status-pill--ok">{sections[collection].length} records</span>
              </header>

              <div className="admin-surface">
                <div className="admin-panel-header">
                  <div className="space-y-3">
                    <div className="admin-panel-meta">
                      <span className="admin-badge">
                        <Icon size={15} />
                        <span>{ui.sectionLabel}</span>
                      </span>
                      <span className="status-pill status-pill--neutral">
                        {config.defaultStatus} default
                      </span>
                    </div>
                    <div>
                      <h2 className="display-title text-4xl text-white sm:text-5xl">{ui.headline}</h2>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">{ui.intro}</p>
                    </div>
                  </div>
                </div>

                <div className="admin-editor-summary-strip mt-5">
                  <article className="admin-editor-summary-item">
                    <span className="admin-mini-stat-label">Records</span>
                    <strong>{sections[collection].length}</strong>
                  </article>
                  <article className="admin-editor-summary-item">
                    <span className="admin-mini-stat-label">Linked items</span>
                    <strong>{linkedCount}</strong>
                  </article>
                  <article className="admin-editor-summary-item">
                    <span className="admin-mini-stat-label">Highlights</span>
                    <strong>{highlightedCount}</strong>
                  </article>
                  <article className="admin-editor-summary-item">
                    <span className="admin-mini-stat-label">Latest update</span>
                    <strong>
                      {latestRecord ? formatUpdatedAt(latestRecord.updatedAt) : "No records yet"}
                    </strong>
                  </article>
                </div>

                <div className="admin-operations-layout mt-5">
                  {/* ── Create form ── */}
                  <section className="admin-record-composer">
                    <div className="admin-record-composer-header">
                      <div>
                        <p className="section-label">New entry</p>
                        <h3 className="display-title mt-3 text-3xl text-white">
                          Add {config.singular}
                        </h3>
                      </div>
                      <span className="status-pill status-pill--ok">{sections[collection].length} total</span>
                    </div>

                    <p className="admin-note">{ui.composerNote}</p>

                    <div className="admin-form mt-5">
                      <div className="admin-form-grid admin-form-grid--wide">
                        <div className="admin-field">
                          <label htmlFor={`${collection}-title`}>{config.fields.title}</label>
                          <input
                            className="admin-input"
                            id={`${collection}-title`}
                            onChange={(e) => updateForm(collection, "title", e.target.value)}
                            value={forms[collection].title}
                          />
                        </div>

                        <div className="admin-field">
                          <label htmlFor={`${collection}-subtitle`}>{config.fields.subtitle}</label>
                          <input
                            className="admin-input"
                            id={`${collection}-subtitle`}
                            onChange={(e) => updateForm(collection, "subtitle", e.target.value)}
                            value={forms[collection].subtitle}
                          />
                        </div>

                        <div className="admin-field">
                          <label htmlFor={`${collection}-status`}>Status</label>
                          <input
                            className="admin-input"
                            id={`${collection}-status`}
                            onChange={(e) => updateForm(collection, "status", e.target.value)}
                            value={forms[collection].status}
                          />
                        </div>

                        <div className="admin-field">
                          <label htmlFor={`${collection}-highlight`}>{config.fields.highlight}</label>
                          <input
                            className="admin-input"
                            id={`${collection}-highlight`}
                            onChange={(e) => updateForm(collection, "highlight", e.target.value)}
                            value={forms[collection].highlight}
                          />
                        </div>

                        <div className="admin-field">
                          <label htmlFor={`${collection}-link`}>{config.fields.link}</label>
                          <input
                            className="admin-input"
                            id={`${collection}-link`}
                            onChange={(e) => updateForm(collection, "link", e.target.value)}
                            value={forms[collection].link}
                          />
                        </div>
                      </div>

                      <div className="admin-field">
                        <label htmlFor={`${collection}-notes`}>{config.fields.notes}</label>
                        <textarea
                          className="admin-textarea"
                          id={`${collection}-notes`}
                          onChange={(e) => updateForm(collection, "notes", e.target.value)}
                          value={forms[collection].notes}
                        />
                      </div>

                      {/* Image fields for collections that support them */}
                      {ui.hasImages ? (
                        <BannerImageField
                          hint={
                            collection === "events"
                              ? "Shown as the event banner on the public events page."
                              : "Cover image shown alongside this record."
                          }
                          label={collection === "events" ? "Banner image" : "Cover image"}
                          onChange={(url) => updateForm(collection, "bannerImage", url)}
                          onPickerOpen={() =>
                            openPicker("single", ([url]) => {
                              if (url) updateForm(collection, "bannerImage", url);
                            })
                          }
                          value={forms[collection].bannerImage ?? ""}
                        />
                      ) : null}

                      {ui.hasGallery ? (
                        <GalleryField
                          onChange={(urls) =>
                            setFormGallery((c) => ({ ...c, [collection]: urls }))
                          }
                          onPickerOpen={() =>
                            openPicker("multi", (urls) => {
                              setFormGallery((c) => ({
                                ...c,
                                [collection]: [...(c[collection] ?? []), ...urls.filter(
                                  (u) => !(c[collection] ?? []).includes(u)
                                )],
                              }));
                            })
                          }
                          value={formGallery[collection] ?? []}
                        />
                      ) : null}

                      <div className="admin-button-row">
                        <button
                          className="admin-button"
                          disabled={busyKey === `${collection}:create`}
                          onClick={() => void createRecord(collection)}
                          type="button"
                        >
                          {busyKey === `${collection}:create` ? (
                            <LoaderCircle className="animate-spin" size={15} />
                          ) : (
                            <Plus size={15} />
                          )}
                          <span>Add {config.singular}</span>
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* ── Record list ── */}
                  <section className="admin-record-list-shell">
                    <div className="admin-record-list-topline">
                      <div>
                        <p className="section-label">Directory</p>
                        <h3 className="display-title mt-3 text-3xl text-white">{config.label}</h3>
                      </div>
                      <span className="admin-records-count">{sections[collection].length} items</span>
                    </div>

                    <p className="admin-note">{config.description}</p>

                    <div className="admin-record-list">
                      {orderedRecords.length === 0 ? (
                        <div className="admin-empty">{config.emptyTitle}</div>
                      ) : null}

                      {orderedRecords.map((record) => {
                        const isEditing = editingId[collection] === record.id;
                        const draft = drafts[record.id];
                        const busyUpdate = busyKey === `${collection}:update:${record.id}`;
                        const busyDelete = busyKey === `${collection}:delete:${record.id}`;

                        return (
                          <article className="admin-record-card" key={record.id}>
                            <div className="admin-record-header">
                              <div className="admin-record-main">
                                {record.bannerImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    alt={record.title}
                                    className="admin-event-card-banner"
                                    src={thumbUrl(record.bannerImage, 400, 140)}
                                  />
                                ) : null}
                                <div className="admin-record-topline">
                                  <span className="admin-badge">{record.status}</span>
                                  {record.highlight ? (
                                    <span className="status-pill status-pill--warn">
                                      {record.highlight}
                                    </span>
                                  ) : null}
                                  <span className="admin-record-date">
                                    Updated {formatUpdatedAt(record.updatedAt)}
                                  </span>
                                </div>
                                <h3 className="admin-record-title">{record.title}</h3>
                                {record.subtitle ? (
                                  <p className="admin-record-sub">{record.subtitle}</p>
                                ) : null}
                                {record.notes ? <p className="admin-note">{record.notes}</p> : null}
                                {record.galleryImages?.length ? (
                                  <div className="admin-record-gallery-strip">
                                    {record.galleryImages.slice(0, 5).map((url, i) => (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        alt=""
                                        className="admin-record-gallery-mini"
                                        key={i}
                                        src={thumbUrl(url, 72, 56)}
                                      />
                                    ))}
                                    {record.galleryImages.length > 5 ? (
                                      <span className="admin-record-gallery-more">
                                        +{record.galleryImages.length - 5}
                                      </span>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>

                              <div className="admin-record-actions">
                                {record.link ? (
                                  <a
                                    className="admin-icon-button"
                                    href={record.link}
                                    rel="noreferrer"
                                    target="_blank"
                                    title="Open link"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                ) : null}
                                {!isEditing ? (
                                  <button
                                    className="admin-icon-button"
                                    onClick={() => beginEdit(collection, record)}
                                    title="Edit"
                                    type="button"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                ) : (
                                  <button
                                    className="admin-icon-button"
                                    onClick={() => cancelEdit(collection, record.id)}
                                    title="Cancel"
                                    type="button"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                                <button
                                  className="admin-icon-button admin-icon-button--danger"
                                  disabled={busyDelete}
                                  onClick={() => void deleteRecord(collection, record.id)}
                                  title="Delete"
                                  type="button"
                                >
                                  {busyDelete ? (
                                    <LoaderCircle className="animate-spin" size={14} />
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </button>
                              </div>
                            </div>

                            {isEditing && draft ? (
                              <div className="admin-edit-grid">
                                <div className="admin-form-grid admin-form-grid--wide">
                                  <div className="admin-field">
                                    <label>{config.fields.title}</label>
                                    <input
                                      className="admin-input"
                                      onChange={(e) => updateDraft(record.id, "title", e.target.value)}
                                      value={draft.title}
                                    />
                                  </div>
                                  <div className="admin-field">
                                    <label>{config.fields.subtitle}</label>
                                    <input
                                      className="admin-input"
                                      onChange={(e) => updateDraft(record.id, "subtitle", e.target.value)}
                                      value={draft.subtitle}
                                    />
                                  </div>
                                  <div className="admin-field">
                                    <label>Status</label>
                                    <input
                                      className="admin-input"
                                      onChange={(e) => updateDraft(record.id, "status", e.target.value)}
                                      value={draft.status}
                                    />
                                  </div>
                                  <div className="admin-field">
                                    <label>{config.fields.highlight}</label>
                                    <input
                                      className="admin-input"
                                      onChange={(e) => updateDraft(record.id, "highlight", e.target.value)}
                                      value={draft.highlight}
                                    />
                                  </div>
                                  <div className="admin-field">
                                    <label>{config.fields.link}</label>
                                    <input
                                      className="admin-input"
                                      onChange={(e) => updateDraft(record.id, "link", e.target.value)}
                                      value={draft.link}
                                    />
                                  </div>
                                </div>

                                <div className="admin-field">
                                  <label>{config.fields.notes}</label>
                                  <textarea
                                    className="admin-textarea"
                                    onChange={(e) => updateDraft(record.id, "notes", e.target.value)}
                                    value={draft.notes}
                                  />
                                </div>

                                {ui.hasImages ? (
                                  <BannerImageField
                                    hint={
                                      collection === "events"
                                        ? "Banner shown on the public events page."
                                        : "Cover image shown alongside this record."
                                    }
                                    label={collection === "events" ? "Banner image" : "Cover image"}
                                    onChange={(url) => updateDraft(record.id, "bannerImage", url)}
                                    onPickerOpen={() =>
                                      openPicker("single", ([url]) => {
                                        if (url) updateDraft(record.id, "bannerImage", url);
                                      })
                                    }
                                    value={draft.bannerImage ?? ""}
                                  />
                                ) : null}

                                {ui.hasGallery ? (
                                  <GalleryField
                                    onChange={(urls) =>
                                      setDraftGallery((c) => ({ ...c, [record.id]: urls }))
                                    }
                                    onPickerOpen={() =>
                                      openPicker("multi", (urls) => {
                                        setDraftGallery((c) => ({
                                          ...c,
                                          [record.id]: [...(c[record.id] ?? []), ...urls.filter(
                                            (u) => !(c[record.id] ?? []).includes(u)
                                          )],
                                        }));
                                      })
                                    }
                                    value={draftGallery[record.id] ?? []}
                                  />
                                ) : null}

                                <div className="admin-button-row">
                                  <button
                                    className="admin-button"
                                    disabled={busyUpdate}
                                    onClick={() => void saveEdit(collection, record.id)}
                                    type="button"
                                  >
                                    {busyUpdate ? (
                                      <LoaderCircle className="animate-spin" size={14} />
                                    ) : (
                                      <Save size={14} />
                                    )}
                                    <span>Save changes</span>
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
