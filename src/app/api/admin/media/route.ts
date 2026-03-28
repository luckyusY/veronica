import { NextResponse } from "next/server";
import { listCmsMediaAssets } from "@/lib/cms-store";

export async function GET() {
  try {
    const items = await listCmsMediaAssets();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load media assets.",
      },
      { status: 500 },
    );
  }
}
