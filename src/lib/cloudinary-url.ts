/**
 * Transforms a Cloudinary secure URL to a smaller thumbnail variant.
 * Inserts transformation params after /upload/ in the URL.
 * Falls back to the original URL if it doesn't match the expected pattern.
 */
export function cloudinaryThumb(
  url: string,
  opts: { width?: number; height?: number; crop?: string } = {},
): string {
  const { width = 400, height = 300, crop = "fill" } = opts;

  try {
    const marker = "/upload/";
    const idx = url.indexOf(marker);

    if (idx === -1) return url;

    const transform = `w_${width},h_${height},c_${crop},q_auto,f_auto`;
    return url.slice(0, idx + marker.length) + transform + "/" + url.slice(idx + marker.length);
  } catch {
    return url;
  }
}

/**
 * Injects q_auto,f_auto into a Cloudinary URL without changing dimensions.
 * Delivers WebP/AVIF automatically and selects optimal quality.
 * Falls back to the original URL if it doesn't match the expected pattern.
 */
export function cloudinaryOptimized(url: string): string {
  try {
    const marker = "/upload/";
    const idx = url.indexOf(marker);

    if (idx === -1) return url;

    // Don't double-apply transforms
    const afterUpload = url.slice(idx + marker.length);
    if (afterUpload.startsWith("q_auto") || afterUpload.startsWith("f_auto")) return url;

    return url.slice(0, idx + marker.length) + "q_auto,f_auto/" + afterUpload;
  } catch {
    return url;
  }
}
