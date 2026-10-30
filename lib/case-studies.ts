import { z } from "zod";

import {
  buildResponsiveImages,
  responsiveImageSchema,
  type ResponsiveImages,
} from "@/lib/responsive-images";

const IK = "https://ik.imagekit.io/s7yz964lq";
const CDN_PATH = "assets/casestudy/Bilit4u/webp";

/**
 * Build an ImageKit URL. FULL_HD masters exceed the 25MP limit, so pass `w`
 * to downscale via `tr:w-*` before delivery.
 */
function asset(file: string, opts?: { w?: number; updatedAt?: string }) {
  const transform = opts?.w ? `tr:w-${opts.w}/` : "";
  const query = opts?.updatedAt ? `?updatedAt=${opts.updatedAt}` : "";
  return `${IK}/${transform}${CDN_PATH}/${file}${query}`;
}

export const caseStudySectionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  images: responsiveImageSchema.optional(),
  desktopImages: responsiveImageSchema.optional(),
  objectFit: z.enum(["cover", "contain"]).default("cover"),
  objectPosition: z.string().default("center"),
  /**
   * Soften `cover` zoom without distorting (1 = normal cover).
   * Values < 1 show more of the artwork; cream section fill covers the edges.
   */
  backgroundScale: z.number().positive().max(1).default(1),
  solidBackground: z.string().optional(),
});

export type CaseStudySection = z.infer<typeof caseStudySectionSchema>;

export const caseStudySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  kicker: z.string().optional(),
  sections: caseStudySectionSchema.array().min(1),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;

/** Shared section 1 artwork for Bilit4U, TealTile, and Tealnex. */
const CASE_STUDY_EN_CDN = "https://cdn.yeganehheshmat.com/backgrounds/En/casestudy";

export const CASE_STUDY_SEC1_IMAGES_EN = responsiveImageSchema.parse({
  fullHd: `${CASE_STUDY_EN_CDN}/SEC1_FULL_HD_1920_portfolio_EN.jpg`,
  "2xl": `${CASE_STUDY_EN_CDN}/SEC1_2XL_1536_portfolio_EN.jpg`,
  desktopWide: `${CASE_STUDY_EN_CDN}/SEC1_DESKTOP_STANDARD_1440_portfolio_EN.jpg`,
  xl: `${CASE_STUDY_EN_CDN}/SEC1_XL_DESKTOP_1280_portfolio_EN.jpg`,
  lg: `${CASE_STUDY_EN_CDN}/SEC1_LG_LAPTOP_1024_portfolio_EN.jpg`,
  md: `${CASE_STUDY_EN_CDN}/SEC1_MD_TABLET_768_portfolio_EN.jpg`,
  sm: `${CASE_STUDY_EN_CDN}/SEC1_SM_640_portfolio_EN.jpg`,
  mobile: `${CASE_STUDY_EN_CDN}/SEC1_SM_640_portfolio_EN.jpg`,
  xs: `${CASE_STUDY_EN_CDN}/SEC1_XS_360_portfolio_EN.jpg`,
});

/** Shared English section 3 artwork for every case study. */
export const CASE_STUDY_SEC3_IMAGES_EN = responsiveImageSchema.parse({
  fullHd: `${CASE_STUDY_EN_CDN}/SEC3_FULL_HD_1920_portfolio_EN.jpg`,
  "2xl": `${CASE_STUDY_EN_CDN}/SEC3_2XL_1536_portfolio_EN.jpg`,
  desktopWide: `${CASE_STUDY_EN_CDN}/SEC3_DESKTOP_STANDARD_1440_portfolio_EN.jpg`,
  xl: `${CASE_STUDY_EN_CDN}/SEC3_XL_DESKTOP_1280_portfolio_EN.jpg`,
  lg: `${CASE_STUDY_EN_CDN}/SEC3_LG_LAPTOP_1024_portfolio_EN.jpg`,
  md: `${CASE_STUDY_EN_CDN}/SEC3_MD_TABLET_768_portfolio_EN.jpg`,
  sm: `${CASE_STUDY_EN_CDN}/SEC3_SM_640_portfolio_EN.jpg`,
  mobile: `${CASE_STUDY_EN_CDN}/SEC3_MOBILE_STANDARD_390_portfolio_EN.jpg`,
  xs: `${CASE_STUDY_EN_CDN}/SEC3_XS_360_portfolio_EN.jpg`,
});

