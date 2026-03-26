import Link from "next/link";
import {
  AnimatedEyebrow,
  AnimatedHeadline,
  AnimatedParagraph,
  RevealBlock,
} from "@/components/animated-text";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlightWords?: string[];
  primaryCta?: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
};

export function PageHero({
  eyebrow,
  title,
  description,
  highlightWords = [],
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="section-shell relative overflow-hidden py-14 sm:py-16 lg:py-20">
      <div className="panel grid gap-8 rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1.3fr)_18rem] lg:items-end">
        <div className="space-y-5">
          <AnimatedEyebrow>{eyebrow}</AnimatedEyebrow>
          <AnimatedHeadline
            as="h1"
            className="display-title max-w-4xl text-4xl text-balance sm:text-5xl lg:text-6xl"
            highlightWords={highlightWords}
            text={title}
          />
          <AnimatedParagraph
            className="max-w-3xl text-base leading-8 text-white/72 sm:text-lg"
            delay={0.12}
            text={description}
          />
          {(primaryCta || secondaryCta) && (
            <RevealBlock className="flex flex-wrap gap-3 pt-2" delay={0.2}>
              {primaryCta ? (
                <Link className="primary-button" href={primaryCta.href}>
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link className="secondary-button" href={secondaryCta.href}>
                  {secondaryCta.label}
                </Link>
              ) : null}
            </RevealBlock>
          )}
        </div>
        <RevealBlock className="solid-note-card text-sm text-white/65" delay={0.24}>
          <p className="font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Brand Standard
          </p>
          <p className="mt-4 leading-7">
            A high-contrast luxury system built to hold story, live
            performance, commerce, partnerships, and press within one polished
            artist platform.
          </p>
        </RevealBlock>
      </div>
    </section>
  );
}
