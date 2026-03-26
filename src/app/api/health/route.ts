import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await pingDatabase();

    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message:
          error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 },
    );
  }
}
