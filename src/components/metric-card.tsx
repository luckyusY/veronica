import {
  AnimatedEyebrow,
  AnimatedParagraph,
  RevealBlock,
} from "@/components/animated-text";

type MetricCardProps = {
  value: string;
  label: string;
  caption: string;
  index: string;
};

export function MetricCard({
  value,
  label,
  caption,
  index,
}: MetricCardProps) {
  return (
    <article className="metric-card">
      <RevealBlock className="flex items-start justify-between gap-4">
        <div>
          <AnimatedEyebrow className="text-[0.64rem]" delay={0.02}>
            Audience Signal
          </AnimatedEyebrow>
          <div className="metric-badge mt-4">Live Metric</div>
          <AnimatedParagraph
            className="mt-4 text-sm leading-7 text-white/68"
            delay={0.1}
            text={caption}
          />
        </div>
        <span className="metric-index">{index}</span>
      </RevealBlock>

      <RevealBlock className="mt-8" delay={0.14}>
        <p className="display-title text-5xl text-[var(--gold-soft)] sm:text-6xl">
          {value}
        </p>
        <p className="mt-3 max-w-xs text-sm leading-7 text-white/78">{label}</p>
      </RevealBlock>
    </article>
  );
}
