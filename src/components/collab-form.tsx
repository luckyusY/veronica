"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

const COLLAB_TYPES = [
  "Music Collaboration",
  "Brand Partnership",
  "Event Partnership",
  "Media & Press",
  "Other",
];

export function CollabForm() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    type: COLLAB_TYPES[0],
    message: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/collab-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed.");
      }
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="collab-success">
        <div className="collab-success-icon">✓</div>
        <h2 className="collab-success-title">Inquiry received</h2>
        <p className="collab-success-msg">
          Thanks for reaching out. We'll review your request and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="collab-form" onSubmit={handleSubmit}>
      <div className="collab-form-row collab-form-row--2">
        <div className="collab-field">
          <label className="collab-label" htmlFor="cf-name">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            className="collab-input"
            id="cf-name"
            name="name"
            onChange={handleChange}
            placeholder="Your name"
            required
            type="text"
            value={form.name}
          />
        </div>
        <div className="collab-field">
          <label className="collab-label" htmlFor="cf-email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            className="collab-input"
            id="cf-email"
            name="email"
            onChange={handleChange}
            placeholder="your@email.com"
            required
            type="email"
            value={form.email}
          />
        </div>
      </div>

      <div className="collab-form-row collab-form-row--2">
        <div className="collab-field">
          <label className="collab-label" htmlFor="cf-org">
            Organization / Brand
          </label>
          <input
            className="collab-input"
            id="cf-org"
            name="org"
            onChange={handleChange}
            placeholder="Optional"
            type="text"
            value={form.org}
          />
        </div>
        <div className="collab-field">
          <label className="collab-label" htmlFor="cf-type">
            Type of collaboration
          </label>
          <select
            className="collab-input collab-select"
            id="cf-type"
            name="type"
            onChange={handleChange}
            value={form.type}
          >
            {COLLAB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="collab-field">
        <label className="collab-label" htmlFor="cf-message">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          className="collab-input collab-textarea"
          id="cf-message"
          name="message"
          onChange={handleChange}
          placeholder="Tell us about the project, timeline, and what you're looking for..."
          required
          rows={6}
          value={form.message}
        />
      </div>

      {state === "error" ? <p className="collab-error">{errorMsg}</p> : null}

      <button
        className="collab-submit-btn"
        disabled={state === "loading"}
        type="submit"
      >
        {state === "loading" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
