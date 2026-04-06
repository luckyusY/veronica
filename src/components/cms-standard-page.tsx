import Image from "next/image";
import Link from "next/link";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { PageHero } from "@/components/page-hero";
import type { CmsTextCard, StandardPageContent, StandardSection } from "@/lib/cms-types";

type CmsStandardPageProps = {
  content: StandardPageContent;
};

type CmsCardVariant = "note" | "route" | "release" | "dark-note" | undefined;

type PageSignal = {
  label: string;
  value: string;
  detail: string;
};

function buildPageSignals(sections: StandardSection[]): PageSignal[] {
  return sections.slice(0, 3).map((section) => {
    if (section.type === "cards") {
      return {
        label: section.eyebrow,
        value: `${section.items.length} modules`,
        detail: section.title,
      };
    }

    if (section.type === "timeline") {
      return {
        label: section.eyebrow,
        value: `${section.items.length} chapters`,
        detail: section.title,
      };
    }

    if (section.type === "banner") {
      return {
        label: section.eyebrow,
        value: "Full-bleed scene",
        detail: section.title,
      };
    }

    if (section.type === "gallery") {
      return {
        label: section.eyebrow,
        value: `${section.items.length} images`,
        detail: section.title,
      };
    }

    return {
      label: section.eyebrow,
      value: section.imageSide === "left" ? "Image-led split" : "Editorial split",
      detail: section.title,
    };
  });
}

function SectionTopline({
  eyebrow,
  index,
  inverse = false,
}: {
  eyebrow: string;
  index: number;
  inverse?: boolean;
}) {
  return (
    <div
      className={`page-standard-section-topline ${
        inverse ? "page-standard-section-topline--inverse" : ""
      }`.trim()}
    >
      <span className="page-standard-sequence">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="section-label">{eyebrow}</span>
    </div>
  );
}

function SectionLead({
  eyebrow,
  title,
  description,
  index,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  index: number;
  inverse?: boolean;
}) {
  return (
    <RevealBlock className="page-standard-lead" variant="up" distance={22}>
      <SectionTopline eyebrow={eyebrow} index={index} inverse={inverse} />
      <div className="editorial-section-opener-row">
        <h2
          className={`display-title editorial-section-opener-title ${
            inverse ? "page-standard-lead-title--inverse" : ""
          }`.trim()}
        >
          {title}
        </h2>
        <span aria-hidden="true" className="editorial-section-opener-rule" />
      </div>
      {description ? (
        <p
          className={`page-standard-lead-copy ${
            inverse ? "page-standard-lead-copy--inverse" : ""
          }`.trim()}
        >
          {description}
        </p>
      ) : null}
    </RevealBlock>
  );
}

function renderCard(item: CmsTextCard, variant: CmsCardVariant, theme: "paper" | "dark") {
  const key = `${item.title}-${item.description}`;

  if (variant === "release") {
    return (
      <article className="editorial-release-card" key={key}>
        <div>
          {item.accent ? <p className="section-label">{item.accent}</p> : null}
          <h3 className="display-title mt-3 text-3xl text-white sm:text-4xl">{item.title}</h3>
        </div>
        <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base">
          {item.description}
        </p>
      </article>
    );
  }

  if (variant === "dark-note") {
    return (
      <article className="editorial-dark-note" key={key}>
        {item.title ? <p className="section-label text-white/82">{item.title}</p> : null}
        <p className={`${item.title ? "mt-3 " : ""}text-sm leading-7 text-white/70 sm:text-base`}>
          {item.description}
        </p>
      </article>
    );
  }

  if (variant === "route") {
    const cardContent = (
      <>
        {item.accent ? <p className="section-label">{item.accent}</p> : null}
        <h3 className="display-title mt-4 text-3xl text-[#1f1914] sm:text-4xl">{item.title}</h3>
        <p className="mt-4 text-sm leading-7 text-[#4b4138] sm:text-base">{item.description}</p>
      </>
    );

    return item.href ? (
      <Link className="editorial-route-card" href={item.href} key={key}>
        {cardContent}
      </Link>
    ) : (
      <article className="editorial-route-card" key={key}>
        {cardContent}
      </article>
    );
  }

  return (
    <article className={theme === "dark" ? "editorial-dark-note" : "editorial-note"} key={key}>
      {item.title ? <p className="section-label">{item.title}</p> : null}
      <p
        className={`${
          item.title ? "mt-4 " : ""
        }text-sm leading-7 ${theme === "dark" ? "text-white/70" : "text-[#4b4138]"} sm:text-base`}
      >
        {item.description}
      </p>
    </article>
  );
}

