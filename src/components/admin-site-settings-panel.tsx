"use client";

import { useState } from "react";
import { LoaderCircle, Save, Settings2 } from "lucide-react";
import type { CmsSiteSettings } from "@/lib/cms-types";

type AdminSiteSettingsPanelProps = {
  initialSiteSettings: CmsSiteSettings;
};

type FeedbackState = {
  tone: "ok" | "error";
  message: string;
} | null;

function cloneSettings(value: CmsSiteSettings) {
  return JSON.parse(JSON.stringify(value)) as CmsSiteSettings;
}

function toMultiline(items: string[]) {
  return items.join("\n");
}

function fromMultiline(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
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

async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export function AdminSiteSettingsPanel({
  initialSiteSettings,
}: AdminSiteSettingsPanelProps) {
  const [siteSettingsDraft, setSiteSettingsDraft] = useState(() => cloneSettings(initialSiteSettings));
  const [footerNotesText, setFooterNotesText] = useState(
    toMultiline(initialSiteSettings.footer.notes),
  );
  const [socialSignalsText, setSocialSignalsText] = useState(
    toMultiline(initialSiteSettings.footer.socialSignals),
  );
  const [utilityLinksText, setUtilityLinksText] = useState(
    serializeUtilityLinks(initialSiteSettings.footer.utilityLinks),
  );
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [busy, setBusy] = useState(false);

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

  async function saveSiteSettings() {
    setBusy(true);
    setFeedback(null);

    const response = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteSettingsDraft),
    });

    if (!response.ok) {
      setBusy(false);
      setFeedback({ tone: "error", message: await readApiError(response) });
      return;
    }

    const payload = (await response.json()) as { item: CmsSiteSettings };
    setSiteSettingsDraft(cloneSettings(payload.item));
    setFooterNotesText(toMultiline(payload.item.footer.notes));
    setSocialSignalsText(toMultiline(payload.item.footer.socialSignals));
    setUtilityLinksText(serializeUtilityLinks(payload.item.footer.utilityLinks));
    setBusy(false);
    setFeedback({ tone: "ok", message: "Global settings saved." });
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

        <div className="admin-site-settings-grid">
          <div className="admin-field">
            <label htmlFor="site-brand-kicker">Header kicker</label>
            <input
              className="admin-input"
              id="site-brand-kicker"
              onChange={(event) => updateSiteSettings("header", "brandKicker", event.target.value)}
              value={siteSettingsDraft.header.brandKicker}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="site-booking-label">Booking label</label>
            <input
              className="admin-input"
              id="site-booking-label"
              onChange={(event) => updateSiteSettings("header", "bookingLabel", event.target.value)}
              value={siteSettingsDraft.header.bookingLabel}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="site-shop-label">Shop label</label>
            <input
              className="admin-input"
              id="site-shop-label"
              onChange={(event) => updateSiteSettings("header", "shopLabel", event.target.value)}
              value={siteSettingsDraft.header.shopLabel}
            />
          </div>

          <div className="admin-field md:col-span-2 xl:col-span-3">
            <label htmlFor="site-footer-description">Footer description</label>
            <textarea
              className="admin-textarea"
              id="site-footer-description"
              onChange={(event) => updateSiteSettings("footer", "description", event.target.value)}
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
                updateSiteSettings("footer", "socialSignals", fromMultiline(event.target.value));
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
                updateSiteSettings("footer", "utilityLinks", parseUtilityLinks(event.target.value));
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
                updateSiteSettings("footer", "copyrightTagline", event.target.value)
              }
              value={siteSettingsDraft.footer.copyrightTagline}
            />
          </div>
        </div>

        <div className="admin-button-row mt-4">
          <button className="admin-button" disabled={busy} onClick={() => void saveSiteSettings()} type="button">
            {busy ? <LoaderCircle className="animate-spin" size={15} /> : <Save size={15} />}
            <span>Save settings</span>
          </button>
        </div>
      </section>
    </div>
  );
}
