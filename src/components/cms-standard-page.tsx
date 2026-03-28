import Link from "next/link";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { PageHero } from "@/components/page-hero";
import type { CmsTextCard, StandardPageContent, StandardSection } from "@/lib/cms-types";

type CmsStandardPageProps = {
  content: StandardPageContent;
};

type CmsCardVariant = "note" | "route" | "release" | "dark-note" | undefined;

function renderCard(item: CmsTextCard, variant: CmsCardVariant, theme: "paper" | "dark") {
  const key = `${item.title}-${item.description}`;

  if (variant === "release") {
    return (
      <article className="editorial-release-row" key={key}>
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
        {item.title ? (
          <p className="section-label text-white/82">{item.title}</p>
        ) : null}
        <p className={`${item.title ? "mt-3 " : ""}text-sm leading-7 text-white/70 sm:text-base`}>
          {item.description}
        </p>
      </article>
    );
  }

  if (variant === "route") {
    const content = (
      <>
        {item.accent ? <p className="section-label">{item.accent}</p> : null}
        <h3 className="display-title mt-4 text-3xl text-[#1f1914] sm:text-4xl">{item.title}</h3>
        <p className="mt-4 text-sm leading-7 text-[#4b4138] sm:text-base">
          {item.description}
        </p>
      </>
    );

    return item.href ? (
      <Link className="editorial-route-card" href={item.href} key={key}>
        {content}
      </Link>
    ) : (
      <article className="editorial-route-card" key={key}>
        {content}
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
        <RevealBlock className="editorial-quote-banner" variant="scale">
          <EditorialImage
            className="editorial-quote-media"
            image={section.image}
            motionPreset={section.imageMotionPreset ?? "settle-left"}
            sizes="100vw"
            strength={78}
          />
          <div className="editorial-quote-copy">
            <p className={`section-label ${section.theme === "dark" ? "text-white/80" : ""}`}>
              {section.eyebrow}
            </p>
            <h2 className="display-title mt-4 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl">
              {section.title}
            </h2>
            {section.description ? (
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
                {section.description}
              </p>
            ) : null}
          </div>
        </RevealBlock>
      </section>
    );
  }

  if (section.type === "timeline") {
    return (
      <section className="section-shell py-10" key={section.id}>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <RevealBlock
            className={section.theme === "dark" ? "editorial-dark-panel" : "editorial-paper-panel"}
            variant="left"
          >
            <p className="section-label">{section.eyebrow}</p>
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

          <RevealBlock className="editorial-timeline-panel" delay={0.08} variant="right">
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
    const panelClass = section.theme === "dark" ? "editorial-dark-panel" : "editorial-paper-panel";
    const columns = section.columns ?? 3;
    const gridClass =
      columns === 2 ? "mt-8 grid gap-4 lg:grid-cols-2" : "mt-8 grid gap-4 lg:grid-cols-3";

    return (
      <section className="section-shell py-10" key={section.id}>
        <RevealBlock className={panelClass} variant={index % 2 === 0 ? "left" : "right"}>
          <p className="section-label">{section.eyebrow}</p>
          <h2
            className={`display-title mt-5 max-w-4xl text-4xl sm:text-5xl ${
              section.theme === "dark" ? "text-white" : "text-[#1f1914]"
            }`}
          >
            {section.title}
          </h2>
          {section.description ? (
            <p
              className={`mt-6 max-w-3xl text-base leading-8 ${
                section.theme === "dark" ? "text-white/72" : "text-[#3a332d]"
              }`}
            >
              {section.description}
            </p>
          ) : null}
          <div className={gridClass}>
            {section.items.map((item) => renderCard(item, section.cardVariant, section.theme))}
          </div>
        </RevealBlock>
      </section>
    );
  }

  const copyPanelClass = section.theme === "dark" ? "editorial-dark-panel" : "editorial-paper-panel";
  const textPanel = (
    <RevealBlock
      className={copyPanelClass}
      delay={section.imageSide === "left" ? 0.08 : 0}
      variant={section.imageSide === "left" ? "right" : "left"}
    >
      <p className="section-label">{section.eyebrow}</p>
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
        <div className={`mt-8 grid gap-4 ${section.cards.length === 2 ? "md:grid-cols-2" : "lg:grid-cols-3"}`}>
          {section.cards.map((item) => renderCard(item, section.cardVariant, section.theme))}
        </div>
      ) : null}
    </RevealBlock>
  );

  const imagePanel = (
    <RevealBlock
      className={`editorial-photo-block${section.tallImage ? " editorial-photo-block--tall" : ""}`}
      delay={section.imageSide === "left" ? 0 : 0.08}
      variant={section.imageSide === "left" ? "left" : "right"}
    >
      <EditorialImage
        className="editorial-photo-shell"
        image={section.image}
        motionPreset={section.imageMotionPreset ?? (section.imageSide === "left" ? "from-left" : "from-right")}
        sizes="(max-width: 1024px) 100vw, 42vw"
        strength={68}
      />
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
  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <PageHero {...content.hero} />
      {content.sections.map((section, index) => renderSection(section, index))}
    </main>
  );
}
