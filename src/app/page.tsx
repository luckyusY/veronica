import Link from "next/link";
import {
  AnimatedEyebrow,
  AnimatedHeadline,
  AnimatedParagraph,
  RevealBlock,
} from "@/components/animated-text";
import { EditorialImage } from "@/components/editorial-image";
import {
  editorialCredits,
  editorialImages,
  editorialIntro,
  editorialSections,
  editorialSignals,
  editorialStoryNotes,
} from "@/lib/editorial-home";

export default function Home() {
  return (
    <main className="editorial-home pb-16 sm:pb-20">
      <section className="section-shell py-5 sm:py-7">
        <RevealBlock className="editorial-hero" variant="scale">
          <EditorialImage
            className="editorial-hero-media"
            image={editorialImages.hero}
            priority
            sizes="100vw"
            strength={84}
          />

          <div className="editorial-hero-content">
            <div className="max-w-4xl">
              <AnimatedEyebrow>Official homepage</AnimatedEyebrow>
              <AnimatedHeadline
                as="h1"
                className="display-title mt-5 max-w-5xl text-5xl text-balance text-white sm:text-6xl xl:text-7xl"
                highlightWords={["story", "legacy", "presence"]}
                text="A homepage led by story, legacy, and stage presence."
              />
              <AnimatedParagraph
                className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg"
                delay={0.14}
                text="This redesign shifts the homepage away from card-heavy layouts and toward an editorial rhythm inspired by luxury artist biography pages: larger photography, warmer contrast, restrained typography, and more composed storytelling."
              />

              <RevealBlock className="mt-7 flex flex-wrap gap-3" delay={0.2}>
                <Link className="primary-button" href="/about">
                  Read Biography
                </Link>
                <Link className="secondary-button" href="/music">
                  Enter Music Archive
                </Link>
              </RevealBlock>
            </div>

            <RevealBlock className="editorial-side-note" delay={0.24}>
              <p className="section-label">Concept Direction</p>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Placeholder editorial photography is being used for this pass so
                we can judge the mood and structure before replacing it with
                real Veronica imagery.
              </p>
              <div className="luxury-divider my-5" />
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                Minimal. Luxury. High contrast.
              </p>
            </RevealBlock>
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <RevealBlock
            className="editorial-photo-block editorial-photo-block--tall"
            variant="left"
          >
            <EditorialImage
              className="editorial-photo-shell"
              image={editorialImages.cliff}
              sizes="(max-width: 1024px) 100vw, 40vw"
              strength={62}
            />
          </RevealBlock>

          <RevealBlock className="editorial-paper-panel" delay={0.08} variant="right">
            <p className="section-label">Official Biography</p>
            <h2 className="display-title mt-5 max-w-4xl text-4xl text-[#1f1914] sm:text-5xl">
              Veronica Adane should feel presented like an artist of lasting cultural weight.
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
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#6d5738]">
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
        <RevealBlock className="editorial-quote-banner" variant="scale">
          <EditorialImage
            className="editorial-quote-media"
            image={editorialImages.stage}
            sizes="100vw"
            strength={76}
          />
          <div className="editorial-quote-copy">
            <p className="section-label text-white/80">Story Rhythm</p>
            <h2 className="display-title mt-4 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl">
              The homepage should move like a visual biography, not like a product landing page.
            </h2>
          </div>
        </RevealBlock>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-2">
          <RevealBlock className="editorial-dark-panel" variant="left">
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

          <RevealBlock className="editorial-photo-block" delay={0.08} variant="right">
            <EditorialImage
              className="editorial-photo-shell"
              image={editorialImages.microphone}
              sizes="(max-width: 1024px) 100vw, 50vw"
              strength={58}
            />
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <RevealBlock className="editorial-paper-panel" variant="left">
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
                  Addis Ababa, Gondar, Hawassa, Harar, Dire Dawa, Bahir Dar and beyond.
                </p>
              </div>
              <div className="editorial-note">
                <p className="section-label">Diaspora</p>
                <p className="mt-3 text-sm leading-7 text-[#4b4138]">
                  Atlanta, DMV, Los Angeles, Seattle, Denver, Oakland, Amsterdam, Paris, Frankfurt.
                </p>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock className="editorial-mosaic" delay={0.08} variant="right">
            <div className="editorial-mosaic-narrow">
              <EditorialImage
                className="editorial-photo-shell"
                image={editorialImages.crowd}
                sizes="(max-width: 1024px) 100vw, 22vw"
                strength={54}
              />
            </div>
            <div className="editorial-mosaic-wide">
              <EditorialImage
                className="editorial-photo-shell"
                image={editorialImages.aerialCrowd}
                sizes="(max-width: 1024px) 100vw, 38vw"
                strength={54}
              />
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="editorial-filmstrip">
          <RevealBlock className="editorial-film-panel editorial-film-panel--dark" variant="left">
            <p className="section-label">Image rhythm</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl text-white sm:text-5xl">
              What makes the reference page memorable is not fancy image delivery. It is sequencing.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              Large panels arrive with different motion languages, text sits
              inside the image flow instead of underneath it, and every frame
              feels like a chapter instead of a card.
            </p>
          </RevealBlock>

          <RevealBlock
            className="editorial-film-panel editorial-film-panel--stacked"
            delay={0.08}
            variant="scale"
          >
            <EditorialImage
              className="editorial-film-media"
              image={editorialImages.stage}
              sizes="(max-width: 1024px) 100vw, 34vw"
              strength={60}
            />
            <div className="editorial-film-copy">
              <p className="section-label text-white/78">Stage-led scene</p>
              <h3 className="display-title mt-4 max-w-2xl text-4xl text-white sm:text-5xl">
                A homepage can speak through photography before the user reads a line.
              </h3>
            </div>
          </RevealBlock>

          <RevealBlock
            className="editorial-film-panel editorial-film-panel--double"
            delay={0.12}
            variant="right"
          >
            <div className="editorial-film-double editorial-film-double--small">
              <EditorialImage
                className="editorial-photo-shell"
                image={editorialImages.hero}
                sizes="(max-width: 1024px) 100vw, 18vw"
                strength={48}
              />
            </div>
            <div className="editorial-film-double editorial-film-double--large">
              <EditorialImage
                className="editorial-photo-shell"
                image={editorialImages.crowd}
                sizes="(max-width: 1024px) 100vw, 28vw"
                strength={56}
              />
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 lg:grid-cols-3">
          {editorialSections.map((item, index) => (
            <RevealBlock
              className={index === 1 ? "editorial-dark-panel" : "editorial-paper-panel"}
              delay={0.08 + index * 0.06}
              variant={index === 0 ? "left" : index === 1 ? "scale" : "right"}
              key={item.title}
            >
              <p className="section-label">{item.title}</p>
              <h2
                className={`display-title mt-5 text-4xl sm:text-5xl ${
                  index === 1 ? "text-white" : "text-[#1f1914]"
                }`}
              >
                {item.title}
              </h2>
              <p
                className={`mt-6 text-base leading-8 ${
                  index === 1 ? "text-white/72" : "text-[#3a332d]"
                }`}
              >
                {item.description}
              </p>
            </RevealBlock>
          ))}
        </div>
      </section>

      <section className="section-shell py-10">
        <RevealBlock className="editorial-paper-panel">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="section-label">Placeholder Credits</p>
              <h2 className="display-title mt-5 text-4xl text-[#1f1914] sm:text-5xl">
                Open photography is being used for concept testing before real artist imagery is introduced.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#3a332d]">
                The current homepage is intentionally being tested with open
                placeholder photography to shape the editorial rhythm, image
                density, and visual tone before we replace these frames with
                Veronica&apos;s official portraits, performance photography, and
                campaign assets.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="primary-button" href="/media">
                Open Press Archive
              </Link>
              <Link className="secondary-button" href="/admin">
                Review Admin
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {editorialCredits.map((item) => (
              <a
                className="editorial-credit-link"
                href={item.source}
                key={item.source}
                rel="noreferrer"
                target="_blank"
              >
                <span>{item.label}</span>
                <span className="text-[#7c6545]">Pexels</span>
              </a>
            ))}
          </div>
        </RevealBlock>
      </section>
    </main>
  );
}
