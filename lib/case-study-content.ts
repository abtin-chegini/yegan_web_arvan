import {
  buildResponsiveImages,
  type ResponsiveImages,
} from "@/lib/responsive-images";

/** Shared cream used when a media slot has no image yet */
export const CASE_STUDY_BLANK = "#FCF6EF";
export const CASE_STUDY_BLANK_MEDIA = "#E8E0D4";

export type CaseStudyMetaCard = {
  dialogTitle?: string;
  dialogItems?: { title?: string; body: string }[];
  href?: string;
  id: string;
  title: string;
  body: string;
  /** Null = blank placeholder icon */
  icon: ResponsiveImages | null;
};

export type CaseStudyOverviewContent = {
  title: string;
  description: string;
  metaCards: CaseStudyMetaCard[];
};

export type CaseStudyChallenge = {
  id: string;
  number: string;
  title: string;
  description: string;
  side: "left" | "right";
  anchorX: number;
  anchorY: number;
};

export type CaseStudyBreakdownContent = {
  challenges?: CaseStudyChallenge[];
  productImageAlt?: string;
  /** Null = blank product mock */
  productImage: string | null;
};

export type CaseStudyDesignSlide = {
  /** Null / empty = blank cream slide */
  image: string | null;
  imageMobile?: string | null;
  alt: string;
};

export type CaseStudyDesignContent = {
  title: string;
  description: string;
  slides: CaseStudyDesignSlide[];
};

export type CaseStudyUxItem = {
  /** Localized media description, independent of the visible section title. */
  imageAlt?: string;
  /** Full-resolution media shown in the image dialog. */
  imageExpanded?: string;
  id: string;
  title: string;
  description: string;
  /** Null = blank blue placeholder in card / dialog */
  image: string | null;
  /** Optional image used only by the desktop layout (md+). */
  imageDesktop?: string;
  /** Thumbnail zoom in the desktop layout only. */
  imageDesktopScale?: number;
};

export type CaseStudyUxContent = {
  title?: string;
  intro: string;
  items: CaseStudyUxItem[];
};

export type CaseStudyTechSlide = {
  details?: string;
  detailsTitle?: string;
  detailItems?: { title: string; body: string }[];
  id: string;
  title: string;
  /** Card surface color */
  color: string;
  /** Technology logo URL */
  logo: string;
  /** Short why-we-used-it copy (shown in the card) */
  description: string;
};

export type CaseStudyTechContent = {
  heading: string;
  slides: CaseStudyTechSlide[];
};

export type CaseStudyContent = {
  overview: CaseStudyOverviewContent;
  breakdown: CaseStudyBreakdownContent;
  design: CaseStudyDesignContent;
  uxArchitecture: CaseStudyUxContent;
  techStack: CaseStudyTechContent;
};

const BILIT4U_ROLE_ICONS = buildResponsiveImages({
  xl: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size1.png?updatedAt=1792483961004",
  lg: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size2.png?updatedAt=1792483960692",
  md: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size3.png?updatedAt=1792483959942",
  sm: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size3.svg?updatedAt=1792483962007",
  xs: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size3.svg?updatedAt=1792483962007",
});

const BILIT4U_INDUSTRY_ICONS = buildResponsiveImages({
  "2xl":
    "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/icon_sec1/new_icon/industry_bilit4u_size4.png?updatedAt=1792420025274",
  desktopWide:
    "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/icon_sec1/new_icon/industry_bilit4u_size4.png?updatedAt=1792420025274",
  xl:
    "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/icon_sec1/new_icon/industry_bilit4u_size4.png?updatedAt=1792420025274",
  lg:
    "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/icon_sec1/new_icon/industry_bilit4u_size1.png?updatedAt=1792420025693",
  md:
    "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/icon_sec1/new_icon/industry_bilit4u_size3.png?updatedAt=1792420025400",
  sm:
    "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/icon_sec1/new_icon/industry_bilit4u_size2.svg?updatedAt=1792420026809",
  xs:
    "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/icon_sec1/new_icon/industry_bilit4u_size2.png?updatedAt=1792420025490",
});

