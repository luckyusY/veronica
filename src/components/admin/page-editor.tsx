"use client";

import { useMemo, useState } from "react";
import { FileJson, LoaderCircle, RefreshCcw, Save, Sparkles } from "lucide-react";
import type { CmsPageDocument, CmsPageSlug } from "@/lib/cms-types";
import {
  type FeedbackState,
  formatUpdatedAt,
  prettyPrint,
  readApiError,
  summarizePageContent,
} from "@/lib/admin-utils";

type PageDraft = {
  name: string;
  summary: string;
  content: string;
};

type PageEditorProps = {
  initialPages: CmsPageDocument[];
};

export function PageEditor({ initialPages }: PageEditorProps) {
  const [pages, setPages] = useState(initialPages);
  const [selectedSlug, setSelectedSlug] = useState<CmsPageSlug>(initialPages[0]?.slug ?? "home");
  const [pageDrafts, setPageDrafts] = useState<Record<string, PageDraft>>(() =>
    Object.fromEntries(
      initialPages.map((page) => [
        page.slug,
        { name: page.name, summary: page.summary, content: prettyPrint(page.content) },
      ]),
    ),
  );
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [busy, setBusy] = useState(false);

  const selectedPage = pages.find((page) => page.slug === selectedSlug) ?? pages[0];
  const selectedDraft = selectedPage ? pageDrafts[selectedPage.slug] : null;
  const selectedSummary = useMemo(
    () => summarizePageContent(selectedPage?.content),
    [selectedPage],
  );

  function updateSelectedDraft(field: keyof PageDraft, value: string) {
    if (!selectedPage) return;

    setPageDrafts((current) => ({
      ...current,
      [selectedPage.slug]: { ...current[selectedPage.slug], [field]: value },
    }));
  }

  async function savePage() {
    if (!selectedPage || !selectedDraft) return;

    let parsedContent: unknown;

    try {
      parsedContent = JSON.parse(selectedDraft.content);
    } catch {
      setFeedback({ tone: "error", message: "Page content must be valid JSON before saving." });
      return;
    }

    setBusy(true);
    setFeedback(null);

    const response = await fetch(`/api/admin/pages/${selectedPage.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: selectedDraft.name,
        summary: selectedDraft.summary,
        content: parsedContent,
      }),
    });

    if (!response.ok) {
      setBusy(false);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as { item: CmsPageDocument };

    setPages((current) =>
      current.map((page) => (page.slug === payload.item.slug ? payload.item : page)),
    );
    setPageDrafts((current) => ({
      ...current,
      [payload.item.slug]: {
        name: payload.item.name,
        summary: payload.item.summary,
        content: prettyPrint(payload.item.content),
      },
    }));
    setBusy(false);
    setFeedback({ tone: "ok", message: `${payload.item.name} saved.` });
  }

  return (
    <>
      {feedback && (
        <div className={`admin-feedback ${feedback.tone === "ok" ? "admin-feedback--ok" : "admin-feedback--error"}`}>
          {feedback.message}
        </div>
      )}
      <section className="admin-surface" id="content">
        <div className="admin-panel-header">
          <div className="space-y-3">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <FileJson size={15} />
                <span>Page CMS</span>
              </span>
              <span className="status-pill status-pill--ok">{pages.length} unique pages</span>
            </div>
            <div>
              <h2 className="admin-page-title">Edit every public page.</h2>
              <p className="admin-page-subtitle">
                Headlines, hero slides, section blocks, and media references live in MongoDB and update without touching code.
              </p>
            </div>
          </div>
        </div>

        <div className="luxury-divider my-5" />

        <div className="admin-cms-layout">
          <aside className="admin-cms-rail">
            <div className="admin-cms-rail-surface">
              <p className="section-label">Editable pages</p>
              <div className="admin-cms-page-list">
                {pages.map((page) => {
                  const summary = summarizePageContent(page.content);

                  return (
                    <button
                      className={`admin-page-card ${selectedSlug === page.slug ? "is-active" : ""}`}
                      key={page.slug}
                      onClick={() => setSelectedSlug(page.slug)}
                      type="button"
                    >
                      <div className="admin-page-card-topline">
                        <span className="admin-badge">{page.slug}</span>
                        <span className="admin-page-card-route">{page.route}</span>
                      </div>
                      <h3 className="admin-page-card-title">{page.name}</h3>
                      <p className="admin-page-card-summary">{page.summary}</p>
                      <div className="admin-page-card-metrics">
                        <span>{summary.sectionKeys.length} sections</span>
                        <span>{summary.images + summary.videos} media refs</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="admin-cms-rail-surface">
              <p className="section-label">Current page snapshot</p>
              <div className="admin-mini-stat-grid">
                <article className="admin-mini-stat">
                  <span className="admin-mini-stat-label">Route</span>
                  <span className="admin-mini-stat-value">{selectedPage?.route ?? "/"}</span>
                </article>
                <article className="admin-mini-stat">
                  <span className="admin-mini-stat-label">Hero slides</span>
                  <span className="admin-mini-stat-value">{selectedSummary.heroSlides}</span>
                </article>
                <article className="admin-mini-stat">
                  <span className="admin-mini-stat-label">Images</span>
                  <span className="admin-mini-stat-value">{selectedSummary.images}</span>
                </article>
                <article className="admin-mini-stat">
                  <span className="admin-mini-stat-label">Videos</span>
                  <span className="admin-mini-stat-value">{selectedSummary.videos}</span>
                </article>
              </div>
            </div>
          </aside>

          <div className="admin-cms-main">
            {selectedPage && selectedDraft ? (
              <div className="admin-editor-layout">
                <div className="admin-surface admin-surface--inner">
                  <div className="admin-panel-header">
                    <div>
                      <p className="section-label">{selectedPage.route}</p>
                      <h3 className="display-title mt-3 text-3xl text-white">
                        {selectedPage.name}
                      </h3>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
                        Use the essentials fields for navigation copy and the JSON editor for full
                        page structure, hero blocks, and section content.
                      </p>
                    </div>

                    <div className="admin-button-row">
                      <a
                        className="admin-button admin-button--ghost"
                        href={selectedPage.route}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open page
                      </a>
                      <button
                        className="admin-button admin-button--ghost"
                        onClick={() =>
                          updateSelectedDraft("content", prettyPrint(selectedPage.content))
                        }
                        type="button"
                      >
                        <RefreshCcw size={15} />
                        <span>Reset JSON</span>
                      </button>
                      <button
                        className="admin-button admin-button--ghost"
                        onClick={() => {
                          try {
                            updateSelectedDraft("content", prettyPrint(JSON.parse(selectedDraft.content)));
                          } catch {
                            setFeedback({
                              tone: "error",
                              message: "JSON cannot be formatted until it is valid.",
                            });
                          }
                        }}
                        type="button"
                      >
                        <Sparkles size={15} />
                        <span>Format JSON</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="admin-field">
                      <label htmlFor="cms-page-name">Page name</label>
                      <input
                        className="admin-input"
                        id="cms-page-name"
                        onChange={(event) => updateSelectedDraft("name", event.target.value)}
                        value={selectedDraft.name}
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="cms-page-summary">Summary</label>
                      <input
                        className="admin-input"
                        id="cms-page-summary"
                        onChange={(event) => updateSelectedDraft("summary", event.target.value)}
                        value={selectedDraft.summary}
                      />
                    </div>
                  </div>

                  <div className="admin-field mt-4">
                    <label htmlFor="cms-page-json">Structured content JSON</label>
                    <textarea
                      className="admin-textarea admin-code-editor"
                      id="cms-page-json"
                      onChange={(event) => updateSelectedDraft("content", event.target.value)}
                      value={selectedDraft.content}
                    />
                  </div>

                  <div className="admin-button-row mt-4">
                    <button
                      className="admin-button"
                      disabled={busy}
                      onClick={() => void savePage()}
                      type="button"
                    >
                      {busy ? <LoaderCircle className="animate-spin" size={15} /> : <Save size={15} />}
                      <span>Save page</span>
                    </button>
                  </div>
                </div>

                <div className="admin-side-stack">
                  <div className="admin-surface admin-surface--inner">
                    <p className="section-label">Publishing context</p>
                    <div className="admin-insight-grid mt-4">
                      <article className="admin-insight-card">
                        <span className="admin-insight-label">Last updated</span>
                        <span className="admin-insight-value">
                          {formatUpdatedAt(selectedPage.updatedAt)}
                        </span>
                      </article>
                      <article className="admin-insight-card">
                        <span className="admin-insight-label">Section keys</span>
                        <span className="admin-insight-value">
                          {selectedSummary.sectionKeys.length}
                        </span>
                      </article>
                      <article className="admin-insight-card">
                        <span className="admin-insight-label">Media refs</span>
                        <span className="admin-insight-value">
                          {selectedSummary.images + selectedSummary.videos}
                        </span>
                      </article>
                      <article className="admin-insight-card">
                        <span className="admin-insight-label">Hero slides</span>
                        <span className="admin-insight-value">{selectedSummary.heroSlides}</span>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
