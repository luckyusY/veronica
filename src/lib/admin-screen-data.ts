import "server-only";

import { getAdminDashboardData } from "@/lib/admin-store";
import { getCloudinaryStatus } from "@/lib/cloudinary";
import { getCmsSiteSettings, listCmsMediaAssets, listCmsPages } from "@/lib/cms-store";
import { pingDatabase } from "@/lib/mongodb";

export async function getDatabaseStatus() {
  try {
    await pingDatabase();

    return {
      tone: "ok" as const,
      label: "MongoDB connected",
      detail:
        "Admin records are live and this control room is writing directly to your production database.",
    };
  } catch {
    return {
      tone: "warn" as const,
      label: "Database unavailable",
      detail:
        "The admin layout is ready, but MongoDB could not be reached. Check your environment variables and cluster access before publishing changes.",
    };
  }
}

export async function getAdminOverviewData() {
  const [{ counts }, databaseStatus, cmsPages, mediaAssets] = await Promise.all([
    getAdminDashboardData(),
    getDatabaseStatus(),
    listCmsPages(),
    listCmsMediaAssets(),
  ]);

  return {
    counts,
    cmsPages,
    mediaAssets,
    cloudinaryReady: getCloudinaryStatus(),
    databaseStatus,
  };
}

export async function getAdminWorkspaceData() {
  const [cmsPages, siteSettings, mediaAssets] = await Promise.all([
    listCmsPages(),
    getCmsSiteSettings(),
    listCmsMediaAssets(),
  ]);

  return {
    cmsPages,
    siteSettings,
    mediaAssets,
    cloudinaryReady: getCloudinaryStatus(),
  };
}

export async function getAdminOperationsData() {
  const [{ counts, sections }, databaseStatus] = await Promise.all([
    getAdminDashboardData(),
    getDatabaseStatus(),
  ]);

  return {
    counts,
    sections,
    databaseStatus,
  };
}
