"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

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
    days:  Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    mins:  Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    secs:  Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="events-countdown-unit">
      <NumberFlow
        className="events-countdown-value"
        format={{ minimumIntegerDigits: label === "days" ? 1 : 2 }}
        transformTiming={{ duration: 400, easing: "cubic-bezier(0.4,0,0.2,1)" }}
        value={value}
      />
      <span className="events-countdown-label">{label}</span>
    </div>
  );
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
      <CountdownUnit label="days"  value={timeLeft.days}  />
      <span aria-hidden="true" className="events-countdown-sep">:</span>
      <CountdownUnit label="hrs"   value={timeLeft.hours} />
      <span aria-hidden="true" className="events-countdown-sep">:</span>
      <CountdownUnit label="min"   value={timeLeft.mins}  />
      <span aria-hidden="true" className="events-countdown-sep">:</span>
      <CountdownUnit label="sec"   value={timeLeft.secs}  />
    </div>
  );
}
