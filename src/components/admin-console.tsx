"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  Disc3,
  ExternalLink,
  LoaderCircle,
  Newspaper,
  Package,
  Pencil,
  Plus,
  Save,
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

type AdminConsoleProps = {
  initialSections: Record<AdminCollectionKey, AdminRecord[]>;
  collections?: readonly AdminCollectionKey[];
};

type FeedbackState = {
  tone: "ok" | "error";
  message: string;
} | null;

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

const collectionUi: Record<
  AdminCollectionKey,
  {
    headline: string;
    intro: string;
    icon: LucideIcon;
    sectionLabel: string;
    composerNote: string;
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
  },
  events: {
    headline: "Keep routing, timing, and venue planning in one live board.",
    intro:
      "Use this workspace to manage confirmed dates, planning notes, and ticket destinations without losing the broader tour picture.",
    icon: CalendarClock,
    sectionLabel: "Live Operations",
    composerNote:
      "Draft upcoming shows and routing details here before pushing them into the broader schedule.",
  },
  products: {
    headline: "Manage merch and offers with a cleaner product release queue.",
    intro:
      "Catalog each product, attach its live link, and keep highlights visible so the storefront stays easy to maintain.",
    icon: Package,
    sectionLabel: "Commerce",
    composerNote:
      "Create the next product record here, then edit notes and launch details directly in the directory.",
  },
  inquiries: {
    headline: "Review incoming conversations in a single, lightweight queue.",
    intro:
      "Track booking, brand, press, and management conversations with clear status, timing, and response context.",
    icon: Newspaper,
    sectionLabel: "Communications",
    composerNote:
      "Capture the request first, then use the list to update status, references, and response notes.",
  },
};

