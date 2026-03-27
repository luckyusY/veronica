"use client";

import Image, { type StaticImageData } from "next/image";
import { useReducedMotion } from "motion/react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type GalleryItem = {
  title: string;
  note: string;
  image: {
    src: string | StaticImageData;
    alt: string;
    position?: string;
    placeholderBase?: string;
    placeholderHighlight?: string;
    label?: string;
  };
};

type EditorialGallerySwiperProps = {
  items: readonly GalleryItem[];
};

export function EditorialGallerySwiper({ items }: EditorialGallerySwiperProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="editorial-gallery-shell" data-lenis-prevent="true">
      <Swiper
        autoplay={
          reducedMotion
            ? false
            : {
                delay: 3200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
        }
        breakpoints={{
          640: { slidesPerView: 1.2 },
          1024: { slidesPerView: 1.35 },
          1280: { slidesPerView: 1.7 },
        }}
        className="editorial-gallery-swiper"
        grabCursor
        modules={[Autoplay]}
        rewind
        slidesPerView={1.04}
        spaceBetween={16}
        speed={850}
      >
        {items.map((item, index) => (
          <SwiperSlide className="editorial-gallery-slide" key={item.title}>
            <article className="editorial-gallery-card image-hover-glow">
              <div className="editorial-gallery-media">
                <Image
                  alt={item.image.alt}
                  className="editorial-gallery-image"
                  fill
                  priority={index < 2}
                  sizes="(max-width: 640px) 82vw, (max-width: 1200px) 46vw, 28vw"
                  src={item.image.src}
                  style={{
                    objectFit: "cover",
                    objectPosition: item.image.position ?? "center",
                  }}
                />
              </div>

              <div className="editorial-gallery-copy">
                <p className="section-label text-white/76">{item.image.label ?? item.title}</p>
                <h3 className="display-title mt-4 text-3xl text-white sm:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/72">
                  {item.note}
                </p>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
