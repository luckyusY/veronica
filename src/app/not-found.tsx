import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist on the official Veronica Adane website.",
};

export default function NotFound() {
  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <section className="section-shell" style={{ paddingTop: "clamp(8rem, 14vw, 12rem)" }}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="editorial-paper-panel">
            <p className="section-label">Error 404</p>
            <h1 className="display-title mt-5 text-5xl text-[#1f1914] sm:text-6xl lg:text-7xl">
              Page not found.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#3a332d]">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved.
              Let&apos;s get you back to familiar ground.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="primary-button" href="/">
                Back to Home
              </Link>
              <Link className="secondary-button" href="/music">
                Explore Music
              </Link>
            </div>
          </div>

          <div className="editorial-dark-panel" style={{ minHeight: "22rem" }}>
            <p className="section-label text-white/80">Quick Links</p>
            <div className="mt-6 grid gap-3">
              {[
                { href: "/about", label: "About Veronica", note: "Biography & journey" },
                { href: "/music", label: "Music & Videos", note: "Discography & visuals" },
                { href: "/events", label: "Events & Tours", note: "Live performances" },
                { href: "/contact", label: "Contact & Booking", note: "Get in touch" },
              ].map((item) => (
                <Link
                  className="editorial-route-card"
                  href={item.href}
                  key={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    borderRadius: "1rem",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(22, 15, 12, 0.76)",
                    padding: "0.9rem 1rem",
                    textDecoration: "none",
                    transition: "transform 220ms ease, border-color 220ms ease",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.86rem",
                        fontWeight: 700,
                        color: "rgba(247, 242, 234, 0.94)",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        margin: "0.2rem 0 0",
                        fontSize: "0.72rem",
                        color: "rgba(247, 242, 234, 0.56)",
                      }}
                    >
                      {item.note}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "0.64rem",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase" as const,
                      color: "rgba(201, 169, 110, 0.82)",
                    }}
                  >
                    Open
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
