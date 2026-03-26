import {
  AnimatedEyebrow,
  AnimatedHeadline,
  AnimatedParagraph,
} from "@/components/animated-text";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlightWords?: string[];
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  highlightWords = [],
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <AnimatedEyebrow>{eyebrow}</AnimatedEyebrow>
      <AnimatedHeadline
        as="h2"
        className="display-title text-3xl text-balance sm:text-4xl lg:text-5xl"
        highlightWords={highlightWords}
        text={title}
      />
      <AnimatedParagraph
        className="text-base leading-8 text-white/72 sm:text-lg"
        delay={0.12}
        text={description}
      />
    </div>
  );
}
