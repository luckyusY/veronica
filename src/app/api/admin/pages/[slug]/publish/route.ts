import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { isCmsPageSlug, publishCmsPageDraft } from "@/lib/cms-store";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(_request: Request, context: RouteContext) {
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

    const item = await publishCmsPageDraft(slug, access.user.email);

    return NextResponse.json({ success: true, item, message: "Page published." });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to publish page.",
      },
      { status: 400 },
    );
  }
}
