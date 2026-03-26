import { testimonials } from "@/lib/site-data";

export function TestimonialsCarousel() {
  return (
    <section className="section-shell py-10">
      <div className="max-w-4xl">
        <p className="section-label">Testimonials</p>
        <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
          Press, producers, and fans on the experience
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
          A photography-led world should feel readable, responsive, and emotionally paced.
          Here’s what people say after the first watch.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto pb-2">
        <div className="flex gap-4 snap-x snap-mandatory">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="solid-note-card min-w-[22rem] snap-start sm:min-w-[26rem]"
            >
              <p className="section-label">Words</p>
              <blockquote className="mt-4 text-base leading-7 text-white/72">
                “{t.quote}”
              </blockquote>
              <p className="mt-5 font-semibold text-white/90">{t.name}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                {t.role}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

