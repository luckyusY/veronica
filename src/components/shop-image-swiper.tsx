"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";

// ─── Card thumbnail swiper (compact, used in the grid) ────────────────────────

type CardSwiperProps = {
  images: string[];
  title: string;
};

export function ShopCardSwiper({ images, title }: CardSwiperProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="scs-single">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={title} className="scs-img" loading="lazy" src={images[0]} />
      </div>
    );
  }

  return (
    <div className="scs-wrap">
      <Swiper
        loop
        modules={[Navigation, Pagination]}
        onSlideChange={(s) => setActive(s.realIndex)}
        onSwiper={setSwiper}
        slidesPerView={1}
        style={{ width: "100%", height: "100%" }}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={`${title} ${i + 1}`} className="scs-img" loading="lazy" src={src} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev / Next arrows */}
      <button
        className="scs-arrow scs-arrow--prev"
        onClick={(e) => { e.preventDefault(); swiper?.slidePrev(); }}
        type="button"
        aria-label="Previous image"
      >
        <ChevronLeft size={14} strokeWidth={2.5} />
      </button>
      <button
        className="scs-arrow scs-arrow--next"
        onClick={(e) => { e.preventDefault(); swiper?.slideNext(); }}
        type="button"
        aria-label="Next image"
      >
        <ChevronRight size={14} strokeWidth={2.5} />
      </button>

      {/* Dot indicators */}
      <div className="scs-dots">
        {images.map((_, i) => (
          <button
            aria-label={`Image ${i + 1}`}
            className={`scs-dot${active === i ? " is-active" : ""}`}
            key={i}
            onClick={(e) => { e.preventDefault(); swiper?.slideToLoop(i); }}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

// ─── Full-size detail swiper (used on the product detail page) ────────────────

type DetailSwiperProps = {
  images: string[];
  title: string;
};

export function ShopDetailSwiper({ images, title }: DetailSwiperProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="sds-wrap">
      <Swiper
        loop={images.length > 1}
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: ".sds-prev",
          nextEl: ".sds-next",
        }}
        onSlideChange={(s) => setActive(s.realIndex)}
        pagination={{ clickable: true, el: ".sds-pagination" }}
        slidesPerView={1}
        style={{ width: "100%", height: "100%" }}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${title} — image ${i + 1}`}
              className="sds-img"
              loading={i === 0 ? "eager" : "lazy"}
              src={src}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <button aria-label="Previous" className="sds-nav sds-prev" type="button">
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <button aria-label="Next" className="sds-nav sds-next" type="button">
            <ChevronRight size={20} strokeWidth={2} />
          </button>

          {/* Thumbnail strip */}
          <div className="sds-thumbs">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                className={`sds-thumb${active === i ? " is-active" : ""}`}
                key={i}
                loading="lazy"
                src={src}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
