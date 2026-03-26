import {
  AnimatedHeadline,
  AnimatedParagraph,
  RevealBlock,
} from "@/components/animated-text";

type CardTone = "gold" | "accent" | "bronze";
type CardSize = "default" | "feature";

const toneClassMap: Record<CardTone, string> = {
  gold: "tone-gold",
  accent: "tone-accent",
  bronze: "tone-bronze",
};

const toneLabelMap: Record<CardTone, string> = {
  gold: "Signature",
  accent: "Spotlight",
  bronze: "Legacy",
};

type CinematicCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  meta?: string[];
  rank?: string;
  tone?: CardTone;
  size?: CardSize;
  className?: string;
  highlightWords?: string[];
};

export function CinematicCard({
  eyebrow,
  title,
  description,
  badge,
  meta = [],
  rank,
  tone = "gold",
  size = "default",
  className = "",
  highlightWords = [],
}: CinematicCardProps) {
  return (
    <article
      className={`cinema-card ${toneClassMap[tone]} ${
        size === "feature" ? "cinema-card--feature" : ""
      } ${className}`.trim()}
    >
      <div aria-hidden="true" className="card-grid" />
      {rank ? (
        <span aria-hidden="true" className="card-rank">
          {rank}
        </span>
      ) : null}

      <div className="relative flex h-full flex-col justify-between gap-10">
        <RevealBlock className="flex items-start justify-between gap-3">
          <span className="card-kicker">{eyebrow}</span>
          <div className="flex items-center gap-2">
            <span className="card-corner-tag">{toneLabelMap[tone]}</span>
            {badge ? <span className="meta-chip meta-chip--accent">{badge}</span> : null}
          </div>
        </RevealBlock>

        <div className="space-y-4">
          <AnimatedHeadline
            as="h3"
            className={`display-title max-w-2xl ${
              size === "feature" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
            }`}
            delay={0.06}
            highlightWords={highlightWords}
            text={title}
          />
          <AnimatedParagraph
            className="max-w-xl text-sm leading-7 text-white/72 sm:text-base"
            delay={0.14}
            text={description}
          />

          {meta.length ? (
            <RevealBlock className="flex flex-wrap gap-2" delay={0.2}>
              {meta.map((item) => (
                <span className="meta-chip" key={item}>
                  {item}
                </span>
              ))}
            </RevealBlock>
          ) : null}

          <RevealBlock className="card-footer" delay={0.24}>
            <span className="card-footer-label">{toneLabelMap[tone]} frame</span>
            <span className="card-footer-arrow">Open Detail</span>
          </RevealBlock>
        </div>
      </div>
    </article>
  );
}
