"use client";

type UrlFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

export function UrlField({ label, value, onChange, error, placeholder }: UrlFieldProps) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      <input
        className={`admin-input ${error ? "is-invalid" : ""}`.trim()}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? "/about or https://example.com"}
        type="url"
        value={value}
      />
      {error ? <p className="admin-field-error">{error}</p> : null}
    </div>
  );
}