export function AdminConsole({ initialSections, collections }: AdminConsoleProps) {
  const [sections, setSections] = useState(initialSections);
  const [forms, setForms] = useState<Record<AdminCollectionKey, AdminRecordInput>>({
    releases: createBlankRecord("releases"),
    events: createBlankRecord("events"),
    products: createBlankRecord("products"),
    inquiries: createBlankRecord("inquiries"),
  });
  const [editingId, setEditingId] = useState<Record<AdminCollectionKey, string | null>>({
    releases: null,
    events: null,
    products: null,
    inquiries: null,
  });
  const [drafts, setDrafts] = useState<Record<string, AdminRecordInput>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  // Gallery text state: create form keyed by collection, edit form keyed by record id
  const [galleryText, setGalleryText] = useState<Record<string, string>>({ events: "" });
  const [draftGalleryText, setDraftGalleryText] = useState<Record<string, string>>({});

  const counts = useMemo(
    () =>
      adminCollectionOrder.reduce<Record<AdminCollectionKey, number>>(
        (accumulator, collection) => {
          accumulator[collection] = sections[collection].length;
          return accumulator;
        },
        {
          releases: 0,
          events: 0,
          products: 0,
          inquiries: 0,
        },
      ),
    [sections],
  );
  const visibleCollections = collections ?? adminCollectionOrder;

  function updateForm(
    collection: AdminCollectionKey,
    field: keyof AdminRecordInput,
    value: string,
  ) {
    setForms((current) => ({
      ...current,
      [collection]: { ...current[collection], [field]: value },
    }));
  }

  function updateDraft(id: string, field: keyof AdminRecordInput, value: string) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], [field]: value },
    }));
  }

  function beginEdit(collection: AdminCollectionKey, record: AdminRecord) {
    setEditingId((current) => ({ ...current, [collection]: record.id }));
    setDrafts((current) => ({
      ...current,
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
    if (collection === "events") {
      setDraftGalleryText((current) => ({
        ...current,
        [record.id]: (record.galleryImages ?? []).join("\n"),
      }));
    }
    setFeedback(null);
  }

  function cancelEdit(collection: AdminCollectionKey, id: string) {
    setEditingId((current) => ({ ...current, [collection]: null }));
    setDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  async function createRecord(collection: AdminCollectionKey) {
    setBusyKey(`${collection}:create`);
    setFeedback(null);

    const body: AdminRecordInput = { ...forms[collection] };
    if (collection === "events") {
      const lines = (galleryText[collection] ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
      if (lines.length > 0) body.galleryImages = lines;
    }

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
    setSections((current) => ({
      ...current,
      [collection]: sortRecords([payload.item, ...current[collection]]),
    }));
    setForms((current) => ({ ...current, [collection]: createBlankRecord(collection) }));
    if (collection === "events") setGalleryText((c) => ({ ...c, [collection]: "" }));
    setBusyKey(null);
    setFeedback({ tone: "ok", message: `${adminCollectionConfig[collection].singular} created.` });
  }

  async function saveEdit(collection: AdminCollectionKey, id: string) {
    setBusyKey(`${collection}:update:${id}`);
    setFeedback(null);

    const editPayload: AdminRecordInput = { ...drafts[id] };
    if (collection === "events") {
      const lines = (draftGalleryText[id] ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
      editPayload.galleryImages = lines.length > 0 ? lines : [];
    }

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
    setSections((current) => ({
      ...current,
      [collection]: sortRecords(
        current[collection].map((record) => (record.id === id ? payload.item : record)),
      ),
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

    setSections((current) => ({
      ...current,
      [collection]: current[collection].filter((record) => record.id !== id),
    }));
    cancelEdit(collection, id);
    setBusyKey(null);
    setFeedback({ tone: "ok", message: `${adminCollectionConfig[collection].singular} removed.` });
  }

  return (
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
        const Icon = collectionUi[collection].icon;
        const orderedRecords = sortRecords(sections[collection]);
        const linkedCount = orderedRecords.filter((record) => Boolean(record.link)).length;
        const highlightedCount = orderedRecords.filter((record) => Boolean(record.highlight)).length;
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
              <span className="status-pill status-pill--ok">{counts[collection]} records</span>
            </header>

            <div className="admin-surface">
              <div className="admin-panel-header">
                <div className="space-y-3">
                  <div className="admin-panel-meta">
                    <span className="admin-badge">
                      <Icon size={15} />
                      <span>{collectionUi[collection].sectionLabel}</span>
                    </span>
                    <span className="status-pill status-pill--neutral">
                      {config.defaultStatus} default
                    </span>
                  </div>

                  <div>
                    <h2 className="display-title text-4xl text-white sm:text-5xl">
                      {collectionUi[collection].headline}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                      {collectionUi[collection].intro}
                    </p>
                  </div>
                </div>
              </div>

              <div className="admin-editor-summary-strip mt-5">
                <article className="admin-editor-summary-item">
                  <span className="admin-mini-stat-label">Records</span>
                  <strong>{counts[collection]}</strong>
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
                <section className="admin-record-composer">
                  <div className="admin-record-composer-header">
                    <div>
                      <p className="section-label">New entry</p>
                      <h3 className="display-title mt-3 text-3xl text-white">
                        Add {config.singular}
                      </h3>
                    </div>
                    <span className="status-pill status-pill--ok">{counts[collection]} total</span>
                  </div>

                  <p className="admin-note">{collectionUi[collection].composerNote}</p>

                  <div className="admin-form mt-5">
                    <div className="admin-form-grid admin-form-grid--wide">
                      <div className="admin-field">
                        <label htmlFor={`${collection}-title`}>{config.fields.title}</label>
                        <input
                          className="admin-input"
                          id={`${collection}-title`}
                          onChange={(event) =>
                            updateForm(collection, "title", event.target.value)
                          }
                          value={forms[collection].title}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor={`${collection}-subtitle`}>{config.fields.subtitle}</label>
                        <input
                          className="admin-input"
                          id={`${collection}-subtitle`}
                          onChange={(event) =>
                            updateForm(collection, "subtitle", event.target.value)
                          }
                          value={forms[collection].subtitle}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor={`${collection}-status`}>Status</label>
                        <input
                          className="admin-input"
                          id={`${collection}-status`}
                          onChange={(event) =>
                            updateForm(collection, "status", event.target.value)
                          }
                          value={forms[collection].status}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor={`${collection}-highlight`}>{config.fields.highlight}</label>
                        <input
                          className="admin-input"
                          id={`${collection}-highlight`}
                          onChange={(event) =>
                            updateForm(collection, "highlight", event.target.value)
                          }
                          value={forms[collection].highlight}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor={`${collection}-link`}>{config.fields.link}</label>
                        <input
                          className="admin-input"
                          id={`${collection}-link`}
                          onChange={(event) =>
                            updateForm(collection, "link", event.target.value)
                          }
                          value={forms[collection].link}
                        />
                      </div>
                    </div>

                    <div className="admin-field">
                      <label htmlFor={`${collection}-notes`}>{config.fields.notes}</label>
                      <textarea
                        className="admin-textarea"
                        id={`${collection}-notes`}
                        onChange={(event) => updateForm(collection, "notes", event.target.value)}
                        value={forms[collection].notes}
                      />
                    </div>

                    {collection === "events" ? (
                      <>
                        <div className="admin-field">
                          <label htmlFor="events-banner-image">Banner image URL</label>
                          <input
                            className="admin-input"
                            id="events-banner-image"
                            onChange={(event) =>
                              updateForm("events", "bannerImage", event.target.value)
                            }
                            placeholder="https://res.cloudinary.com/…"
                            value={forms["events"].bannerImage ?? ""}
                          />
                          <p className="admin-field-hint">Paste a Cloudinary or external image URL to show as the event banner.</p>
                        </div>
                        <div className="admin-field">
                          <label htmlFor="events-gallery-images">Gallery images (one URL per line)</label>
                          <textarea
                            className="admin-textarea"
                            id="events-gallery-images"
                            onChange={(event) =>
                              setGalleryText((c) => ({ ...c, events: event.target.value }))
                            }
                            placeholder={"https://res.cloudinary.com/…\nhttps://res.cloudinary.com/…"}
                            rows={4}
                            value={galleryText["events"] ?? ""}
                          />
                          <p className="admin-field-hint">Each line becomes one gallery image on the public events page.</p>
                        </div>
                      </>
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

                <section className="admin-record-list-shell">
                  <div className="admin-record-list-topline">
                    <div>
                      <p className="section-label">Directory</p>
                      <h3 className="display-title mt-3 text-3xl text-white">
                        {config.label}
                      </h3>
                    </div>
                    <span className="admin-records-count">{counts[collection]} items</span>
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
                              {collection === "events" && record.bannerImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  alt={record.title}
                                  className="admin-event-card-banner"
                                  src={record.bannerImage}
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
                              {collection === "events" && record.galleryImages?.length ? (
                                <p className="admin-record-sub" style={{ opacity: 0.5 }}>
                                  {record.galleryImages.length} gallery image{record.galleryImages.length === 1 ? "" : "s"}
                                </p>
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
                                    onChange={(event) =>
                                      updateDraft(record.id, "title", event.target.value)
                                    }
                                    value={draft.title}
                                  />
                                </div>

                                <div className="admin-field">
                                  <label>{config.fields.subtitle}</label>
                                  <input
                                    className="admin-input"
                                    onChange={(event) =>
                                      updateDraft(record.id, "subtitle", event.target.value)
                                    }
                                    value={draft.subtitle}
                                  />
                                </div>

                                <div className="admin-field">
                                  <label>Status</label>
                                  <input
                                    className="admin-input"
                                    onChange={(event) =>
                                      updateDraft(record.id, "status", event.target.value)
                                    }
                                    value={draft.status}
                                  />
                                </div>

                                <div className="admin-field">
                                  <label>{config.fields.highlight}</label>
                                  <input
                                    className="admin-input"
                                    onChange={(event) =>
                                      updateDraft(record.id, "highlight", event.target.value)
                                    }
                                    value={draft.highlight}
                                  />
                                </div>

                                <div className="admin-field">
                                  <label>{config.fields.link}</label>
                                  <input
                                    className="admin-input"
                                    onChange={(event) =>
                                      updateDraft(record.id, "link", event.target.value)
                                    }
                                    value={draft.link}
                                  />
                                </div>
                              </div>

                              <div className="admin-field">
                                <label>{config.fields.notes}</label>
                                <textarea
                                  className="admin-textarea"
                                  onChange={(event) =>
                                    updateDraft(record.id, "notes", event.target.value)
                                  }
                                  value={draft.notes}
                                />
                              </div>

                              {collection === "events" ? (
                                <>
                                  <div className="admin-field">
                                    <label>Banner image URL</label>
                                    <input
                                      className="admin-input"
                                      onChange={(event) =>
                                        updateDraft(record.id, "bannerImage", event.target.value)
                                      }
                                      placeholder="https://res.cloudinary.com/…"
                                      value={draft.bannerImage ?? ""}
                                    />
                                    <p className="admin-field-hint">Banner shown on the public events page.</p>
                                  </div>
                                  <div className="admin-field">
                                    <label>Gallery images (one URL per line)</label>
                                    <textarea
                                      className="admin-textarea"
                                      onChange={(event) =>
                                        setDraftGalleryText((c) => ({
                                          ...c,
                                          [record.id]: event.target.value,
                                        }))
                                      }
                                      placeholder={"https://res.cloudinary.com/…\nhttps://res.cloudinary.com/…"}
                                      rows={4}
                                      value={draftGalleryText[record.id] ?? ""}
                                    />
                                    <p className="admin-field-hint">Each line is one gallery image.</p>
                                  </div>
                                </>
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
  );
}
