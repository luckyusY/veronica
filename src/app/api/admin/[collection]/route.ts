import { NextResponse } from "next/server";
import { type AdminRole } from "@/lib/admin-access";
import { requireAdminAccess } from "@/lib/admin-guard";
import {
  createAdminRecord,
  ensureAdminSeedData,
  isAdminCollectionKey,
  listAdminCollection,
} from "@/lib/admin-store";
import { type AdminCollectionKey } from "@/lib/admin-schema";

type RouteContext = {
  params: Promise<{
    collection: string;
  }>;
};

function getAllowedRoles(collection: AdminCollectionKey): readonly AdminRole[] {
  switch (collection) {
    case "events":
    case "inquiries":
      return ["owner", "bookings"];
    case "releases":
    case "products":
      return ["owner"];
    default:
      return ["owner"];
  }
}

export async function GET(_request: Request, context: RouteContext) {
  const { collection } = await context.params;

  if (!isAdminCollectionKey(collection)) {
    return NextResponse.json(
      { success: false, error: "Unknown admin collection." },
      { status: 404 },
    );
  }

  const access = await requireAdminAccess(getAllowedRoles(collection));

  if (access.response) {
    return access.response;
  }

  await ensureAdminSeedData();
  const items = await listAdminCollection(collection);

  return NextResponse.json({ success: true, items });
}

export async function POST(request: Request, context: RouteContext) {
  const { collection } = await context.params;

  if (!isAdminCollectionKey(collection)) {
    return NextResponse.json(
      { success: false, error: "Unknown admin collection." },
      { status: 404 },
    );
  }

  try {
    const access = await requireAdminAccess(getAllowedRoles(collection));

    if (access.response) {
      return access.response;
    }

    const payload = await request.json();
    const item = await createAdminRecord(collection, payload);

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unable to create admin record.",
      },
      { status: 400 },
    );
  }
}
