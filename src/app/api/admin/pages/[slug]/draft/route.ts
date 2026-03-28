import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { isCmsPageSlug, saveCmsPageDraft } from "@/lib/cms-store";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isCmsPageSlug(slug)) {
    return NextResponse.json(
      { success: false, error: "Unknown CMS page." },
      { status: 404 },
    );
  }

  try {
    const access = await requireAdminAccess(["owner", "content"]);

    if (access.response) {
      return access.response;
    }

    const payload = await request.json();
    const item = await saveCmsPageDraft(slug, payload, access.user.email);

    return NextResponse.json({ success: true, item, message: "Draft saved." });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to save page draft.",
      },
      { status: 400 },
    );
  }
}
