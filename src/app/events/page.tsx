import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarClock, MapPin, Ticket } from "lucide-react";
import { listAdminCollection } from "@/lib/admin-store";
import type { AdminRecord } from "@/lib/admin-schema";
import { EventCountdown } from "@/components/event-countdown";

function formatEventDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}



export const metadata: Metadata = {
  title: "Events — Veronica Adane",
  description: "Upcoming shows, tour dates, and live performances by Veronica Adane.",
};

export const revalidate = 60;

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s === "confirmed") return "events-badge--confirmed";
  if (s === "planning") return "events-badge--planning";
  if (s === "sold out") return "events-badge--soldout";
  if (s === "cancelled") return "events-badge--cancelled";
  return "events-badge--default";
}

function EventCard({ event }: { event: AdminRecord }) {
  return (
    <article className="events-card">
      {event.bannerImage ? (
        <div className="events-card-banner">
          <Image
            alt={event.title}
            className="events-card-img"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            src={event.bannerImage}
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>
      ) : (
        <div className="events-card-banner events-card-banner--empty">
          <CalendarClock size={28} />
        </div>
      )}

      <div className="events-card-body">
        <div className="events-card-topline">
          <span className={`events-badge ${statusColor(event.status)}`}>{event.status}</span>
          {event.eventDate ? (
            <span className="events-card-date">
              <CalendarClock size={11} />
              {formatEventDate(event.eventDate)}
            </span>
          ) : event.highlight ? (
            <span className="events-card-date">{event.highlight}</span>
          ) : null}
        </div>

        <h2 className="events-card-title">{event.title}</h2>

        {event.subtitle ? (
          <p className="events-card-venue">
            <MapPin size={12} />
            <span>{event.subtitle}</span>
          </p>
        ) : null}

        {event.notes ? <p className="events-card-notes">{event.notes}</p> : null}

        {/* Live countdown — only shown when eventDate is set */}
        {event.eventDate ? (
          <EventCountdown eventDate={event.eventDate} />
        ) : null}

        {/* Gallery strip */}
        {event.galleryImages && event.galleryImages.length > 0 ? (
          <div className="events-gallery-strip">
            {event.galleryImages.map((src, i) => (
              <div className="events-gallery-thumb" key={i}>
                <Image
                  alt={`${event.title} gallery ${i + 1}`}
                  className="events-gallery-img"
                  fill
                  loading="lazy"
                  sizes="80px"
                  src={src}
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            ))}
          </div>
        ) : null}

        {/* Ticket button — only shown when a link is set */}
        <div className="events-card-footer">
          {event.link ? (
            <a className="events-ticket-btn" href={event.link} rel="noreferrer" target="_blank">
              <Ticket size={15} />
              <span>Buy Tickets</span>
            </a>
          ) : (
            <span className="events-no-ticket">Tickets not available yet</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const events = await listAdminCollection("events");

  return (
    <main className="events-page">
      {/* Page header */}
      <div className="events-header section-shell">
        <p className="section-label">Live performance</p>
        <h1 className="display-title events-page-title">Events</h1>
        <p className="events-page-subtitle">
          Upcoming shows, confirmed dates, and touring information.
        </p>
      </div>

      {/* All events grid */}
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
          <Link className="events-ticket-link" href="/">Back to home</Link>
        </div>
      )}
    </main>
  );
}
