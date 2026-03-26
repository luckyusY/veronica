"use client";

import type { StaticImageData } from "next/image";
import { useReducedMotion } from "motion/react";
import { Autoplay, FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { EditorialImage } from "@/components/editorial-image";

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

const motionPresets = ["from-left", "diagonal", "from-right", "settle-left", "zoom-burst"] as const;

export function EditorialGallerySwiper({ items }: EditorialGallerySwiperProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="editorial-gallery-shell" data-lenis-prevent="true">
      <Swiper
        className="editorial-gallery-swiper"
        freeMode={{ enabled: true, momentumVelocityRatio: 0.8 }}
        loop
        modules={[Autoplay, FreeMode, Mousewheel]}
        mousewheel={{ forceToAxis: true }}
        slidesPerView="auto"
        spaceBetween={16}
        speed={950}
        autoplay={
          reducedMotion
            ? false
            : {
                delay: 2200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
        }
      >
        {items.map((item, index) => (
          <SwiperSlide className="editorial-gallery-slide" key={item.title}>
            <article className="editorial-gallery-card image-hover-glow">
              <EditorialImage
                className="editorial-gallery-media"
                image={item.image}
                motionPreset={motionPresets[index % motionPresets.length]}
                sizes="(max-width: 768px) 80vw, (max-width: 1280px) 44vw, 26vw"
                strength={88}
                tilt
              />
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
