"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  mins: number;
  secs: number;
} | null;

function getTimeLeft(isoDate: string): TimeLeft {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    secs: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function EventCountdown({ eventDate }: { eventDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(eventDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(eventDate)), 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  if (timeLeft === null) {
    return <p className="events-countdown-past">This event has passed</p>;
  }

  return (
    <div className="events-countdown">
      <div className="events-countdown-unit">
        <span className="events-countdown-value">{timeLeft.days}</span>
        <span className="events-countdown-label">days</span>
      </div>
      <span className="events-countdown-sep" aria-hidden="true">:</span>
      <div className="events-countdown-unit">
        <span className="events-countdown-value">{pad(timeLeft.hours)}</span>
        <span className="events-countdown-label">hrs</span>
      </div>
      <span className="events-countdown-sep" aria-hidden="true">:</span>
      <div className="events-countdown-unit">
        <span className="events-countdown-value">{pad(timeLeft.mins)}</span>
        <span className="events-countdown-label">min</span>
      </div>
      <span className="events-countdown-sep" aria-hidden="true">:</span>
      <div className="events-countdown-unit">
        <span className="events-countdown-value">{pad(timeLeft.secs)}</span>
        <span className="events-countdown-label">sec</span>
      </div>
    </div>
  );
}
