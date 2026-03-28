"use client";

import { useState } from "react";
import { X } from "lucide-react";

type TagListFieldProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
  placeholder?: string;
};

export function TagListField({
  label,
  values,
  onChange,
  error,
  placeholder,
}: TagListFieldProps) {
  const [draftValue, setDraftValue] = useState("");

  function addTag() {
    const nextValue = draftValue.trim();

    if (!nextValue) {
      return;
    }

    onChange([...values, nextValue]);
    setDraftValue("");
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className={`admin-tag-field ${error ? "is-invalid" : ""}`.trim()}>
        <div className="admin-tag-list">
          {values.map((item, index) => (
            <span className="admin-tag-chip" key={`${item}-${index}`}>
              <span>{item}</span>
              <button
                aria-label={`Remove ${item}`}
                className="admin-tag-chip-remove"
                onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
                type="button"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <input
          className="admin-tag-input"
          onChange={(event) => setDraftValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder ?? "Type and press Enter"}
          value={draftValue}
        />
      </div>
      {error ? <p className="admin-field-error">{error}</p> : null}
    </div>
  );
}
