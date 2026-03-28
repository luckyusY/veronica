import "server-only";

import path from "node:path";

export type BundledCloudinaryAsset = {
  filename: string;
  publicId: string;
  resourceType: "image" | "video";
  title: string;
  alt: string;
};

export const bundledCloudinaryAssets: readonly BundledCloudinaryAsset[] = [
  {
    filename: "IMG_8027.JPG.jpeg",
    publicId: "veronica/images/img_8027",
    resourceType: "image",
    title: "Classic close-up portrait",
    alt: "Close portrait of Veronica Adane in a black editorial look with feather trim.",
  },
  {
    filename: "IMG_8029.JPG.jpeg",
    publicId: "veronica/images/img_8029",
    resourceType: "image",
    title: "Signature black gown portrait",
    alt: "Veronica Adane standing in a black off-shoulder gown against a clean studio backdrop.",
  },
  {
    filename: "IMG_8077.JPG.jpeg",
    publicId: "veronica/images/img_8077",
    resourceType: "image",
    title: "Gilded couture portrait",
    alt: "Veronica Adane styled in crystal couture inside a marble-and-gold bath set.",
  },
  {
    filename: "IMG_8078.JPG.jpeg",
    publicId: "veronica/images/img_8078",
    resourceType: "image",
    title: "Crystal bath portrait",
    alt: "Veronica Adane reclining in a crystal-styled bath inside a gilded marble interior.",
  },
  {
    filename: "IMG_8079.JPG (1).jpeg",
    publicId: "veronica/images/img_8079",
    resourceType: "image",
    title: "Couture fur portrait",
    alt: "Veronica Adane posed in a deep brown fur coat with black tailoring against a caramel studio background.",
  },
  {
    filename: "IMG_8080.JPG.jpeg",
    publicId: "veronica/images/img_8080",
    resourceType: "image",
    title: "Winter couture close-up",
    alt: "Veronica Adane seated in a rich brown fur coat and black tailored look.",
  },
  {
    filename: "IMG_8081.JPG.jpeg",
    publicId: "veronica/images/img_8081",
    resourceType: "image",
    title: "Fur studio portrait",
    alt: "Veronica Adane seated in a brown fur coat over black tailoring on a warm studio set.",
  },
  {
    filename: "IMG_8094.JPG.jpeg",
    publicId: "veronica/images/img_8094",
    resourceType: "image",
    title: "Scarlet campaign portrait",
    alt: "Veronica Adane in a crimson gown with white opera gloves framed by red heart balloons.",
  },
  {
    filename: "IMG_8095.JPG.jpeg",
    publicId: "veronica/images/img_8095",
    resourceType: "image",
    title: "Heart-wall glamour portrait",
    alt: "Veronica Adane in a red gown against a wall of red heart balloons.",
  },
  {
    filename: "IMG_8096.JPG.jpeg",
    publicId: "veronica/images/img_8096",
    resourceType: "image",
    title: "Scarlet close-up portrait",
    alt: "Close glamour portrait of Veronica Adane in a red gown and white gloves framed by heart balloons.",
  },
  {
    filename: "Veronica Adane - Kedemenaw - ቬሮኒካ አዳነ - ከደመናዉ (Official Music Video).mp4",
    publicId: "veronica/videos/kedemenaw",
    resourceType: "video",
    title: "Kedemenaw",
    alt: "Official music video for Veronica Adane's Kedemenaw.",
  },
  {
    filename: "Veronica Adane - መጠሪያዬ - Meteriyaye (New Ethiopan Music 2024).mp4",
    publicId: "veronica/videos/meteriyaye",
    resourceType: "video",
    title: "Meteriyaye",
    alt: "Official music video for Veronica Adane's Meteriyaye.",
  },
  {
    filename: "Veronica Adane - ተናገር - Tenager (Official Music Video) - (New Ethiopian Music 2024).mp4",
    publicId: "veronica/videos/tenager",
    resourceType: "video",
    title: "Tenager",
    alt: "Official music video for Veronica Adane's Tenager.",
  },
  {
    filename: "Veronica Adane - ካንተ ሌላ - Kante Lela (Official Music Video) New Ethiopian Music 2024.mp4",
    publicId: "veronica/videos/kante-lela",
    resourceType: "video",
    title: "Kante Lela",
    alt: "Official music video for Veronica Adane's Kante Lela.",
  },
  {
    filename: "Veronica Adane - ጎኔ ደር - Gone Der (New Ethiopian Music 2024).mp4",
    publicId: "veronica/videos/gone-der",
    resourceType: "video",
    title: "Gone Der",
    alt: "Official music video for Veronica Adane's Gone Der.",
  },
] as const;

export function getBundledCloudinaryAssetPath(filename: string) {
  return path.join(process.cwd(), "assets", filename);
}