/** Shared English section 4 artwork for every case study. */
export const CASE_STUDY_SEC4_IMAGES_EN = responsiveImageSchema.parse({
  fullHd: `${CASE_STUDY_EN_CDN}/SEC4_portfolio_1920_HD_FULL_EN.jpg`,
  "2xl": `${CASE_STUDY_EN_CDN}/SEC4_portfolio_1536_2XL_EN.jpg`,
  desktopWide: `${CASE_STUDY_EN_CDN}/SEC4_portfolio_1440_STANDARD_DESKTOP_EN.jpg`,
  xl: `${CASE_STUDY_EN_CDN}/SEC4_portfolio_1280_DESKTOP_XL_EN.jpg`,
  lg: `${CASE_STUDY_EN_CDN}/SEC4_portfolio_1024_LAPTOP_LG_EN.jpg`,
  md: `${CASE_STUDY_EN_CDN}/SEC4_portfolio_768_TABLET_MD_EN.jpg`,
  sm: `${CASE_STUDY_EN_CDN}/SEC4_portfolio_640_SM_EN.jpg`,
  mobile: `${CASE_STUDY_EN_CDN}/SEC4_portfolio_390_STANDARD_MOBILE_EN.jpg`,
  xs: `${CASE_STUDY_EN_CDN}/SEC4_portfolio_360_XS_EN.jpg`,
});

/** Project-specific English section 5 artwork at every viewport width. */
function englishSection5Images(
  project: "bilit4u" | "tealtile" | "tealnex",
  prefix: "SEC5" | "SEC5_TT" | "SEC5_TN",
): ResponsiveImages {
  const image = (size: string) =>
    `${CASE_STUDY_EN_CDN}/${prefix}_${size}_portfolio_${project}_EN.jpg`;

  return responsiveImageSchema.parse({
    fullHd: image("FULL_HD_1920"),
    "2xl": image("2XL_1536"),
    desktopWide: image("DESKTOP_STANDARD_1440"),
    xl: image("XL_DESKTOP_1280"),
    lg: image("LG_LAPTOP_1024"),
    md: image("MD_TABLET_768"),
    sm: image("SM_640"),
    mobile: image("MOBILE_STANDARD_390"),
    xs: image("XS_360"),
  });
}

export const CASE_STUDY_SEC5_IMAGES_EN: Record<string, ResponsiveImages> = {
  bilit4u: englishSection5Images("bilit4u", "SEC5"),
  tealtile: englishSection5Images("tealtile", "SEC5_TT"),
  tealnex: englishSection5Images("tealnex", "SEC5_TN"),
};

const CASE_STUDY_SEC1_IMAGES = responsiveImageSchema.parse({
	fullHd: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/icon_set/FULL_HD_1920_portfolio_SEC1.jpg?updatedAt=1792658004514",
	"2xl": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/icon_set/2XL_1536_portfolio_SEC1.jpg?updatedAt=1792658002581",
	desktopWide: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/icon_set/DESKTOP_STANDARD_1440_portfolio_SEC1.jpg?updatedAt=1792658002783",
	xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/icon_set/XL_DESKTOP_1280_portfolio_SEC1.jpg?updatedAt=1792658002673",
	lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/icon_set/LG_LAPTOP_1024_portfolio_SEC1.jpg?updatedAt=1792658002615",
	md: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/icon_set/MD_TABLET_768_HOMEPAGE_sec1.jpg?updatedAt=1792658002789",
	sm: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/icon_set/SM_640_portfolio_SEC1.jpg?updatedAt=1792658002482",
	mobile: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/icon_set/XS_360_portfolio_SEC1.jpg?updatedAt=1792658002384",
	xs: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/icon_set/XS_360_portfolio_SEC1.jpg?updatedAt=1792658002384",
});

