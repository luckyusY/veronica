"use client";

import { useMemo, useState } from "react";
import { FileJson, LoaderCircle, RefreshCcw, Save, Sparkles } from "lucide-react";
import type { CmsPageDocument, CmsPageSlug } from "@/lib/cms-types";

type AdminPageCmsPanelProps = {
  initialPages: CmsPageDocument[];
};

type FeedbackState = {
  tone: "ok" | "error";
  message: string;
} | null;

type PageDraft = {
  name: string;
  summary: string;
  content: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function prettyPrint(value: unknown) {
  return JSON.stringify(value, null, 2);
}

async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function summarizePageContent(value: unknown) {
  const content = isPlainObject(value) ? value : {};
  const sectionKeys = Object.keys(content);
  const hero = isPlainObject(content.hero) ? content.hero : null;
  const heroSlides = hero && Array.isArray(hero.slides) ? hero.slides.length : 0;

  let mediaRefs = 0;

  function visit(entry: unknown) {
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }

    if (!isPlainObject(entry)) {
      return;
    }

    if (typeof entry.publicId === "string" || typeof entry.url === "string") {
      mediaRefs += 1;
    }

    Object.values(entry).forEach(visit);
  }

  visit(content);

  return { sectionKeys, heroSlides, mediaRefs };
}

export function AdminPageCmsPanel({ initialPages }: AdminPageCmsPanelProps) {
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
  const [busyKey, setBusyKey] = useState<string | null>(null);

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
      [selectedPage.slug]: {
        ...current[selectedPage.slug],
        [field]: value,
      },
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

    setBusyKey(`page:${selectedPage.slug}`);
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
      setBusyKey(null);
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
    setBusyKey(null);
    setFeedback({ tone: "ok", message: `${payload.item.name} saved.` });
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
                Edit public page content by route.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Pick a route on the left, then update the structured JSON that powers each page.
              </p>
            </div>
          </div>
        </div>

        <div className="luxury-divider my-5" />

        <div className="admin-cms-layout">
          <aside className="admin-cms-rail">
            <div className="admin-cms-rail-surface">
              <p className="section-label">Pages</p>
              <div className="admin-cms-page-list">
                {pages.map((page) => {
                  const summary = summarizePageContent(page.content);

                  return (
                    <button
                      className={`admin-page-card ${selectedSlug === page.slug ? "is-active" : ""}`.trim()}
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
                        <span>{summary.mediaRefs} media refs</span>
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
                  <span className="admin-mini-stat-label">Media refs</span>
                  <span className="admin-mini-stat-value">{selectedSummary.mediaRefs}</span>
                </article>
                <article className="admin-mini-stat">
                  <span className="admin-mini-stat-label">Updated</span>
                  <span className="admin-mini-stat-value">{selectedPage ? formatUpdatedAt(selectedPage.updatedAt) : "-"}</span>
                </article>
              </div>
            </div>
          </aside>

          {selectedPage && selectedDraft ? (
            <div className="admin-editor-layout">
              <div className="admin-surface admin-surface--inner">
                <div className="admin-panel-header">
                  <div>
                    <p className="section-label">{selectedPage.route}</p>
                    <h2 className="display-title mt-3 text-3xl text-white">
                      {selectedPage.name}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
                      Update the route labels, then save the JSON content body for hero and sections.
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
                      onClick={() => updateSelectedDraft("content", prettyPrint(selectedPage.content))}
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
                    disabled={busyKey === `page:${selectedPage.slug}`}
                    onClick={() => void savePage()}
                    type="button"
                  >
                    {busyKey === `page:${selectedPage.slug}` ? (
                      <LoaderCircle className="animate-spin" size={15} />
                    ) : (
                      <Save size={15} />
                    )}
                    <span>Save page</span>
                  </button>
                </div>
              </div>

              <div className="admin-side-stack">
                <div className="admin-surface admin-surface--inner">
                  <p className="section-label">Section keys</p>
                  <div className="admin-key-list mt-4">
                    {selectedSummary.sectionKeys.map((key) => (
                      <span className="admin-key-chip" key={key}>
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
