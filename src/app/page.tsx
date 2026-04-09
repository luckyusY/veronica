import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealBlock } from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import { HomeHeroSwiper } from "@/components/home-hero-swiper";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { YouTubeFacade } from "@/components/youtube-facade";
import { getHomePageContent, homeResearchSignals } from "@/lib/artist-page-content";
import { getCmsPage } from "@/lib/cms-store";
import type { HomePageContent } from "@/lib/cms-types";
import {
  fetchPlaylistVideos,
  formatPublished,
  formatViews,
  type PlaylistVideo,
} from "@/lib/youtube-playlists";

export const revalidate = 60;

type HomePageImage = HomePageContent["intro"]["image"];
type RevealVariant = "left" | "right" | "up" | "scale";
type HomeGalleryItem = {
  image: HomePageImage;
  eyebrow: string;
  title: string;
  note: string;
};
type HomePlaylistItem = HomePageContent["playlists"]["items"][number];
type HomeFeaturedVideoItem = HomePlaylistItem & {
  feedTitle: string;
  leadVideo: PlaylistVideo | null;
  playlistCount: number;
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
          mobileFit="cover"
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

function _HomeAutoGalleryRow({
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
                  mobileFit="cover"
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
              mobileFit="cover"
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

function HomeFeaturedVideoCard({
  item,
  index,
}: {
  item: HomeFeaturedVideoItem;
  index: number;
}) {
  const embedVideoId = item.leadVideo?.id ?? item.previewVideoId;
  const videoTitle = item.leadVideo?.title ?? item.title;
  const published = item.leadVideo ? formatPublished(item.leadVideo.published) : "";
  const views = item.leadVideo ? formatViews(item.leadVideo.views) : "";
  const meta = [published, views].filter(Boolean).join(" • ");
  const playlistCountLabel =
    item.playlistCount > 0
      ? `${item.playlistCount} ${item.playlistCount === 1 ? "video" : "videos"}`
      : item.stat;

  return (
    <RevealBlock
      className="home-playlist-video-card"
      delay={0.08 + index * 0.08}
      distance={30}
      variant={index % 2 === 0 ? "left" : "right"}
    >
      <div className="home-playlist-video-media">
        <YouTubeFacade
          className="home-playlist-video-embed"
          fullscreenOnPlay
          loading={index === 0 ? "eager" : "lazy"}
          thumbnailUrl={
            item.leadVideo?.thumbnail ?? `https://i.ytimg.com/vi/${embedVideoId}/hqdefault.jpg`
          }
          title={videoTitle}
          videoId={embedVideoId}
        />
        <div className="home-playlist-video-wash" />
        <div className="home-playlist-video-topline">
          <span className="home-playlist-video-index">{String(index + 1).padStart(2, "0")}</span>
          <div className="home-playlist-video-chip-row">
            <span className="home-playlist-video-chip">{item.accent}</span>
            <span className="home-playlist-video-chip">{playlistCountLabel}</span>
            {item.feedTitle && item.feedTitle !== item.title ? (
              <span className="home-playlist-video-chip">{item.feedTitle}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="home-playlist-video-body">
        <p className="section-label home-playlist-video-kicker">{item.title}</p>
        <h3 className="display-title home-playlist-video-title">{videoTitle}</h3>
        {meta ? <p className="home-playlist-video-meta">{meta}</p> : null}
        <p className="home-playlist-video-description">{item.description}</p>
        <div className="home-playlist-video-actions">
          <a
            className="primary-button"
            href={item.href}
            rel="noreferrer"
            target="_blank"
          >
            <span>Open playlist</span>
            <ArrowUpRight size={16} strokeWidth={2.1} />
          </a>
        </div>
      </div>
    </RevealBlock>
  );
}

export default async function Home() {
  const page = await getCmsPage("home");
  const content = getHomePageContent(page.content as HomePageContent);
  const visualChaptersSet = content.visualChapters.items;
  const visualRows = visualChaptersSet;
  const risePrimaryImage = content.rise.images[0] ?? content.heritage.image;
  const riseSecondaryImage = content.rise.images[1] ?? risePrimaryImage;
  const campaignSupportSecondary =
    content.campaign.supportingImages[1] ??
    content.campaign.supportingImages[0] ??
    content.campaign.featureImage;
  const hasTestimonials = content.testimonials.items.length > 0;
  const featuredVideos = await Promise.all(
    content.playlists.items.slice(0, 4).map(async (item) => {
      const feed = await fetchPlaylistVideos(item.playlistId);

      return {
        ...item,
        feedTitle: feed.feedTitle,
        leadVideo: feed.items[0] ?? null,
        playlistCount: feed.items.length,
      };
    }),
  );

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
        <div className="home-viewport-breakout home-playlist-stage">
          <RevealBlock className="home-playlist-banner" distance={28} variant="up">
            <div className="home-playlist-banner-copy">
              <p className="section-label">{content.playlists.eyebrow}</p>
              <h2 className="display-title text-4xl text-white sm:text-5xl">
                {content.playlists.title}
              </h2>
            </div>
            <div className="home-playlist-banner-support">
              <p className="text-base leading-8 text-white/72">
                {content.playlists.description}
              </p>
              <div className="home-playlist-marks">
                {content.playlists.highlights.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <a
                className="secondary-button"
                href={content.playlists.channelAction.href}
                rel="noreferrer"
                target="_blank"
              >
                {content.playlists.channelAction.label}
              </a>
            </div>
          </RevealBlock>

          <div className="home-playlist-grid">
            {featuredVideos.map((item, index) => (
              <HomeFeaturedVideoCard index={index} item={item} key={item.playlistId} />
            ))}
          </div>
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
                mobileFit="cover"
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
            imageEyebrow="Touring"
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
            imageEyebrow="Global reach"
            imageSide="right"
            panelClassName="editorial-dark-panel home-editorial-copy-panel home-editorial-copy-panel--compact"
            panel={
              <>
                <div>
                  <p className="section-label">Global demand</p>
                  <h3 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
                    Diaspora audiences carried Veronica from Ethiopia to the Middle East, the United States, and Europe.
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
            imageEyebrow="Future chapter"
            imageSide="left"
            panelClassName="editorial-dark-panel home-editorial-copy-panel home-editorial-copy-panel--compact"
            panel={
              <>
                <div>
                  <p className="section-label">Faith and future</p>
                  <h3 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
                    Acting, advocacy, brand work, and a multilingual EP show how much larger the next chapter can become.
                  </h3>
                </div>
                <p className="max-w-2xl text-base leading-8 text-white/72">
                  She has supported women and communities, built a house for her father,
                  represented Kelati Human Hair and Midea Ethiopia, and dreams of launching a
                  foundation for women, youth, and people in need.
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
