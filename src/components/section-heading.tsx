type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="section-label">{eyebrow}</p>
      <h2 className="display-title text-3xl text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-8 text-white/72 sm:text-lg">{description}</p>
    </div>
  );
}
