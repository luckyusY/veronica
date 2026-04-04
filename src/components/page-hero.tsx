import Link from "next/link";
import type { StaticImageData } from "next/image";
import {
  AnimatedEyebrow,
  AnimatedHeadline,
  AnimatedParagraph,
  RevealBlock,
} from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";

type PageHeroImage = {
  src?: string | StaticImageData;
  url?: string;
  alt: string;
  position?: string;
};

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
  image: PageHeroImage;
  imageMotionPreset?:
    | "vertical"
    | "from-left"
    | "from-right"
    | "settle-left"
    | "settle-right";
  imageLabel?: string;
  noteTitle?: string;
  noteText?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  highlightWords = [],
  primaryCta,
  secondaryCta,
  image,
  imageMotionPreset = "settle-right",
  imageLabel = "Official Veronica Adane photography",
  noteTitle,
  noteText,
}: PageHeroProps) {
  return (
    <section className="section-shell page-hero-section py-6 sm:py-8">
      <div className="editorial-page-hero">
        <div className="editorial-page-copy">
          <AnimatedEyebrow>{eyebrow}</AnimatedEyebrow>
          <AnimatedHeadline
            as="h1"
            className="display-title mt-5 max-w-4xl text-5xl text-balance text-white sm:text-6xl xl:text-7xl"
            highlightWords={highlightWords}
            text={title}
          />
          <AnimatedParagraph
            className="mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg"
            delay={0.12}
            text={description}
          />

          <RevealBlock className="page-hero-metadata-row" delay={0.16} variant="up">
            <span className="page-hero-metadata-chip">{imageLabel}</span>
          </RevealBlock>

          {(primaryCta || secondaryCta) && (
            <RevealBlock className="mt-7 flex flex-wrap gap-3" delay={0.18}>
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

          {noteTitle && noteText ? (
            <RevealBlock className="editorial-page-note page-hero-guidance-card" delay={0.22} variant="left">
              <p className="section-label">{noteTitle}</p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/68 sm:text-base">
                {noteText}
              </p>
            </RevealBlock>
          ) : null}
        </div>

        <RevealBlock className="editorial-page-visual" delay={0.1} variant="right">
          <EditorialImage
            className="editorial-page-media"
            image={image}
            motionPreset={imageMotionPreset}
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            strength={72}
          />
          <div className="editorial-media-caption">
            <span className="section-label">{imageLabel}</span>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
