import { NextResponse } from "next/server";
import { getCloudinary } from "@/lib/cloudinary";
import { createCmsMediaAsset } from "@/lib/cms-store";

export const runtime = "nodejs";

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  original_filename?: string;
};

function sanitizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    publicId?: string;
    resourceType?: "auto" | "image" | "video";
  },
) {
  const cloudinary = getCloudinary();

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: options.resourceType ?? "auto",
        overwrite: true,
        use_filename: !options.publicId,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result as CloudinaryUploadResult);
      },
    );

    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }

    const folder = sanitizeText(formData.get("folder")) || "veronica/uploads";
    const title = sanitizeText(formData.get("title")) || file.name.replace(/\.[^.]+$/, "");
    const alt = sanitizeText(formData.get("alt")) || title;
    const publicId = sanitizeText(formData.get("publicId")) || undefined;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await uploadToCloudinary(buffer, {
      folder,
      publicId,
      resourceType: "auto",
    });

    const asset = await createCmsMediaAsset({
      title,
      alt,
      publicId: uploaded.public_id,
      secureUrl: uploaded.secure_url,
      resourceType: uploaded.resource_type,
      format: uploaded.format,
      bytes: uploaded.bytes,
      width: uploaded.width,
      height: uploaded.height,
      duration: uploaded.duration,
    });

    return NextResponse.json({ item: asset }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to upload media.",
      },
      { status: 400 },
    );
  }
}
