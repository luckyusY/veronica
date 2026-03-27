import Link from "next/link";
import { RevealBlock } from "@/components/animated-text";
import { EditorialGallerySwiper } from "@/components/editorial-gallery-swiper";
import { EditorialImage } from "@/components/editorial-image";
import { HomeHeroSwiper } from "@/components/home-hero-swiper";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import {
  editorialCredits,
  editorialGalleryMoments,
  editorialHeroMoments,
  editorialImages,
  editorialIntro,
  editorialPathways,
  editorialSignals,
  editorialStoryNotes,
} from "@/lib/editorial-home";

export default function Home() {
  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <HomeHeroSwiper slides={editorialHeroMoments} />

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
          <RevealBlock
            className="editorial-photo-block editorial-photo-block--tall image-hover-glow"
            variant="left"
            distance={40}
          >
            <EditorialImage
              className="editorial-photo-shell"
              image={editorialImages.cliff}
              motionPreset="from-left"
              sizes="(max-width: 1024px) 100vw, 40vw"
              strength={88}
              tilt
            />
          </RevealBlock>

          <RevealBlock className="editorial-paper-panel" delay={0.1} variant="right" distance={40}>
            <p className="section-label">Biography</p>
            <h2 className="display-title mt-5 max-w-4xl text-4xl text-[#1f1914] sm:text-5xl">
              A journey shaped by faith, study, sacrifice, and the courage to keep going.
            </h2>

            <div className="mt-6 grid gap-4 text-[#3a332d]">
              {editorialIntro.map((paragraph) => (
                <p className="max-w-3xl text-base leading-8" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {editorialSignals.map((item) => (
                <article className="editorial-stat" key={item.label}>
                  <p className="display-title text-4xl text-[#18120d] sm:text-5xl">
                    {item.value}
                  </p>
                  <p className="editorial-stat-label mt-3 text-sm font-semibold uppercase text-[#6d5738]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#4b4138]">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
          <RevealBlock
            className="min-w-0 editorial-dark-panel visual-chapters-panel"
            variant="left"
            distance={32}
          >
            <p className="section-label">Visual Chapters</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
              Real imagery now drives the homepage with more drama, elegance, and character.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              Veronica&apos;s portraits move between black-tie studio clarity, gilded couture,
              warm brown fashion, and scarlet campaign energy. The result feels more like
              an artist world than a stack of generic modules.
            </p>
            <div className="visual-chapters-chip-list mt-8">
              {["Portraiture", "Release Eras", "Couture", "Stage Presence"].map((item) => (
                <span className="visual-chapters-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock className="min-w-0" delay={0.08} variant="right" distance={32}>
            <EditorialGallerySwiper items={editorialGalleryMoments} />
          </RevealBlock>
        </div>
      </section>

      <TestimonialsCarousel />

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-2">
          <RevealBlock className="editorial-dark-panel" variant="left" distance={36}>
            <p className="section-label">Heritage</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
              {editorialStoryNotes[0].title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              {editorialStoryNotes[0].copy}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Azmari", "Family Legacy", "Faith", "Identity"].map((item) => (
                <span className="meta-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </RevealBlock>

          <RevealBlock
            className="editorial-photo-block image-hover-glow"
            delay={0.1}
            variant="right"
            distance={36}
          >
            <EditorialImage
              className="editorial-photo-shell"
              image={editorialImages.microphone}
              motionPreset="from-right"
              sizes="(max-width: 1024px) 100vw, 50vw"
              strength={82}
              tilt
            />
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <RevealBlock className="editorial-paper-panel" variant="left" distance={32}>
            <p className="section-label">Rise</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-[#1f1914] sm:text-5xl">
              {editorialStoryNotes[1].title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#3a332d]">
              {editorialStoryNotes[1].copy}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="editorial-note">
                <p className="section-label">National</p>
                <p className="mt-3 text-sm leading-7 text-[#4b4138]">
                  Addis Ababa, Gondar, Hawassa, Harar, Dire Dawa, Bahir Dar, Arba Minch,
                  Dilla, and many more cities across Ethiopia.
                </p>
              </div>
              <div className="editorial-note">
                <p className="section-label">International</p>
                <p className="mt-3 text-sm leading-7 text-[#4b4138]">
                  Atlanta, DMV, Los Angeles, Seattle, Denver, Oakland, Amsterdam, Paris,
                  Zurich, Oslo, Frankfurt, and Stockholm.
                </p>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock className="editorial-mosaic" delay={0.1} variant="right" distance={32}>
            <div className="editorial-mosaic-narrow image-hover-glow">
              <div className="image-tilt-shell">
                <EditorialImage
                  className="editorial-photo-shell"
                  image={editorialImages.heartClose}
                  motionPreset="from-left"
                  sizes="(max-width: 1024px) 100vw, 22vw"
                  strength={78}
                  tilt
                />
              </div>
            </div>
            <div className="editorial-mosaic-wide image-hover-glow">
              <div className="image-tilt-shell">
                <EditorialImage
                  className="editorial-photo-shell"
                  image={editorialImages.crowd}
                  motionPreset="from-right"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  strength={78}
                  tilt
                />
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="editorial-filmstrip">
          <RevealBlock className="editorial-film-panel editorial-film-panel--dark" variant="left" distance={44}>
            <p className="section-label">Presence</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
              Music, film, advocacy, and glamour now sit inside one unmistakable public identity.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              Veronica moves easily between performance, screen presence, and cultural
              advocacy. The home experience should carry that same range without losing
              elegance or restraint.
            </p>
          </RevealBlock>

          <RevealBlock
            className="editorial-film-panel editorial-film-panel--stacked image-hover-glow"
            delay={0.1}
            variant="scale"
          >
            <EditorialImage
              className="editorial-film-media"
              image={editorialImages.aerialCrowd}
              motionPreset="zoom-burst"
              sizes="(max-width: 1024px) 100vw, 34vw"
              strength={80}
            />
            <div className="editorial-film-copy">
              <p className="section-label text-white/78">Release Energy</p>
              <h3 className="display-title mt-4 max-w-2xl text-4xl text-white sm:text-5xl">
                Campaign imagery can be bold, romantic, and unmistakably her own.
              </h3>
            </div>
          </RevealBlock>

          <RevealBlock
            className="editorial-film-panel editorial-film-panel--double"
            delay={0.18}
            variant="right"
            distance={44}
          >
            <div className="editorial-film-double editorial-film-double--small image-hover-glow">
              <EditorialImage
                className="editorial-photo-shell"
                image={editorialImages.stage}
                motionPreset="settle-right"
                sizes="(max-width: 1024px) 100vw, 18vw"
                strength={68}
                tilt
              />
            </div>
            <div className="editorial-film-double editorial-film-double--large image-hover-glow">
              <EditorialImage
                className="editorial-photo-shell"
                image={editorialImages.furSeated}
                motionPreset="from-left"
                sizes="(max-width: 1024px) 100vw, 28vw"
                strength={78}
                tilt
              />
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <RevealBlock className="editorial-paper-panel" variant="left" distance={30}>
            <p className="section-label">Explore</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-[#1f1914] sm:text-5xl">
              Step deeper into the catalogue, the stage world, and the public archive.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#3a332d]">
              The strongest homepages do not stop at introduction. They guide people
              cleanly into music, live performance, and the verified story behind the artist.
            </p>
          </RevealBlock>

          <div className="grid gap-4 xl:grid-cols-3">
            {editorialPathways.map((item, index) => (
              <RevealBlock
                delay={0.08 + index * 0.08}
                distance={28}
                key={item.title}
                variant={index === 0 ? "left" : index === 1 ? "up" : "right"}
              >
                <Link className="editorial-route-link" href={item.href}>
                  <span className="editorial-route-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="section-label">{item.eyebrow}</p>
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
        <RevealBlock className="editorial-paper-panel">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="section-label">Official Image Archive</p>
              <h2 className="display-title mt-5 text-4xl text-[#1f1914] sm:text-5xl">
                Veronica&apos;s own portrait library now gives the brand a clearer signature.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#3a332d]">
                The world now moves through signature black portraiture, crystal couture,
                warm studio fashion, and scarlet campaign imagery. That range gives the
                homepage more authority, emotion, and memorability.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="primary-button" href="/media">
                Open Press Archive
              </Link>
              <Link className="secondary-button" href="/about">
                Read Biography
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {editorialCredits.map((item) => (
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
