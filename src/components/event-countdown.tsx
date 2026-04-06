"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

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

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Single animated digit slot — flips when the value changes
function FlipDigit({ value }: { value: string }) {
  return (
    <span className="events-flip-slot">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          animate={{ y: 0, opacity: 1 }}
          className="events-countdown-value"
          exit={{ y: -28, opacity: 0 }}
          initial={{ y: 28, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CountdownUnit({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="events-countdown-unit">
      <FlipDigit value={value} />
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
    return (
      <motion.p
        animate={{ opacity: 1 }}
        className="events-countdown-past"
        initial={{ opacity: 0 }}
      >
        This event has passed
      </motion.p>
    );
  }

  return (
    <div className="events-countdown">
      <CountdownUnit label="days" value={String(timeLeft.days)} />
      <span aria-hidden="true" className="events-countdown-sep">:</span>
      <CountdownUnit label="hrs"  value={pad(timeLeft.hours)} />
      <span aria-hidden="true" className="events-countdown-sep">:</span>
      <CountdownUnit label="min"  value={pad(timeLeft.mins)} />
      <span aria-hidden="true" className="events-countdown-sep">:</span>
      <CountdownUnit label="sec"  value={pad(timeLeft.secs)} />
    </div>
  );
}
