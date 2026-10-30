import { z } from "zod";

export const sectionIdSchema = z.enum([
  "home",
  "about",
  "process",
  "skills",
  "portfolio",
  "contact",
]);
export type SectionId = z.infer<typeof sectionIdSchema>;

const CDN = "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds";

const imageSourceSchema = z.union([z.url(), z.string().regex(/^\/images\/[^\s]+$/)]);

/** Art-directed breakpoints — one image per viewport width */
export const responsiveImageSchema = z.object({
  xs: imageSourceSchema, // 360
  mobile: imageSourceSchema, // 390
  sm: imageSourceSchema, // 640
  md: imageSourceSchema, // 768
  lg: imageSourceSchema, // 1024
  xl: imageSourceSchema, // 1280
  desktopWide: imageSourceSchema, // 1440
  "2xl": imageSourceSchema, // 1536
  fullHd: imageSourceSchema, // 1920
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

type SizeToken =
  | "FULL_HD_1920"
  | "2XL_1536"
  | "DESKTOP_STANDARD_1440"
  | "XL_DESKTOP_1280"
  | "LG_LAPTOP_1024"
  | "MD_TABLET_768"
  | "SM_640"
  | "MOBILE_STANDARD_390"
  | "XS_360";

function asset(sec: number, size: SizeToken) {
  return `${CDN}/${size}_HOMEPAGE_SEC${sec}.jpg`;
}

/** Build a full breakpoint map; missing sizes fall back to the nearest larger asset */
function sectionImages(
  sec: number,
  available: SizeToken[]
): ResponsiveImages {
  const set = new Set(available);
  const pick = (...candidates: SizeToken[]) => {
    for (const c of candidates) {
      if (set.has(c)) return asset(sec, c);
    }
    // Prefer the smallest listed asset (best mobile stand-in) over the largest
    return asset(sec, available[available.length - 1]!);
  };

  const upscaleFallbacks: SizeToken[] = [
    "LG_LAPTOP_1024",
    "XL_DESKTOP_1280",
    "DESKTOP_STANDARD_1440",
    "2XL_1536",
    "FULL_HD_1920",
  ];

  return responsiveImageSchema.parse({
    fullHd: pick("FULL_HD_1920", "2XL_1536", "DESKTOP_STANDARD_1440"),
    "2xl": pick("2XL_1536", "FULL_HD_1920", "DESKTOP_STANDARD_1440"),
    desktopWide: pick(
      "DESKTOP_STANDARD_1440",
      "2XL_1536",
      "XL_DESKTOP_1280",
      "FULL_HD_1920"
    ),
    xl: pick(
      "XL_DESKTOP_1280",
      "DESKTOP_STANDARD_1440",
      "2XL_1536",
      "LG_LAPTOP_1024"
    ),
    lg: pick(
      "LG_LAPTOP_1024",
      "XL_DESKTOP_1280",
      "MD_TABLET_768",
      "DESKTOP_STANDARD_1440"
    ),
    md: pick(
      "MD_TABLET_768",
      "LG_LAPTOP_1024",
      "SM_640",
      "XL_DESKTOP_1280",
      "DESKTOP_STANDARD_1440"
    ),
    sm: pick("SM_640", "MD_TABLET_768", "MOBILE_STANDARD_390", ...upscaleFallbacks),
    mobile: pick(
      "MOBILE_STANDARD_390",
      "XS_360",
      "SM_640",
      "MD_TABLET_768",
      ...upscaleFallbacks
    ),
    xs: pick(
      "XS_360",
      "MOBILE_STANDARD_390",
      "SM_640",
      "MD_TABLET_768",
      ...upscaleFallbacks
    ),
  });
}

const ALL_SIZES: SizeToken[] = [
  "FULL_HD_1920",
  "2XL_1536",
  "DESKTOP_STANDARD_1440",
  "XL_DESKTOP_1280",
  "LG_LAPTOP_1024",
  "MD_TABLET_768",
  "SM_640",
  "MOBILE_STANDARD_390",
  "XS_360",
];

/** SEC1 home — supplied artwork at each viewport width (640 uses the 390 image). */
const HOME_IMAGES = responsiveImageSchema.parse({
  fullHd:
    "/images/FULL_HD_1920_HOMEPAGE_sec1.jpg",
  "2xl":
    "/images/2XL_1536_HOMEPAGE_sec1.jpg",
  desktopWide:
    "/images/DESKTOP_STANDARD_1440_HOMEPAGE_sec1.jpg",
  xl: "/images/XL_DESKTOP_1280_HOMEPAGE_sec1.jpg",
  lg: "/images/LG_LAPTOP_1024_HOMEPAGE_sec1.jpg",
  md: "/images/MD_TABLET_768_HOMEPAGE_sec1.jpg",
  sm: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Hero/MOBILE_STANDARD_390_HOMEPAGE_sec1.jpg?updatedAt=1792657240786",
  mobile:
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Hero/MOBILE_STANDARD_390_HOMEPAGE_sec1.jpg?updatedAt=1792657240786",
  xs: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Hero/XS_360_HOMEPAGE_sec1.jpg?updatedAt=1792657240898",
});

const HOME_EN_CDN = "https://cdn.yeganehheshmat.com/backgrounds/En/Homepage";
const HOME_FA_CDN = "https://cdn.yeganehheshmat.com/backgrounds/fa/Homepage";

/** SEC1 Persian artwork at each supplied viewport width. */
export const HOME_IMAGES_FA = responsiveImageSchema.parse({
  fullHd: `${HOME_FA_CDN}/sec1_HOMEPAGE_1920_HD_FULL_FA.jpg`,
  "2xl": `${HOME_FA_CDN}/sec1_HOMEPAGE_1536_2XL_FA.jpg`,
  desktopWide: `${HOME_FA_CDN}/sec1_HOMEPAGE_1440_STANDARD_DESKTOP_FA.jpg`,
  xl: `${HOME_FA_CDN}/sec1_HOMEPAGE_1280_DESKTOP_XL_FA.jpg`,
  lg: `${HOME_FA_CDN}/sec1_HOMEPAGE_1024_LAPTOP_LG_FA.jpg`,
  md: `${HOME_FA_CDN}/sec1_HOMEPAGE_768_TABLET_MD_FA.jpg`,
  mobile: `${HOME_FA_CDN}/sec1_HOMEPAGE_390_STANDARD_MOBILE_FA.jpg`,
  sm: `${HOME_FA_CDN}/sec1_HOMEPAGE_390_STANDARD_MOBILE_FA.jpg`,
  xs: `${HOME_FA_CDN}/sec1_HOMEPAGE_360_XS_FA.jpg`,
});

/** SEC1 English artwork at the supplied viewport widths. */
export const HOME_IMAGES_EN = responsiveImageSchema.parse({
  fullHd: `${HOME_EN_CDN}/sec1_HOMEPAGE_360_XS_EN.jpg`,
  "2xl": `${HOME_EN_CDN}/sec1_HOMEPAGE_1536_2XL_EN.jpg`,
  desktopWide: `${HOME_EN_CDN}/sec1_HOMEPAGE_1440_STANDARD_DESKTOP_EN.jpg`,
  xl: `${HOME_EN_CDN}/sec1_HOMEPAGE_1280_DESKTOP_XL_EN.jpg`,
  lg: `${HOME_EN_CDN}/sec1_HOMEPAGE_1024_LAPTOP_LG_EN.jpg`,
  md: `${HOME_EN_CDN}/sec1_HOMEPAGE_768_TABLET_MD_EN.jpg`,
  sm: `${HOME_EN_CDN}/sec1_HOMEPAGE_640_SM_EN.jpg`,
  mobile: `${HOME_EN_CDN}/sec1_HOMEPAGE_390_STANDARD_MOBILE_EN.jpg`,
  xs: `${HOME_EN_CDN}/sec1_HOMEPAGE_360_XS_EN.jpg`,
});

/** SEC2 Brand Value — replace tablet/desktop artwork; preserve mobile fallbacks. */
const ABOUT_IMAGES = responsiveImageSchema.parse({
  ...sectionImages(2, [
    "2XL_1536",
    "DESKTOP_STANDARD_1440",
    "XL_DESKTOP_1280",
    "LG_LAPTOP_1024",
  ]),
  fullHd:
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/brand_value_2/FULL_HD_1920_HOMEPAGE_sec2.jpg?updatedAt=1792657440449",
  "2xl":
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/brand_value_2/2XL_1536_HOMEPAGE_sec2.jpg?updatedAt=1792657440204",
  desktopWide:
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/brand_value_2/DESKTOP_STANDARD_1440_HOMEPAGE_sec2.jpg?updatedAt=1792657440465",
  xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/brand_value_2/XL_DESKTOP_1280_HOMEPAGE_sec2.jpg?updatedAt=1792657440631",
  lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/brand_value_2/LG_LAPTOP_1024_HOMEPAGE_sec2.jpg?updatedAt=1792657440808",
  md: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/brand_value_2/MD_TABLET_768_HOMEPAGE_sec2.jpg?updatedAt=1792657440302",
});

/** SEC2 English artwork; retain existing images below the tablet breakpoint. */
export const ABOUT_IMAGES_EN = responsiveImageSchema.parse({
  ...ABOUT_IMAGES,
  fullHd: `${HOME_EN_CDN}/sec2_HOMEPAGE_1920_HD_FULL_EN.jpg`,
  "2xl": `${HOME_EN_CDN}/sec2_HOMEPAGE_1536_2XL_EN.jpg`,
  desktopWide: `${HOME_EN_CDN}/sec2_HOMEPAGE_1440_STANDARD_DESKTOP_EN.jpg`,
  xl: `${HOME_EN_CDN}/sec2_HOMEPAGE_1280_DESKTOP_XL_EN.jpg`,
  lg: `${HOME_EN_CDN}/sec2_HOMEPAGE_1024_LAPTOP_LG_EN.jpg`,
  md: `${HOME_EN_CDN}/sec2_HOMEPAGE_768_TABLET_MD_EN.jpg`,
});

/** SEC2 Persian artwork; retain existing mobile images. */
export const ABOUT_IMAGES_FA = responsiveImageSchema.parse({
  ...ABOUT_IMAGES,
  fullHd: `${HOME_FA_CDN}/sec2_HOMEPAGE_1920_HD_FULL_FA.jpg`,
  "2xl": `${HOME_FA_CDN}/sec2_HOMEPAGE_1536_2XL_FA.jpg`,
  desktopWide: `${HOME_FA_CDN}/sec2_HOMEPAGE_1440_STANDARD_DESKTOP_FA.jpg`,
  xl: `${HOME_FA_CDN}/sec2_HOMEPAGE_1280_DESKTOP_XL_FA.jpg`,
  lg: `${HOME_FA_CDN}/sec2_HOMEPAGE_1024_LAPTOP_LG_FA.jpg`,
  md: `${HOME_FA_CDN}/sec2_HOMEPAGE_768_TABLET_MD_FA.jpg`,
});

/** SEC3 What I Do — replace tablet/desktop artwork; preserve mobile fallbacks. */
const PROCESS_IMAGES = responsiveImageSchema.parse({
  ...sectionImages(3, [
    "2XL_1536",
    "DESKTOP_STANDARD_1440",
    "XL_DESKTOP_1280",
  ]),
  fullHd:
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/WhatIdo_3/FULL_HD_1920_HOMEPAGE_sec3.jpg?updatedAt=1792657589473",
  "2xl":
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/WhatIdo_3/2XL_1536_portfolio_SEC3.jpg?updatedAt=1792657589023",
  desktopWide:
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/WhatIdo_3/DESKTOP_STANDARD_1440_HOMEPAGE_sec3.jpg?updatedAt=1792657589212",
  xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/WhatIdo_3/XL_DESKTOP_1280_HOMEPAGE_sec3.jpg?updatedAt=1792657588925",
  lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/WhatIdo_3/LG_LAPTOP_1024_HOMEPAGE_sec3.jpg?updatedAt=1792657588997",
  md: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/WhatIdo_3/MD_TABLET_768_HOMEPAGE_sec3.jpg?updatedAt=1792657588301",
});

/** SEC3 English artwork; retain existing images below the tablet breakpoint. */
export const PROCESS_IMAGES_EN = responsiveImageSchema.parse({
  ...PROCESS_IMAGES,
  fullHd: `${HOME_EN_CDN}/sec3_HOMEPAGE_1920_HD_FULL_EN.jpg`,
  "2xl": `${HOME_EN_CDN}/sec3_HOMEPAGE_1536_2XL_EN.jpg`,
  desktopWide: `${HOME_EN_CDN}/sec3_HOMEPAGE_1440_STANDARD_DESKTOP_EN.jpg`,
  xl: `${HOME_EN_CDN}/sec3_HOMEPAGE_1280_DESKTOP_XL_EN.jpg`,
  lg: `${HOME_EN_CDN}/sec3_HOMEPAGE_1024_LAPTOP_LG_EN.jpg`,
  md: `${HOME_EN_CDN}/sec3_HOMEPAGE_768_TABLET_MD_EN.jpg`,
});

/** SEC3 Persian artwork; retain existing images below the tablet breakpoint. */
export const PROCESS_IMAGES_FA = responsiveImageSchema.parse({
  ...PROCESS_IMAGES,
  fullHd: `${HOME_FA_CDN}/sec3_HOMEPAGE_1920_HD_FULL_FA.jpg`,
  "2xl": `${HOME_FA_CDN}/sec3_HOMEPAGE_1536_2XL_FA.jpg`,
  desktopWide: `${HOME_FA_CDN}/sec3_HOMEPAGE_1440_STANDARD_DESKTOP_FA.jpg`,
  xl: `${HOME_FA_CDN}/sec3_HOMEPAGE_1280_DESKTOP_XL_FA.jpg`,
  lg: `${HOME_FA_CDN}/sec3_HOMEPAGE_1024_LAPTOP_LG_FA.jpg`,
  md: `${HOME_FA_CDN}/sec3_HOMEPAGE_768_TABLET_MD_FA.jpg`,
});

/** SEC4 My Approach — replace tablet/desktop artwork; preserve mobile images. */
const SKILLS_IMAGES = responsiveImageSchema.parse({
  ...sectionImages(4, ALL_SIZES),
  fullHd:
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Approach/FULL_HD_1920_HOMEPAGE_sec4.jpg?updatedAt=1792657863051",
  "2xl":
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Approach/2XL_1536_HOMEPAGE_sec4.jpg?updatedAt=1792657861526",
  desktopWide:
    "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Approach/DESKTOP_STANDARD_1440_HOMEPAGE_sec4.jpg?updatedAt=1792657862666",
  xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Approach/XL_DESKTOP_1280_HOMEPAGE_sec4.jpg?updatedAt=1792657862713",
  lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Approach/LG_LAPTOP_1024_HOMEPAGE_sec4.jpg?updatedAt=1792657862516",
  md: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Approach/MD_TABLET_768_HOMEPAGE_sec4.jpg?updatedAt=1792657862680",
});

/** SEC4 English artwork; retain existing images below the tablet breakpoint. */
export const SKILLS_IMAGES_EN = responsiveImageSchema.parse({
  ...SKILLS_IMAGES,
  fullHd: `${HOME_EN_CDN}/sec4_HOMEPAGE_1920_FULL_HD_EN.jpg`,
  "2xl": `${HOME_EN_CDN}/sec4_HOMEPAGE_1536_2XL_EN.jpg`,
  desktopWide: `${HOME_EN_CDN}/sec4_HOMEPAGE_1440_DESKTOP_STANDARD_EN.jpg`,
  xl: `${HOME_EN_CDN}/sec4_HOMEPAGE_1280_XL_DESKTOP_EN.jpg`,
  lg: `${HOME_EN_CDN}/sec4_HOMEPAGE_1024_LG_LAPTOP_EN.jpg`,
  md: `${HOME_EN_CDN}/sec4_HOMEPAGE_768_MD_TABLET_EN.jpg`,
});

/** SEC4 Persian artwork; retain existing images below the tablet breakpoint. */
export const SKILLS_IMAGES_FA = responsiveImageSchema.parse({
  ...SKILLS_IMAGES,
  fullHd: `${HOME_FA_CDN}/sec4_HOMEPAGE_1920_FULL_HD_FA.jpg`,
  "2xl": `${HOME_FA_CDN}/sec4_HOMEPAGE_1536_2XL_FA.jpg`,
  desktopWide: `${HOME_FA_CDN}/sec4_HOMEPAGE_1440_DESKTOP_STANDARD_FA.jpg`,
  xl: `${HOME_FA_CDN}/sec4_HOMEPAGE_1280_XL_DESKTOP_FA.jpg`,
  lg: `${HOME_FA_CDN}/sec4_HOMEPAGE_1024_LG_LAPTOP_FA.jpg`,
  md: `${HOME_FA_CDN}/sec4_HOMEPAGE_768_MD_TABLET_FA.jpg`,
});

/** SEC5 English artwork; retain existing images below the tablet breakpoint. */
export const PORTFOLIO_IMAGES_EN = responsiveImageSchema.parse({
  fullHd: `${HOME_EN_CDN}/sec5_HOMEPAGE_1920_FULLHD_EN.jpg`,
  "2xl": `${HOME_EN_CDN}/sec5_HOMEPAGE_1536_2XL_EN.jpg`,
  desktopWide: `${HOME_EN_CDN}/sec5_HOMEPAGE_1440_DESKTOP_STANDARD_EN.jpg`,
  xl: `${HOME_EN_CDN}/sec5_HOMEPAGE_1280_XL_DESKTOP_EN.jpg`,
  lg: `${HOME_EN_CDN}/sec5_HOMEPAGE_1024_LG_LAPTOP_EN.jpg`,
  md: `${HOME_EN_CDN}/sec5_HOMEPAGE_768_MD_TABLET_EN.jpg`,
  sm: `${CDN}/related_works_5.jpg`,
  mobile: `${CDN}/related_works_9.jpg`,
  xs: `${CDN}/related_works_9.jpg`,
});

/** SEC5 Persian artwork; retain existing mobile and XS images. */
export const PORTFOLIO_IMAGES_FA = responsiveImageSchema.parse({
  ...PORTFOLIO_IMAGES_EN,
  fullHd: `${HOME_FA_CDN}/sec5_HOMEPAGE_1920_FULLHD_FA.jpg`,
  "2xl": `${HOME_FA_CDN}/sec5_HOMEPAGE_1536_2XL_FA.jpg`,
  desktopWide: `${HOME_FA_CDN}/sec5_HOMEPAGE_1440_DESKTOP_STANDARD_FA.jpg`,
  xl: `${HOME_FA_CDN}/sec5_HOMEPAGE_1280_XL_DESKTOP_FA.jpg`,
  lg: `${HOME_FA_CDN}/sec5_HOMEPAGE_1024_LG_LAPTOP_FA.jpg`,
  md: `${HOME_FA_CDN}/sec5_HOMEPAGE_768_MD_TABLET_FA.jpg`,
  sm: `${HOME_FA_CDN}/sec5_HOMEPAGE_640_SM_FA.jpg`,
});

/** Shared footer artwork at each viewport breakpoint. */
const CONTACT_IMAGES = responsiveImageSchema.parse({
  fullHd: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Footer/FULL_HD_1920_HOMEPAGE_FOOTER.jpg?updatedAt=1792657842029",
  "2xl": "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Footer/2XL_1536_HOMEPAGE_FOOTER.jpg?updatedAt=1792657841806",
  desktopWide: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Footer/DESKTOP_STANDARD_1440_HOMEPAGE_FOOTER.jpg?updatedAt=1792657841447",
  xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Footer/XL_DESKTOP_1280_HOMEPAGE_FOOTER.jpg?updatedAt=1792657841160",
  lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Footer/LG_LAPTOP_1024_HOMEPAGE_FOOTER.jpg?updatedAt=1792657838829",
  md: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Footer/MD_TABLET_768_HOMEPAGE_FOOTER.jpg?updatedAt=1792657840253",
  sm: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Footer/SM_640_HOMEPAGE_FOOTER.jpg?updatedAt=1792657840538",
  mobile: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Footer/MOBILE_STANDARD_390_footer.jpg",
  xs: "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/Footer/XS_360_footer.jpg",
});

/** English homepage footer artwork at every supplied viewport width. */
export const CONTACT_IMAGES_EN = responsiveImageSchema.parse({
  fullHd: `${HOME_EN_CDN}/FOOTER_HOMEPAGE_1920_FULLHD_EN.jpg`,
  "2xl": `${HOME_EN_CDN}/FOOTER_HOMEPAGE_1536_2XL_EN.jpg`,
  desktopWide: `${HOME_EN_CDN}/FOOTER_HOMEPAGE_1440_DESKTOP_STANDARD_EN.jpg`,
  xl: `${HOME_EN_CDN}/FOOTER_HOMEPAGE_1280_XL_DESKTOP_EN.jpg`,
  lg: `${HOME_EN_CDN}/FOOTER_HOMEPAGE_1024_LG_LAPTOP_EN.jpg`,
  md: `${HOME_EN_CDN}/FOOTER_HOMEPAGE_768_MD_TABLET_EN.jpg`,
  sm: `${HOME_EN_CDN}/SEC7_HOMEPAGE_390_MOBILE_STANDARD_EN-1.jpg`,
  mobile: `${HOME_EN_CDN}/SEC7_HOMEPAGE_390_MOBILE_STANDARD_EN.jpg`,
  xs: `${HOME_EN_CDN}/SEC7_HOMEPAGE_360_XS_EN.jpg`,
});

/** Persian homepage footer artwork at every supplied viewport width. */
export const CONTACT_IMAGES_FA = responsiveImageSchema.parse({
  fullHd: `${HOME_FA_CDN}/FOOTER_HOMEPAGE_1920_FULLHD_FA.jpg`,
  "2xl": `${HOME_FA_CDN}/FOOTER_HOMEPAGE_1536_2XL_FA.jpg`,
  desktopWide: `${HOME_FA_CDN}/FOOTER_HOMEPAGE_1440_DESKTOP_STANDARD_FA.jpg`,
  xl: `${HOME_FA_CDN}/FOOTER_HOMEPAGE_1280_XL_DESKTOP_FA.jpg`,
  lg: `${HOME_FA_CDN}/FOOTER_HOMEPAGE_1024_LG_LAPTOP_FA.jpg`,
  md: `${HOME_FA_CDN}/FOOTER_HOMEPAGE_768_MD_TABLET_FA.jpg`,
  mobile: `${HOME_FA_CDN}/SEC7_HOMEPAGE_390_MOBILE_STANDARD_FA-1.jpg`,
  sm: `${HOME_FA_CDN}/FOOTER_HOMEPAGE_640_SM_FA.jpg`,
  xs: `${HOME_FA_CDN}/SEC7_HOMEPAGE_360_XS_FA.jpg`,
});

export const sectionSchema = z.object({
  id: sectionIdSchema,
  label: z.string().min(1),
  /** Fallback asset when `images` is set */
  image: imageSourceSchema.optional(),
  /** Art-directed set — omit for solid cream sections (e.g. portfolio) */
  images: responsiveImageSchema.optional(),
  foreground: z.string().min(1),
  muted: z.string().min(1),
  objectPosition: z.string().default("center"),
  objectFit: z.enum(["cover", "contain", "fill", "none"]).default("cover"),
  contentInset: z.enum(["default", "art-left", "art-right"]).default("default"),
  /** Solid page fill when no CDN images are provided */
  solidBackground: z.string().optional(),
});

export type Section = z.infer<typeof sectionSchema>;

export const sections = sectionSchema.array().parse([
  {
    id: "home",
    label: "Home",
    image: HOME_IMAGES.fullHd,
    images: HOME_IMAGES,
    foreground: "var(--section-home-fg)",
    muted: "var(--section-home-muted)",
    objectFit: "cover",
    objectPosition: "center top",
  },
  {
    id: "about",
    label: "About",
    image: ABOUT_IMAGES.fullHd,
    images: ABOUT_IMAGES,
    foreground: "var(--section-about-fg)",
    muted: "var(--section-about-muted)",
    objectFit: "cover",
    objectPosition: "left bottom",
    contentInset: "art-left",
  },
  {
    id: "process",
    label: "What I Do",
    image: PROCESS_IMAGES.fullHd,
    images: PROCESS_IMAGES,
    foreground: "var(--section-process-fg)",
    muted: "var(--section-process-muted)",
    objectFit: "cover",
    objectPosition: "right bottom",
    contentInset: "art-right",
  },
  {
    id: "skills",
    label: "My Approach",
    image: SKILLS_IMAGES.fullHd,
    images: SKILLS_IMAGES,
    foreground: "var(--section-skills-fg)",
    muted: "var(--section-skills-muted)",
    objectFit: "cover",
    objectPosition: "center center",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    image:
      "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_3.jpg",
    images: {
      fullHd:
        "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_3.jpg",
      "2xl":
        "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_1.jpg",
      desktopWide:
        "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_2.jpg",
      xl: "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_2.jpg",
      lg: "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_8.jpg",
      md: "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_4.jpg",
      sm: "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_5.jpg",
      mobile:
        "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_9.jpg",
      xs: "https://ik.imagekit.io/s7yz964lq/assets/SectionBackgrounds/related_works_9.jpg",
    },
    foreground: "var(--section-portfolio-fg)",
    muted: "var(--section-portfolio-muted)",
    objectFit: "cover",
    objectPosition: "center center",
  },
  {
    id: "contact",
    label: "Footer",
    image: CONTACT_IMAGES.fullHd,
    images: CONTACT_IMAGES,
    foreground: "var(--section-contact-fg)",
    muted: "var(--section-contact-muted)",
    objectFit: "cover",
    objectPosition: "center bottom",
  },
]);
