"use client";

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
};

export function TextareaField({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
}: TextareaFieldProps) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      <textarea
        className={`admin-textarea ${error ? "is-invalid" : ""}`.trim()}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
      {error ? <p className="admin-field-error">{error}</p> : null}
    </div>
  );
}
