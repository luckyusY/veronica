"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, CheckCircle2, RotateCcw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

const COLLAB_TYPES = [
  { id: "music",   label: "Music Collaboration" },
  { id: "brand",   label: "Brand Partnership"   },
  { id: "event",   label: "Event Partnership"   },
  { id: "media",   label: "Media & Press"       },
  { id: "other",   label: "Other"               },
] as const;

type FormData = {
  name:    string;
  email:   string;
  org:     string;
  type:    string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

// ─── Animations ───────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const row = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.52, ease } },
};

// ─── Field component ─────────────────────────────────────────────────────────

function Field({
  label,
  opt,
  error,
  children,
}: {
  label: React.ReactNode;
  opt?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cf-field">
      <div className="cf-label-row">
        <span className="cf-label">{label}</span>
        {opt && <span className="cf-label-opt">optional</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="cf-field-error"
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function CollabForm() {
  const [form, setForm]       = useState<FormData>({ name: "", email: "", org: "", type: COLLAB_TYPES[0].label, message: "" });
  const [errors, setErrors]   = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.name.trim())    e.name    = "Name is required.";
    if (!form.email.trim())   e.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              e.email   = "Enter a valid email address.";
    if (!form.message.trim()) e.message = "Please write a short message.";
    return e;
  }

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function selectType(label: string) {
    setForm((f) => ({ ...f, type: label }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/collab-inquiry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Submission failed.");
      }
      setDone(true);
      toast.success("Inquiry sent!", {
        description: "We'll review your request and be in touch shortly.",
        duration:    6000,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setDone(false);
    setForm({ name: "", email: "", org: "", type: COLLAB_TYPES[0].label, message: "" });
    setErrors({});
  }

  // ── Success state ───────────────────────────────────────────────────────────
  if (done) {
    return (
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="cf-done"
        initial={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.44, ease }}
      >
        <motion.div
          animate={{ scale: 1 }}
          className="cf-done-icon"
          initial={{ scale: 0.6 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <CheckCircle2 size={28} strokeWidth={1.5} />
        </motion.div>
        <h2 className="cf-done-title">Inquiry received</h2>
        <p className="cf-done-msg">
          Thanks for reaching out. The team will review your request
          and respond to <strong>{form.email}</strong> shortly.
        </p>
        <button className="cf-done-reset" onClick={reset} type="button">
          <RotateCcw size={13} strokeWidth={2} />
          Send another inquiry
        </button>
      </motion.div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <motion.form
      animate="show"
      className="cf-form"
      initial="hidden"
      onSubmit={handleSubmit}
      variants={container}
    >
      {/* Type chips */}
      <motion.div variants={row}>
        <div className="cf-label-row" style={{ marginBottom: "0.55rem" }}>
          <span className="cf-label">Type of collaboration</span>
        </div>
        <div className="cf-chips">
          {COLLAB_TYPES.map(({ id, label }) => (
            <button
              className={`cf-chip${form.type === label ? " is-active" : ""}`}
              key={id}
              onClick={() => selectType(label)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Name + Email */}
      <motion.div className="cf-row cf-row--2" variants={row}>
        <Field error={errors.name} label="Full name *">
          <input
            autoComplete="name"
            className={`cf-input${errors.name ? " is-error" : ""}`}
            name="name"
            onChange={handleChange}
            placeholder="Your name"
            type="text"
            value={form.name}
          />
        </Field>
        <Field error={errors.email} label="Email *">
          <input
            autoComplete="email"
            className={`cf-input${errors.email ? " is-error" : ""}`}
            name="email"
            onChange={handleChange}
            placeholder="your@email.com"
            type="email"
            value={form.email}
          />
        </Field>
      </motion.div>

      {/* Organization */}
      <motion.div variants={row}>
        <Field label="Organization / Brand" opt>
          <input
            autoComplete="organization"
            className="cf-input"
            name="org"
            onChange={handleChange}
            placeholder="Company, label, or brand name"
            type="text"
            value={form.org}
          />
        </Field>
      </motion.div>

      {/* Message */}
      <motion.div variants={row}>
        <Field error={errors.message} label="Message *">
          <textarea
            className={`cf-input cf-textarea${errors.message ? " is-error" : ""}`}
            name="message"
            onChange={handleChange}
            placeholder="Tell us about the project, timeline, and what you're looking for…"
            rows={6}
            value={form.message}
          />
        </Field>
      </motion.div>

      {/* Submit */}
      <motion.div variants={row}>
        <motion.button
          className="cf-submit"
          disabled={loading}
          type="submit"
          whileHover={loading ? {} : { scale: 1.03, boxShadow: "0 8px 36px rgba(176,141,87,0.42)" }}
          whileTap={loading   ? {} : { scale: 0.97 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                animate={{ opacity: 1 }}
                className="cf-submit-inner"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="loading"
              >
                <Loader2 className="cf-spin" size={16} />
                Sending…
              </motion.span>
            ) : (
              <motion.span
                animate={{ opacity: 1 }}
                className="cf-submit-inner"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="idle"
              >
                <Send size={15} strokeWidth={2} />
                Send inquiry
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <p className="cf-privacy">
          Your information is used only to process this inquiry and will never be shared.
        </p>
      </motion.div>
    </motion.form>
  );
}
