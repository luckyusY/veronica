"use client";

import { useState } from "react";
import { LoaderCircle, Save, Settings2 } from "lucide-react";
import type { CmsSiteSettings } from "@/lib/cms-types";
import {
  type FeedbackState,
  cloneSettings,
  fromMultiline,
  parseUtilityLinks,
  readApiError,
  serializeUtilityLinks,
  toMultiline,
} from "@/lib/admin-utils";

type SiteSettingsEditorProps = {
  initialSiteSettings: CmsSiteSettings;
};

export function SiteSettingsEditor({ initialSiteSettings }: SiteSettingsEditorProps) {
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
    setFeedback({ tone: "ok", message: "Site settings saved." });
  }

  return (
    <div className="admin-surface admin-surface--inner" id="settings">
      {feedback && (
        <div className={`admin-feedback mb-4 ${feedback.tone === "ok" ? "admin-feedback--ok" : "admin-feedback--error"}`}>
          {feedback.message}
        </div>
      )}
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
          disabled={busy}
          onClick={() => void saveSiteSettings()}
          type="button"
        >
          {busy ? <LoaderCircle className="animate-spin" size={15} /> : <Save size={15} />}
          <span>Save site settings</span>
        </button>
      </div>
    </div>
  );
}
