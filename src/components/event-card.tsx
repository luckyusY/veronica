"use client";

import Image from "next/image";
import { CalendarClock, CalendarPlus, MapPin, Ticket } from "lucide-react";
import { motion } from "motion/react";
import type { AdminRecord } from "@/lib/admin-schema";
import { EventCountdown } from "@/components/event-countdown";

// ─── Helpers (duplicated from page so the card is self-contained) ─────────────

function statusMeta(status: string): { cls: string } {
  const s = status.toLowerCase();
  if (s === "confirmed") return { cls: "ev-badge--confirmed" };
  if (s === "planning")  return { cls: "ev-badge--planning"  };
  if (s === "sold out")  return { cls: "ev-badge--soldout"   };
  if (s === "cancelled") return { cls: "ev-badge--cancelled" };
  return                        { cls: "ev-badge--default"   };
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

function toGCalDate(iso: string) {
  return iso.replace(/[-:]/g, "").slice(0, 15);
}

function buildGoogleCalUrl(event: AdminRecord) {
  if (!event.eventDate) return null;
  const start  = toGCalDate(event.eventDate);
  const endMs  = new Date(event.eventDate).getTime() + 2 * 60 * 60 * 1000;
  const end    = toGCalDate(new Date(endMs).toISOString().slice(0, 16));
  const params = new URLSearchParams({
    action:   "TEMPLATE",
    text:     event.title,
    dates:    `${start}/${end}`,
    details:  event.notes  || "",
    location: event.subtitle || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EventCard({
  event,
  index = 0,
}: {
  event: AdminRecord;
  index?: number;
}) {
  const { cls }      = statusMeta(event.status);
  const googleCalUrl = buildGoogleCalUrl(event);

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="ev-card"
      initial={{ opacity: 0, y: 48 }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ once: true, margin: "-60px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
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
        <div className="ev-card-media-overlay" />
        <span className={`ev-badge ${cls}`}>
          <span className="ev-badge-dot" />
          {event.status}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="ev-card-body">
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

        <h2 className="ev-card-title">{event.title}</h2>

        {event.subtitle ? (
          <p className="ev-card-venue">
            <MapPin size={12} />
            <span>{event.subtitle}</span>
          </p>
        ) : null}

        {event.notes ? (
          <p className="ev-card-notes">{event.notes}</p>
        ) : null}

        {event.eventDate ? (
          <div className="ev-card-countdown-wrap">
            <p className="ev-card-countdown-label">Time remaining</p>
            <EventCountdown eventDate={event.eventDate} />
          </div>
        ) : null}

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

        {/* ── Action row ── */}
        <div className="ev-card-actions">
          {event.link ? (
            <motion.a
              className="ev-ticket-btn"
              href={event.link}
              rel="noreferrer"
              target="_blank"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
            >
              <Ticket size={14} />
              <span>Buy Tickets</span>
              <span className="ev-ticket-btn-shine" aria-hidden="true" />
            </motion.a>
          ) : (
            <span className="ev-no-ticket">Tickets not available yet</span>
          )}

          {googleCalUrl ? (
            <motion.a
              className="ev-cal-btn"
              href={googleCalUrl}
              rel="noreferrer"
              target="_blank"
              title="Add to Google Calendar"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CalendarPlus size={14} />
              <span>Add to Calendar</span>
            </motion.a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
