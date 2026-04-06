"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

type TimeLeft = { days: number; hours: number; mins: number; secs: number } | null;

function getTimeLeft(isoDate: string): TimeLeft {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:  Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins:  Math.floor((diff % 3_600_000) / 60_000),
    secs:  Math.floor((diff % 60_000) / 1000),
  };
}

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="ev-cd-tile">
      <div className="ev-cd-num">
        <NumberFlow
          format={{ minimumIntegerDigits: label === "days" ? 1 : 2 }}
          transformTiming={{ duration: 450, easing: "cubic-bezier(0.4,0,0.2,1)" }}
          value={value}
          willChange
        />
      </div>
      <span className="ev-cd-lbl">{label}</span>
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
    return <p className="ev-cd-past">This event has passed</p>;
  }

  return (
    <div className="ev-cd-wrap">
      <p className="ev-cd-heading">Time remaining</p>
      <div className="ev-cd-grid">
        <Tile value={timeLeft.days}  label="days" />
        <Tile value={timeLeft.hours} label="hrs"  />
        <Tile value={timeLeft.mins}  label="min"  />
        <Tile value={timeLeft.secs}  label="sec"  />
      </div>
    </div>
  );
}
