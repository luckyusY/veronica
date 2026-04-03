import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/mongodb";

export async function GET() {
  const result = await pingDatabase();

  if (result.ok) {
    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json(
    {
      status: "error",
      database: "disconnected",
      message: result.error,
    },
    { status: 500 },
  );
}
