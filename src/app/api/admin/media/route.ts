import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { getMediaUsageForPublicId, listMediaUsageIndex } from "@/lib/db/media-usage";
import { deleteCmsMediaAsset, getCmsMediaAsset, listCmsMediaAssets } from "@/lib/cms-store";

export async function GET() {
  try {
    const access = await requireAdminAccess(["owner", "content", "media"]);

    if (access.response) {
      return access.response;
    }

    const [items, usage] = await Promise.all([listCmsMediaAssets(), listMediaUsageIndex()]);
    return NextResponse.json({ success: true, items, usage });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load media assets.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const access = await requireAdminAccess(["owner", "content", "media"]);

    if (access.response) {
      return access.response;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "A media asset id is required." },
        { status: 400 },
      );
    }

    const existingAsset = await getCmsMediaAsset(id);

    if (!existingAsset) {
      return NextResponse.json(
        { success: false, error: "Media asset not found." },
        { status: 404 },
      );
    }

    const usage = await getMediaUsageForPublicId(existingAsset.publicId);

    await deleteCloudinaryAsset({
      publicId: existingAsset.publicId,
      resourceType: existingAsset.resourceType,
    });

    const deletedAsset = await deleteCmsMediaAsset(id);

    return NextResponse.json({
      success: true,
      item: deletedAsset,
      usage,
      message: usage?.usedIn.length
        ? "Asset deleted. Review the referenced sections and replace the missing media."
        : "Asset deleted.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to delete media asset.",
      },
      { status: 400 },
    );
  }
}
