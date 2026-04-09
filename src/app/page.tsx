import type { ReactNode } from "react";
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
type HomeGalleryItem = {
  image: HomePageImage;
  eyebrow: string;
  title: string;
  note: string;
};
type HomePlaylistItem = {
  title: string;
  href: string;
  accent: string;
  description: string;
  note: string;
};
type HomeEditorialPairProps = {
  image: HomePageImage;
  imageEyebrow: string;
  panel: ReactNode;
  panelClassName: string;
  sizes: string;
  imageSide?: "left" | "right";
  className?: string;
  frameClassName?: string;
  imagePriority?: boolean;
  imageDelay?: number;
  panelDelay?: number;
};

type HomeImageCardProps = {
  image: HomePageImage;
  eyebrow: string;
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
          overlayClassName="home-full-image-veil"
          priority={priority}
          shimmer={false}
          sizes={sizes}
          strength={52}
        />
        {eyebrow ? (
          <span className="home-full-image-tag">{eyebrow}</span>
        ) : null}
        <span className="home-image-copyright">© All rights reserved</span>
      </div>
    </RevealBlock>
  );
}

function HomeAutoGalleryRow({
  items,
  className = "",
}: {
  items: HomeGalleryItem[];
  className?: string;
}) {
  return (
    <div className={`home-auto-gallery-marquee ${className}`.trim()}>
      {[0, 1].map((copyIndex) => (
        <div
          aria-hidden={copyIndex === 1}
          className="home-auto-gallery-group"
          key={`gallery-copy-${copyIndex}`}
        >
          {items.map((item, index) => (
            <article
              className="home-auto-gallery-tile"
              key={`${item.title}-${copyIndex}-${index}`}
            >
              <div className="home-auto-gallery-media">
                <EditorialImage
                  className="home-auto-gallery-image"
                  fit="contain"
                  image={item.image}
                  overlayClassName="home-auto-gallery-veil"
                  shimmer={false}
                  sizes="(max-width: 1024px) 72vw, 18vw"
                  strength={40}
                />
                <span className="home-image-copyright">© All rights reserved</span>
              </div>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}

function HomePortraitGrid({ items }: { items: HomeGalleryItem[] }) {
  return (
    <div className="home-portrait-grid">
      {items.slice(0, 3).map((item, index) => (
        <RevealBlock
          className="home-portrait-card"
          delay={0.08 + index * 0.12}
          distance={44}
          key={item.title}
          variant="up"
        >
          <div className="home-portrait-frame">
            <EditorialImage
              className="home-portrait-image"
              fit="contain"
              image={item.image}
              overlayClassName="home-portrait-veil"
              shimmer
              sizes="(max-width: 900px) 90vw, 30vw"
              strength={48}
            />
          </div>
          <div className="home-portrait-caption">
            <p className="section-label home-portrait-eyebrow">{item.eyebrow}</p>
            <h3 className="display-title home-portrait-title">{item.title}</h3>
            <p className="home-portrait-note">{item.note}</p>
          </div>
        </RevealBlock>
      ))}
    </div>
  );
}

function HomeEditorialPair({
  image,
  imageEyebrow,
  panel,
  panelClassName,
  sizes,
  imageSide = "right",
  className = "",
  frameClassName = "",
  imagePriority = false,
  imageDelay,
  panelDelay,
}: HomeEditorialPairProps) {
  const imageVariant = imageSide === "left" ? "left" : "right";
  const panelVariant = imageSide === "left" ? "right" : "left";

  return (
    <div
      className={`home-viewport-breakout home-editorial-pair home-editorial-pair--image-${imageSide} ${className}`.trim()}
    >
      <RevealBlock
        className={`home-editorial-copy ${panelClassName}`.trim()}
        delay={panelDelay}
        distance={34}
        variant={panelVariant}
      >
        {panel}
      </RevealBlock>

      <HomeImageCard
        className="home-editorial-image"
        delay={imageDelay}
        eyebrow={imageEyebrow}
        frameClassName={frameClassName}
        image={image}
        priority={imagePriority}
        sizes={sizes}
        variant={imageVariant}
      />
    </div>
  );
}

function looksLikeUploadName(value?: string) {
  if (!value) {
    return false;
  }

  const normalized = value.trim();

  return /^(img|dsc|pxl|mvimg|image|file)[-_ ]?\d+/i.test(normalized);
}

function resolveImageTitle(label: string | undefined, fallback: string) {
  if (!label || looksLikeUploadName(label)) {
    return fallback;
  }

  return label;
}

function getHomeImageSourceKey(image: HomePageImage) {
  return image.publicId ?? image.url ?? image.alt;
}

const featuredPlaylists: HomePlaylistItem[] = [
  {
    title: "Veronica Adane Hit Singles (102M Views)",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFN-jNTdW57IeQ898Z2efccd&si=HTiu4REORFYg-RQB",
    accent: "YouTube playlist",
    description:
      "A direct entry into the biggest singles run, collected for fast listening, sharing, and press reference.",
    note: "Hit singles / official uploads",
  },
  {
    title: "Veronica Adane music video clips behind the scenes",
    href: "https://youtube.com/playlist?list=PLj1hYyBldtFPOSCDsVEBxhXTlyhGTl7bD&si=ixkbAbTof-_G9BVI",
    accent: "Behind the scenes",
    description:
      "Extra visual context from music-video production moments, set footage, and campaign-adjacent clips.",
    note: "BTS footage / video moments",
  },
];

export default async function Home() {
  const page = await getCmsPage("home");
  const content = getHomePageContent(page.content as HomePageContent);
  const visualChaptersSet = content.visualChapters.items;
  const visualFeature = visualChaptersSet[0];
  const visualSupport = visualChaptersSet.slice(1);
  const visualRows = visualChaptersSet;
  const risePrimaryImage = content.rise.images[0] ?? content.heritage.image;
  const riseSecondaryImage = content.rise.images[1] ?? risePrimaryImage;
  const campaignSupportPrimary =
    content.campaign.supportingImages[0] ?? content.campaign.featureImage;
  const campaignSupportSecondary =
    content.campaign.supportingImages[1] ?? campaignSupportPrimary;
  const hasTestimonials = content.testimonials.items.length > 0;
  const autoGalleryItems = [
    {
      image: content.intro.image,
      eyebrow: "Official portrait",
      title: resolveImageTitle(content.intro.image.label, "Full-frame portrait"),
      note: "Lead press image used across platform headers, booking decks, and releases.",
    },
    visualFeature
      ? {
          image: visualFeature.image,
          eyebrow: visualFeature.era,
          title: visualFeature.title,
          note: visualFeature.note,
        }
      : null,
    ...visualSupport.slice(0, 2).map((item) => ({
      image: item.image,
      eyebrow: item.era,
      title: item.title,
      note: item.note,
    })),
    {
      image: content.heritage.image,
      eyebrow: content.heritage.eyebrow,
      title: resolveImageTitle(content.heritage.image.label, "Live-stage portrait"),
      note: "A heritage frame that anchors the homepage with a grounded live-performance portrait.",
    },
    {
      image: risePrimaryImage,
      eyebrow: "Tour frame",
      title: resolveImageTitle(risePrimaryImage.label, "Stage direction"),
      note: "Performance photography with enough breathing room for the styling and pose to stay intact.",
    },
    {
      image: content.campaign.featureImage,
      eyebrow: content.campaign.eyebrow,
      title: resolveImageTitle(content.campaign.featureImage.label, "Campaign feature"),
      note: "Campaign imagery staged for press kits, headers, and launch announcements.",
    },
    {
      image: campaignSupportPrimary,
      eyebrow: "Supporting frame",
      title: resolveImageTitle(campaignSupportPrimary.label, "Campaign still 01"),
      note: "Secondary photography that keeps the same editorial tone without feeling repetitive.",
    },
  ].filter((item): item is HomeGalleryItem => item !== null);
  const seenGallerySources = new Set<string>();
  const uniqueAutoGalleryItems = autoGalleryItems.filter((item) => {
    const key = getHomeImageSourceKey(item.image);

    if (seenGallerySources.has(key)) {
      return false;
    }

    seenGallerySources.add(key);
    return true;
  });
  const autoGallerySplitIndex = Math.ceil(uniqueAutoGalleryItems.length / 2);
  const autoGalleryPrimaryRow = uniqueAutoGalleryItems.slice(0, autoGallerySplitIndex);
  const autoGallerySecondaryRow =
    uniqueAutoGalleryItems.slice(autoGallerySplitIndex).length > 0
      ? uniqueAutoGalleryItems.slice(autoGallerySplitIndex)
      : uniqueAutoGalleryItems.slice().reverse();

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

          <RevealBlock className="home-intro-visual" distance={40} variant="right">
            <div className="home-intro-visual-stage">
              <p className="section-label home-intro-visual-kicker">Official image</p>
              <EditorialImage
                className="home-intro-image"
                fit="contain"
                image={content.intro.image}
                overlayClassName="home-intro-image-veil"
                priority
                shimmer={false}
                sizes="(max-width: 1024px) 100vw, 46vw"
                strength={52}
              />
              <span className="home-image-copyright">© All rights reserved</span>
            </div>

            <div className="home-intro-caption">
              <h3 className="display-title home-intro-caption-title">
                {resolveImageTitle(content.intro.image.label, "Signature portrait")}
              </h3>
              <p className="home-intro-caption-note">{content.intro.paragraphs[0]}</p>
            </div>
          </RevealBlock>
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
          </RevealBlock>

          {visualRows.length > 0 ? (
            <HomePortraitGrid items={visualRows.map(item => ({
              image: item.image,
              eyebrow: item.era,
              title: item.title,
              note: item.note,
            }))} />
          ) : null}
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="home-viewport-breakout">
          <RevealBlock className="home-auto-gallery-stage" distance={32} variant="up">
            <div className="home-auto-gallery-head">
              <div>
                <p className="section-label">Moving gallery</p>
                <h2 className="display-title home-auto-gallery-heading">
                  Photography in motion.
                </h2>
              </div>
            </div>

            <HomeAutoGalleryRow items={autoGalleryPrimaryRow} />
            <HomeAutoGalleryRow
              className="home-auto-gallery-marquee--alternate"
              items={autoGallerySecondaryRow}
            />
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="home-editorial-stack">
          <HomeEditorialPair
            className="home-editorial-pair--feature"
            frameClassName="home-full-image-frame--split-feature"
            image={content.heritage.image}
            imageEyebrow={content.heritage.eyebrow}
            imageSide="right"
            panelClassName="editorial-dark-panel home-editorial-copy-panel"
            panel={
              <>
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
              </>
            }
            sizes="(max-width: 1024px) 100vw, 52vw"
          />

          <HomeEditorialPair
            frameClassName="home-full-image-frame--split-standard"
            image={risePrimaryImage}
            imageEyebrow="Tour frame"
            imageSide="left"
            panelClassName="editorial-paper-panel home-editorial-copy-panel"
            panel={
              <>
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
                    <p className="mt-3 text-sm leading-7 text-[#4b4138]">
                      {content.rise.nationalNote}
                    </p>
                  </div>
                  <div className="editorial-note">
                    <p className="section-label">Beyond Ethiopia</p>
                    <p className="mt-3 text-sm leading-7 text-[#4b4138]">
                      {content.rise.internationalNote}
                    </p>
                  </div>
                </div>
              </>
            }
            sizes="(max-width: 1024px) 100vw, 52vw"
          />

          <HomeEditorialPair
            className="home-editorial-pair--compact"
            frameClassName="home-full-image-frame--split-support"
            image={riseSecondaryImage}
            imageEyebrow="Audience frame"
            imageSide="right"
            panelClassName="editorial-dark-panel home-editorial-copy-panel home-editorial-copy-panel--compact"
            panel={
              <>
                <div>
                  <p className="section-label">Audience atmosphere</p>
                  <h3 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
                    Performance images can stay full without losing the live emotion.
                  </h3>
                </div>
                <p className="max-w-2xl text-base leading-8 text-white/72">
                  {content.rise.internationalNote}
                </p>
              </>
            }
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="home-editorial-stack">
          <HomeEditorialPair
            className="home-editorial-pair--feature"
            frameClassName="home-full-image-frame--split-feature"
            image={content.campaign.featureImage}
            imageEyebrow={content.campaign.eyebrow}
            imageSide="right"
            panelClassName="editorial-paper-panel home-editorial-copy-panel"
            panel={
              <>
                <div>
                  <p className="section-label">{content.campaign.eyebrow}</p>
                  <h2 className="display-title mt-5 max-w-3xl text-4xl text-[#1f1914] sm:text-5xl">
                    {content.campaign.title}
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-8 text-[#3a332d]">
                  {content.campaign.description}
                </p>
              </>
            }
            sizes="(max-width: 1024px) 100vw, 52vw"
          />

          <HomeEditorialPair
            className="home-editorial-pair--compact home-editorial-pair--campaign-support"
            frameClassName="home-full-image-frame--split-support"
            image={campaignSupportSecondary}
            imageEyebrow="Supporting frame"
            imageSide="left"
            panelClassName="editorial-dark-panel home-editorial-copy-panel home-editorial-copy-panel--compact"
            panel={
              <>
                <div>
                  <p className="section-label">Supporting stills</p>
                  <h3 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
                    Press-ready images should feel open, tall, and immediate.
                  </h3>
                </div>
                <p className="max-w-2xl text-base leading-8 text-white/72">
                  Additional campaign imagery for platform headers, press kits, release coverage,
                  and social launch moments.
                </p>
              </>
            }
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
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
        <div className="home-route-stage home-route-stage--playlists">
          <RevealBlock
            className="editorial-paper-panel home-route-intro home-playlist-intro"
            distance={30}
            variant="left"
          >
            <p className="section-label">Featured playlists</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-[#1f1914] sm:text-5xl">
              Go straight to the official YouTube playlists.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#3a332d]">
              The homepage now includes direct playlist paths for the biggest hit singles and
              behind-the-scenes video clips, without making visitors hunt through the full channel.
            </p>
          </RevealBlock>

          <div className="home-route-grid home-route-grid--playlists">
            {featuredPlaylists.map((item, index) => (
              <RevealBlock
                delay={0.08 + index * 0.08}
                distance={28}
                key={item.href}
                variant={index === 0 ? "up" : "right"}
              >
                <a
                  className="editorial-route-link home-route-link home-playlist-link"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="editorial-route-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="section-label">{item.accent}</p>
                  <h3 className="display-title home-playlist-title mt-4 text-white">{item.title}</h3>
                  <p className="home-playlist-copy mt-5 text-sm leading-7 text-white/72">
                    {item.description}
                  </p>
                  <div className="editorial-route-footer">
                    <span>{item.note}</span>
                    <span>Open on YouTube</span>
                  </div>
                </a>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

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