/** Shared section 3 Process artwork for Bilit4U, TealTile, and Tealnex. */
const CASE_STUDY_SEC3_IMAGES = responsiveImageSchema.parse({
  fullHd: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/process/FULL_HD_1920_portfolio_SEC3.jpg?updatedAt=1792658158281",
  "2xl": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/process/2XL_1536_portfolio_SEC3.jpg?updatedAt=1792658158385",
  desktopWide: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/process/DESKTOP_STANDARD_1440_portfolio_SEC3.jpg?updatedAt=1792658158717",
  xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/process/XL_DESKTOP_1280_portfolio_SEC3.jpg?updatedAt=1792658158527",
  lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/process/LG_LAPTOP_1024_portfolio_SEC3.jpg?updatedAt=1792658158035",
  md: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/process/MD_TABLET_768_portfolio_SEC3.jpg?updatedAt=1792658158634",
  sm: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/process/SM_640_portfolio_SEC3.jpg?updatedAt=1792658158304",
  mobile: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/process/MOBILE_STANDARD_390_portfolio_SEC3.jpg?updatedAt=1792658158202",
  xs: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/process/XS_360_portfolio_SEC3.jpg?updatedAt=1792658158116",
});

/** Shared section 4 design artwork for Bilit4U, TealTile, and Tealnex. */
const CASE_STUDY_SEC4_IMAGES = responsiveImageSchema.parse({
  fullHd: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/designs/FULL_HD_1920_portfolio_SEC4.jpg?updatedAt=1792658334162",
  "2xl": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/designs/2XL_1536_portfolio_SEC4.jpg?updatedAt=1792658333801",
  desktopWide: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/designs/DESKTOP_STANDARD_1440_portfolio_SEC4.jpg?updatedAt=1792658333962",
  xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/designs/XL_DESKTOP_1280_portfolio_SEC4.jpg?updatedAt=1792658333941",
  lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/designs/LG_LAPTOP_1024_portfolio_SEC4.jpg?updatedAt=1792658333921",
  md: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/designs/MD_TABLET_768_portfolio_SEC4.jpg?updatedAt=1792658333890",
  sm: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/designs/SM_640_portfolio_SEC4.jpg?updatedAt=1792658333875",
  mobile: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/designs/MOBILE_STANDARD_390_portfolio_SEC4.jpg?updatedAt=1792658333867",
  xs: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/designs/XS_360_portfolio_SEC4.jpg?updatedAt=1792658333768",
});

/** Bilit4U — section 5 art-directed backgrounds */
const BILIT4U_SEC5_IMAGES = responsiveImageSchema.parse({
  fullHd: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/bilit4u/FULL_HD_1920_portfolio_SEC5.jpg?updatedAt=1792658658543",
  "2xl": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/bilit4u/2XL_1536_portfolio_SEC5.jpg?updatedAt=1792658658173",
  desktopWide: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/bilit4u/DESKTOP_STANDARD_1440_portfolio_SEC5.jpg?updatedAt=1792658658113",
  xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/bilit4u/XL_DESKTOP_1280_portfolio_SEC5.jpg?updatedAt=1792658658343",
  lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/bilit4u/LG_LAPTOP_1024_portfolio_SEC5.jpg?updatedAt=1792658658014",
  md: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/bilit4u/MD_TABLET_768_portfolio_SEC5.jpg?updatedAt=1792658658266",
  sm: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/bilit4u/SM_640_portfolio_SEC5.jpg?updatedAt=1792658658253",
  mobile: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/bilit4u/MOBILE_STANDARD_390_portfolio_SEC5.jpg?updatedAt=1792658658099",
  xs: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/bilit4u/XS_360_portfolio_SEC5.jpg?updatedAt=1792658657916",
});

/** TealTile — section 5 UX Architecture backgrounds, exclusive to this project. */
const TEALTILE_SEC5_IMAGES = responsiveImageSchema.parse({
  fullHd: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealtile/FULL_HD_1920_portfolio_SEC5_TT.jpg?updatedAt=1792658706519",
  "2xl": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealtile/2XL_1536_portfolio_SEC5_TT.jpg?updatedAt=1792658706443",
  desktopWide: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealtile/DESKTOP_STANDARD_1440_portfolio_SEC5_TT.jpg?updatedAt=1792658706293",
  xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealtile/XL_DESKTOP_1280_portfolio_SEC5_TT.jpg?updatedAt=1792658706287",
  lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealtile/LG_LAPTOP_1024_portfolio_SEC5_TT.jpg?updatedAt=1792658706206",
  md: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealtile/MD_TABLET_768_portfolio_SEC5_TT.jpg?updatedAt=1792658706198",
  sm: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealtile/SM_640_portfolio_SEC5_TT.jpg?updatedAt=1792658706322",
  mobile: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealtile/MOBILE_STANDARD_390_portfolio_SEC5_TT.jpg?updatedAt=1792658706371",
  xs: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealtile/XS_360_portfolio_SEC5_TT.jpg?updatedAt=1792658706412",
});

