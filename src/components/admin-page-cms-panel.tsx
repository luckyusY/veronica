"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileJson, LoaderCircle, RefreshCcw, Rocket, Save, Trash2 } from "lucide-react";
import { SectionEditor } from "@/components/admin/cms/SectionEditor";
import { SectionFieldsRenderer } from "@/components/admin/cms/SectionFieldsRenderer";
import { defaultCmsPageContent } from "@/lib/cms-defaults";
import {
  buildValidationState,
  countChangedFields,
  formatRelativeFromNow,
  formatUpdatedAt,
  getSectionErrorCount,
  getStatusConfig,
  summarizePageContent,
  type ValidationErrorMap,
  type ValidationIssueItem,
} from "@/lib/cms-admin-ui";
import { humanizeKey, isPlainObject } from "@/lib/cms-editor-utils";
import { cmsPageEditorSchemas } from "@/lib/schemas/cms-pages";
import type {
  CmsMediaAsset,
  CmsPageSlug,
  CmsPageWorkspaceDocument,
} from "@/lib/cms-types";

type AdminPageCmsPanelProps = {
  initialPages: CmsPageWorkspaceDocument[];
  initialMediaAssets: CmsMediaAsset[];
  selectedSlug: CmsPageSlug;
};

type FeedbackState = {
  tone: "ok" | "error";
  message: string;
} | null;

type PageDraft = {
  name: string;
  summary: string;
  content: unknown;
};

type PageMutationResponse = {
  success: boolean;
  item?: CmsPageWorkspaceDocument;
  error?: string;
  message?: string;
};

async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

function createDraftState(page: CmsPageWorkspaceDocument): PageDraft {
  return {
    name: page.name,
    summary: page.summary,
    content: JSON.parse(JSON.stringify(page.content)),
  };
}

