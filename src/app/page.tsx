import Link from "next/link";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { HomeHeroSwiper } from "@/components/home-hero-swiper";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { getHomePageContent, homeResearchSignals } from "@/lib/artist-page-content";
import { getCmsPage } from "@/lib/cms-store";
import type { HomePageContent } from "@/lib/cms-types";

export const revalidate = 60;

type HomePageImage = HomePageContent["intro"]["image"];
type RevealVariant = "left" | "right" | "up" | "scale";

type HomeImageCardProps = {
  image: HomePageImage;
  eyebrow: string;
  title: string;
  note: string;
  sizes: string;
  className?: string;
  frameClassName?: string;
  priority?: boolean;
  delay?: number;
  distance?: number;
  variant?: RevealVariant;
};

function HomeImageCard({
  image,
  eyebrow,
  title,
  note,
  sizes,
  className = "",
  frameClassName = "",
  priority = false,
  delay,
  distance = 32,
  variant = "up",
}: HomeImageCardProps) {
  return (
    <RevealBlock
      className={`home-full-image-card ${className}`.trim()}
      delay={delay}
      distance={distance}
      variant={variant}
    >
      <div className={`home-full-image-frame ${frameClassName}`.trim()}>
        <EditorialImage
          className="home-full-image-shell"
          fit="contain"
          image={image}
          overlayClassName="bg-transparent"
          priority={priority}
          shimmer={false}
          sizes={sizes}
          strength={72}
        />
      </div>

      <div className="home-full-image-meta">
        <p className="section-label">{eyebrow}</p>
        <h3 className="display-title home-full-image-title">{title}</h3>
        <p className="home-full-image-note">{note}</p>
      </div>
    </RevealBlock>
  );
}

