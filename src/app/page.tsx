import Link from "next/link";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { HomeHeroSwiper } from "@/components/home-hero-swiper";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { getCmsPage } from "@/lib/cms-store";
import type { HomePageContent } from "@/lib/cms-types";

export default async function Home() {
  const page = await getCmsPage("home");
  const content = page.content as HomePageContent;
  const visualChaptersSet = content.visualChapters.items;

  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <HomeHeroSwiper
        headlineLines={content.hero.headlineLines}
        headlineTop={content.hero.headlineTop}
        primaryAction={content.hero.primaryAction}
        secondaryAction={content.hero.secondaryAction}
        slides={content.hero.slides}
        verticalLabel={content.hero.verticalLabel}
      />

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
          <RevealBlock
            className="editorial-photo-block editorial-photo-block--tall image-hover-glow"
            variant="left"
            distance={40}
          >
            <EditorialImage
              className="editorial-photo-shell"
              image={content.intro.image}
              motionPreset="from-left"
              sizes="(max-width: 1024px) 100vw, 40vw"
              strength={88}
              tilt
            />
          </RevealBlock>

          <RevealBlock className="editorial-paper-panel" delay={0.1} variant="right" distance={40}>
            <p className="section-label">{content.intro.eyebrow}</p>
            <h2 className="display-title mt-5 max-w-4xl text-4xl text-[#1f1914] sm:text-5xl">
              {content.intro.title}
            </h2>

            <div className="mt-6 grid gap-4 text-[#3a332d]">
              {content.intro.paragraphs.map((paragraph) => (
                <p className="max-w-3xl text-base leading-8" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {content.intro.stats.map((item) => (
                <article className="editorial-stat" key={item.label}>
                  <p className="display-title text-4xl text-[#18120d] sm:text-5xl">
                    {item.value}
                  </p>
                  <p className="editorial-stat-label mt-3 text-sm font-semibold uppercase text-[#6d5738]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#4b4138]">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="editorial-section-opener-shell">
        <RevealBlock className="editorial-section-opener" variant="up" distance={28}>
          <p className="section-label">{content.visualChapters.eyebrow}</p>
          <div className="editorial-section-opener-row">
            <h2 className="display-title editorial-section-opener-title">
              {content.visualChapters.title}
            </h2>
            <span aria-hidden="true" className="editorial-section-opener-rule" />
          </div>
          <p className="editorial-section-opener-copy">{content.visualChapters.description}</p>
          <div className="visual-chapters-chip-list">
            {content.visualChapters.chips.map((item) => (
              <span className="visual-chapters-chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell pb-10">
        <div className="editorial-asymmetric-gallery">
          <RevealBlock
            className="editorial-bleed-tile editorial-bleed-tile--portrait"
            variant="left"
            distance={34}
          >
            <EditorialImage
              className="editorial-bleed-image editorial-parallax-portrait"
              image={visualChaptersSet[0].image}
              motionPreset="settle-left"
              overlayClassName="bg-transparent"
              sizes="(max-width: 1024px) 100vw, 44vw"
              strength={132}
            />
            <div className="editorial-bleed-hover">
              <p className="editorial-bleed-caption">{visualChaptersSet[0].title}</p>
              <p className="editorial-bleed-era">{visualChaptersSet[0].era}</p>
            </div>
          </RevealBlock>

          {visualChaptersSet.slice(1).map((item, index) => (
            <RevealBlock
              className="editorial-bleed-tile editorial-bleed-tile--landscape"
              delay={0.08 + index * 0.08}
              distance={30}
              key={item.title}
              variant="right"
            >
              <EditorialImage
                className="editorial-bleed-image"
                image={item.image}
                motionPreset={index === 0 ? "from-right" : "diagonal"}
                overlayClassName="bg-transparent"
                sizes="(max-width: 1024px) 100vw, 34vw"
                strength={92}
              />
              <div className="editorial-bleed-hover">
                <p className="editorial-bleed-caption">{item.title}</p>
                <p className="editorial-bleed-era">{item.era}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      <TestimonialsCarousel
        description={content.testimonials.description}
        eyebrow={content.testimonials.eyebrow}
        items={content.testimonials.items}
        title={content.testimonials.title}
      />

      <section className="editorial-section-opener-shell editorial-section-opener-shell--compact">
        <RevealBlock className="editorial-section-opener" variant="up" distance={24}>
          <p className="section-label">Tour Studies</p>
          <div className="editorial-section-opener-row">
            <h2 className="display-title editorial-section-opener-title editorial-section-opener-title--small">
              Across Ethiopia
            </h2>
            <span aria-hidden="true" className="editorial-section-opener-rule" />
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-2">
          <RevealBlock className="editorial-dark-panel" variant="left" distance={36}>
            <p className="section-label">{content.heritage.eyebrow}</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
              {content.heritage.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              {content.heritage.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {content.heritage.tags.map((item) => (
                <span className="meta-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock
            className="editorial-photo-block image-hover-glow"
            delay={0.1}
            variant="right"
            distance={36}
          >
            <EditorialImage
              className="editorial-photo-shell"
              image={content.heritage.image}
              motionPreset="from-right"
              sizes="(max-width: 1024px) 100vw, 50vw"
              strength={82}
              tilt
            />
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <RevealBlock className="editorial-paper-panel" variant="left" distance={32}>
            <p className="section-label">{content.rise.eyebrow}</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-[#1f1914] sm:text-5xl">
              {content.rise.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#3a332d]">
              {content.rise.description}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="editorial-note">
                <p className="section-label">National</p>
                <p className="mt-3 text-sm leading-7 text-[#4b4138]">{content.rise.nationalNote}</p>
              </div>
              <div className="editorial-note">
                <p className="section-label">International</p>
                <p className="mt-3 text-sm leading-7 text-[#4b4138]">{content.rise.internationalNote}</p>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock className="editorial-mosaic" delay={0.1} variant="right" distance={32}>
            <div className="editorial-mosaic-narrow image-hover-glow">
              <div className="image-tilt-shell">
                <EditorialImage
                  className="editorial-photo-shell"
                  image={content.rise.images[0]}
                  motionPreset="from-left"
                  sizes="(max-width: 1024px) 100vw, 22vw"
                  strength={78}
                  tilt
                />
              </div>
            </div>
            <div className="editorial-mosaic-wide image-hover-glow">
              <div className="image-tilt-shell">
                <EditorialImage
                  className="editorial-photo-shell"
                  image={content.rise.images[1]}
                  motionPreset="from-right"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  strength={78}
                  tilt
                />
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="editorial-section-opener-shell editorial-section-opener-shell--compact">
        <RevealBlock className="editorial-section-opener" variant="up" distance={24}>
          <p className="section-label">{content.campaign.eyebrow}</p>
          <div className="editorial-section-opener-row">
            <h2 className="display-title editorial-section-opener-title editorial-section-opener-title--small">
              Release Energy
            </h2>
            <span aria-hidden="true" className="editorial-section-opener-rule" />
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell py-10">
        <div className="editorial-filmstrip">
          <RevealBlock className="editorial-film-panel editorial-film-panel--dark" variant="left" distance={44}>
            <p className="section-label">{content.campaign.eyebrow}</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
              {content.campaign.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              {content.campaign.description}
            </p>
          </RevealBlock>

          <RevealBlock
            className="editorial-film-panel editorial-film-panel--stacked image-hover-glow"
            delay={0.1}
            variant="scale"
          >
            <EditorialImage
              className="editorial-film-media"
              image={content.campaign.featureImage}
              motionPreset="zoom-burst"
              sizes="(max-width: 1024px) 100vw, 34vw"
              strength={80}
            />
            <div className="editorial-film-copy">
              <p className="section-label text-white/78">Release Energy</p>
              <h3 className="display-title mt-4 max-w-2xl text-4xl text-white sm:text-5xl">
                Campaign imagery can be bold, romantic, and unmistakably her own.
              </h3>
            </div>
          </RevealBlock>

          <RevealBlock
            className="editorial-film-panel editorial-film-panel--double"
            delay={0.18}
            variant="right"
            distance={44}
          >
            <div className="editorial-film-double editorial-film-double--small image-hover-glow">
                <EditorialImage
                  className="editorial-photo-shell"
                  image={content.campaign.supportingImages[0]}
                  motionPreset="settle-right"
                  sizes="(max-width: 1024px) 100vw, 18vw"
                  strength={68}
                tilt
              />
            </div>
            <div className="editorial-film-double editorial-film-double--large image-hover-glow">
                <EditorialImage
                  className="editorial-photo-shell"
                  image={content.campaign.supportingImages[1]}
                  motionPreset="from-left"
                  sizes="(max-width: 1024px) 100vw, 28vw"
                  strength={78}
                tilt
              />
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <RevealBlock className="editorial-paper-panel" variant="left" distance={30}>
            <p className="section-label">{content.pathways.eyebrow}</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-[#1f1914] sm:text-5xl">
              {content.pathways.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#3a332d]">
              {content.pathways.description}
            </p>
          </RevealBlock>

          <div className="grid gap-4 xl:grid-cols-3">
            {content.pathways.items.map((item, index) => (
              <RevealBlock
                delay={0.08 + index * 0.08}
                distance={28}
                key={item.title}
                variant={index === 0 ? "left" : index === 1 ? "up" : "right"}
              >
                <Link className="editorial-route-link" href={item.href ?? "#"}>
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
        <RevealBlock className="editorial-paper-panel">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
