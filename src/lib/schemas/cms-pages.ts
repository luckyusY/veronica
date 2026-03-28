import type { CmsPageSlug } from "@/lib/cms-types";
import { aboutPageSchema } from "@/lib/schemas/about-page";
import { collaborationsPageSchema } from "@/lib/schemas/collaborations-page";
import { contactPageSchema } from "@/lib/schemas/contact-page";
import { createCmsPageEditorSchema } from "@/lib/schemas/cms-shared";
import { eventsPageSchema } from "@/lib/schemas/events-page";
import { homePageSchema } from "@/lib/schemas/home-page";
import { mediaPageSchema } from "@/lib/schemas/media-page";
import { musicPageSchema } from "@/lib/schemas/music-page";
import { shopPageSchema } from "@/lib/schemas/shop-page";

export const cmsPageContentSchemas = {
  home: homePageSchema,
  about: aboutPageSchema,
  music: musicPageSchema,
  events: eventsPageSchema,
  shop: shopPageSchema,
  collaborations: collaborationsPageSchema,
  media: mediaPageSchema,
  contact: contactPageSchema,
} as const satisfies Record<CmsPageSlug, (typeof homePageSchema) | (typeof aboutPageSchema)>;

export const cmsPageEditorSchemas = {
  home: createCmsPageEditorSchema(homePageSchema),
  about: createCmsPageEditorSchema(aboutPageSchema),
  music: createCmsPageEditorSchema(musicPageSchema),
  events: createCmsPageEditorSchema(eventsPageSchema),
  shop: createCmsPageEditorSchema(shopPageSchema),
  collaborations: createCmsPageEditorSchema(collaborationsPageSchema),
  media: createCmsPageEditorSchema(mediaPageSchema),
  contact: createCmsPageEditorSchema(contactPageSchema),
} as const;

export function getCmsPageEditorSchema(slug: CmsPageSlug) {
  return cmsPageEditorSchemas[slug];
}

export function getCmsPageContentSchema(slug: CmsPageSlug) {
  return cmsPageContentSchemas[slug];
}
