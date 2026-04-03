"use client";

import type {
  CmsMediaAsset,
  CmsPageDocument,
  CmsSiteSettings,
} from "@/lib/cms-types";
import { PageEditor } from "./admin/page-editor";
import { SiteSettingsEditor } from "./admin/site-settings-editor";
import { MediaBrowser } from "./admin/media-browser";

export type AdminWorkspaceProps = {
  cloudinaryReady: boolean;
  initialMediaAssets: CmsMediaAsset[];
  initialPages: CmsPageDocument[];
  initialSiteSettings: CmsSiteSettings;
};

export function AdminWorkspace({
  cloudinaryReady,
  initialMediaAssets,
  initialPages,
  initialSiteSettings,
}: AdminWorkspaceProps) {
  return (
    <div className="admin-stack">
      <PageEditor initialPages={initialPages} />
      <SiteSettingsEditor initialSiteSettings={initialSiteSettings} />
      <MediaBrowser
        cloudinaryReady={cloudinaryReady}
        initialMediaAssets={initialMediaAssets}
      />
    </div>
  );
}