export default async function Home() {
  const page = await getCmsPage("home");
  const content = getHomePageContent(page.content as HomePageContent);
  const visualChaptersSet = content.visualChapters.items;
  const visualFeature = visualChaptersSet[0];
  const visualSupport = visualChaptersSet.slice(1);
  const risePrimaryImage = content.rise.images[0] ?? content.heritage.image;
  const riseSecondaryImage = content.rise.images[1] ?? risePrimaryImage;
  const campaignSupportPrimary =
    content.campaign.supportingImages[0] ?? content.campaign.featureImage;
  const campaignSupportSecondary =
    content.campaign.supportingImages[1] ?? campaignSupportPrimary;
  const hasTestimonials = content.testimonials.items.length > 0;

  return (
    <main className="editorial-home home-redesign pb-16 sm:pb-20">
      <HomeHeroSwiper
        headlineLines={content.hero.headlineLines}
        headlineTop={content.hero.headlineTop}
        primaryAction={content.hero.primaryAction}
        secondaryAction={content.hero.secondaryAction}
        slides={content.hero.slides}
        verticalLabel={content.hero.verticalLabel}
      />

      <section className="section-shell relative z-10 pb-6 sm:pb-8 lg:-mt-2">
        <div className="home-signal-band">
          {homeResearchSignals.map((item, index) => (
            <RevealBlock
              className="home-signal-card"
              delay={0.06 + index * 0.06}
              distance={20}
              key={`${item.label}-${item.title}`}
              variant={index === 1 ? "up" : index === 0 ? "left" : "right"}
            >
              <p className="home-signal-label">{item.label}</p>
              <h2 className="home-signal-title">{item.title}</h2>
              <p className="home-signal-detail">{item.detail}</p>
            </RevealBlock>
          ))}
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="home-stage-grid">
          <RevealBlock className="editorial-paper-panel home-stage-copy" distance={40} variant="left">
            <div>
              <p className="section-label">{content.intro.eyebrow}</p>
              <h2 className="display-title mt-5 max-w-4xl text-4xl text-[#1f1914] sm:text-5xl">
                {content.intro.title}
              </h2>
            </div>

            <div className="home-stage-copy-body">
              {content.intro.paragraphs.map((paragraph) => (
                <p className="max-w-3xl text-base leading-8 text-[#3a332d]" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="home-stage-stats">
              {content.intro.stats.map((item) => (
                <article className="editorial-stat home-stage-stat" key={item.label}>
                  <p className="display-title text-4xl text-[#18120d] sm:text-5xl">{item.value}</p>
                  <p className="editorial-stat-label mt-3 text-sm font-semibold uppercase text-[#6d5738]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#4b4138]">{item.detail}</p>
                </article>
              ))}
            </div>
          </RevealBlock>

          <HomeImageCard
            className="home-full-image-card--feature"
            eyebrow="Official image"
            frameClassName="home-full-image-frame--portrait"
            image={content.intro.image}
            note={content.intro.paragraphs[0]}
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            title={content.intro.image.label ?? "Full-frame portrait"}
            variant="right"
          />
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="home-visual-stage">
          <RevealBlock className="home-section-lead" distance={28} variant="up">
            <p className="section-label">{content.visualChapters.eyebrow}</p>
            <div className="editorial-section-opener-row">
              <h2 className="display-title editorial-section-opener-title">
                {content.visualChapters.title}
              </h2>
              <span aria-hidden="true" className="editorial-section-opener-rule" />
            </div>
            <p className="home-section-copy">{content.visualChapters.description}</p>
            <div className="visual-chapters-chip-list">
              {content.visualChapters.chips.map((item) => (
                <span className="visual-chapters-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </RevealBlock>

          {visualFeature ? (
            <div className="home-visual-grid">
              <HomeImageCard
                className="home-visual-card home-visual-card--feature"
                eyebrow={visualFeature.era}
                frameClassName="home-full-image-frame--tall"
                image={visualFeature.image}
                note={visualFeature.note}
                sizes="(max-width: 1024px) 100vw, 44vw"
                title={visualFeature.title}
                variant="left"
              />

              {visualSupport.map((item, index) => (
                <HomeImageCard
                  className="home-visual-card"
                  delay={0.08 + index * 0.08}
                  eyebrow={item.era}
                  frameClassName="home-full-image-frame--landscape"
                  image={item.image}
                  key={item.title}
                  note={item.note}
                  sizes="(max-width: 1024px) 100vw, 28vw"
                  title={item.title}
                  variant={index % 2 === 0 ? "up" : "right"}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="home-dossier-grid">
          <RevealBlock className="editorial-dark-panel home-dossier-panel" distance={34} variant="left">
            <div>
              <p className="section-label">{content.heritage.eyebrow}</p>
              <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
                {content.heritage.title}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/72">
              {content.heritage.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {content.heritage.tags.map((item) => (
                <span className="meta-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </RevealBlock>

          <HomeImageCard
            className="home-full-image-card--wide"
            eyebrow={content.heritage.eyebrow}
            frameClassName="home-full-image-frame--wide"
            image={content.heritage.image}
            note={content.heritage.description}
            sizes="(max-width: 1024px) 100vw, 48vw"
            title={content.heritage.image.label ?? "Live-stage portrait"}
            variant="right"
          />

          <RevealBlock className="editorial-paper-panel home-dossier-panel" delay={0.08} distance={32} variant="left">
            <div>
              <p className="section-label">{content.rise.eyebrow}</p>
              <h2 className="display-title mt-5 max-w-3xl text-4xl text-[#1f1914] sm:text-5xl">
                {content.rise.title}
              </h2>
            </div>

            <p className="max-w-2xl text-base leading-8 text-[#3a332d]">
              {content.rise.description}
            </p>

            <div className="home-dossier-notes">
              <div className="editorial-note">
                <p className="section-label">Within Ethiopia</p>
                <p className="mt-3 text-sm leading-7 text-[#4b4138]">{content.rise.nationalNote}</p>
              </div>
              <div className="editorial-note">
                <p className="section-label">Beyond Ethiopia</p>
                <p className="mt-3 text-sm leading-7 text-[#4b4138]">
                  {content.rise.internationalNote}
                </p>
              </div>
            </div>
          </RevealBlock>

          <div className="home-image-pair-grid">
            <HomeImageCard
              className="home-full-image-card--compact"
              delay={0.12}
              eyebrow="Tour frame"
              frameClassName="home-full-image-frame--compact"
              image={risePrimaryImage}
              note={content.rise.nationalNote}
              sizes="(max-width: 1024px) 100vw, 24vw"
              title={risePrimaryImage.label ?? "Stage direction"}
              variant="up"
            />
            <HomeImageCard
              className="home-full-image-card--compact"
              delay={0.18}
              eyebrow="Audience frame"
              frameClassName="home-full-image-frame--compact"
              image={riseSecondaryImage}
              note={content.rise.internationalNote}
              sizes="(max-width: 1024px) 100vw, 24vw"
              title={riseSecondaryImage.label ?? "Crowd energy"}
              variant="up"
            />
          </div>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="home-campaign-grid">
          <HomeImageCard
            className="home-full-image-card--campaign"
            eyebrow={content.campaign.eyebrow}
            frameClassName="home-full-image-frame--campaign"
            image={content.campaign.featureImage}
            note={content.campaign.description}
            sizes="(max-width: 1024px) 100vw, 46vw"
            title={content.campaign.featureImage.label ?? "Campaign feature"}
            variant="left"
          />

          <RevealBlock className="editorial-paper-panel home-campaign-panel" delay={0.08} distance={34} variant="right">
            <div>
              <p className="section-label">{content.campaign.eyebrow}</p>
              <h2 className="display-title mt-5 max-w-3xl text-4xl text-[#1f1914] sm:text-5xl">
                {content.campaign.title}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#3a332d]">
                {content.campaign.description}
              </p>
            </div>

            <div className="home-supporting-rail">
              <HomeImageCard
                className="home-full-image-card--support"
                delay={0.12}
                eyebrow="Supporting image"
                frameClassName="home-full-image-frame--support"
                image={campaignSupportPrimary}
                note="Additional campaign imagery for platform headers, press kits, and release coverage."
                sizes="(max-width: 1024px) 100vw, 22vw"
                title={campaignSupportPrimary.label ?? "Campaign still 01"}
                variant="up"
              />
              <HomeImageCard
                className="home-full-image-card--support"
                delay={0.18}
                eyebrow="Supporting image"
                frameClassName="home-full-image-frame--support"
                image={campaignSupportSecondary}
                note="A secondary full-frame visual that keeps the portrait readable without cropping."
                sizes="(max-width: 1024px) 100vw, 22vw"
                title={campaignSupportSecondary.label ?? "Campaign still 02"}
                variant="up"
              />
            </div>
          </RevealBlock>
        </div>
      </section>

      {hasTestimonials ? (
        <TestimonialsCarousel
          description={content.testimonials.description}
          eyebrow={content.testimonials.eyebrow}
          items={content.testimonials.items}
          title={content.testimonials.title}
        />
      ) : null}

      <section className="section-shell py-10">
        <div className="home-route-stage">
          <RevealBlock className="editorial-dark-panel home-route-intro" distance={30} variant="left">
            <p className="section-label">{content.pathways.eyebrow}</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
              {content.pathways.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              {content.pathways.description}
            </p>
          </RevealBlock>

          <div className="home-route-grid">
            {content.pathways.items.map((item, index) => (
              <RevealBlock
                delay={0.08 + index * 0.08}
                distance={28}
                key={item.title}
                variant={index === 0 ? "left" : index === 1 ? "up" : "right"}
              >
                <Link className="editorial-route-link home-route-link" href={item.href ?? "#"}>
                  <span className="editorial-route-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="section-label">{item.accent}</p>
                  <h3 className="display-title mt-4 text-4xl text-white">{item.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-white/72">{item.description}</p>
                  <div className="editorial-route-footer">
                    <span>{item.note}</span>
                    <span>Open</span>
                  </div>
                </Link>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-10">
        <RevealBlock className="editorial-paper-panel home-archive-panel" distance={28} variant="up">
          <div className="home-archive-top">
            <div className="max-w-4xl">
              <p className="section-label">{content.archive.eyebrow}</p>
              <h2 className="display-title mt-5 text-4xl text-[#1f1914] sm:text-5xl">
                {content.archive.title}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#3a332d]">
                {content.archive.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="primary-button" href={content.archive.primaryAction.href}>
                {content.archive.primaryAction.label}
              </Link>
              <Link className="secondary-button" href={content.archive.secondaryAction.href}>
                {content.archive.secondaryAction.label}
              </Link>
            </div>
          </div>

          <div className="home-archive-credit-grid">
            {content.archive.credits.map((item) => (
              <article className="editorial-credit-link" key={item.label}>
                <span>{item.label}</span>
                <span className="text-[#7c6545]">{item.note}</span>
              </article>
            ))}
          </div>
        </RevealBlock>
      </section>
    </main>
  );
}