/** Tealnex — section 5 UX Architecture backgrounds, exclusive to this project. */
const TEALNEX_SEC5_IMAGES = responsiveImageSchema.parse({
  fullHd: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealnex/FULL_HD_1920_portfolio_SEC5_TN.jpg?updatedAt=1792658684758",
  "2xl": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealnex/2XL_1536_portfolio_SEC5_TN.jpg?updatedAt=1792658684462",
  desktopWide: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealnex/DESKTOP_STANDARD_1440_portfolio_SEC5_TN.jpg?updatedAt=1792658684365",
  xl: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealnex/XL_DESKTOP_1280_portfolio_SEC5_TN.jpg?updatedAt=1792658684568",
  lg: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealnex/LG_LAPTOP_1024_portfolio_SEC5_TN.jpg?updatedAt=1792658684256",
  md: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealnex/MD_TABLET_768_portfolio_SEC5_TN.jpg?updatedAt=1792658684241",
  sm: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealnex/SM_640_portfolio_SEC5_TN.jpg?updatedAt=1792658684449",
  mobile: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealnex/MOBILE_STANDARD_390_portfolio_SEC5_TN.jpg?updatedAt=1792658684298",
  xs: "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/ux_architecture/tealnex/XS_360_portfolio_SEC5_TN.jpg?updatedAt=1792658684371",
});

/** Bilit4U — section 6 art-directed backgrounds */
const BILIT4U_SEC6_IMAGES = buildResponsiveImages({
  fullHd: asset("FULL_HD_1920_usecase_SEC8.webp", {
    w: 1920,
    updatedAt: "1788364376672",
  }),
  "2xl": asset("2XL_1536_usecase_SEC8.webp", {
    updatedAt: "1788364376611",
  }),
  xl: asset("XL_DESKTOP_1280_usecase_SEC8.webp", {
    updatedAt: "1788364375613",
  }),
  lg: asset("LG_LAPTOP_1024_usecase_SEC8.webp", {
    updatedAt: "1788364371533",
  }),
  md: asset("MD_TABLET_768_usecase_SEC8.webp", {
    updatedAt: "1788364374430",
  }),
  sm: asset("SM_640_usecase_SEC8.webp", {
    updatedAt: "1788364370413",
  }),
  xs: asset("XS_360_usecase_SEC8.webp", {
    updatedAt: "1788364371998",
  }),
});

/** Shared Section 6 artwork, displayed only at 768px and above. */
const CASE_STUDY_SEC6_DESKTOP_IMAGES = buildResponsiveImages({
  "fullHd": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/frontend_architecture/FULL_HD_1920_portfolio_SEC6.jpg?updatedAt=1792658836515",
  "2xl": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/frontend_architecture/2XL_1536_portfolio_SEC6.jpg?updatedAt=1792658836122",
  "desktopWide": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/frontend_architecture/DESKTOP_STANDARD_1440_portfolio_SEC6.jpg?updatedAt=1792658836673",
  "xl": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/frontend_architecture/XL_DESKTOP_1280_portfolio_SEC6.jpg?updatedAt=1792658836433",
  "lg": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/frontend_architecture/LG_LAPTOP_1024_portfolio_SEC6.jpg?updatedAt=1792658836420",
  "md": "https://ik.imagekit.io/s7yz964lq/backgrounds/caseStudy/frontend_architecture/MD_TABLET_768_portfolio_SEC6.jpg?updatedAt=1792658909858",
});

/** Shared English section 6 artwork, rendered from tablet widths upward. */
export const CASE_STUDY_SEC6_IMAGES_EN = buildResponsiveImages({
  fullHd: `${CASE_STUDY_EN_CDN}/SEC6_FULL_HD_1920_portfolio_EN.jpg`,
  "2xl": `${CASE_STUDY_EN_CDN}/SEC6_2XL_1536_portfolio_EN.jpg`,
  desktopWide: `${CASE_STUDY_EN_CDN}/SEC6_DESKTOP_STANDARD_1440_portfolio_EN.jpg`,
  xl: `${CASE_STUDY_EN_CDN}/SEC6_XL_DESKTOP_1280_portfolio_EN.jpg`,
  lg: `${CASE_STUDY_EN_CDN}/SEC6_LG_LAPTOP_1024_portfolio_EN-1.jpg`,
  md: `${CASE_STUDY_EN_CDN}/SEC6_LG_LAPTOP_1024_portfolio_EN.jpg`,
});

