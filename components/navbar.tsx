"use client";

import {LanguageSwitcher} from "@/components/language-switcher";

import {useTranslations} from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { useCallback, useContext } from "react";

import FancyNavbar from "@/components/fancyNavbar/fancynavbar";
import { ResponsiveNavbar } from "@/components/Navbar_portable/ResponsiveNavbar";
import { FullpageContext } from "@/components/fullpage/fullpage-context";
import { isNavRouteId, NAV_ROUTES } from "@/lib/nav-routes";
import { sections, type SectionId } from "@/lib/sections";

const LOGO_SRC =
  "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/yeganehheshmat_logo.png";

export type NavbarProps = {
  /** Override section navigation for non-routed section ids */
  onNavigate?: (id: SectionId) => void;
  activeId?: SectionId;
  foreground?: string;
  onHomeClick?: () => void;
};

export function Navbar({
  onNavigate,
  activeId: activeIdProp,
  foreground: foregroundProp,
  onHomeClick,
}: NavbarProps = {}) {
  const images = useTranslations("Images");
  const router = useRouter();
  const fullpage = useContext(FullpageContext);

  const activeId =
    activeIdProp ??
    (fullpage ? sections[fullpage.activeIndex]?.id : undefined);
  const foreground =
    foregroundProp ??
    (fullpage ? sections[fullpage.activeIndex]?.foreground : undefined) ??
    "#1d3557";

  const goToId = useCallback(
    (id: SectionId) => {
      if (isNavRouteId(id)) {
        router.push(NAV_ROUTES[id]);
        return;
      }

      if (onNavigate) {
        onNavigate(id);
        return;
      }

      fullpage?.goToId?.(id);
    },
    [fullpage, onNavigate, router],
  );

  return (
    <>
      {/* Mobile navigation */}
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-60 md:hidden"
        style={{ color: foreground }}
      >
        <div className="relative flex h-[68px] items-center justify-between gap-4 px-4 sm:px-5">
          <button
            type="button"
            onClick={onHomeClick ?? (() => router.push(NAV_ROUTES.home))}
            aria-label={images("home")}
            className="pointer-events-auto flex min-h-11 min-w-0 items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt={images("logo")}
              width={140}
              height={40}
              className="h-7 w-auto max-w-full object-contain"
              decoding="async"
            />
          </button>
          <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ResponsiveNavbar
            className="pointer-events-auto shrink-0"
            onNavigate={goToId}
            activeId={activeId}
            foreground={foreground}
          />
          </div>
        </div>
      </header>

      {/* Tablet + desktop (md / lg / xl / 2xl) */}
      <div className="hidden md:block" style={{ color: foreground }}>
        <FancyNavbar onNavigate={goToId} activeId={activeId} />
      </div>
    </>
  );
}
