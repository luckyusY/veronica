import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarClock, CalendarPlus, MapPin, Ticket } from "lucide-react";
import { listAdminCollection } from "@/lib/admin-store";
import type { AdminRecord } from "@/lib/admin-schema";
import { EventCountdown } from "@/components/event-countdown";

export const metadata: Metadata = {
  title: "Events — Veronica Adane",
  description: "Upcoming shows, tour dates, and live performances by Veronica Adane.",
};

export const revalidate = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusMeta(status: string): { cls: string; dot: string } {
  const s = status.toLowerCase();
  if (s === "confirmed") return { cls: "ev-badge--confirmed", dot: "#4ade80" };
  if (s === "planning")  return { cls: "ev-badge--planning",  dot: "#facc15" };
  if (s === "sold out")  return { cls: "ev-badge--soldout",   dot: "#f87171" };
  if (s === "cancelled") return { cls: "ev-badge--cancelled", dot: "#94a3b8" };
  return                        { cls: "ev-badge--default",   dot: "#b08d57" };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
    year:    "numeric",
    hour:    "numeric",
    minute:  "2-digit",
  }).format(new Date(iso));
}

/** Convert datetime-local string (2025-05-18T19:00) to Google Calendar date format */
function toGCalDate(iso: string) {
  // Google Calendar expects YYYYMMDDTHHmmss (no colon/dash)
  return iso.replace(/[-:]/g, "").slice(0, 15);
}

function buildGoogleCalUrl(event: AdminRecord) {
  if (!event.eventDate) return null;
  const start = toGCalDate(event.eventDate);
  // Default 2-hour duration for end time
  const startMs = new Date(event.eventDate).getTime();
  const endMs   = startMs + 2 * 60 * 60 * 1000;
  const end     = toGCalDate(new Date(endMs).toISOString().slice(0, 16));
  const params  = new URLSearchParams({
    action:   "TEMPLATE",
    text:     event.title,
    dates:    `${start}/${end}`,
    details:  event.notes || "",
    location: event.subtitle || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event }: { event: AdminRecord }) {
  const { cls } = statusMeta(event.status);
  const googleCalUrl = buildGoogleCalUrl(event);

  return (
    <article className="ev-card">
      {/* ── Banner ── */}
      <div className="ev-card-media">
        {event.bannerImage ? (
          <Image
            alt={event.title}
            className="ev-card-img"
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={event.bannerImage}
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : (
          <div className="ev-card-img-placeholder">
            <CalendarClock size={32} />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="ev-card-media-overlay" />
        {/* Status badge pinned to image */}
        <span className={`ev-badge ${cls}`}>
          <span className="ev-badge-dot" />
          {event.status}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="ev-card-body">

        {/* Date line */}
        {event.eventDate ? (
          <p className="ev-card-dateline">
            <CalendarClock size={12} />
            {formatDate(event.eventDate)}
          </p>
        ) : event.highlight ? (
          <p className="ev-card-dateline">
            <CalendarClock size={12} />
            {event.highlight}
          </p>
        ) : null}

        {/* Title */}
        <h2 className="ev-card-title">{event.title}</h2>

        {/* Venue */}
        {event.subtitle ? (
          <p className="ev-card-venue">
            <MapPin size={12} />
            <span>{event.subtitle}</span>
          </p>
        ) : null}

        {/* Notes */}
        {event.notes ? (
          <p className="ev-card-notes">{event.notes}</p>
        ) : null}

        {/* Countdown */}
        {event.eventDate ? (
          <div className="ev-card-countdown-wrap">
            <p className="ev-card-countdown-label">Time remaining</p>
            <EventCountdown eventDate={event.eventDate} />
          </div>
        ) : null}

        {/* Gallery strip */}
        {event.galleryImages && event.galleryImages.length > 0 ? (
          <div className="ev-gallery-strip">
            {event.galleryImages.slice(0, 4).map((src, i) => (
              <div className="ev-gallery-thumb" key={i}>
                <Image
                  alt={`${event.title} photo ${i + 1}`}
                  className="ev-gallery-img"
                  fill
                  loading="lazy"
                  sizes="72px"
                  src={src}
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            ))}
            {event.galleryImages.length > 4 ? (
              <div className="ev-gallery-more">+{event.galleryImages.length - 4}</div>
            ) : null}
          </div>
        ) : null}

        {/* Action row */}
        <div className="ev-card-actions">
          {event.link ? (
            <a
              className="ev-ticket-btn"
              href={event.link}
              rel="noreferrer"
              target="_blank"
            >
              <Ticket size={14} />
              <span>Buy Tickets</span>
            </a>
          ) : (
            <span className="ev-no-ticket">Tickets not available yet</span>
          )}

          {googleCalUrl ? (
            <a
              className="ev-cal-btn"
              href={googleCalUrl}
              rel="noreferrer"
              target="_blank"
              title="Add to Google Calendar"
            >
              <CalendarPlus size={14} />
              <span>Add to Calendar</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EventsPage() {
  const events = await listAdminCollection("events");

  return (
    <main className="events-page">
      <div className="events-header section-shell">
        <p className="section-label">Live performance</p>
        <h1 className="display-title events-page-title">Events</h1>
        <p className="events-page-subtitle">
          Upcoming shows, confirmed dates, and touring information.
        </p>
      </div>

      {events.length > 0 ? (
        <section className="events-grid-section section-shell">
          <div className="events-grid">
            {events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        </section>
      ) : (
        <div className="events-empty section-shell">
          <CalendarClock size={32} />
          <p>No events scheduled yet. Check back soon.</p>
          <Link className="ev-ticket-btn" href="/">Back to home</Link>
        </div>
      )}
    </main>
  );
}