const COMMON_PLATFORM_ICONS = buildResponsiveImages({
  xl: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/platform_size1.png?updatedAt=1792483960974",
  lg: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/platform_size2.png?updatedAt=1792483960699",
  md: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/platform_size3.png?updatedAt=1792483960150",
  sm: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/platform_size4.png?updatedAt=1792483959800",
  xs: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/platform_size4.png?updatedAt=1792483959800",
});

const BILIT4U_SCOPE_ICONS = buildResponsiveImages({
  xl: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size1.png?updatedAt=1792483960982",
  lg: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size2.png?updatedAt=1792483960826",
  md: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size4.png?updatedAt=1792483960080",
  sm: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size4.png?updatedAt=1792483960080",
  xs: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size4.png?updatedAt=1792483960080",
});

const COMMON_ROLE_ICONS = buildResponsiveImages({
  xl: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size1.png?updatedAt=1792483961004",
  lg: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size2.png?updatedAt=1792483960692",
  md: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size3.png?updatedAt=1792483959942",
  sm: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size4.png?updatedAt=1792483960237",
  xs: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/role_size4.png?updatedAt=1792483960237",
});

const COMMON_SCOPE_ICONS = buildResponsiveImages({
  xl: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size1.png?updatedAt=1792483960982",
  lg: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size2.png?updatedAt=1792483960826",
  md: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size2.png?updatedAt=1792483960826",
  sm: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size2.png?updatedAt=1792483960826",
  xs: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/common_icons/Scope_size2.png?updatedAt=1792483960826",
});

const TEALNEX_INDUSTRY_ICONS = buildResponsiveImages({
  xl: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex/industry_tealnex_size1.png",
  lg: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex/industry_tealnex_size4.png",
  md: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex/industry_tealnex_size2.png",
  sm: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex/industry_tealnex_size3.png",
  xs: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex/industry_tealnex_size3.png",
});

const TEALTILE_INDUSTRY_ICONS = buildResponsiveImages({
  xl: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/icon_set/industry_tealtile_size1.png?updatedAt=1792489763550",
  lg: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/icon_set/industry_tealtile_size2.png?updatedAt=1792489763224",
  md: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/icon_set/industry_tealtile_size3.png?updatedAt=1792489763145",
  sm: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/icon_set/industry_tealtile_size4.png?updatedAt=1792489762957",
  xs: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/icon_set/industry_tealtile_size4.png?updatedAt=1792489762957",
});

const DESIGN_INTRO =
  "Each frame marks a step in the interface's evolution — from the first wireframes to the final booking UI. Slide through the stack to see how the visual language matured while the core flows stayed clear.";

const UX_INTRO =
  "I designed the UX architecture of the booking platform as a clear, step-by-step journey — from search and route selection through filters, seats, and booking. Reusable flows, predictable actions, and responsive layouts keep complex decisions simple and easy to complete.";

/** Shared copy/layout skeleton — swap images per project */
function blankUxItems(): CaseStudyUxItem[] {
  return [
    {
      id: "search",
      title: "Unified Search Experience",
      description:
        "Users start with a unified search on the homepage, choose a service, enter their route and date, and get real-time city suggestions in Persian or English before moving to the results page.",
      image: null,
    },
    {
      id: "results",
      title: "Results, Filters & Service Selection",
      description:
        "Users review available services, compare options by time, company, amenities, and price, then use filters to choose the best result and continue the booking flow.",
      image: null,
    },
    {
      id: "seats",
      title: "Interactive Seat Selection & Booking Completion",
      description:
        "Users choose a seat based on live availability and gender rules, enter passenger details, complete payment, and receive the final booking receipt.",
      image: null,
    },
  ];
}

function commonMetaCards(bodies: {
  role: string;
  industry: string;
  platform: string;
  scope: string;
}, industryIcon: ResponsiveImages): CaseStudyMetaCard[] {
  return [
    { id: "role", title: "Role", body: bodies.role, icon: COMMON_ROLE_ICONS },
    { id: "industry", title: "Industry", body: bodies.industry, icon: industryIcon },
    { id: "platform", title: "Platform", body: bodies.platform, icon: COMMON_PLATFORM_ICONS },
    { id: "scope", title: "Scope", body: bodies.scope, icon: COMMON_SCOPE_ICONS },
  ];
}

