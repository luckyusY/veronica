"use client";

import { useMemo, useState } from "react";
import { Check, Images, LoaderCircle, Save, Search, Settings2, X } from "lucide-react";
import type { CmsMediaAsset, CmsSiteSettings } from "@/lib/cms-types";

type AdminSiteSettingsPanelProps = {
  initialSiteSettings: CmsSiteSettings;
  initialMediaAssets: CmsMediaAsset[];
};

type FeedbackState = { tone: "ok" | "error"; message: string } | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cloneSettings(v: CmsSiteSettings) {
  return JSON.parse(JSON.stringify(v)) as CmsSiteSettings;
}

function toMultiline(items: string[]) { return items.join("\n"); }

function fromMultiline(value: string) {
  return value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
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
      const [label, href] = line.split("|").map((s) => s.trim());
      return { label: label ?? "", href: href ?? "" };
    })
    .filter((item) => item.label && item.href);
}

async function readApiError(res: Response) {
  try {
    const p = (await res.json()) as { error?: string };
    return p.error ?? "Something went wrong.";
  } catch { return "Something went wrong."; }
}

// ─── Image gallery picker ─────────────────────────────────────────────────────

function CollabImagePicker({
  mediaAssets,
  selected,
  onChange,
}: {
  mediaAssets: CmsMediaAsset[];
  selected: string[];
  onChange: (urls: string[]) => void;
}) {
  const [query, setQuery] = useState("");

  const imageAssets = useMemo(
    () => mediaAssets.filter((a) => a.resourceType === "image"),
    [mediaAssets],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return imageAssets;
    return imageAssets.filter(
      (a) => a.title.toLowerCase().includes(q) || a.alt.toLowerCase().includes(q),
    );
  }, [imageAssets, query]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggle(url: string) {
    if (selectedSet.has(url)) {
      onChange(selected.filter((u) => u !== url));
    } else {
      onChange([...selected, url]);
    }
  }

  function removeSelected(url: string) {
    onChange(selected.filter((u) => u !== url));
  }

  return (
    <div className="cip-root">
      {/* Header bar */}
      <div className="cip-bar">
        <div className="cip-bar-left">
          <Images size={15} strokeWidth={2} />
          <span>Select photos for the Collaborations strip</span>
        </div>
        <span className="cip-count">
          {selected.length > 0 ? `${selected.length} selected` : "None selected"}
        </span>
      </div>

      {/* Search */}
      <div className="cip-search-wrap">
        <Search className="cip-search-icon" size={13} strokeWidth={2} />
        <input
          className="cip-search"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          type="text"
          value={query}
        />
        {query && (
          <button className="cip-search-clear" onClick={() => setQuery("")} type="button">
            <X size={12} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Image grid */}
      {imageAssets.length === 0 ? (
        <div className="cip-empty">
          <Images size={28} strokeWidth={1.2} />
          <p>No images in your media library yet.</p>
          <p className="cip-empty-sub">Upload photos via Admin → Media, then come back here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="cip-empty">
          <p>No images match &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="cip-grid">
          {filtered.map((asset) => {
            const isSelected = selectedSet.has(asset.secureUrl);
            return (
              <button
                className={`cip-thumb${isSelected ? " is-selected" : ""}`}
                key={asset.id}
                onClick={() => toggle(asset.secureUrl)}
                title={asset.title || asset.alt}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={asset.alt || asset.title}
                  className="cip-thumb-img"
                  loading="lazy"
                  src={asset.secureUrl}
                />
                {isSelected && (
                  <span className="cip-thumb-check">
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}
                <span className="cip-thumb-overlay" />
              </button>
            );
          })}
        </div>
      )}

      {/* Selected strip */}
      {selected.length > 0 && (
        <div className="cip-selected-strip">
          <p className="cip-selected-label">Selected order (drag to rearrange is not yet supported — remove and re-add to reorder)</p>
          <div className="cip-selected-list">
            {selected.map((url, i) => (
              <div className="cip-sel-item" key={url}>
                <span className="cip-sel-num">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="cip-sel-img" src={url} />
                <button
                  aria-label="Remove"
                  className="cip-sel-remove"
                  onClick={() => removeSelected(url)}
                  type="button"
                >
                  <X size={10} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function AdminSiteSettingsPanel({
  initialSiteSettings,
  initialMediaAssets,
}: AdminSiteSettingsPanelProps) {
  const [draft, setDraft]                 = useState(() => cloneSettings(initialSiteSettings));
  const [footerNotesText, setFooterNotes] = useState(toMultiline(initialSiteSettings.footer.notes));
  const [socialText, setSocialText]       = useState(toMultiline(initialSiteSettings.footer.socialSignals));
  const [utilityText, setUtilityText]     = useState(serializeUtilityLinks(initialSiteSettings.footer.utilityLinks));
  const [feedback, setFeedback]           = useState<FeedbackState>(null);
  const [busy, setBusy]                   = useState(false);

  function patchHeader(field: string, value: string) {
    setDraft((d) => ({ ...d, header: { ...d.header, [field]: value } }));
  }

  function patchFooter(field: string, value: string | string[] | CmsSiteSettings["footer"]["utilityLinks"]) {
    setDraft((d) => ({ ...d, footer: { ...d.footer, [field]: value } }));
  }

  function setCollabImages(urls: string[]) {
    setDraft((d) => ({ ...d, collabImages: urls }));
  }

  async function save() {
    setBusy(true);
    setFeedback(null);
    const res = await fetch("/api/admin/site-settings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(draft),
    });

    if (!res.ok) {
      setBusy(false);
      setFeedback({ tone: "error", message: await readApiError(res) });
      return;
    }

    const payload = (await res.json()) as { item: CmsSiteSettings };
    setDraft(cloneSettings(payload.item));
    setFooterNotes(toMultiline(payload.item.footer.notes));
    setSocialText(toMultiline(payload.item.footer.socialSignals));
    setUtilityText(serializeUtilityLinks(payload.item.footer.utilityLinks));
    setBusy(false);
    setFeedback({ tone: "ok", message: "Settings saved." });
  }

  return (
    <div className="admin-stack">
      {feedback && (
        <div className={`admin-feedback ${feedback.tone === "ok" ? "admin-feedback--ok" : "admin-feedback--error"}`}>
          {feedback.message}
        </div>
      )}

      <section className="admin-surface">
        {/* Header */}
        <div className="admin-panel-header">
          <div className="space-y-3">
            <div className="admin-panel-meta">
              <span className="admin-badge">
                <Settings2 size={15} />
                <span>Global Settings</span>
              </span>
            </div>
            <div>
              <h1 className="display-title text-4xl text-white sm:text-5xl">
                Manage header and footer content globally.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
                Keep brand copy, labels, social signals, and footer links in one place so every
                public page stays aligned.
              </p>
            </div>
          </div>
        </div>

        <div className="luxury-divider my-5" />

        {/* Header settings */}
        <div className="admin-site-settings-layout">
          <section className="admin-settings-card">
            <div className="admin-settings-card-header">
              <div>
                <p className="section-label">Header</p>
                <h2 className="display-title mt-3 text-3xl text-white">Navigation labels</h2>
              </div>
              <p className="text-sm leading-7 text-white/60">
                Keep the top navigation language short, premium, and consistent.
              </p>
            </div>

            <div className="admin-site-settings-grid">
              <div className="admin-field">
                <label htmlFor="site-brand-kicker">Header kicker</label>
                <input
                  className="admin-input"
                  id="site-brand-kicker"
                  onChange={(e) => patchHeader("brandKicker", e.target.value)}
                  value={draft.header.brandKicker}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="site-booking-label">Booking label</label>
                <input
                  className="admin-input"
                  id="site-booking-label"
                  onChange={(e) => patchHeader("bookingLabel", e.target.value)}
                  value={draft.header.bookingLabel}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="site-shop-label">Shop label</label>
                <input
                  className="admin-input"
                  id="site-shop-label"
                  onChange={(e) => patchHeader("shopLabel", e.target.value)}
                  value={draft.header.shopLabel}
                />
              </div>
            </div>
          </section>

          {/* Footer settings */}
          <section className="admin-settings-card">
            <div className="admin-settings-card-header">
              <div>
                <p className="section-label">Footer</p>
                <h2 className="display-title mt-3 text-3xl text-white">Closing details</h2>
              </div>
              <p className="text-sm leading-7 text-white/60">
                Edit the supporting footer copy, signals, and utility links from one place.
              </p>
            </div>

            <div className="admin-site-settings-grid">
              <div className="admin-field admin-field--full">
                <label htmlFor="site-footer-description">Footer description</label>
                <textarea
                  className="admin-textarea"
                  id="site-footer-description"
                  onChange={(e) => patchFooter("description", e.target.value)}
                  value={draft.footer.description}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="site-footer-notes">Footer notes (one per line)</label>
                <textarea
                  className="admin-textarea"
                  id="site-footer-notes"
                  onChange={(e) => {
                    setFooterNotes(e.target.value);
                    patchFooter("notes", fromMultiline(e.target.value));
                  }}
                  value={footerNotesText}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="site-social-signals">Social signals (one per line)</label>
                <textarea
                  className="admin-textarea"
                  id="site-social-signals"
                  onChange={(e) => {
                    setSocialText(e.target.value);
                    patchFooter("socialSignals", fromMultiline(e.target.value));
                  }}
                  value={socialText}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="site-utility-links">Utility links (label | href)</label>
                <textarea
                  className="admin-textarea"
                  id="site-utility-links"
                  onChange={(e) => {
                    setUtilityText(e.target.value);
                    patchFooter("utilityLinks", parseUtilityLinks(e.target.value));
                  }}
                  value={utilityText}
                />
              </div>
              <div className="admin-field admin-field--full">
                <label htmlFor="site-copyright-tagline">Copyright tagline</label>
                <input
                  className="admin-input"
                  id="site-copyright-tagline"
                  onChange={(e) => patchFooter("copyrightTagline", e.target.value)}
                  value={draft.footer.copyrightTagline}
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── Collab image gallery picker ── */}
        <div className="admin-site-settings-layout" style={{ marginTop: "1.5rem" }}>
          <section className="admin-settings-card">
            <div className="admin-settings-card-header">
              <div>
                <p className="section-label">Collaborations page</p>
                <h2 className="display-title mt-3 text-3xl text-white">Artist photo strip</h2>
              </div>
              <p className="text-sm leading-7 text-white/60">
                Click images from your media library to add them to the auto-scrolling strip
                on the Collaborations page. Upload photos via Admin → Media first.
              </p>
            </div>

            <CollabImagePicker
              mediaAssets={initialMediaAssets}
              onChange={setCollabImages}
              selected={draft.collabImages ?? []}
            />
          </section>
        </div>

        {/* Save button */}
        <div className="admin-button-row mt-4">
          <button
            className="admin-button"
            disabled={busy}
            onClick={() => void save()}
            type="button"
          >
            {busy ? <LoaderCircle className="animate-spin" size={15} /> : <Save size={15} />}
            <span>Save settings</span>
          </button>
        </div>
      </section>
    </div>
  );
}