const PLACEHOLDER_BG = "#FCF6EF";

function placeholderSection(id: string, label: string): CaseStudySection {
  return caseStudySectionSchema.parse({
    id,
    label,
    solidBackground: PLACEHOLDER_BG,
  });
}

/** Same section shell as Bilit4U — blank cream backgrounds until art is provided */
function blankProjectSections(): CaseStudySection[] {
  return [
    { ...placeholderSection("overview", "Overview"), images: CASE_STUDY_SEC1_IMAGES },
    placeholderSection("challenge", "Challenges"),
    { ...placeholderSection("approach", "Process"), images: CASE_STUDY_SEC3_IMAGES },
    { ...placeholderSection("design", "Design"), images: CASE_STUDY_SEC4_IMAGES },
    placeholderSection("development", "UX Architecture"),
    { ...placeholderSection("outcome", "Tech Stack"), desktopImages: CASE_STUDY_SEC6_DESKTOP_IMAGES },
  ];
}

const bilit4uCaseStudy = caseStudySchema.parse({
  slug: "bilit4u",
  title: "Bilit4U",
  kicker: "B2B & B2C Tourism / Booking Platform",
  sections: [
    {
      id: "overview",
      label: "Overview",
      images: CASE_STUDY_SEC1_IMAGES,
      objectFit: "cover",
      objectPosition: "center",
      solidBackground: PLACEHOLDER_BG,
    },
    {
      id: "challenge",
      label: "Challenges",
      solidBackground: "#FAF8F4",
    },
    {
      id: "approach",
      label: "Process",
      images: CASE_STUDY_SEC3_IMAGES,
      objectFit: "cover",
      objectPosition: "right top",
      // Soften cover zoom so the floral/bird reads closer to original scale
      backgroundScale: 0.82,
      solidBackground: PLACEHOLDER_BG,
    },
    {
      id: "design",
      label: "Design",
      images: CASE_STUDY_SEC4_IMAGES,
      objectFit: "cover",
      objectPosition: "center",
      solidBackground: PLACEHOLDER_BG,
    },
    {
      id: "development",
      label: "UX Architecture",
      images: BILIT4U_SEC5_IMAGES,
      objectFit: "cover",
      objectPosition: "center",
      solidBackground: PLACEHOLDER_BG,
    },
    {
      id: "outcome",
      label: "Tech Stack",
      images: BILIT4U_SEC6_IMAGES,
      desktopImages: CASE_STUDY_SEC6_DESKTOP_IMAGES,
      objectFit: "cover",
      objectPosition: "center",
      solidBackground: PLACEHOLDER_BG,
    },
  ],
});

const tealnexCaseStudy = caseStudySchema.parse({
  slug: "tealnex",
  title: "Tealnex",
  kicker: "B2C Architecture & Renovation / Company",
  sections: blankProjectSections().map((section) =>
    section.id === "development"
      ? { ...section, images: TEALNEX_SEC5_IMAGES }
      : section.id === "challenge"
        ? { ...section, solidBackground: "#FAF8F4" }
        : section,
  ),
});

const tealtileCaseStudy = caseStudySchema.parse({
  slug: "tealtile",
  title: "TealTile",
  kicker: "B2C Tile Retail & Installation / Shop",
  sections: blankProjectSections().map((section) =>
    section.id === "development"
      ? { ...section, images: TEALTILE_SEC5_IMAGES }
      : section.id === "challenge"
        ? { ...section, solidBackground: "#FAF8F4" }
        : section,
  ),
});

export const caseStudies: CaseStudy[] = [
  bilit4uCaseStudy,
  tealnexCaseStudy,
  tealtileCaseStudy,
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((study) => study.slug);
}

/** Update section backgrounds when CDN assets are provided */
export function setCaseStudySectionImages(
  slug: string,
  sectionId: string,
  images: ResponsiveImages,
): void {
  const study = caseStudies.find((item) => item.slug === slug);
  const section = study?.sections.find((item) => item.id === sectionId);
  if (section) {
    section.images = images;
    section.solidBackground = undefined;
  }
}
