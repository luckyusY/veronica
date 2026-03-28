import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { getCmsSiteSettings, updateCmsSiteSettings } from "@/lib/cms-store";

export async function GET() {
  try {
    const access = await requireAdminAccess(["owner", "content"]);

    if (access.response) {
      return access.response;
    }

    const item = await getCmsSiteSettings();
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load site settings.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await requireAdminAccess(["owner", "content"]);

    if (access.response) {
      return access.response;
    }

    const payload = await request.json();
    const item = await updateCmsSiteSettings(payload);

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unable to update site settings.",
      },
      { status: 400 },
    );
  }
}
