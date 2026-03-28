import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { getCmsWorkspacePage, isCmsPageSlug, saveCmsPageDraft } from "@/lib/cms-store";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function unknownPageResponse() {
  return NextResponse.json(
    { success: false, error: "Unknown CMS page." },
    { status: 404 },
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isCmsPageSlug(slug)) {
    return unknownPageResponse();
  }

  try {
    const access = await requireAdminAccess(["owner", "content"]);

    if (access.response) {
      return access.response;
    }

    const item = await getCmsWorkspacePage(slug);
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load page workspace.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isCmsPageSlug(slug)) {
    return unknownPageResponse();
  }

  try {
    const access = await requireAdminAccess(["owner", "content"]);

    if (access.response) {
      return access.response;
    }

    const payload = await request.json();
    const item = await saveCmsPageDraft(slug, payload, access.user.email);

    return NextResponse.json({ success: true, item });
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