const TECH_STACK_HEADING = "Frontend Architecture";
const TECH_LOGO_BASE =
  "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/logo";

const TECH_STACK_SLIDES: CaseStudyTechSlide[] = [
  {
    id: "nextjs",
    title: "Next.js",
    color: "#E8D5C4",
    logo: `${TECH_LOGO_BASE}/Next.js.svg?updatedAt=1788106925308`,
    description:
      "Powers the booking app with App Router, fast page loads, and SEO-ready search flows across every step of the journey.",
  },
  {
    id: "tanstack",
    title: "TanStack Query",
    color: "#D4E0EA",
    logo: `${TECH_LOGO_BASE}/TanStack_Query.svg?updatedAt=1788106941896`,
    description:
      "Smart caching of travel data, filters, and seat availability for faster performance and fewer API requests.",
  },
  {
    id: "zustand",
    title: "Zustand",
    color: "#D8E5D3",
    logo: `${TECH_LOGO_BASE}/Zod.svg?updatedAt=1788106944581`,
    description:
      "Simplifies state management for passenger details, seat selection, and booking steps.",
  },
  {
    id: "tailwind",
    title: "Tailwind CSS",
    color: "#EAD9C8",
    logo: `${TECH_LOGO_BASE}/Tailwind_CSS.svg?updatedAt=1788107019827`,
    description:
      "Builds a consistent, responsive UI with flexible styling across the entire booking process.",
  },
  {
    id: "zod",
    title: "Zod",
    color: "#D6D0E3",
    logo: `${TECH_LOGO_BASE}/Zustand.svg?updatedAt=1788107063645`,
    description:
      "Validates passenger forms and booking data for accuracy and security before payment.",
  },
  {
    id: "dexie",
    title: "Dexie",
    color: "#E5DCC8",
    logo: `${TECH_LOGO_BASE}/Dexie.svg?updatedAt=1788106973005`,
    description:
      "Stores booking drafts and city suggestions locally for a smoother experience on slow connections.",
  },
  {
    id: "lottie",
    title: "Lottie",
    color: "#C9D8E0",
    logo: `${TECH_LOGO_BASE}/Lottie.svg?updatedAt=1788106990176`,
    description:
      "Enhances user interactions with smooth animations, intuitive feedback, and engaging visual guidance.",
  },
];

const TECH_STACK_CONTENT: CaseStudyTechContent = {
  heading: TECH_STACK_HEADING,
  slides: TECH_STACK_SLIDES,
};

const bilit4uContent: CaseStudyContent = {
  overview: {
    title: "Designing a Clearer Booking Experience",
    description:
      "A booking and ticketing platform for searching, comparing, and purchasing tickets with less friction. I led UX/UI, interaction design, and front-end work to turn a complex reservation flow into a clear, polished experience.",
    metaCards: [
      {
        id: "role",
        title: "Role",
        body: "UX/UI Design · Interaction Design · Front-End Development",
        icon: BILIT4U_ROLE_ICONS,
      },
      {
        id: "industry",
        title: "Industry",
        body: "Booking · Ticketing · Reservation",
        icon: BILIT4U_INDUSTRY_ICONS,
      },
      {
        id: "platform",
        title: "Platform",
        body: "Responsive Website",
        icon: COMMON_PLATFORM_ICONS,
      },
      {
        id: "scope",
        title: "Scope",
        body: "Interface Design · Micro-interactions · Front-End Build",
        icon: BILIT4U_SCOPE_ICONS,
      },
    ],
  },
  breakdown: {
    productImage:
      "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/webp/browser-ui-transparent.png",
  },
  design: {
    title: "Evolution of the designs",
    description: DESIGN_INTRO,
    slides: [
      {
        image: "/image/BA1.jpg",
        imageMobile: "/image/BA1_mobile.jpg",
        alt: "Hero search evolution — early vs refined",
      },
      {
        image: "/image/BA2.jpg",
        imageMobile: "/image/BA2_mobile.jpg",
        alt: "Booking flow evolution — early vs refined",
      },
      {
        image: "/image/BA3.jpg",
        imageMobile: "/image/BA3_mobile.jpg",
        alt: "Results and filters evolution — early vs refined",
      },
      {
        image: "/image/BA4.jpg",
        imageMobile: "/image/BA4_mobile.jpg",
        alt: "Seat selection evolution — early vs refined",
      },
    ],
  },
  uxArchitecture: {
    intro: UX_INTRO,
    items: [
      {
        id: "search",
        imageExpanded: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/bilit4u_ux_architecture1_b.png",
        title: "Unified Search Experience",
        description:
          "Users start with a unified search on the homepage, choose a service, enter their route and date, and get real-time city suggestions in Persian or English before moving to the results page.",
        image:
          "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/search.png",
      },
      {
        id: "results",
        imageExpanded: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/bilit4u_ux_architecture3_b.png",
        title: "Results, Filters & Service Selection",
        description:
          "Users review available services, compare options by time, company, amenities, and price, then use filters to choose the best result and continue the booking flow.",
        image:
          "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/plp.png",
      },
      {
        id: "seats",
        imageExpanded: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/bilit4u_ux_architecture3_b.png",
        title: "Interactive Seat Selection & Booking Completion",
        description:
          "Users choose a seat based on live availability and gender rules, enter passenger details, complete payment, and receive the final booking receipt.",
        image:
          "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Bilit4u/seat.png",
      },
    ],
  },
  techStack: TECH_STACK_CONTENT,
};

