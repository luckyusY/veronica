import { NextResponse } from "next/server";
import { getCmsPage, isCmsPageSlug } from "@/lib/cms-store";

type RouteContext = {
  params: Promise<{
    route: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { route } = await context.params;

  if (!isCmsPageSlug(route)) {
    return NextResponse.json(
      { success: false, error: "Unknown page route." },
      { status: 404 },
    );
  }

  try {
    const item = await getCmsPage(route);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load page.",
      },
      { status: 500 },
    );
  }
}
