"use client";

import { useState } from "react";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Autoplay, EffectFade, FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { EditorialImage } from "@/components/editorial-image";

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

const motionPresets = ["settle-right", "from-left", "diagonal", "from-right"] as const;

export function HomeHeroSwiper({ slides }: HomeHeroSwiperProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const activeSlide = slides[activeIndex] ?? slides[0];

  return (
    <section className="section-shell py-5 sm:py-7">
      <div className="home-hero-shell">
        <div className="home-hero-copy">
          <motion.div
            className="home-hero-copy-inner"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
            whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              reducedMotion
                ? { duration: 0.25 }
                : { type: "spring", stiffness: 110, damping: 18, mass: 0.84 }
            }
          >
            <p className="section-label text-beam">Official Artist Platform</p>
            <AnimatePresence mode="wait">
              <motion.div
                className="home-hero-copy-stack"
                key={activeIndex}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 24, filter: "blur(12px)" }
                }
                animate={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -18, filter: "blur(10px)" }
                }
                transition={{
                  duration: reducedMotion ? 0.2 : 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="home-hero-kicker">{activeSlide.eyebrow}</p>
                <h1 className="display-title home-hero-title">{activeSlide.title}</h1>
                <p className="home-hero-description">{activeSlide.copy}</p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="home-hero-actions"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.12, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link className="primary-button" href="/about">
                Read Biography
              </Link>
              <Link className="secondary-button" href="/music">
                Enter Music Archive
              </Link>
            </motion.div>

            <motion.div
              className="home-hero-foot"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="home-hero-stat">
                <span className="home-hero-stat-label">Current focus</span>
                <strong>{activeSlide.accent}</strong>
              </div>
              <div className="home-hero-stat">
                <span className="home-hero-stat-label">Momentum</span>
                <strong>{activeSlide.stat}</strong>
              </div>
              <div className="home-hero-video-note">
                <p className="section-label">Featured Video</p>
                <p>
                  Watch the current visual and move through official portraits,
                  release imagery, and signature eras.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="home-hero-stage">
          <div className="home-hero-swiper-shell">
            <Swiper
              className="home-hero-swiper"
              effect="fade"
              fadeEffect={{ crossFade: true }}
              rewind={true}
              modules={[Autoplay, EffectFade, Pagination]}
              onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
              onSwiper={setSwiper}
              pagination={{ clickable: true }}
              speed={1200}
              autoplay={
                reducedMotion
                  ? false
                  : {
                    delay: 4200,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
              }
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={slide.title}>
                  <div className="home-hero-slide">
                    <EditorialImage
                      className="home-hero-slide-media"
                      image={slide.image}
                      motionPreset={motionPresets[index % motionPresets.length]}
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      strength={112}
                      tilt
                    />
                    <div className="home-hero-slide-overlay" />
                    <div className="home-hero-slide-caption">
                      <span className="section-label text-white/72">{slide.accent}</span>
                      <p className="home-hero-slide-label">{slide.image.label ?? slide.eyebrow}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="home-hero-video-card">
              <div className="editorial-video-frame">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="editorial-video-embed"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src="https://www.youtube.com/embed/ReUSSljekP0?si=qps2JuHV7lkQ3-ip"
                  title="Veronica Adane featured video"
                />
              </div>
            </div>
          </div>

          <div className="home-hero-thumb-shell" data-lenis-prevent="true">
            <Swiper
              className="home-hero-thumb-swiper"
              modules={[FreeMode]}
              slidesPerView="auto"
              spaceBetween={12}
              freeMode
              speed={900}
            >
              {slides.map((slide, index) => (
                <SwiperSlide className="home-hero-thumb-slide" key={`${slide.title}-thumb`}>
                  <button
                    className={`home-hero-thumb${index === activeIndex ? " is-active" : ""}`}
                    onClick={() => swiper?.slideTo(index)}
                    type="button"
                  >
                    <span className="home-hero-thumb-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="home-hero-thumb-copy">
                      <strong>{slide.eyebrow}</strong>
                      <span>{slide.stat}</span>
                    </span>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