/** Same layout; blank media until project images are provided */
const tealnexContent: CaseStudyContent = {
  overview: {
    title: "Building a Clearer Architecture Experience",
    description:
      "A digital presence for architecture and renovation — helping clients explore services, projects, and next steps with clarity. UX/UI and front-end work focused on a polished, trustworthy brand experience.",
    metaCards: commonMetaCards({
      role: "UX/UI Design · Interaction Design · Front-End Development",
      industry: "Architecture · Renovation · Construction",
      platform: "Responsive Website",
      scope: "Interface Design · Brand Experience · Front-End Build",
    }, TEALNEX_INDUSTRY_ICONS),
  },
  breakdown: {
    productImage: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_architecture.webp?updatedAt=1792583747139",
    productImageAlt: "Tealnex architecture and renovation website experience",
    // Draft challenges — replace with final case-study copy.
    challenges: [
      {
        id: "services", number: "01", title: "Clarifying Complex Services",
        description: "Organizing architecture, renovation and construction services into a clear structure so visitors can understand the offering and find the right support.",
        side: "left", anchorX: 0.25, anchorY: 0.25,
      },
      {
        id: "projects", number: "02", title: "Showcasing Projects with Purpose",
        description: "Presenting image-rich projects with a consistent visual hierarchy that balances architectural storytelling with practical project information.",
        side: "right", anchorX: 0.75, anchorY: 0.25,
      },
      {
        id: "enquiries", number: "03", title: "Turning Interest into Enquiries",
        description: "Connecting service and project exploration to clear contact opportunities, helping prospective clients take the next step with confidence.",
        side: "left", anchorX: 0.3, anchorY: 0.8,
      },
      {
        id: "responsive", number: "04", title: "A Consistent Responsive Experience",
        description: "Adapting large architectural imagery, navigation and content across screen sizes while preserving readability and a refined brand experience.",
        side: "right", anchorX: 0.75, anchorY: 0.8,
      },
    ],
  },
  design: {
    title: "Evolution of the designs",
    description: DESIGN_INTRO,
    slides: [
      {
        image: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_BA1.jpg?updatedAt=1792491390356",
        imageMobile: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_BA1_mobile.jpg?updatedAt=1792491390952",
        alt: "Tealnex design evolution — frame 1",
      },
      {
        image: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_BA2.jpg?updatedAt=1792491391421",
        imageMobile: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_BA2_mobile.jpg?updatedAt=1792491391133",
        alt: "Tealnex design evolution — frame 2",
      },
      {
        image: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_BA3.jpg?updatedAt=1792491391256",
        imageMobile: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_BA3_mobile.jpg?updatedAt=1792491391340",
        alt: "Tealnex design evolution — frame 3",
      },
      {
        image: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_BA4.jpg?updatedAt=1792491390907",
        imageMobile: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_BA4_mobile.jpg?updatedAt=1792491391083",
        alt: "Tealnex design evolution — frame 4",
      },
    ],
  },
  uxArchitecture: {
    intro: UX_INTRO,
    items: blankUxItems().map((item, index) => {
      const imageNumber = [2, 1, 3][index];
      const imageBase = `https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex_ux_architecture${imageNumber}`;
      return {
        ...item,
        image: `${imageBase}.png`,
        imageDesktop: `${imageBase}.png`,
        imageExpanded: `${imageBase}_b.png`,
      };
    }),
  },
  techStack: TECH_STACK_CONTENT,
};

