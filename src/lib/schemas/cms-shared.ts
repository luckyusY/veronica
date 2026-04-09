import { z } from "zod";

function requiredText(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`);
}

function optionalText() {
  return z.string().trim().optional();
}

export const linkTargetSchema = z
  .string()
  .trim()
  .min(1, "Link is required.")
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("#") ||
      /^https?:\/\//i.test(value) ||
      /^mailto:/i.test(value) ||
      /^tel:/i.test(value),
    "Use a relative path like /about or a valid absolute URL.",
  );

export const cmsMediaItemSchema = z.object({
  url: requiredText("Media URL"),
  alt: requiredText("Alt text"),
  publicId: optionalText(),
  resourceType: z.enum(["image", "video"]).optional(),
  position: optionalText(),
  label: optionalText(),
  placeholderBase: optionalText(),
  placeholderHighlight: optionalText(),
});

export const cmsActionSchema = z.object({
  label: requiredText("Action label"),
  href: linkTargetSchema,
});

export const cmsHeroSlideSchema = z.object({
  eyebrow: requiredText("Slide eyebrow"),
  title: requiredText("Slide title"),
  copy: requiredText("Slide copy"),
  stat: requiredText("Slide stat"),
  accent: requiredText("Slide accent"),
  image: cmsMediaItemSchema,
});

export const cmsStatSchema = z.object({
  value: requiredText("Stat value"),
  label: requiredText("Stat label"),
  detail: requiredText("Stat detail"),
});

export const cmsSignalSchema = z.object({
  label: requiredText("Signal label"),
  title: requiredText("Signal title"),
  detail: requiredText("Signal detail"),
});

export const cmsTextCardSchema = z.object({
  title: requiredText("Card title"),
  description: requiredText("Card description"),
  accent: optionalText(),
  href: linkTargetSchema.optional(),
  note: optionalText(),
});

export const cmsCreditSchema = z.object({
  label: requiredText("Credit label"),
  note: requiredText("Credit note"),
});

export const cmsTestimonialSchema = z.object({
  quote: requiredText("Quote"),
  name: requiredText("Name"),
  role: requiredText("Role"),
});

export const standardHeroContentSchema = z.object({
  eyebrow: requiredText("Hero eyebrow"),
  title: requiredText("Hero title"),
  description: requiredText("Hero description"),
  highlightWords: z.array(requiredText("Highlight word")).optional(),
  primaryCta: cmsActionSchema.optional(),
  secondaryCta: cmsActionSchema.optional(),
  image: cmsMediaItemSchema,
  imageMotionPreset: z
    .enum(["vertical", "from-left", "from-right", "settle-left", "settle-right"])
    .optional(),
  imageLabel: optionalText(),
  noteTitle: optionalText(),
  noteText: optionalText(),
});

const standardSplitSectionSchema = z.object({
  id: requiredText("Section ID"),
  type: z.literal("split"),
  theme: z.enum(["paper", "dark"]),
  eyebrow: requiredText("Section eyebrow"),
  title: requiredText("Section title"),
  description: requiredText("Section description"),
  body: z.array(requiredText("Body paragraph")).optional(),
  image: cmsMediaItemSchema,
  imageSide: z.enum(["left", "right"]),
  imageMotionPreset: z
    .enum(["vertical", "from-left", "from-right", "settle-left", "settle-right"])
    .optional(),
  cards: z.array(cmsTextCardSchema).optional(),
  cardVariant: z.enum(["note", "route", "release", "dark-note"]).optional(),
  tallImage: z.boolean().optional(),
});

const standardCardsSectionSchema = z.object({
  id: requiredText("Section ID"),
  type: z.literal("cards"),
  theme: z.enum(["paper", "dark"]),
  eyebrow: requiredText("Section eyebrow"),
  title: requiredText("Section title"),
  description: optionalText(),
  items: z.array(cmsTextCardSchema).min(1, "Add at least one card."),
  columns: z.union([z.literal(2), z.literal(3)]).optional(),
  cardVariant: z.enum(["note", "route", "release", "dark-note"]).optional(),
});

const standardBannerSectionSchema = z.object({
  id: requiredText("Section ID"),
  type: z.literal("banner"),
  theme: z.enum(["dark", "light"]),
  eyebrow: requiredText("Section eyebrow"),
  title: requiredText("Section title"),
  description: optionalText(),
  image: cmsMediaItemSchema,
  imageMotionPreset: z
    .enum([
      "vertical",
      "from-left",
      "from-right",
      "settle-left",
      "settle-right",
      "zoom-burst",
    ])
    .optional(),
});

const standardTimelineSectionSchema = z.object({
  id: requiredText("Section ID"),
  type: z.literal("timeline"),
  theme: z.enum(["paper", "dark"]),
  eyebrow: requiredText("Section eyebrow"),
  title: requiredText("Section title"),
  description: optionalText(),
  items: z.array(requiredText("Timeline item")).min(1, "Add at least one timeline item."),
});

const standardGallerySectionSchema = z.object({
  id: requiredText("Section ID"),
  type: z.literal("gallery"),
  theme: z.enum(["paper", "dark"]),
  eyebrow: requiredText("Section eyebrow"),
  title: requiredText("Section title"),
  description: optionalText(),
  items: z.array(cmsMediaItemSchema),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
});

export const standardSectionSchema = z.discriminatedUnion("type", [
  standardSplitSectionSchema,
  standardCardsSectionSchema,
  standardBannerSectionSchema,
  standardTimelineSectionSchema,
  standardGallerySectionSchema,
]);

export const standardPageSchema = z.object({
  hero: standardHeroContentSchema,
  sections: z.array(standardSectionSchema).min(1, "Add at least one content section."),
});

export const cmsPageMetadataSchema = z.object({
  name: requiredText("Page name"),
  summary: requiredText("Page summary"),
});

export function createCmsPageEditorSchema<TSchema extends z.ZodTypeAny>(contentSchema: TSchema) {
  return cmsPageMetadataSchema.extend({
    content: contentSchema,
  });
}

export type CmsPageEditorSchema = ReturnType<typeof createCmsPageEditorSchema>;
