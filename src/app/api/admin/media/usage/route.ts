import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { getMediaUsageForPublicId } from "@/lib/db/media-usage";

export async function GET(request: Request) {
  try {
    const access = await requireAdminAccess(["owner", "content", "media"]);

    if (access.response) {
      return access.response;
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId")?.trim();

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "A publicId query parameter is required." },
        { status: 400 },
      );
    }

    const item = await getMediaUsageForPublicId(publicId);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load media usage.",
      },
      { status: 500 },
    );
  }
}