function renderSection(section: StandardSection, index: number) {
  if (section.type === "banner") {
    return (
      <section className="section-shell py-10" key={section.id}>
        <RevealBlock className="page-standard-banner" variant="scale">
          <EditorialImage
            className="page-standard-banner-media"
            image={section.image}
            motionPreset={section.imageMotionPreset ?? "settle-left"}
            sizes="100vw"
            strength={84}
          />
          <div className="page-standard-banner-copy">
            <SectionTopline eyebrow={section.eyebrow} index={index} inverse />
            <h2 className="display-title mt-5 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl">
              {section.title}
            </h2>
            {section.description ? (
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/74">
                {section.description}
              </p>
            ) : null}
            <span className="page-standard-banner-rule" aria-hidden="true" />
          </div>
        </RevealBlock>
      </section>
    );
  }

  if (section.type === "timeline") {
    return (
      <section className="section-shell py-10" key={section.id}>
        <div className="page-standard-timeline-shell">
          <RevealBlock
            className={section.theme === "dark" ? "editorial-dark-panel" : "editorial-paper-panel"}
            variant="left"
          >
            <SectionTopline eyebrow={section.eyebrow} index={index} inverse={section.theme === "dark"} />
            <h2
              className={`display-title mt-5 max-w-3xl text-4xl sm:text-5xl ${
                section.theme === "dark" ? "text-white" : "text-[#1f1914]"
              }`}
            >
              {section.title}
            </h2>
            {section.description ? (
              <p
                className={`mt-6 max-w-2xl text-base leading-8 ${
                  section.theme === "dark" ? "text-white/74" : "text-[#3a332d]"
                }`}
              >
                {section.description}
              </p>
            ) : null}
          </RevealBlock>

          <RevealBlock className="editorial-timeline-panel page-standard-timeline-stage" delay={0.08} variant="right">
            <p className="section-label">Narrative timeline</p>
            <div className="mt-6 grid gap-4">
              {section.items.map((item, itemIndex) => (
                <article className="editorial-timeline-item" key={item}>
                  <p className="editorial-timeline-index">
                    {(itemIndex + 1).toString().padStart(2, "0")}
                  </p>
                  <p className="text-sm leading-7 text-[#3e362e] sm:text-base">{item}</p>
                </article>
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>
    );
  }

  if (section.type === "cards") {
    const columns = section.columns ?? 3;
    const gridClass =
      columns === 2 ? "page-standard-card-grid page-standard-card-grid--two" : "page-standard-card-grid";

    return (
      <section className="section-shell py-10" key={section.id}>
        <SectionLead
          description={section.description}
          eyebrow={section.eyebrow}
          index={index}
          inverse={section.theme === "dark"}
          title={section.title}
        />

        <RevealBlock
          className={`page-standard-card-stage page-standard-card-stage--${section.theme}`.trim()}
          delay={0.08}
          variant={index % 2 === 0 ? "left" : "right"}
        >
          <div className={gridClass}>
            {section.items.map((item) => renderCard(item, section.cardVariant, section.theme))}
          </div>
        </RevealBlock>
      </section>
    );
  }

  if (section.type === "gallery") {
    const cols = section.columns ?? 3;
    return (
      <section
        className={`cms-gallery-section ${section.theme === "dark" ? "cms-gallery-section--dark" : ""}`}
        key={section.id}
      >
        <div className="section-shell py-10">
          <SectionLead
            description={section.description}
            eyebrow={section.eyebrow}
            index={index}
            inverse={section.theme === "dark"}
            title={section.title}
          />
          <RevealBlock className="cms-masonry-gallery" delay={0.1} variant="up">
            <div className="cms-masonry-grid" style={{ columnCount: cols }}>
              {section.items.map((item, i) => (
                <div className="cms-masonry-item" key={i}>
                  <Image
                    alt={item.alt}
                    className="cms-masonry-img"
                    height={600}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    src={item.url}
                    unoptimized
                    width={400}
                  />
                  {item.label ? (
                    <p className="cms-masonry-caption">{item.label}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>
    );
  }

  const copyPanelClass = section.theme === "dark" ? "editorial-dark-panel" : "editorial-paper-panel";
  const textPanel = (
    <RevealBlock
      className={`${copyPanelClass} page-standard-copy-panel`.trim()}
      delay={section.imageSide === "left" ? 0.08 : 0}
      variant={section.imageSide === "left" ? "right" : "left"}
    >
      <SectionTopline eyebrow={section.eyebrow} index={index} inverse={section.theme === "dark"} />
      <h2
        className={`display-title mt-5 max-w-4xl text-4xl sm:text-5xl ${
          section.theme === "dark" ? "text-white" : "text-[#1f1914]"
        }`}
      >
        {section.title}
      </h2>
      <p
        className={`mt-6 max-w-3xl text-base leading-8 ${
          section.theme === "dark" ? "text-white/72" : "text-[#3a332d]"
        }`}
      >
        {section.description}
      </p>

      {section.body?.length ? (
        <div
          className={`mt-6 grid gap-4 ${
            section.theme === "dark" ? "text-white/68" : "text-[#3a332d]"
          }`}
        >
          {section.body.map((paragraph) => (
            <p className="max-w-3xl text-base leading-8" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {section.cards?.length ? (
        <div
          className={`mt-8 grid gap-4 ${
            section.cardVariant === "release"
              ? "page-standard-release-grid"
              : section.cards.length === 2
                ? "md:grid-cols-2"
                : "lg:grid-cols-3"
          }`}
        >
          {section.cards.map((item) => renderCard(item, section.cardVariant, section.theme))}
        </div>
      ) : null}
    </RevealBlock>
  );

  const imagePanel = (
    <RevealBlock
      className={`editorial-photo-block page-standard-photo-block image-hover-glow${
        section.tallImage ? " editorial-photo-block--tall" : ""
      }`}
      delay={section.imageSide === "left" ? 0 : 0.08}
      variant={section.imageSide === "left" ? "left" : "right"}
    >
      <EditorialImage
        className="editorial-photo-shell"
        image={section.image}
        motionPreset={
          section.imageMotionPreset ??
          (section.imageSide === "left" ? "from-left" : "from-right")
        }
        sizes="(max-width: 1024px) 100vw, 42vw"
        strength={72}
      />
      <div className="page-standard-photo-caption">
        <span className="section-label">{section.image.label ?? section.eyebrow}</span>
      </div>
    </RevealBlock>
  );

  return (
    <section className="section-shell py-10" key={section.id}>
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        {section.imageSide === "left" ? imagePanel : textPanel}
        {section.imageSide === "left" ? textPanel : imagePanel}
      </div>
    </section>
  );
}

export function CmsStandardPage({ content }: CmsStandardPageProps) {
  const pageSignals = buildPageSignals(content.sections);

  return (
    <main className="editorial-home editorial-standard-page pb-16 sm:pb-20">
      <PageHero {...content.hero} />

      {pageSignals.length ? (
        <section className="section-shell relative z-10 pt-2 pb-6 sm:-mt-14 sm:pt-0 sm:pb-8">
          <div className="page-signal-band">
            {pageSignals.map((item, index) => (
              <RevealBlock
                className="page-signal-card"
                delay={0.05 + index * 0.06}
                distance={20}
                key={`${item.label}-${item.value}`}
                variant={index === 1 ? "up" : index === 0 ? "left" : "right"}
              >
                <p className="page-signal-label">{item.label}</p>
                <p className="page-signal-value">{item.value}</p>
                <p className="page-signal-detail">{item.detail}</p>
              </RevealBlock>
            ))}
          </div>
        </section>
      ) : null}

      {content.sections.map((section, index) => renderSection(section, index))}
    </main>
  );
}