const tealtileContent: CaseStudyContent = {
  overview: {
    title: "Designing a Clearer Retail Experience",
    description:
      "A tile retail and installation shop experience — browsing products, understanding services, and connecting with the brand. UX/UI and front-end work shaped a clear, material-forward digital presence.",
    metaCards: commonMetaCards({
      role: "UX/UI Design · Interaction Design · Front-End Development",
      industry: "Tile Retail · Installation · Home Improvement",
      platform: "Responsive Website",
      scope: "Interface Design · Brand Experience · Front-End Build",
    }, TEALTILE_INDUSTRY_ICONS),
  },
  breakdown: {
    productImage: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_architecture.webp",
    productImageAlt: "Tealtile website architecture and product experience",
    // Draft challenges — replace with final case-study copy.
    challenges: [
      {
        id: "discovery", number: "01", title: "Simplifying Product Discovery",
        description: "Organizing tile collections, finishes and formats into a clear browsing experience so customers can find materials that suit their space.",
        side: "left", anchorX: 0.25, anchorY: 0.25,
      },
      {
        id: "planning", number: "02", title: "Connecting Inspiration to Planning",
        description: "Helping customers move from visual inspiration to practical decisions with clear product information and guidance for their project.",
        side: "right", anchorX: 0.75, anchorY: 0.25,
      },
      {
        id: "installation", number: "03", title: "Making Installation Services Clear",
        description: "Bringing retail and installation services together in one consistent journey, with clear next steps for requesting support and moving a project forward.",
        side: "left", anchorX: 0.3, anchorY: 0.8,
      },
      {
        id: "responsive", number: "04", title: "A Consistent Responsive Experience",
        description: "Adapting image-rich collections, product details and service enquiries across screen sizes while keeping the experience clear and easy to navigate.",
        side: "right", anchorX: 0.75, anchorY: 0.8,
      },
    ],
  },
  design: {
    title: "Evolution of the designs",
    description: DESIGN_INTRO,
    slides: [
      {
        image: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_BA4.jpg?updatedAt=1792491295199",
        imageMobile: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_BA4_mobile.jpg?updatedAt=1792491295204",
        alt: "Tealtile design evolution — frame 4",
      },
      {
        image: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_BA3.jpg?updatedAt=1792491295192",
        imageMobile: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_BA3_mobile.jpg?updatedAt=1792491295197",
        alt: "Tealtile design evolution — frame 3",
      },
      {
        image: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_BA2.jpg?updatedAt=1792491295187",
        imageMobile: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_BA2_mobile.jpg?updatedAt=1792491295299",
        alt: "Tealtile design evolution — frame 2",
      },
      {
        image: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_BA1.jpg?updatedAt=1792491321404",
        imageMobile: "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_BA1_mobile.jpg?updatedAt=1792491295273",
        alt: "Tealtile design evolution — frame 1",
      },
    ],
  },
  uxArchitecture: {
    intro: UX_INTRO,
    items: blankUxItems().map((item, index) => {
      const imageNumber = [1, 2, 3][index];
      const imageBase = `https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile_ux_architecture${imageNumber}`;
      return {
        ...item,
        image: `${imageBase}.png`,
        imageDesktop: `${imageBase}.png`,
        imageExpanded: `${imageBase}_b.png`,
      };
    }),
  },
  techStack: TECH_STACK_CONTENT,
};

const CASE_STUDY_CONTENT: Record<string, CaseStudyContent> = {
  bilit4u: bilit4uContent,
  tealnex: tealnexContent,
  tealtile: tealtileContent,
};

export function getCaseStudyContent(slug: string): CaseStudyContent | undefined {
  return CASE_STUDY_CONTENT[slug];
}
