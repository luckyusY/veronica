"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CloudUpload,
  Copy,
  FileJson,
  ImageIcon,
  LoaderCircle,
  RefreshCcw,
  Save,
  Settings2,
  Sparkles,
  Video,
} from "lucide-react";
import type {
  CmsMediaAsset,
  CmsPageDocument,
  CmsPageSlug,
  CmsSiteSettings,
} from "@/lib/cms-types";

type AdminWorkspaceProps = {
  cloudinaryReady: boolean;
  initialMediaAssets: CmsMediaAsset[];
  initialPages: CmsPageDocument[];
  initialSiteSettings: CmsSiteSettings;
};

type FeedbackState = {
  tone: "ok" | "error";
  message: string;
} | null;

type MediaFilter = "all" | "image" | "video";

type PageDraft = {
  name: string;
  summary: string;
  content: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

function prettyPrint(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function cloneSettings(value: CmsSiteSettings) {
  return JSON.parse(JSON.stringify(value)) as CmsSiteSettings;
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

function countMediaReferences(value: unknown) {
  let images = 0;
  let videos = 0;

  function visit(entry: unknown) {
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }

    if (!isPlainObject(entry)) {
      return;
    }

    const publicId = typeof entry.publicId === "string" ? entry.publicId : "";
    const url =
      typeof entry.url === "string"
        ? entry.url
        : typeof entry.secureUrl === "string"
          ? entry.secureUrl
          : "";
    const resourceType = typeof entry.resourceType === "string" ? entry.resourceType : "";

    if (publicId || url) {
      if (resourceType === "video" || publicId.includes("/videos/") || url.includes("/video/")) {
        videos += 1;
      } else {
        images += 1;
      }
    }

    Object.values(entry).forEach(visit);
  }

  visit(value);

  return { images, videos };
}

function summarizePageContent(value: unknown) {
  const content = isPlainObject(value) ? value : {};
  const sectionKeys = Object.keys(content);
  const hero = isPlainObject(content.hero) ? content.hero : null;
  const heroSlides =
    hero && Array.isArray(hero.slides) ? hero.slides.length : 0;
  const media = countMediaReferences(content);

  return {
    sectionKeys,
    heroSlides,
    images: media.images,
    videos: media.videos,
  };
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

function toMultiline(items: string[]) {
  return items.join("\n");
}

function fromMultiline(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeUtilityLinks(links: CmsSiteSettings["footer"]["utilityLinks"]) {
  return links.map((item) => `${item.label} | ${item.href}`).join("\n");
}

function parseUtilityLinks(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|").map((item) => item.trim());
      return { label: label ?? "", href: href ?? "" };
    })
    .filter((item) => item.label && item.href);
}

export function AdminWorkspace({
  cloudinaryReady,
  initialMediaAssets,
  initialPages,
  initialSiteSettings,
}: AdminWorkspaceProps) {
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
  const [siteSettingsDraft, setSiteSettingsDraft] = useState(() =>
    cloneSettings(initialSiteSettings),
  );
  const [footerNotesText, setFooterNotesText] = useState(
    toMultiline(initialSiteSettings.footer.notes),
  );
  const [socialSignalsText, setSocialSignalsText] = useState(
    toMultiline(initialSiteSettings.footer.socialSignals),
  );
  const [utilityLinksText, setUtilityLinksText] = useState(
    serializeUtilityLinks(initialSiteSettings.footer.utilityLinks),
  );
  const [mediaAssets, setMediaAssets] = useState(initialMediaAssets);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const selectedPage = pages.find((page) => page.slug === selectedSlug) ?? pages[0];
  const selectedDraft = selectedPage ? pageDrafts[selectedPage.slug] : null;
  const selectedSummary = useMemo(
    () => summarizePageContent(selectedPage?.content),
    [selectedPage],
  );
  const visibleMedia = useMemo(() => {
    if (mediaFilter === "all") {
      return mediaAssets;
    }

    return mediaAssets.filter((asset) => asset.resourceType === mediaFilter);
  }, [mediaAssets, mediaFilter]);

  function updateSelectedDraft(field: keyof PageDraft, value: string) {
    if (!selectedPage) return;

    setPageDrafts((current) => ({
      ...current,
      [selectedPage.slug]: { ...current[selectedPage.slug], [field]: value },
    }));
  }

  function updateSiteSettings(
    section: keyof CmsSiteSettings,
    field: string,
    value: string | string[] | CmsSiteSettings["footer"]["utilityLinks"],
  ) {
    setSiteSettingsDraft((current) => {
      if (section === "header") {
        return { ...current, header: { ...current.header, [field]: value } };
      }

      return { ...current, footer: { ...current.footer, [field]: value } };
    });
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

  async function saveSiteSettings() {
    setBusyKey("site-settings");
    setFeedback(null);

    const response = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteSettingsDraft),
    });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as { item: CmsSiteSettings };

    setSiteSettingsDraft(cloneSettings(payload.item));
    setFooterNotesText(toMultiline(payload.item.footer.notes));
    setSocialSignalsText(toMultiline(payload.item.footer.socialSignals));
    setUtilityLinksText(serializeUtilityLinks(payload.item.footer.utilityLinks));
    setBusyKey(null);
    setFeedback({ tone: "ok", message: "Site settings saved." });
  }

  async function syncBundledAssets() {
    setBusyKey("sync-library");
    setFeedback(null);

    const response = await fetch("/api/admin/media/sync", { method: "POST" });

    if (!response.ok) {
      setBusyKey(null);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as { count: number; items: CmsMediaAsset[] };
    setMediaAssets((current) => mergeMediaAssets(current, payload.items));
    setBusyKey(null);
    setFeedback({
      tone: "ok",
      message: `${payload.count} bundled asset${payload.count === 1 ? "" : "s"} synced to Cloudinary.`,
    });
  }

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    setBusyKey("upload");
    setFeedback(null);

    const uploaded: CmsMediaAsset[] = [];

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", file.type.startsWith("video/") ? "veronica/videos" : "veronica/images");
      formData.append("title", file.name.replace(/\.[^.]+$/, ""));
      formData.append("alt", file.name.replace(/\.[^.]+$/, ""));

      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });

      if (!response.ok) {
        setBusyKey(null);
        setFeedback({ tone: "error", message: await readApiError(response) });
        return;
      }

      const payload = (await response.json()) as { item: CmsMediaAsset };
      uploaded.push(payload.item);
    }

    setMediaAssets((current) => mergeMediaAssets(current, uploaded));
    setBusyKey(null);
    setFeedback({
      tone: "ok",
      message: `${uploaded.length} media asset${uploaded.length > 1 ? "s" : ""} uploaded.`,
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
              <h2 className="display-title text-4xl text-white sm:text-5xl">
                Edit every public page from one publishing workspace.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Headlines, hero slides, section blocks, footer details, and media references now
                live in MongoDB and can be updated without touching code.
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
                      className={`admin-page-card ${
                        selectedSlug === page.slug ? "is-active" : ""
                      }`.trim()}
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

                    <div className="luxury-divider my-5" />

                    <div className="admin-key-list">
                      {selectedSummary.sectionKeys.map((key) => (
                        <span className="admin-key-chip" key={key}>
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="admin-surface admin-surface--inner">
                    <div className="admin-panel-meta">
                      <span className="admin-badge">
                        <Settings2 size={15} />
                        <span>Site settings</span>
                      </span>
                    </div>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
                      Header and footer copy, signals, and utility links render globally across the
                      public site.
                    </p>

                    <div className="admin-site-settings-grid mt-5">
                      <div className="admin-field">
                        <label htmlFor="site-brand-kicker">Header kicker</label>
                        <input
                          className="admin-input"
                          id="site-brand-kicker"
                          onChange={(event) =>
                            updateSiteSettings("header", "brandKicker", event.target.value)
                          }
                          value={siteSettingsDraft.header.brandKicker}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="site-booking-label">Booking label</label>
                        <input
                          className="admin-input"
                          id="site-booking-label"
                          onChange={(event) =>
                            updateSiteSettings("header", "bookingLabel", event.target.value)
                          }
                          value={siteSettingsDraft.header.bookingLabel}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="site-shop-label">Shop label</label>
                        <input
                          className="admin-input"
                          id="site-shop-label"
                          onChange={(event) =>
                            updateSiteSettings("header", "shopLabel", event.target.value)
                          }
                          value={siteSettingsDraft.header.shopLabel}
                        />
                      </div>

                      <div className="admin-field md:col-span-2 xl:col-span-3">
                        <label htmlFor="site-footer-description">Footer description</label>
                        <textarea
                          className="admin-textarea"
                          id="site-footer-description"
                          onChange={(event) =>
                            updateSiteSettings("footer", "description", event.target.value)
                          }
                          value={siteSettingsDraft.footer.description}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="site-footer-notes">Footer notes (one per line)</label>
                        <textarea
                          className="admin-textarea"
                          id="site-footer-notes"
                          onChange={(event) => {
                            setFooterNotesText(event.target.value);
                            updateSiteSettings("footer", "notes", fromMultiline(event.target.value));
                          }}
                          value={footerNotesText}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="site-social-signals">Social signals (one per line)</label>
                        <textarea
                          className="admin-textarea"
                          id="site-social-signals"
                          onChange={(event) => {
                            setSocialSignalsText(event.target.value);
                            updateSiteSettings(
                              "footer",
                              "socialSignals",
                              fromMultiline(event.target.value),
                            );
                          }}
                          value={socialSignalsText}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="site-utility-links">Utility links (`label | href`)</label>
                        <textarea
                          className="admin-textarea"
                          id="site-utility-links"
                          onChange={(event) => {
                            setUtilityLinksText(event.target.value);
                            updateSiteSettings(
                              "footer",
                              "utilityLinks",
                              parseUtilityLinks(event.target.value),
                            );
                          }}
                          value={utilityLinksText}
                        />
                      </div>

                      <div className="admin-field md:col-span-2 xl:col-span-3">
                        <label htmlFor="site-copyright-tagline">Copyright tagline</label>
                        <input
                          className="admin-input"
                          id="site-copyright-tagline"
                          onChange={(event) =>
                            updateSiteSettings(
                              "footer",
                              "copyrightTagline",
                              event.target.value,
                            )
                          }
                          value={siteSettingsDraft.footer.copyrightTagline}
                        />
                      </div>
                    </div>

                    <div className="admin-button-row mt-4">
                      <button
                        className="admin-button"
                        disabled={busyKey === "site-settings"}
                        onClick={() => void saveSiteSettings()}
                        type="button"
                      >
                        {busyKey === "site-settings" ? (
                          <LoaderCircle className="animate-spin" size={15} />
                        ) : (
                          <Save size={15} />
                        )}
                        <span>Save site settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="admin-surface" id="media-library">
        <div className="admin-panel-header">
          <div className="space-y-3">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <CloudUpload size={15} />
                <span>Cloudinary media</span>
              </span>
              <span
                className={`status-pill ${
                  cloudinaryReady ? "status-pill--ok" : "status-pill--warn"
                }`}
              >
                {cloudinaryReady ? "Cloudinary ready" : "Cloudinary env missing"}
              </span>
            </div>
            <div>
              <h2 className="display-title text-4xl text-white sm:text-5xl">
                Upload once, reuse everywhere.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Sync the bundled Veronica library to Cloudinary, or upload new media directly from
                admin. Every asset lands in Mongo-backed media records with reusable delivery URLs.
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
                  <CloudUpload size={15} />
                  <span>Bundled library</span>
                </span>
              </div>
              <p className="admin-note mt-4">
                One-click sync for the real Veronica images and music videos already inside the
                project workspace.
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
                  <Sparkles size={15} />
                  <span>Fresh upload</span>
                </span>
              </div>
              <p className="admin-note mt-4">
                Add new posters, editorials, reels, or video masters and copy the resulting URLs
                straight into page content.
              </p>
              <div className="admin-button-row mt-4">
                <label className="admin-button cursor-pointer">
                  {busyKey === "upload" ? (
                    <LoaderCircle className="animate-spin" size={15} />
                  ) : (
                    <CloudUpload size={15} />
                  )}
                  <span>{busyKey === "upload" ? "Uploading..." : "Upload media"}</span>
                  <input
                    accept="image/*,video/*"
                    className="sr-only"
                    disabled={!cloudinaryReady || busyKey === "upload"}
                    multiple
                    onChange={(event) => void uploadFiles(event.target.files)}
                    type="file"
                  />
                </label>
              </div>
            </article>
          </div>

          <div className="admin-filter-row">
            {(["all", "image", "video"] as const).map((item) => (
              <button
                className={`admin-filter-pill ${mediaFilter === item ? "is-active" : ""}`.trim()}
                key={item}
                onClick={() => setMediaFilter(item)}
                type="button"
              >
                {item === "all" ? "All assets" : `${item}s`}
              </button>
            ))}
            <span className="status-pill status-pill--ok">
              {visibleMedia.length} visible asset{visibleMedia.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {visibleMedia.map((asset) => (
              <article className="admin-record-card" key={asset.publicId}>
                <div className="overflow-hidden rounded-[1.15rem] border border-white/8 bg-black/30">
                  {asset.resourceType === "video" ? (
                    <video
                      className="aspect-[4/5] h-full w-full object-cover"
                      controls
                      preload="metadata"
                      src={asset.secureUrl}
                    />
                  ) : (
                    <Image
                      alt={asset.alt}
                      className="aspect-[4/5] h-full w-full object-cover"
                      height={asset.height ?? 1200}
                      loading="lazy"
                      src={asset.secureUrl}
                      unoptimized
                      width={asset.width ?? 960}
                    />
                  )}
                </div>

                <div className="admin-record-copy">
                  <div className="admin-panel-meta">
                    <span className="admin-badge">
                      {asset.resourceType === "video" ? <Video size={15} /> : <ImageIcon size={15} />}
                      <span>{asset.resourceType}</span>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{asset.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/60">{asset.alt}</p>
                  </div>
                  <div className="admin-key-list">
                    <span className="admin-key-chip">{asset.publicId}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <button
                    className="admin-button admin-button--ghost"
                    onClick={() => void copyValue(asset.secureUrl, "Asset URL")}
                    type="button"
                  >
                    <Copy size={15} />
                    <span>Copy URL</span>
                  </button>
                  <button
                    className="admin-button admin-button--ghost"
                    onClick={() => void copyValue(asset.publicId, "Public ID")}
                    type="button"
                  >
                    <Copy size={15} />
                    <span>Copy public ID</span>
                  </button>
                </div>
              </article>
            ))}

            {visibleMedia.length === 0 ? (
              <div className="admin-empty">No assets match the current media filter.</div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
