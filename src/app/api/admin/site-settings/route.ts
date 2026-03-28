import { NextResponse } from "next/server";
import { getCmsSiteSettings, updateCmsSiteSettings } from "@/lib/cms-store";

export async function GET() {
  try {
    const item = await getCmsSiteSettings();
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load site settings.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const item = await updateCmsSiteSettings(payload);

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to update site settings.",
      },
      { status: 400 },
    );
  }
}
