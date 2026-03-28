import type {
  CmsPageContentMap,
  CmsPageDocument,
  CmsPageWorkspaceDocument,
  CmsPageSlug,
} from "@/lib/cms-types";
import { defaultHomePageContent } from "@/lib/cms-defaults/home";
import {
  defaultContactPageContent,
  defaultCollaborationsPageContent,
  defaultAboutPageContent,
  defaultEventsPageContent,
  defaultMediaPageContent,
  defaultMusicPageContent,
  defaultShopPageContent,
} from "@/lib/cms-defaults/pages";
import { defaultPageSummaries } from "@/lib/cms-defaults/shared";

export { defaultMediaLibrary, defaultSiteSettings, defaultVideoLibrary } from "@/lib/cms-defaults/shared";

export const defaultCmsPageContent: CmsPageContentMap = {
  home: defaultHomePageContent,
  about: defaultAboutPageContent,
  music: defaultMusicPageContent,
  events: defaultEventsPageContent,
  shop: defaultShopPageContent,
  collaborations: defaultCollaborationsPageContent,
  media: defaultMediaPageContent,
  contact: defaultContactPageContent,
};

export function buildDefaultCmsPage<TSlug extends CmsPageSlug>(
  slug: TSlug,
): CmsPageDocument<CmsPageContentMap[TSlug]> {
  const summary = defaultPageSummaries[slug];

  return {
    slug,
    name: summary.name,
    route: summary.route,
    summary: summary.summary,
    content: defaultCmsPageContent[slug],
    updatedAt: new Date(0).toISOString(),
  };
}

export function buildDefaultCmsPageWorkspace<TSlug extends CmsPageSlug>(
  slug: TSlug,
): CmsPageWorkspaceDocument<CmsPageContentMap[TSlug]> {
  const page = buildDefaultCmsPage(slug);

  return {
    ...page,
    published: {
      content: page.content,
      publishedAt: null,
      publishedBy: null,
    },
    draft: {
      content: null,
      savedAt: null,
      savedBy: null,
    },
    status: "never-published",
  };
}
