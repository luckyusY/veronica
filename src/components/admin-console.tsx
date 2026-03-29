"use client";

import { useMemo, useState } from "react";
import { ExternalLink, LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
      [collection]: {
        ...current[collection],
        [field]: value,
      },
    }));
  }

  function updateDraft(id: string, field: keyof AdminRecordInput, value: string) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  }

  function beginEdit(collection: AdminCollectionKey, record: AdminRecord) {
    setEditingId((current) => ({
      ...current,
      [collection]: record.id,
    }));
    setDrafts((current) => ({
      ...current,
      [record.id]: {
        title: record.title,
        subtitle: record.subtitle,
        status: record.status,
        highlight: record.highlight,
        link: record.link,
        notes: record.notes,
      },
    }));
    setFeedback(null);
  }

  function cancelEdit(collection: AdminCollectionKey, id: string) {
    setEditingId((current) => ({
      ...current,
      [collection]: null,
    }));
    setDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  async function createRecord(collection: AdminCollectionKey) {
    setBusyKey(`${collection}:create`);
    setFeedback(null);

    const response = await fetch(`/api/admin/${collection}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forms[collection]),
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({
        tone: "error",
        message: await readApiError(response),
      });
      return;
    }

    const payload = (await response.json()) as { item: AdminRecord };

    setSections((current) => ({
      ...current,
      [collection]: sortRecords([payload.item, ...current[collection]]),
    }));
    setForms((current) => ({
      ...current,
      [collection]: createBlankRecord(collection),
    }));
    setBusyKey(null);
    setFeedback({
      tone: "ok",
      message: `${adminCollectionConfig[collection].singular} created.`,
    });
  }

  async function saveEdit(collection: AdminCollectionKey, id: string) {
    setBusyKey(`${collection}:update:${id}`);
    setFeedback(null);

    const response = await fetch(`/api/admin/${collection}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(drafts[id]),
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({
        tone: "error",
        message: await readApiError(response),
      });
      return;
    }

    const payload = (await response.json()) as { item: AdminRecord };

    setSections((current) => ({
      ...current,
      [collection]: sortRecords(
        current[collection].map((record) =>
          record.id === id ? payload.item : record,
        ),
      ),
    }));
    cancelEdit(collection, id);
    setBusyKey(null);
    setFeedback({
      tone: "ok",
      message: `${adminCollectionConfig[collection].singular} updated.`,
    });
  }

  async function deleteRecord(collection: AdminCollectionKey, id: string) {
    setBusyKey(`${collection}:delete:${id}`);
    setFeedback(null);

    const response = await fetch(`/api/admin/${collection}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({
        tone: "error",
        message: await readApiError(response),
      });
      return;
    }

    setSections((current) => ({
      ...current,
      [collection]: current[collection].filter((record) => record.id !== id),
    }));
    cancelEdit(collection, id);
    setBusyKey(null);
    setFeedback({
      tone: "ok",
      message: `${adminCollectionConfig[collection].singular} removed.`,
    });
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

      {visibleCollections.map((collection) => {
        const config = adminCollectionConfig[collection];
        const records = sections[collection];

        return (
          <section className="admin-surface" id={collection} key={collection}>
            <div className="admin-panel-header">
              <div className="space-y-3">
                <div className="admin-panel-meta">
                  <span className="admin-badge">{config.label}</span>
                  <span className="status-pill status-pill--ok">{counts[collection]} records</span>
                </div>
                <div>
                  <h2 className="display-title text-4xl text-white sm:text-5xl">
                    {config.label}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                    {config.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="luxury-divider my-5" />

            <div className="admin-operations-layout">
              <div className="admin-record-composer">
                <div className="admin-record-composer-header">
                  <div>
                    <p className="section-label">New record</p>
                    <h3 className="display-title mt-3 text-3xl text-white">
                      Add {config.singular}
                    </h3>
                  </div>
                  <p className="text-sm leading-7 text-white/58">
                    Keep titles, status, notes, and links together in one clean form.
                  </p>
                </div>

                <div className="admin-form">
                  <div className="admin-form-grid admin-form-grid--wide">
                    <div className="admin-field">
                      <label htmlFor={`${collection}-title`}>{config.fields.title}</label>
                      <input
                        className="admin-input"
                        id={`${collection}-title`}
                        onChange={(event) => updateForm(collection, "title", event.target.value)}
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
                        onChange={(event) => updateForm(collection, "status", event.target.value)}
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
                        onChange={(event) => updateForm(collection, "link", event.target.value)}
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

                  <div className="admin-button-row">
                    <button
                      className="admin-button"
                      disabled={busyKey === `${collection}:create`}
                      onClick={() => createRecord(collection)}
                      type="button"
                    >
                      {busyKey === `${collection}:create` ? (
                        <LoaderCircle className="animate-spin" size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                      <span>Add {config.singular}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-record-list-shell">
                <div className="admin-record-list-topline">
                  <p className="section-label">Existing records</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/38">
                    {counts[collection]} total
                  </p>
                </div>

                <div className="luxury-divider my-5" />

                <div className="admin-record-grid">
                  {records.length === 0 ? (
                    <div className="admin-empty">{config.emptyTitle}</div>
                  ) : null}

                  {records.map((record) => {
                    const isEditing = editingId[collection] === record.id;
                    const draft = drafts[record.id];
                    const busyUpdate = busyKey === `${collection}:update:${record.id}`;
                    const busyDelete = busyKey === `${collection}:delete:${record.id}`;

                    return (
                      <article className="admin-record-card" key={record.id}>
                        <div className="admin-record-header">
                          <div className="admin-record-copy">
                            <div className="admin-panel-meta">
                              <span className="admin-badge">{record.status}</span>
                              {record.highlight ? (
                                <span className="status-pill status-pill--warn">
                                  {record.highlight}
                                </span>
                              ) : null}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{record.title}</h3>
                              {record.subtitle ? (
                                <p className="mt-2 text-sm leading-7 text-white/60">
                                  {record.subtitle}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="admin-button-row">
                            {record.link ? (
                              <a
                                className="admin-button admin-button--ghost"
                                href={record.link}
                                rel="noreferrer"
                                target="_blank"
                              >
                                <ExternalLink size={15} />
                                <span>Open</span>
                              </a>
                            ) : null}

                            {!isEditing ? (
                              <button
                                className="admin-button admin-button--secondary"
                                onClick={() => beginEdit(collection, record)}
                                type="button"
                              >
                                <Pencil size={15} />
                                <span>Edit</span>
                              </button>
                            ) : (
                              <button
                                className="admin-button admin-button--ghost"
                                onClick={() => cancelEdit(collection, record.id)}
                                type="button"
                              >
                                <X size={15} />
                                <span>Cancel</span>
                              </button>
                            )}

                            <button
                              className="admin-button admin-button--ghost"
                              disabled={busyDelete}
                              onClick={() => deleteRecord(collection, record.id)}
                              type="button"
                            >
                              {busyDelete ? (
                                <LoaderCircle className="animate-spin" size={15} />
                              ) : (
                                <Trash2 size={15} />
                              )}
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        <p className="admin-note">
                          {record.notes || "No notes added yet."}
                        </p>

                        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                          Updated {formatUpdatedAt(record.updatedAt)}
                        </p>

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

                            <div className="admin-button-row">
                              <button
                                className="admin-button"
                                disabled={busyUpdate}
                                onClick={() => saveEdit(collection, record.id)}
                                type="button"
                              >
                                {busyUpdate ? (
                                  <LoaderCircle className="animate-spin" size={15} />
                                ) : (
                                  <Save size={15} />
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
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
