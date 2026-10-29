import type { SectionId } from "@/lib/sections";

/** Primary nav destinations — used by desktop + mobile menus */
export const NAV_ROUTES: Record<
  Extract<SectionId, "home" | "about" | "portfolio" | "contact">,
  string
> = {
  home: "/",
  about: "/about",
  portfolio: "/portfolio",
  contact: "/contact",
};

export function isNavRouteId(
  id: SectionId,
): id is keyof typeof NAV_ROUTES {
  return id in NAV_ROUTES;
}
