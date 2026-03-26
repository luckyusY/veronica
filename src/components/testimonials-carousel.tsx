"use client";

import { useReducedMotion } from "motion/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { testimonials } from "@/lib/site-data";

export function TestimonialsCarousel() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="section-shell py-10">
      <div className="testimonial-swiper-shell">
        <div className="max-w-3xl">
          <p className="section-label">Testimonials</p>
          <h2 className="display-title mt-5 max-w-4xl text-4xl text-white sm:text-5xl">
            Press, producers, and audiences speak about the same thing: presence.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
            Veronica&apos;s work lands through voice, image, discipline, and the feeling
            that every release belongs to a larger era.
          </p>
        </div>

        <Swiper
          className="testimonial-swiper"
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          speed={900}
          autoplay={
            reducedMotion
              ? false
              : {
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
          }
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.name}>
              <article className="testimonial-slide">
                <p className="testimonial-mark">&ldquo;</p>
                <blockquote className="testimonial-quote">
                  {testimonial.quote}
                </blockquote>
                <div className="testimonial-meta">
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
