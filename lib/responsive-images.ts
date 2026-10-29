import { z } from "zod";

/** Art-directed breakpoints — one CDN file per viewport width */
export const responsiveImageSchema = z.object({
  xs: z.url(), // 360
  mobile: z.url(), // 390
  sm: z.url(), // 640
  md: z.url(), // 768
  lg: z.url(), // 1024
  xl: z.url(), // 1280
  desktopWide: z.url(), // 1440
  "2xl": z.url(), // 1536
  fullHd: z.url(), // 1920
});

export type ResponsiveImages = z.infer<typeof responsiveImageSchema>;

/** Largest-first <picture> sources (xs is the <img> fallback) */
export const RESPONSIVE_IMAGE_SOURCES: {
  key: Exclude<keyof ResponsiveImages, "xs">;
  minWidth: number;
}[] = [
  { key: "fullHd", minWidth: 1920 },
  { key: "2xl", minWidth: 1536 },
  { key: "desktopWide", minWidth: 1440 },
  { key: "xl", minWidth: 1280 },
  { key: "lg", minWidth: 1024 },
  { key: "md", minWidth: 768 },
  { key: "sm", minWidth: 640 },
  { key: "mobile", minWidth: 390 },
];

type ResponsiveImageKey = keyof ResponsiveImages;

/**
 * Fill a full breakpoint map from partial CDN assets.
 * Missing sizes fall back to the nearest provided asset.
 */
export function buildResponsiveImages(
  partial: Partial<Record<ResponsiveImageKey, string>>,
): ResponsiveImages {
  const pick = (...keys: ResponsiveImageKey[]) => {
    for (const key of keys) {
      const url = partial[key];
      if (url) return url;
    }
    const first = Object.values(partial).find(Boolean);
    if (!first) {
      throw new Error("buildResponsiveImages requires at least one image URL");
    }
    return first;
  };

  return responsiveImageSchema.parse({
    fullHd: pick("fullHd", "2xl", "desktopWide", "xl", "lg", "md", "sm", "mobile", "xs"),
    "2xl": pick("2xl", "fullHd", "desktopWide", "xl", "lg", "md", "sm", "mobile", "xs"),
    desktopWide: pick("desktopWide", "xl", "2xl", "fullHd", "lg", "md", "sm", "mobile", "xs"),
    xl: pick("xl", "desktopWide", "lg", "2xl", "fullHd", "md", "sm", "mobile", "xs"),
    lg: pick("lg", "xl", "md", "desktopWide", "sm", "mobile", "xs"),
    md: pick("md", "sm", "lg", "xl", "mobile", "xs"),
    sm: pick("sm", "md", "mobile", "xs", "lg", "xl"),
    mobile: pick("mobile", "xs", "sm", "md", "lg"),
    xs: pick("xs", "mobile", "sm", "md", "lg"),
  });
}
