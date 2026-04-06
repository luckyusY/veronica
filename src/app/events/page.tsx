import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { listAdminCollection } from "@/lib/admin-store";
import { EventCard } from "@/components/event-card";

export const metadata: Metadata = {
  title: "Events — Veronica Adane",
  description: "Upcoming shows, tour dates, and live performances by Veronica Adane.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const events = await listAdminCollection("events");

  return (
    <main className="events-page">
      {/* ── Animated header ── */}
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
            {events.map((event, i) => (
              <EventCard event={event} index={i} key={event.id} />
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
