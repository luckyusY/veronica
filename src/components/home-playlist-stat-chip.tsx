"use client";

import { useEffect, useMemo, useState } from "react";
import NumberFlow from "@number-flow/react";

type HomePlaylistStatChipProps = {
  value: string;
};

function parseNumericStat(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)([A-Za-z+%]*)(.*)$/);

  if (!match) {
    return null;
  }

  return {
    amount: Number(match[1]),
    suffix: `${match[2]}${match[3]}`.trim(),
  };
}

export function HomePlaylistStatChip({ value }: HomePlaylistStatChipProps) {
  const parsed = useMemo(() => parseNumericStat(value), [value]);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!parsed) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setDisplayValue(parsed.amount);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [parsed]);

  if (!parsed) {
    return <span className="home-playlist-stat-text">{value}</span>;
  }

  return (
    <span className="home-playlist-stat-flow">
      <NumberFlow
        format={{ maximumFractionDigits: parsed.amount % 1 === 0 ? 0 : 1 }}
        transformTiming={{ duration: 850, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        value={displayValue}
        willChange
      />
      {parsed.suffix ? <span className="home-playlist-stat-suffix">{parsed.suffix}</span> : null}
    </span>
  );
}
