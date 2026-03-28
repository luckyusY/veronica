import { NextResponse } from "next/server";
import { isCmsPageSlug, updateCmsPage } from "@/lib/cms-store";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isCmsPageSlug(slug)) {
    return NextResponse.json({ error: "Unknown CMS page." }, { status: 404 });
  }

  try {
    const payload = await request.json();
    const item = await updateCmsPage(slug, payload);

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to update page.",
      },
      { status: 400 },
    );
  }
}
