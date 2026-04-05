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
      },
    }));
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

    const response = await fetch(`/api/admin/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forms[collection]),
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
    setBusyKey(null);
    setFeedback({ tone: "ok", message: `${adminCollectionConfig[collection].singular} created.` });
  }

  async function saveEdit(collection: AdminCollectionKey, id: string) {
    setBusyKey(`${collection}:update:${id}`);
    setFeedback(null);

    const response = await fetch(`/api/admin/${collection}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drafts[id]),
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
        const records = sections[collection];

        return (
          <div key={collection}>
            <header className="admin-page-head">
              <div className="admin-page-head-left">
                <h1 className="admin-page-title">{config.label}</h1>
              </div>
              <span className="status-pill status-pill--ok">{counts[collection]} records</span>
            </header>

            <div className="admin-ops-body" style={{ marginTop: "1rem" }}>
              {/* Add record form */}
              <div className="admin-add-form-panel">
                <div className="admin-add-form-head">
                  <p className="admin-add-form-title">New {config.singular}</p>
                </div>

                <div className="admin-form">
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

                  <div className="admin-button-row">
                    <button
                      className="admin-button"
                      disabled={busyKey === `${collection}:create`}
                      onClick={() => createRecord(collection)}
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
              </div>

              {/* Records list */}
              <div className="admin-records-panel">
                <div className="admin-records-head">
                  <p className="admin-records-title">Records</p>
                  <span className="admin-records-count">{counts[collection]} total</span>
                </div>

                <div className="admin-record-list">
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
                              <h3 className="text-base font-semibold text-white">
                                {record.title}
                              </h3>
                              {record.subtitle ? (
                                <p className="mt-1 text-sm leading-6 text-white/56">
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
                                <ExternalLink size={14} />
                                <span>Open</span>
                              </a>
                            ) : null}

                            {!isEditing ? (
                              <button
                                className="admin-button admin-button--secondary"
                                onClick={() => beginEdit(collection, record)}
                                type="button"
                              >
                                <Pencil size={14} />
                                <span>Edit</span>
                              </button>
                            ) : (
                              <button
                                className="admin-button admin-button--ghost"
                                onClick={() => cancelEdit(collection, record.id)}
                                type="button"
                              >
                                <X size={14} />
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
                                <LoaderCircle className="animate-spin" size={14} />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {record.notes ? (
                          <p className="admin-note">{record.notes}</p>
                        ) : null}

                        <p className="text-xs uppercase tracking-[0.16em] text-white/32">
                          Updated {formatUpdatedAt(record.updatedAt)}
                        </p>

                        {isEditing && draft ? (
                          <div className="admin-edit-grid">
                            <div className="admin-form-grid admin-form-grid--wide">
                              <div className="admin-field">
                                <label>{config.fields.title}</label>
                                <input
                                  className="admin-input"
                                  onChange={(e) =>
                                    updateDraft(record.id, "title", e.target.value)
                                  }
                                  value={draft.title}
                                />
                              </div>

                              <div className="admin-field">
                                <label>{config.fields.subtitle}</label>
                                <input
                                  className="admin-input"
                                  onChange={(e) =>
                                    updateDraft(record.id, "subtitle", e.target.value)
                                  }
                                  value={draft.subtitle}
                                />
                              </div>

                              <div className="admin-field">
                                <label>Status</label>
                                <input
                                  className="admin-input"
                                  onChange={(e) =>
                                    updateDraft(record.id, "status", e.target.value)
                                  }
                                  value={draft.status}
                                />
                              </div>

                              <div className="admin-field">
                                <label>{config.fields.highlight}</label>
                                <input
                                  className="admin-input"
                                  onChange={(e) =>
                                    updateDraft(record.id, "highlight", e.target.value)
                                  }
                                  value={draft.highlight}
                                />
                              </div>

                              <div className="admin-field">
                                <label>{config.fields.link}</label>
                                <input
                                  className="admin-input"
                                  onChange={(e) =>
                                    updateDraft(record.id, "link", e.target.value)
                                  }
                                  value={draft.link}
                                />
                              </div>
                            </div>

                            <div className="admin-field">
                              <label>{config.fields.notes}</label>
                              <textarea
                                className="admin-textarea"
                                onChange={(e) =>
                                  updateDraft(record.id, "notes", e.target.value)
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
