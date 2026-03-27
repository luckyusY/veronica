import { NextResponse } from "next/server";
import {
  deleteAdminRecord,
  isAdminCollectionKey,
  updateAdminRecord,
} from "@/lib/admin-store";

type RouteContext = {
  params: Promise<{
    collection: string;
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { collection, id } = await context.params;

  if (!isAdminCollectionKey(collection)) {
    return NextResponse.json({ error: "Unknown admin collection." }, { status: 404 });
  }

  try {
    const payload = await request.json();
    const item = await updateAdminRecord(collection, id, payload);

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      {
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
    return NextResponse.json({ error: "Unknown admin collection." }, { status: 404 });
  }

  try {
    await deleteAdminRecord(collection, id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to delete admin record.",
      },
      { status: 400 },
    );
  }
}
