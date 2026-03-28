import { z } from "zod";
import {
  cmsActionSchema,
  cmsCreditSchema,
  cmsHeroSlideSchema,
  cmsMediaItemSchema,
  cmsStatSchema,
  cmsTestimonialSchema,
  cmsTextCardSchema,
} from "@/lib/schemas/cms-shared";

export const homePageSchema = z.object({
  hero: z.object({
    verticalLabel: z.string().trim().min(1, "Hero vertical label is required."),
    headlineTop: z.string().trim().min(1, "Hero heading is required."),
    headlineLines: z
      .array(z.string().trim().min(1, "Headline line is required."))
      .min(1, "Add at least one headline line."),
    primaryAction: cmsActionSchema,
    secondaryAction: cmsActionSchema,
    slides: z.array(cmsHeroSlideSchema).min(1, "Add at least one hero slide."),
  }),
  intro: z.object({
    eyebrow: z.string().trim().min(1, "Intro eyebrow is required."),
    title: z.string().trim().min(1, "Intro title is required."),
    paragraphs: z
      .array(z.string().trim().min(1, "Intro paragraph is required."))
      .min(1, "Add at least one intro paragraph."),
    image: cmsMediaItemSchema,
    stats: z.array(cmsStatSchema).min(1, "Add at least one intro stat."),
  }),
  visualChapters: z.object({
    eyebrow: z.string().trim().min(1, "Visual chapters eyebrow is required."),
    title: z.string().trim().min(1, "Visual chapters title is required."),
    description: z.string().trim().min(1, "Visual chapters description is required."),
    chips: z
      .array(z.string().trim().min(1, "Chip label is required."))
      .min(1, "Add at least one chip."),
    items: z
      .array(
        z.object({
          title: z.string().trim().min(1, "Item title is required."),
          era: z.string().trim().min(1, "Era label is required."),
          note: z.string().trim().min(1, "Item note is required."),
          image: cmsMediaItemSchema,
        }),
      )
      .min(1, "Add at least one visual chapter item."),
  }),
  testimonials: z.object({
    eyebrow: z.string().trim().min(1, "Testimonials eyebrow is required."),
    title: z.string().trim().min(1, "Testimonials title is required."),
    description: z.string().trim().min(1, "Testimonials description is required."),
    items: z.array(cmsTestimonialSchema).min(1, "Add at least one testimonial."),
  }),
  heritage: z.object({
    eyebrow: z.string().trim().min(1, "Heritage eyebrow is required."),
    title: z.string().trim().min(1, "Heritage title is required."),
    description: z.string().trim().min(1, "Heritage description is required."),
    tags: z
      .array(z.string().trim().min(1, "Tag is required."))
      .min(1, "Add at least one tag."),
    image: cmsMediaItemSchema,
  }),
  rise: z.object({
    eyebrow: z.string().trim().min(1, "Rise eyebrow is required."),
    title: z.string().trim().min(1, "Rise title is required."),
    description: z.string().trim().min(1, "Rise description is required."),
    nationalNote: z.string().trim().min(1, "National note is required."),
    internationalNote: z.string().trim().min(1, "International note is required."),
    images: z.array(cmsMediaItemSchema).min(1, "Add at least one rise image."),
  }),
  campaign: z.object({
    eyebrow: z.string().trim().min(1, "Campaign eyebrow is required."),
    title: z.string().trim().min(1, "Campaign title is required."),
    description: z.string().trim().min(1, "Campaign description is required."),
    featureImage: cmsMediaItemSchema,
    supportingImages: z
      .array(cmsMediaItemSchema)
      .min(1, "Add at least one supporting campaign image."),
  }),
  pathways: z.object({
    eyebrow: z.string().trim().min(1, "Pathways eyebrow is required."),
    title: z.string().trim().min(1, "Pathways title is required."),
    description: z.string().trim().min(1, "Pathways description is required."),
    items: z.array(cmsTextCardSchema).min(1, "Add at least one pathway item."),
  }),
  archive: z.object({
    eyebrow: z.string().trim().min(1, "Archive eyebrow is required."),
    title: z.string().trim().min(1, "Archive title is required."),
    description: z.string().trim().min(1, "Archive description is required."),
    primaryAction: cmsActionSchema,
    secondaryAction: cmsActionSchema,
    credits: z.array(cmsCreditSchema).min(1, "Add at least one archive credit."),
  }),
});
