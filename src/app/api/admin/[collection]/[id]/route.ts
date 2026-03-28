import { NextResponse } from "next/server";
import { type AdminRole } from "@/lib/admin-access";
import { requireAdminAccess } from "@/lib/admin-guard";
import {
  deleteAdminRecord,
  isAdminCollectionKey,
  updateAdminRecord,
} from "@/lib/admin-store";
import { type AdminCollectionKey } from "@/lib/admin-schema";

type RouteContext = {
  params: Promise<{
    collection: string;
    id: string;
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

export async function PATCH(request: Request, context: RouteContext) {
  const { collection, id } = await context.params;

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
    const item = await updateAdminRecord(collection, id, payload);

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unable to update admin record.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { collection, id } = await context.params;

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

    await deleteAdminRecord(collection, id);

    return NextResponse.json({ success: true, ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unable to delete admin record.",
      },
      { status: 400 },
    );
  }
}
