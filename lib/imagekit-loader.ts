import type { ImageLoaderProps } from "next/image";

/** ImageKit performs resizing on its CDN; no Next.js image server is needed. */
export default function imagekitLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith("https://ik.imagekit.io/s7yz964lq/")) return src;

  const url = new URL(src);
  const existing = url.searchParams.get("tr");
  const resize = `w-${width},q-${quality ?? 75}`;
  url.searchParams.set("tr", existing ? `${existing}:${resize}` : resize);
  return url.toString();
}
