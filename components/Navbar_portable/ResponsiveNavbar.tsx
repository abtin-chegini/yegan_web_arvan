"use client";

import {useTranslations, useLocale} from "next-intl";

import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect, useState } from "react";

import { Curve } from "@/components/Navbar_portable/curve";
import {
  menuSlide,
  slide,
} from "@/components/Navbar_portable/navbar-animations";
import { FullpageContext } from "@/components/fullpage/fullpage-context";
import { MenuIcon } from "@/components/menu-button";
import { cn } from "@/lib/utils";
import { sections, type SectionId } from "@/lib/sections";

const MENU_BG = "#FCF6EF";
const MENU_BG_IMAGE =
  "https://ik.imagekit.io/s7yz964lq/assets/background_menu.jpg";
const LOGO_SRC =
  "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/yeganehheshmat_logo.png";

const navLinks: { label: string; id: SectionId }[] = [
  { label: "Home", id: "home" },
  { label: "About Me", id: "about" },
  { label: "Portfolio", id: "portfolio" },
  { label: "Contact Me", id: "contact" },
];

function MobileNavLink({
  label,
  id,
  index,
  isActive,
  onNavigate,
}: {
  label: string;
  id: SectionId;
  index: number;
  isActive: boolean;
  onNavigate: (id: SectionId) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const showLine = isActive || hovered;

  return (
    <motion.div
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.button
        type="button"
        onClick={() => onNavigate(id)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative block w-full py-2 text-start font-serif text-lg font-medium tracking-[0.14em] uppercase sm:text-xl",
          isActive || hovered ? "opacity-100" : "opacity-55"
        )}
        animate={{ x: hovered ? 4 : 0 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {label}
        <motion.span
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current"
          initial={false}
          animate={{
            scaleX: showLine ? 1 : 0,
            opacity: isActive ? 1 : hovered ? 0.65 : 0,
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.button>
    </motion.div>
  );
}

type ResponsiveNavbarProps = {
  className?: string;
  onNavigate?: (id: SectionId) => void;
  activeId?: SectionId;
  foreground?: string;
};

/**
 * Fancy burger + curved slide menu — visible only below `md`.
 * Desktop navigation stays in the parent Navbar.
 */
export function ResponsiveNavbar({
  className = "",
  onNavigate,
  activeId: activeIdProp,
  foreground: foregroundProp,
}: ResponsiveNavbarProps) {
  const t = useTranslations("Nav");
  const images = useTranslations("Images");
  const locale = useLocale();
  const fullpage = useContext(FullpageContext);
  const [isOpen, setIsOpen] = useState(false);

  const activeId =
    activeIdProp ??
    (fullpage ? sections[fullpage.activeIndex]?.id : undefined);
  const foreground =
    foregroundProp ??
    (fullpage ? sections[fullpage.activeIndex]?.foreground : undefined) ??
    "currentColor";

  const navigate = (id: SectionId) => {
    const handler = onNavigate ?? fullpage?.goToId;
    if (handler) {
      handler(id);
    } else {
      window.location.href = `/${locale}/#${id}`;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={cn("relative flex h-full items-center md:hidden", className)}>
      <motion.button
        type="button"
        aria-label={isOpen ? t("close") : t("open")}
        aria-expanded={isOpen}
        aria-controls="mobile-primary-nav"
        className="relative z-50 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-current/10 bg-[#FCF6EF]/92 shadow-[0_4px_18px_-8px_rgba(29,53,87,0.22)] backdrop-blur-md"
        style={{ color: foreground }}
        initial={false}
        onClick={() => setIsOpen((open) => !open)}
      >
        <MenuIcon expanded={isOpen} />
      </motion.button>
      <AnimatePresence>
        {isOpen ? (
          <motion.button
            key="nav-overlay"
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-[#1a2f28]/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setIsOpen(false)}
          />
        ) : null}
        {isOpen ? (
          <motion.div
            key="nav-panel"
            id="mobile-primary-nav"
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed top-0 right-0 z-40 flex h-dvh w-[min(86vw,22rem)] flex-col"
            dir={locale === "fa" ? "rtl" : "ltr"}
            style={{
              color: foreground,
              backgroundColor: MENU_BG,
              borderLeft: "1px solid rgba(252, 246, 239, 0.4)",
              boxShadow: "0 8px 40px rgba(26, 47, 40, 0.12)",
            }}
          >
            {/* Floral background — art sits on the right, links stay on clear cream */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${MENU_BG_IMAGE}?tr=w-800,q-80`}
                alt=""
                className="h-full w-full object-cover object-right"
                decoding="async"
              />
            </div>

            <div className="relative z-10 flex h-full flex-col">
              {/* Brand header — matches 50px bar height */}
              <div className="flex h-[50px] items-center gap-3 px-4">
                <span className="w-12 shrink-0" aria-hidden />
                <button
                  type="button"
                  onClick={() => navigate("home")}
                  aria-label={images("home")}
                  className="min-w-0 transition-opacity hover:opacity-80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={LOGO_SRC}
                    alt={images("logo")}
                    width={150}
                    height={42}
                    className="h-7 w-auto"
                    decoding="async"
                  />
                </button>
              </div>

              {/* Nav stack — anchored toward the top */}
              <nav
                aria-label="Mobile primary"
                className="flex flex-1 flex-col justify-start px-5 pt-6 pb-8 sm:px-8"
              >
                <ul className="flex flex-col gap-5">
                  {navLinks.map((link, index) => (
                    <li key={link.id}>
                      <MobileNavLink
                        {...link}
                        label={t(link.id)}
                        index={index}
                        isActive={activeId === link.id}
                        onNavigate={navigate}
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="px-5 py-5 sm:px-8">
                <p className="font-sans text-xs font-medium tracking-[0.16em] uppercase opacity-40">
                  Yegan — Portfolio
                </p>
              </div>
            </div>

            <Curve color={MENU_BG} side="left" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default ResponsiveNavbar;
