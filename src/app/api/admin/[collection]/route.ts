import { NextResponse } from "next/server";
import {
  createAdminRecord,
  ensureAdminSeedData,
  isAdminCollectionKey,
  listAdminCollection,
} from "@/lib/admin-store";

type RouteContext = {
  params: Promise<{
    collection: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { collection } = await context.params;

  if (!isAdminCollectionKey(collection)) {
    return NextResponse.json({ error: "Unknown admin collection." }, { status: 404 });
  }

  await ensureAdminSeedData();
  const items = await listAdminCollection(collection);

  return NextResponse.json({ items });
}

export async function POST(request: Request, context: RouteContext) {
  const { collection } = await context.params;

  if (!isAdminCollectionKey(collection)) {
    return NextResponse.json({ error: "Unknown admin collection." }, { status: 404 });
  }

  try {
    const payload = await request.json();
    const item = await createAdminRecord(collection, payload);

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create admin record.",
      },
      { status: 400 },
    );
  }
}
