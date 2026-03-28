import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { getCloudinary } from "@/lib/cloudinary";
import {
  bundledCloudinaryAssets,
  getBundledCloudinaryAssetPath,
} from "@/lib/cloudinary-library";
import { upsertCmsMediaAsset } from "@/lib/cms-store";

export const runtime = "nodejs";

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
};

async function uploadBundledAsset(asset: (typeof bundledCloudinaryAssets)[number]) {
  const filePath = getBundledCloudinaryAssetPath(asset.filename);
  await fs.access(filePath);

  const cloudinary = getCloudinary();
  const uploaded = await cloudinary.uploader.upload(filePath, {
    public_id: asset.publicId,
    overwrite: true,
    resource_type: asset.resourceType,
  });

  const result = uploaded as CloudinaryUploadResult;

  return upsertCmsMediaAsset({
    title: asset.title,
    alt: asset.alt,
    publicId: result.public_id,
    secureUrl: result.secure_url,
    resourceType: result.resource_type,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
    duration: result.duration,
  });
}

export async function POST() {
  try {
    const access = await requireAdminAccess(["owner", "content", "media"]);

    if (access.response) {
      return access.response;
    }

    const synced = [];
    const skipped: Array<{ filename: string; reason: string }> = [];

    for (const asset of bundledCloudinaryAssets) {
      try {
        synced.push(await uploadBundledAsset(asset));
      } catch (error) {
        const reason =
          error instanceof Error && "code" in error && error.code === "ENOENT"
            ? "Local source file is not available in this environment."
            : error instanceof Error
              ? error.message
              : "Unknown upload error.";

        skipped.push({
          filename: asset.filename,
          reason,
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: synced.length,
      items: synced,
      skipped,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to sync bundled media.",
      },
      { status: 500 },
    );
  }
}
