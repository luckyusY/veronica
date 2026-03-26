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
      <div className="pointer-events-none absolute inset-x-8 top-0 -z-10 h-72 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(212,175,106,0.22),_rgba(217,79,43,0.12),_transparent_68%)] blur-2xl" />
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
        <RevealBlock
          className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5 text-sm text-white/65"
          delay={0.24}
        >
          <p className="font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Build Direction
          </p>
          <p className="mt-4 leading-7">
            The site is being shaped as a cinematic artist platform with strong
            storytelling, merch, ticketing, and media-ready sections for a
            Vercel deployment workflow.
          </p>
        </RevealBlock>
      </div>
    </section>
  );
}
