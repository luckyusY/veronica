"use client";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

export function TextField({ label, value, onChange, error, placeholder }: TextFieldProps) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      <input
        className={`admin-input ${error ? "is-invalid" : ""}`.trim()}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      {error ? <p className="admin-field-error">{error}</p> : null}
    </div>
  );
}
