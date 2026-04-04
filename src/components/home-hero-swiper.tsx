"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMotionLite } from "@/components/providers";
import { createSvgBlurDataURL } from "@/lib/image-utils";

type HeroSlide = {
  eyebrow: string;
  title: string;
  copy: string;
  stat: string;
  accent: string;
  image: {
    src?: string | StaticImageData;
    url?: string;
    alt: string;
    position?: string;
    placeholderBase?: string;
    placeholderHighlight?: string;
    label?: string;
  };
};

type HomeHeroSwiperProps = {
  verticalLabel: string;
  headlineTop: string;
  headlineLines: string[];
  primaryAction: {
    href: string;
    label: string;
  };
  secondaryAction: {
    href: string;
    label: string;
  };
  slides: readonly HeroSlide[];
};

const itemEase = [0.22, 1, 0.36, 1] as const;

export function HomeHeroSwiper({
  verticalLabel,
  headlineTop,
  headlineLines,
  primaryAction,
  secondaryAction,
  slides,
}: HomeHeroSwiperProps) {
  const userReducedMotion = Boolean(useReducedMotion());
  const liteMotion = Boolean(useMotionLite() || userReducedMotion);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  return (
    <section className="home-hero-section">
      <Swiper
        allowTouchMove={!userReducedMotion}
        autoplay={
          userReducedMotion
            ? false
            : {
                delay: 7200,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                waitForTransition: false,
              }
        }
        className="home-hero-swiper"
        effect="fade"
        fadeEffect={{ crossFade: true }}
        modules={[Autoplay, EffectFade, Pagination]}
        loop={slides.length > 1}
        onRealIndexChange={(instance) => setActiveIndex(instance.realIndex)}
        pagination={{ clickable: true }}
        speed={1600}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className="home-hero-slide">
              <div className="home-hero-slide-media">
                <Image
                  alt={slide.image.alt}
                  blurDataURL={createSvgBlurDataURL(
                    slide.image.placeholderBase ?? "#141012",
                    slide.image.placeholderHighlight ?? "#8e6b43",
                  )}
                  className="home-hero-slide-image"
                  fill
                  placeholder="blur"
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  sizes="100vw"
                  src={slide.image.src ?? slide.image.url ?? ""}
                  style={{ objectPosition: slide.image.position ?? "center center" }}
                />
              </div>
              <div className="home-hero-vignette" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="home-hero-overlay">
        <p className="home-hero-vertical">{verticalLabel}</p>

        <div className="section-shell home-hero-overlay-inner">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="home-hero-copy"
            initial={liteMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={
              liteMotion
                ? { duration: 0.24 }
                : { duration: 0.56, delay: 0.08, ease: itemEase }
            }
          >
            <AnimatePresence mode="wait">
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="home-hero-kicker"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: 8 }}
                key={`${activeIndex}-accent`}
                transition={{ duration: 0.3, ease: itemEase }}
              >
                {activeSlide.accent}
              </motion.p>
            </AnimatePresence>

            <h1 className="display-title home-hero-headline">
              <span className="home-hero-headline-top">{headlineTop}</span>
              <span className="home-hero-headline-bottom">
                {headlineLines.map((line) => (
                  <span className="home-hero-headline-line" key={line}>
                    {line}
                  </span>
                ))}
              </span>
            </h1>

            <AnimatePresence mode="wait">
              <motion.p
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="home-hero-description"
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                key={`${activeIndex}-copy`}
                transition={{ duration: 0.34, ease: itemEase }}
              >
                {activeSlide.copy}
              </motion.p>
            </AnimatePresence>

            <span aria-hidden="true" className="home-hero-rule" />

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="home-hero-actions"
              initial={liteMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.34, delay: 0.18, ease: itemEase }}
            >
              <Link className="home-hero-button" href={primaryAction.href}>
                {primaryAction.label}
              </Link>
              <Link
                className="home-hero-button home-hero-button--secondary"
                href={secondaryAction.href}
              >
                {secondaryAction.label}
              </Link>
            </motion.div>
          </motion.div>

          <div className="home-hero-side">
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="home-hero-slide-card"
                exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                key={`${activeIndex}-scene`}
                transition={{ duration: 0.34, delay: 0.24, ease: itemEase }}
              >
                <p className="home-hero-side-label">Current scene</p>
                <div className="home-hero-slide-card-topline">
                  <span className="home-hero-slide-card-count">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="home-hero-slide-card-rule" />
                  <span className="home-hero-slide-card-total">
                    {String(slides.length).padStart(2, "0")}
                  </span>
                </div>
                <p className="home-hero-slide-card-title">{activeSlide.title}</p>
                <p className="home-hero-slide-card-note">
                  {activeSlide.image.label ?? activeSlide.eyebrow}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="home-hero-meta"
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: 12 }}
                key={`${activeIndex}-meta`}
                transition={{ duration: 0.34, ease: itemEase }}
              >
                <p className="home-hero-meta-label">{activeSlide.accent}</p>
                <p className="home-hero-meta-value">{activeSlide.stat}</p>
                <p className="home-hero-meta-note">
                  {activeSlide.image.label ?? activeSlide.eyebrow}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
