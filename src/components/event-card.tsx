"use client";

import Image from "next/image";
import { CalendarPlus, Clock, MapPin, Ticket } from "lucide-react";
import { motion } from "motion/react";
import type { AdminRecord } from "@/lib/admin-schema";
import { EventCountdown } from "@/components/event-countdown";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusMeta(status: string): { cls: string; label: string } {
  const s = status.toLowerCase();
  if (s === "confirmed") return { cls: "ev-badge--confirmed", label: "Confirmed" };
  if (s === "planning")  return { cls: "ev-badge--planning",  label: "Planning"  };
  if (s === "sold out")  return { cls: "ev-badge--soldout",   label: "Sold Out"  };
  if (s === "cancelled") return { cls: "ev-badge--cancelled", label: "Cancelled" };
  return                        { cls: "ev-badge--default",   label: status      };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month:   "long",
    day:     "numeric",
    year:    "numeric",
  }).format(new Date(iso));
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour:   "numeric",
    minute: "2-digit",
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
    details:  event.notes    || "",
    location: event.subtitle || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function EventCard({ event, index = 0 }: { event: AdminRecord; index?: number }) {
  const { cls, label } = statusMeta(event.status);
  const googleCalUrl   = buildGoogleCalUrl(event);

  return (
    <motion.article
      className="ev-card"
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* ── Banner image ── */}
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
            <Clock size={28} strokeWidth={1.5} />
          </div>
        )}
        <div className="ev-card-media-overlay" />

        {/* Status badge — Coinbase pill style */}
        <span className={`ev-badge ${cls}`}>
          <span className="ev-badge-dot" />
          {label}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="ev-card-body">

        {/* Date + time row */}
        {event.eventDate ? (
          <div className="ev-card-dateline">
            <span className="ev-card-date">{formatDate(event.eventDate)}</span>
            <span className="ev-card-time-chip">
              <Clock size={10} />
              {formatTime(event.eventDate)}
            </span>
          </div>
        ) : event.highlight ? (
          <p className="ev-card-date">{event.highlight}</p>
        ) : null}

        {/* Title */}
        <h2 className="ev-card-title">{event.title}</h2>

        {/* Venue */}
        {event.subtitle ? (
          <p className="ev-card-venue">
            <MapPin size={12} strokeWidth={2} />
            <span>{event.subtitle}</span>
          </p>
        ) : null}

        {/* Notes */}
        {event.notes ? <p className="ev-card-notes">{event.notes}</p> : null}

        {/* Countdown — Coinbase-style tile grid */}
        {event.eventDate ? (
          <EventCountdown eventDate={event.eventDate} />
        ) : null}

        {/* Gallery strip */}
        {event.galleryImages && event.galleryImages.length > 0 ? (
          <div className="ev-gallery-strip">
            {event.galleryImages.slice(0, 4).map((src, i) => (
              <div className="ev-gallery-thumb" key={i}>
                <Image
                  alt=""
                  className="ev-gallery-img"
                  fill
                  loading="lazy"
                  sizes="56px"
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

        {/* ── Actions — Coinbase pill buttons ── */}
        <div className="ev-card-actions">
          {event.link ? (
            <motion.a
              className="ev-ticket-btn"
              href={event.link}
              rel="noreferrer"
              target="_blank"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Ticket size={15} strokeWidth={2} />
              <span>Buy Tickets</span>
              <span aria-hidden="true" className="ev-ticket-btn-shine" />
            </motion.a>
          ) : (
            <span className="ev-no-ticket">Tickets TBA</span>
          )}

          {googleCalUrl ? (
            <motion.a
              className="ev-cal-btn"
              href={googleCalUrl}
              rel="noreferrer"
              target="_blank"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <CalendarPlus size={15} strokeWidth={2} />
              <span>Save Date</span>
            </motion.a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
