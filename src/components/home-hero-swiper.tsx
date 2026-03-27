"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type HeroSlide = {
  eyebrow: string;
  title: string;
  copy: string;
  stat: string;
  accent: string;
  image: {
    src: string | StaticImageData;
    alt: string;
    position?: string;
    placeholderBase?: string;
    placeholderHighlight?: string;
    label?: string;
  };
};

type HomeHeroSwiperProps = {
  slides: readonly HeroSlide[];
};

const itemEase = [0.22, 1, 0.36, 1] as const;

export function HomeHeroSwiper({ slides }: HomeHeroSwiperProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  return (
    <section className="home-hero-section">
      <Swiper
        autoplay={
          reducedMotion
            ? false
            : {
                delay: 10000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
        }
        className="home-hero-swiper"
        effect="fade"
        fadeEffect={{ crossFade: true }}
        modules={[Autoplay, EffectFade, Pagination]}
        onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
        pagination={{ clickable: true }}
        rewind
        speed={1800}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className="home-hero-slide">
              <div className="home-hero-slide-media">
                <Image
                  alt={slide.image.alt}
                  className="home-hero-slide-image"
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  src={slide.image.src}
                  style={{ objectPosition: slide.image.position ?? "center center" }}
                />
              </div>
              <div className="home-hero-vignette" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="home-hero-overlay">
        <div className="home-hero-vertical">
          VERONICA ADANE <span aria-hidden="true">·</span> OFFICIAL
        </div>

        <div className="section-shell home-hero-overlay-inner">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="home-hero-copy"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={
              reducedMotion
                ? { duration: 0.24 }
                : { duration: 0.62, delay: 0.08, ease: itemEase }
            }
          >
            <AnimatePresence mode="wait">
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="home-hero-kicker"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: 8 }}
                key={`${activeIndex}-eyebrow`}
                transition={{ duration: 0.34, ease: itemEase }}
              >
                {activeSlide.accent}
              </motion.p>
            </AnimatePresence>

            <h1 className="display-title home-hero-headline">
              <span className="home-hero-headline-top">Faith, glamour, and a voice</span>
              <span className="home-hero-headline-bottom">
                <span className="home-hero-headline-line">carrying Ethiopia</span>
                <span className="home-hero-headline-line">far beyond</span>
                <span className="home-hero-headline-line">its borders</span>
              </span>
            </h1>

            <AnimatePresence mode="wait">
              <motion.p
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="home-hero-description"
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                key={`${activeIndex}-copy`}
                transition={{ duration: 0.42, ease: itemEase }}
              >
                {activeSlide.copy}
              </motion.p>
            </AnimatePresence>

            <span aria-hidden="true" className="home-hero-rule" />

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="home-hero-actions"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.38, delay: 0.2, ease: itemEase }}
            >
              <Link className="home-hero-button" href="/about">
                Read Biography
              </Link>
              <Link className="home-hero-button" href="/music">
                Enter Music Archive
              </Link>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="home-hero-meta"
              exit={{ opacity: 0, y: 12 }}
              initial={{ opacity: 0, y: 14 }}
              key={`${activeIndex}-meta`}
              transition={{ duration: 0.4, delay: 0.16, ease: itemEase }}
            >
              <p className="home-hero-meta-label">{activeSlide.eyebrow}</p>
              <p className="home-hero-meta-value">{activeSlide.stat}</p>
              <p className="home-hero-meta-note">
                {activeSlide.image.label ?? activeSlide.eyebrow}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
