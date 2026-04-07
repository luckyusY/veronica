"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ExternalLink, FileJson, LoaderCircle, RefreshCcw, Rocket, Save, Trash2 } from "lucide-react";
import { SectionEditor } from "@/components/admin/cms/SectionEditor";
import { SectionFieldsRenderer } from "@/components/admin/cms/SectionFieldsRenderer";
import { ImagePickerField } from "@/components/admin/cms/fields/ImagePickerField";
import { RepeatableField } from "@/components/admin/cms/fields/RepeatableField";
import { getSelectedMediaGridItems } from "@/lib/artist-page-content";
import { defaultCmsPageContent } from "@/lib/cms-defaults";
import { defaultMediaLibrary } from "@/lib/cms-defaults/shared";
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
  CmsMediaItem,
  CmsPageSlug,
  CmsPageWorkspaceDocument,
  StandardPageContent,
  StandardSection,
} from "@/lib/cms-types";

type AdminPageCmsPanelProps = {
  initialPages: CmsPageWorkspaceDocument[];
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

const emptyMediaGridItem: CmsMediaItem = {
  url: "",
  alt: "",
  publicId: "",
  resourceType: "image",
  label: "",
  position: "",
  placeholderBase: "",
  placeholderHighlight: "",
};

const mediaAdminGallerySection: Extract<StandardSection, { type: "gallery" }> = {
  id: "selected-media-grid",
  type: "gallery",
  theme: "paper",
  eyebrow: "Selected images",
  title: "Images shown on /media",
  description:
    "Add, reorder, or remove the exact images that should appear on the public media page.",
  items: [],
  columns: 3,
};

const mediaAdminTemplateContent: StandardPageContent = {
  hero: {
    eyebrow: "Media grid",
    title: "Selected media gallery",
    description: "Only the chosen gallery images are rendered on the public media page.",
    image: defaultMediaLibrary.microphone,
    imageMotionPreset: "from-left",
    imageLabel: "Selected media preview",
    noteTitle: "Selected images only",
    noteText: "This hidden structure keeps the public media route focused on the image grid.",
  },
  sections: [mediaAdminGallerySection],
};

async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

function normalizeMediaGridItem(candidate: unknown): CmsMediaItem {
  if (!candidate || typeof candidate !== "object") {
    return { ...emptyMediaGridItem };
  }

  const item = candidate as Partial<CmsMediaItem>;

  return {
    url: typeof item.url === "string" ? item.url : "",
    alt: typeof item.alt === "string" ? item.alt : "",
    publicId: typeof item.publicId === "string" ? item.publicId : "",
    resourceType: item.resourceType === "video" ? "video" : "image",
    label: typeof item.label === "string" ? item.label : "",
    position: typeof item.position === "string" ? item.position : "",
    placeholderBase:
      typeof item.placeholderBase === "string" ? item.placeholderBase : "",
    placeholderHighlight:
      typeof item.placeholderHighlight === "string" ? item.placeholderHighlight : "",
  };
}

function getMediaEditorItems(content: unknown) {
  const sections = Array.isArray((content as StandardPageContent | undefined)?.sections)
    ? (content as StandardPageContent).sections
    : [];
  const gallerySection = sections.find((section) => section.type === "gallery");

  return gallerySection ? gallerySection.items.map(normalizeMediaGridItem) : [];
}

function createMediaAdminContent(content: unknown): StandardPageContent {
  return {
    ...mediaAdminTemplateContent,
    hero: { ...mediaAdminTemplateContent.hero },
    sections: [
      {
        ...mediaAdminGallerySection,
        items: getSelectedMediaGridItems(content as StandardPageContent).map(
          normalizeMediaGridItem,
        ),
      },
    ],
  };
}

function getEditablePageContent(slug: CmsPageSlug, content: unknown) {
  return slug === "media" ? createMediaAdminContent(content) : content;
}

function createDraftState(page: CmsPageWorkspaceDocument): PageDraft {
  return {
    name: page.name,
    summary: page.summary,
    content: JSON.parse(JSON.stringify(getEditablePageContent(page.slug, page.content))),
  };
}

export function AdminPageCmsPanel({
  initialPages,
  selectedSlug,
}: AdminPageCmsPanelProps) {
  const [pages, setPages] = useState(initialPages);
  const [mediaAssets, setMediaAssets] = useState<CmsMediaAsset[]>([]);
  const mediaFetched = useRef(false);

  // Load media assets in the background — non-blocking, doesn't delay initial render
  useEffect(() => {
    if (mediaFetched.current) return;
    mediaFetched.current = true;

    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((payload: { items?: CmsMediaAsset[] }) => {
        if (Array.isArray(payload.items)) {
          setMediaAssets(payload.items);
        }
      })
      .catch(() => {
        // silent — image picker will just show empty if this fails
      });
  }, []);
  const [pageDrafts, setPageDrafts] = useState<Record<string, PageDraft>>(() =>
    Object.fromEntries(initialPages.map((page) => [page.slug, createDraftState(page)])),
  );
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorMap>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssueItem[] | null>(null);

  const selectedPage = pages.find((page) => page.slug === selectedSlug) ?? pages[0];
  const selectedDraft = selectedPage ? pageDrafts[selectedPage.slug] : null;
  const isMediaPage = selectedPage?.slug === "media";
  const selectedComparableContent = useMemo(
    () =>
      selectedPage ? getEditablePageContent(selectedPage.slug, selectedPage.content) : null,
    [selectedPage],
  );
  const selectedSummary = useMemo(
    () => summarizePageContent(selectedDraft?.content),
    [selectedDraft],
  );
  const selectedMediaItems = useMemo(
    () => (isMediaPage && selectedDraft ? getMediaEditorItems(selectedDraft.content) : []),
    [isMediaPage, selectedDraft],
  );
  const hasUnsavedChanges = Boolean(
    selectedPage &&
      selectedDraft &&
      (selectedDraft.name !== selectedPage.name ||
        selectedDraft.summary !== selectedPage.summary ||
        JSON.stringify(selectedDraft.content ?? null) !==
          JSON.stringify(selectedComparableContent ?? null)),
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

  function updateSelectedMediaItems(nextItems: CmsMediaItem[]) {
    if (!selectedPage || selectedPage.slug !== "media") {
      return;
    }

    const nextContent = createMediaAdminContent(selectedDraft?.content);
    nextContent.sections = [
      {
        ...mediaAdminGallerySection,
        items: nextItems.map(normalizeMediaGridItem),
      },
    ];

    updateSelectedContent(nextContent);
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

      {/* Page header */}
      <header className="admin-page-head">
        <div className="admin-page-head-left">
          <div className="admin-page-head-icon">
            <FileJson size={18} />
          </div>
          <h1 className="admin-page-title">{selectedPage.name}</h1>
        </div>
        <div className="admin-button-row">
          <Link className="admin-button admin-button--ghost" href="/admin/content">
            <ArrowLeft size={14} />
            <span>All pages</span>
          </Link>
          <a
            className="admin-button admin-button--ghost"
            href={selectedPage.route}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink size={14} />
            <span>View live</span>
          </a>
          <span className={`status-pill ${statusConfig.className}`}>{statusConfig.label}</span>
        </div>
      </header>

      {/* Two-column CMS layout */}
      <div className="admin-cms-layout">
        {/* Rail: page switcher */}
        <aside className="admin-cms-rail">
          <div className="admin-cms-rail-surface">
            <p className="admin-v2-section-title">Pages</p>
            <div className="admin-cms-page-list admin-cms-page-list--stacked">
              {pages.map((page) => {
                const summary = summarizePageContent(
                  getEditablePageContent(page.slug, page.content),
                );
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
                      <div className="admin-page-card-icon">
                        <FileJson size={13} />
                      </div>
                      <span className={`status-pill ${pageStatus.className}`}>
                        {pageStatus.label}
                      </span>
                    </div>
                    <h3 className="admin-page-card-title">{page.name}</h3>
                    <span className="admin-page-card-route">{page.route}</span>
                    <div className="admin-page-card-metrics">
                      <span>{summary.sectionKeys.length} sections</span>
                      <span>{summary.mediaRefs} media</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main editor column */}
        <div className="admin-cms-main">
          {/* Editor sub-header */}
          <div className="admin-editor-head">
            <div className="admin-editor-head-info">
              <p className="admin-editor-route">{selectedPage.route}</p>
              <p className="admin-editor-summary-line">
                {isMediaPage
                  ? `${selectedMediaItems.length} selected image${
                      selectedMediaItems.length === 1 ? "" : "s"
                    } · only these appear on the live media page`
                  : `${selectedSummary.sectionKeys.length} sections · ${selectedSummary.mediaRefs} media refs`}
              </p>
            </div>
            <button
              className="admin-icon-button"
              onClick={() =>
                setPageDrafts((current) => ({
                  ...current,
                  [selectedPage.slug]: createDraftState(selectedPage),
                }))
              }
              title="Reset local changes"
              type="button"
            >
              <RefreshCcw size={15} />
            </button>
          </div>

          {/* Stats strip */}
          <div className="admin-editor-summary-strip">
            <div className="admin-editor-summary-item">
              <span className="admin-mini-stat-label">Route</span>
              <strong>{selectedPage.route}</strong>
            </div>
            <div className="admin-editor-summary-item">
              <span className="admin-mini-stat-label">
                {isMediaPage ? "Selected images" : "Sections"}
              </span>
              <strong>{isMediaPage ? selectedMediaItems.length : selectedSummary.sectionKeys.length}</strong>
            </div>
            <div className="admin-editor-summary-item">
              <span className="admin-mini-stat-label">
                {isMediaPage ? "Live layout" : "Hero slides"}
              </span>
              <strong>{isMediaPage ? "Grid only" : selectedSummary.heroSlides}</strong>
            </div>
            <div className="admin-editor-summary-item">
              <span className="admin-mini-stat-label">
                {isMediaPage ? "Media refs" : "Media refs"}
              </span>
              <strong>{isMediaPage ? selectedMediaItems.length : selectedSummary.mediaRefs}</strong>
            </div>
          </div>

          {/* Publishing bar */}
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
                    "Not published yet."
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
                <span>Discard</span>
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

          {/* Section key chips */}
          <div className="admin-key-list mt-5">
            {isMediaPage ? (
              <span className="admin-key-chip">selected images</span>
            ) : (
              selectedSummary.sectionKeys.map((key) => (
                <span className="admin-key-chip" key={key}>
                  {key}
                </span>
              ))
            )}
          </div>

          {/* Page identity fields */}
          <section className="admin-editing-basics-card mt-5">
            <div className="admin-settings-card-header">
              <p className="admin-v2-section-title">Page identity</p>
            </div>
            <div className="admin-form-grid admin-form-grid--wide">
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
          </section>

          {/* Section editors */}
          <div className="admin-section-stack mt-5">
            {isMediaPage ? (
              <SectionEditor
                defaultOpen
                errorCount={getSectionErrorCount(validationErrors, "sections")}
                onChange={(nextValue) =>
                  updateSelectedMediaItems(
                    Array.isArray(nextValue) ? nextValue.map(normalizeMediaGridItem) : [],
                  )
                }
                sectionKey="selected-images"
                title="Selected images"
                value={selectedMediaItems}
              >
                <div className="admin-object-panel">
                  <p className="admin-object-panel-label">Live media grid</p>
                  <div className="admin-object-panel-body">
                    <p className="admin-publishing-note">
                      Add, reorder, or remove the exact images that should appear on
                      {" "}
                      <code>/media</code>. Save the draft, then publish it to update the live page.
                    </p>
                  </div>
                </div>

                <RepeatableField
                  addLabel="Add image"
                  error={validationErrors["sections.0.items"]?.[0]}
                  getItemLabel={(index) =>
                    selectedMediaItems[index]?.label ||
                    selectedMediaItems[index]?.alt ||
                    selectedMediaItems[index]?.publicId ||
                    `Image ${index + 1}`
                  }
                  items={selectedMediaItems}
                  label="Selected images"
                  onAdd={() =>
                    updateSelectedMediaItems([...selectedMediaItems, { ...emptyMediaGridItem }])
                  }
                  onMove={(fromIndex, toIndex) => {
                    const nextItems = [...selectedMediaItems];
                    const [movedItem] = nextItems.splice(fromIndex, 1);

                    if (!movedItem) {
                      return;
                    }

                    nextItems.splice(toIndex, 0, movedItem);
                    updateSelectedMediaItems(nextItems);
                  }}
                  onRemove={(index) =>
                    updateSelectedMediaItems(
                      selectedMediaItems.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  renderItem={(index) => (
                    <ImagePickerField
                      assets={mediaAssets}
                      label={`Image ${index + 1}`}
                      onChange={(nextValue) =>
                        updateSelectedMediaItems(
                          selectedMediaItems.map((item, itemIndex) =>
                            itemIndex === index ? normalizeMediaGridItem(nextValue) : item,
                          ),
                        )
                      }
                      value={selectedMediaItems[index] ?? { ...emptyMediaGridItem }}
                    />
                  )}
                />
              </SectionEditor>
            ) : (
              sectionKeys.map((sectionKey, index) => (
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
                    mediaAssets={mediaAssets}
                    onContentChange={updateSelectedContent}
                    path={[sectionKey]}
                    slug={selectedPage.slug}
                    value={(selectedDraft.content as Record<string, unknown>)[sectionKey]}
                  />
                </SectionEditor>
              ))
            )}
          </div>

          {/* Save draft */}
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

      {/* Validation modal */}
      {validationIssues ? (
        <div className="admin-modal-overlay" role="presentation">
          <div className="admin-modal">
            <div className="admin-panel-header">
              <div>
                <p className="admin-v2-section-title">Validation</p>
                <h3 className="admin-records-title">
                  Resolve these fields before saving
                </h3>
              </div>
              <button
                className="admin-icon-button"
                onClick={() => setValidationIssues(null)}
                title="Close"
                type="button"
              >
                <ArrowLeft size={14} />
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
