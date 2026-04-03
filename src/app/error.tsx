"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught application error:", error);
  }, [error]);

  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <section className="section-shell" style={{ paddingTop: "clamp(8rem, 14vw, 12rem)" }}>
        <div className="editorial-paper-panel" style={{ maxWidth: "42rem", marginInline: "auto" }}>
          <p className="section-label">Something went wrong</p>
          <h1 className="display-title mt-5 text-4xl text-[#1f1914] sm:text-5xl">
            We hit an unexpected issue.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#3a332d]">
            An error occurred while loading this page. This has been logged and our
            team will look into it. You can try refreshing or go back to the homepage.
          </p>
          {error.digest ? (
            <p
              className="mt-4"
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7c6545",
              }}
            >
              Error reference: {error.digest}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="primary-button"
              onClick={() => reset()}
              type="button"
            >
              Try Again
            </button>
            <a className="secondary-button" href="/">
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