export function AdminPageCmsPanel({
  initialPages,
  initialMediaAssets,
  selectedSlug,
}: AdminPageCmsPanelProps) {
  const [pages, setPages] = useState(initialPages);
  const [pageDrafts, setPageDrafts] = useState<Record<string, PageDraft>>(() =>
    Object.fromEntries(initialPages.map((page) => [page.slug, createDraftState(page)])),
  );
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorMap>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssueItem[] | null>(null);

  const selectedPage = pages.find((page) => page.slug === selectedSlug) ?? pages[0];
  const selectedDraft = selectedPage ? pageDrafts[selectedPage.slug] : null;
  const selectedSummary = useMemo(
    () => summarizePageContent(selectedDraft?.content),
    [selectedDraft],
  );
  const hasUnsavedChanges = Boolean(
    selectedPage &&
      selectedDraft &&
      (selectedDraft.name !== selectedPage.name ||
        selectedDraft.summary !== selectedPage.summary ||
        JSON.stringify(selectedDraft.content ?? null) !==
          JSON.stringify(selectedPage.content ?? null)),
  );
  const statusConfig = selectedPage ? getStatusConfig(selectedPage.status) : null;
  const sectionKeys = useMemo(
    () =>
      selectedDraft && isPlainObject(selectedDraft.content)
        ? Object.keys(selectedDraft.content)
        : [],
    [selectedDraft],
  );

  function updateSelectedDraftField(field: "name" | "summary", value: string) {
    if (!selectedPage) return;

    setValidationErrors({});
    setValidationIssues(null);
    setPageDrafts((current) => ({
      ...current,
      [selectedPage.slug]: {
        ...current[selectedPage.slug],
        [field]: value,
      },
    }));
  }

  function updateSelectedContent(nextContent: unknown) {
    if (!selectedPage) return;

    setValidationErrors({});
    setValidationIssues(null);
    setPageDrafts((current) => ({
      ...current,
      [selectedPage.slug]: {
        ...current[selectedPage.slug],
        content: nextContent,
      },
    }));
  }

  function applyPageUpdate(item: CmsPageWorkspaceDocument, successMessage: string) {
    setPages((current) => current.map((page) => (page.slug === item.slug ? item : page)));
    setPageDrafts((current) => ({
      ...current,
      [item.slug]: createDraftState(item),
    }));
    setValidationErrors({});
    setValidationIssues(null);
    setFeedback({ tone: "ok", message: successMessage });
  }

  async function saveDraft() {
    if (!selectedPage || !selectedDraft) return;

    const validation = cmsPageEditorSchemas[selectedPage.slug].safeParse({
      name: selectedDraft.name,
      summary: selectedDraft.summary,
      content: selectedDraft.content,
    });

    if (!validation.success) {
      const nextValidationState = buildValidationState(validation.error.issues);
      setValidationErrors(nextValidationState.errorMap);
      setValidationIssues(nextValidationState.issues);
      setFeedback({
        tone: "error",
        message: "Resolve the highlighted fields before saving this draft.",
      });
      return;
    }

    setBusyKey(`draft:${selectedPage.slug}`);
    setFeedback(null);

    const response = await fetch(`/api/admin/pages/${selectedPage.slug}/draft`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as PageMutationResponse;

    if (!payload.item) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: payload.error ?? "Unable to save draft." });
      return;
    }

    applyPageUpdate(
      payload.item,
      payload.message ??
        `${payload.item.name} draft saved at ${formatUpdatedAt(payload.item.draft.savedAt)}.`,
    );
    setBusyKey(null);
  }

  async function publishDraft() {
    if (!selectedPage) return;

    if (hasUnsavedChanges) {
      setFeedback({
        tone: "error",
        message: "Save the current draft first, then publish it to the live site.",
      });
      return;
    }

    if (selectedPage.status !== "draft-pending" || !selectedPage.draft.content) {
      setFeedback({
        tone: "error",
        message: "There is no unpublished draft ready to publish for this page.",
      });
      return;
    }

    const changedFields = countChangedFields(
      selectedPage.published.content,
      selectedPage.draft.content,
    );
    const confirmed = window.confirm(
      `Publish ${selectedPage.name} to the live site?\n\n${
        changedFields > 0
          ? `${changedFields} field${changedFields === 1 ? "" : "s"} changed.`
          : "This will promote the current draft."
      }`,
    );

    if (!confirmed) {
      return;
    }

    setBusyKey(`publish:${selectedPage.slug}`);
    setFeedback(null);

    const response = await fetch(`/api/admin/pages/${selectedPage.slug}/publish`, {
      method: "POST",
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as PageMutationResponse;

    if (!payload.item) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: payload.error ?? "Unable to publish page." });
      return;
    }

    applyPageUpdate(payload.item, payload.message ?? `${payload.item.name} is now live.`);
    setBusyKey(null);
  }

  async function discardDraft() {
    if (!selectedPage) return;

    const hasServerDraft =
      selectedPage.status === "draft-pending" && Boolean(selectedPage.draft.content);

    if (!hasServerDraft && !hasUnsavedChanges) {
      setFeedback({
        tone: "error",
        message: "There are no unpublished changes to discard for this page.",
      });
      return;
    }

    const confirmed = window.confirm(
      hasServerDraft
        ? "Discard the unpublished draft? The published version will remain live."
        : "Reset your unsaved local edits for this page?",
    );

    if (!confirmed) {
      return;
    }

    if (!hasServerDraft) {
      setPageDrafts((current) => ({
        ...current,
        [selectedPage.slug]: createDraftState(selectedPage),
      }));
      setValidationErrors({});
      setValidationIssues(null);
      setFeedback({ tone: "ok", message: "Local edits reset." });
      return;
    }

    setBusyKey(`discard:${selectedPage.slug}`);
    setFeedback(null);

    const response = await fetch(`/api/admin/pages/${selectedPage.slug}/discard`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as PageMutationResponse;

    if (!payload.item) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: payload.error ?? "Unable to discard draft." });
      return;
    }

    applyPageUpdate(payload.item, payload.message ?? `${payload.item.name} draft discarded.`);
    setBusyKey(null);
  }

  if (!selectedPage || !selectedDraft || !statusConfig) {
    return null;
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
                <FileJson size={15} />
                <span>Page CMS</span>
              </span>
              <span className="status-pill status-pill--ok">{pages.length} pages</span>
            </div>
            <div>
              <h1 className="display-title text-4xl text-white sm:text-5xl">
                Edit each public route in its own workspace.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Every page now has a dedicated editor route so fields stay visible, repeatable
                groups have room to breathe, and publishing decisions stay focused.
              </p>
            </div>
          </div>
        </div>

        <div className="luxury-divider my-5" />

        <div className="admin-cms-layout">
          <aside className="admin-cms-rail">
            <div className="admin-cms-rail-surface">
              <p className="section-label">Content directory</p>
              <div className="admin-button-row mt-4">
                <Link className="admin-button admin-button--ghost" href="/admin/content">
                  All pages
                </Link>
                <a
                  className="admin-button admin-button--ghost"
                  href={selectedPage.route}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open live page
                </a>
              </div>
            </div>

            <div className="admin-cms-rail-surface">
              <p className="section-label">Page editors</p>
              <div className="admin-cms-page-list admin-cms-page-list--stacked">
                {pages.map((page) => {
                  const summary = summarizePageContent(page.content);
                  const pageStatus = getStatusConfig(page.status);

                  return (
                    <Link
                      className={`admin-page-card ${
                        selectedSlug === page.slug ? "is-active" : ""
                      }`.trim()}
                      href={`/admin/content/${page.slug}`}
                      key={page.slug}
                    >
                      <div className="admin-page-card-topline">
                        <span className="admin-badge">{page.slug}</span>
                        <span className={`status-pill ${pageStatus.className}`}>
                          {pageStatus.label}
                        </span>
                      </div>
                      <span className="admin-page-card-route">{page.route}</span>
                      <h3 className="admin-page-card-title">{page.name}</h3>
                      <p className="admin-page-card-summary">{page.summary}</p>
                      <div className="admin-page-card-metrics">
                        <span>{summary.sectionKeys.length} sections</span>
                        <span>{summary.mediaRefs} media refs</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="admin-cms-main">
            <div className="admin-surface admin-surface--inner">
              <div className="admin-panel-header">
                <div>
                  <p className="section-label">{selectedPage.route}</p>
                  <h2 className="display-title mt-3 text-3xl text-white">
                    {selectedPage.name}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
                    Structured field editing is the default here. Advanced section JSON is
                    still available when needed, but the editor now gives each page enough
                    width to manage nested content comfortably.
                  </p>
                </div>

                <div className="admin-button-row">
                  <button
                    className="admin-button admin-button--ghost"
                    onClick={() =>
                      setPageDrafts((current) => ({
                        ...current,
                        [selectedPage.slug]: createDraftState(selectedPage),
                      }))
                    }
                    type="button"
                  >
                    <RefreshCcw size={15} />
                    <span>Reset local changes</span>
                  </button>
                </div>
              </div>

              <div className="admin-publishing-bar">
                <div className="admin-publishing-copy">
                  <div className="admin-publishing-topline">
                    <span className={`status-pill ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>
                    <span className="admin-publishing-stamp">
                      {selectedPage.draft.savedAt ? (
                        <>
                          Last saved {formatRelativeFromNow(selectedPage.draft.savedAt)} by{" "}
                          {selectedPage.draft.savedBy ?? "Unknown"}
                        </>
                      ) : selectedPage.published.publishedAt ? (
                        <>
                          Live since {formatUpdatedAt(selectedPage.published.publishedAt)} by{" "}
                          {selectedPage.published.publishedBy ?? "Unknown"}
                        </>
                      ) : (
                        "This page has not been published yet."
                      )}
                    </span>
                  </div>
                  <p className="admin-publishing-note">
                    {hasUnsavedChanges
                      ? "Local edits are waiting to be saved as a draft."
                      : statusConfig.description}
                  </p>
                </div>

                <div className="admin-button-row">
                  <button
                    className="admin-button admin-button--ghost"
                    disabled={busyKey !== null}
                    onClick={() => void discardDraft()}
                    type="button"
                  >
                    {busyKey === `discard:${selectedPage.slug}` ? (
                      <LoaderCircle className="animate-spin" size={15} />
                    ) : (
                      <Trash2 size={15} />
                    )}
                    <span>Discard draft</span>
                  </button>
                  <button
                    className="admin-button"
                    disabled={
                      busyKey !== null ||
                      hasUnsavedChanges ||
                      selectedPage.status !== "draft-pending"
                    }
                    onClick={() => void publishDraft()}
                    type="button"
                  >
                    {busyKey === `publish:${selectedPage.slug}` ? (
                      <LoaderCircle className="animate-spin" size={15} />
                    ) : (
                      <Rocket size={15} />
                    )}
                    <span>Publish</span>
                  </button>
                </div>
              </div>

              <div className="admin-editor-overview-grid mt-5">
                <article className="admin-mini-stat">
                  <span className="admin-mini-stat-label">Route</span>
                  <span className="admin-mini-stat-value">{selectedPage.route}</span>
                </article>
                <article className="admin-mini-stat">
                  <span className="admin-mini-stat-label">Sections</span>
                  <span className="admin-mini-stat-value">
                    {selectedSummary.sectionKeys.length}
                  </span>
                </article>
                <article className="admin-mini-stat">
                  <span className="admin-mini-stat-label">Hero slides</span>
                  <span className="admin-mini-stat-value">{selectedSummary.heroSlides}</span>
                </article>
                <article className="admin-mini-stat">
                  <span className="admin-mini-stat-label">Media refs</span>
                  <span className="admin-mini-stat-value">{selectedSummary.mediaRefs}</span>
                </article>
              </div>

              <div className="admin-key-list mt-5">
                {selectedSummary.sectionKeys.map((key) => (
                  <span className="admin-key-chip" key={key}>
                    {key}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="admin-field">
                  <label htmlFor="cms-page-name">Page name</label>
                  <input
                    className={`admin-input ${validationErrors.name ? "is-invalid" : ""}`.trim()}
                    id="cms-page-name"
                    onChange={(event) => updateSelectedDraftField("name", event.target.value)}
                    value={selectedDraft.name}
                  />
                  {validationErrors.name?.[0] ? (
                    <p className="admin-field-error">{validationErrors.name[0]}</p>
                  ) : null}
                </div>

                <div className="admin-field">
                  <label htmlFor="cms-page-summary">Summary</label>
                  <input
                    className={`admin-input ${validationErrors.summary ? "is-invalid" : ""}`.trim()}
                    id="cms-page-summary"
                    onChange={(event) => updateSelectedDraftField("summary", event.target.value)}
                    value={selectedDraft.summary}
                  />
                  {validationErrors.summary?.[0] ? (
                    <p className="admin-field-error">{validationErrors.summary[0]}</p>
                  ) : null}
                </div>
              </div>

              <div className="admin-section-stack mt-5">
                {sectionKeys.map((sectionKey, index) => (
                  <SectionEditor
                    defaultOpen={index === 0}
                    errorCount={getSectionErrorCount(validationErrors, sectionKey)}
                    key={sectionKey}
                    onChange={(nextValue) =>
                      updateSelectedContent({
                        ...(selectedDraft.content as Record<string, unknown>),
                        [sectionKey]: nextValue,
                      })
                    }
                    sectionKey={sectionKey}
                    title={humanizeKey(sectionKey)}
                    value={(selectedDraft.content as Record<string, unknown>)[sectionKey]}
                  >
                    <SectionFieldsRenderer
                      contentRoot={selectedDraft.content}
                      defaultContent={defaultCmsPageContent[selectedPage.slug]}
                      errorMap={validationErrors}
                      mediaAssets={initialMediaAssets}
                      onContentChange={updateSelectedContent}
                      path={[sectionKey]}
                      slug={selectedPage.slug}
                      value={(selectedDraft.content as Record<string, unknown>)[sectionKey]}
                    />
                  </SectionEditor>
                ))}
              </div>

              <div className="admin-button-row mt-5">
                <button
                  className="admin-button"
                  disabled={busyKey !== null}
                  onClick={() => void saveDraft()}
                  type="button"
                >
                  {busyKey === `draft:${selectedPage.slug}` ? (
                    <LoaderCircle className="animate-spin" size={15} />
                  ) : (
                    <Save size={15} />
                  )}
                  <span>Save draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {validationIssues ? (
        <div className="admin-modal-overlay" role="presentation">
          <div className="admin-modal">
            <div className="admin-panel-header">
              <div>
                <p className="section-label">Validation</p>
                <h3 className="display-title mt-3 text-3xl text-white">
                  Resolve these fields before saving
                </h3>
              </div>
              <button
                className="admin-button admin-button--ghost"
                onClick={() => setValidationIssues(null)}
                type="button"
              >
                <span>Close</span>
              </button>
            </div>

            <div className="admin-validation-list">
              {validationIssues.map((issue, index) => (
                <article className="admin-validation-item" key={`${issue.path}-${index}`}>
                  <strong>{issue.path}</strong>
                  <span>{issue.message}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
