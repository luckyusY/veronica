import { NextResponse } from "next/server";
import { listCmsPages } from "@/lib/cms-store";

export async function GET() {
  try {
    const items = await listCmsPages();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load pages.",
      },
      { status: 500 },
    );
  }
}
