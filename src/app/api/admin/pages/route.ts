import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { listCmsPages } from "@/lib/cms-store";

export async function GET() {
  try {
    const access = await requireAdminAccess(["owner", "content"]);

    if (access.response) {
      return access.response;
    }

    const items = await listCmsPages();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load pages.",
      },
      { status: 500 },
    );
  }
}
