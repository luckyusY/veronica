"use client";

import { useState } from "react";
import { ChevronDown, CodeXml, Layers } from "lucide-react";

type SectionEditorProps = {
  title: string;
  sectionKey: string;
  value: unknown;
  onChange: (value: unknown) => void;
  errorCount: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function prettyPrint(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function SectionEditor({
  title,
  sectionKey,
  value,
  onChange,
  errorCount,
  defaultOpen = false,
  children,
}: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [rawMode, setRawMode] = useState(false);
  const [rawValue, setRawValue] = useState(prettyPrint(value));
  const [rawError, setRawError] = useState<string | null>(null);

  function toggleRawMode() {
    if (rawMode) {
      try {
        const parsed = JSON.parse(rawValue);
        onChange(parsed);
        setRawError(null);
        setRawMode(false);
      } catch {
        setRawError("This section must contain valid JSON before returning to form mode.");
      }

      return;
    }

    setRawValue(prettyPrint(value));
    setRawError(null);
    setRawMode(true);
  }

  return (
    <section className="admin-section-editor">
      <button
        className="admin-section-editor-header"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <div className="admin-section-editor-left">
          <div className="admin-section-editor-num">
            <Layers size={14} />
          </div>
          <div className="admin-section-editor-info">
            <h3 className="admin-section-editor-title">{title}</h3>
            <span className="admin-section-editor-key">{sectionKey}</span>
          </div>
        </div>

        <div className="admin-section-editor-right">
          {errorCount > 0 ? (
            <span className="status-pill status-pill--error-soft">
              {errorCount} issue{errorCount === 1 ? "" : "s"}
            </span>
          ) : null}
          <div className={`admin-section-editor-chevron${isOpen ? " is-open" : ""}`}>
            <ChevronDown size={14} />
          </div>
        </div>
      </button>

      {isOpen ? (
        <div className="admin-section-editor-body">
          {rawMode ? (
            <div className="admin-field">
              <label>{title} JSON</label>
              <textarea
                className={`admin-textarea admin-code-editor ${rawError ? "is-invalid" : ""}`.trim()}
                onChange={(event) => setRawValue(event.target.value)}
                rows={14}
                value={rawValue}
              />
              {rawError ? <p className="admin-field-error">{rawError}</p> : null}
            </div>
          ) : (
            children
          )}

          <div className="admin-section-editor-footer">
            <button
              className="admin-button admin-button--ghost"
              onClick={toggleRawMode}
              type="button"
            >
              <CodeXml size={14} />
              <span>{rawMode ? "Apply JSON" : "Raw JSON"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
