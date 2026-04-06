import { NextResponse } from "next/server";
import { createAdminRecord } from "@/lib/admin-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, org, type, message } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    const dateLabel = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    await createAdminRecord("inquiries", {
      title: `${type || "Collaboration"} — ${name.trim()}`,
      subtitle: org?.trim() ? `${org.trim()} / ${email.trim()}` : email.trim(),
      status: "Open",
      highlight: dateLabel,
      link: "",
      notes: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to submit inquiry. Please try again." },
      { status: 500 },
    );
  }
}
