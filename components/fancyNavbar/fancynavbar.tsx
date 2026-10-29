"use client";

import {useTranslations} from "next-intl";
import {LanguageSwitcher} from "@/components/language-switcher";

import { gsap } from "gsap";
import { Globe, Mail, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, type SVGProps } from "react";

import { MenuButton } from "@/components/menu-button";
import { cn } from "@/lib/utils";
import { type SectionId } from "@/lib/sections";

const LOGO_SRC =
  "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/yeganehheshmat_logo.svg?updatedAt=1792670046410";
const MENU_BG_SRC = "https://ik.imagekit.io/s7yz964lq/assets/MENU.jpg";

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const menuLinks: { label: string; id: SectionId }[] = [
  { label: "Home", id: "home" },
  { label: "About Me", id: "about" },
  { label: "Portfolio", id: "portfolio" },
  { label: "Contact Me", id: "contact" },
];

const contactItems = [
  {
    icon: Mail,
    label: "hello@yeganehheshmat.com",
    href: "mailto:hello@yeganehheshmat.com",
  },
  {
    icon: MapPin,
    label: "Tehran, Iran",
  },
  {
    icon: Globe,
    label: "yeganehheshmat.com",
    href: "https://yeganehheshmat.com",
  },
  {
    icon: LinkedInIcon,
    label: "linkedin.com/in/yeganeh-heshmat",
    href: "https://linkedin.com/in/yeganeh-heshmat",
  },
] as const;

type FancyNavbarProps = {
  onNavigate?: (id: SectionId) => void;
  activeId?: SectionId;
};

function MenuOrnament({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "menu-ornament",
        orientation === "vertical" && "menu-ornament-vertical",
        className,
      )}
      aria-hidden
    >
      <span className="menu-ornament-line" />
      <span className="menu-ornament-diamond" />
      <span className="menu-ornament-line" />
    </div>
  );
}

function FancyNavLink({
  label,
  id,
  isActive,
  onNavigate,
}: {
  label: string;
  id: SectionId;
  isActive: boolean;
  onNavigate: (id: SectionId) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      data-section-id={id}
      onClick={() => onNavigate(id)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "fancy-nav-link relative block w-max text-center font-medium tracking-[0.14em] uppercase",
        isActive || hovered ? "opacity-100" : "opacity-55",
      )}
      animate={{ x: hovered ? 4 : 0 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {label}
    </motion.button>
  );
}

function FancyNavbar({ onNavigate, activeId }: FancyNavbarProps) {
  const t = useTranslations("Nav");
  const images = useTranslations("Images");
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const onNavigateRef = useRef(onNavigate);
  useLayoutEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);
  const closeMenuRef = useRef<(() => void) | null>(null);
  const menuStateRef = useRef({ isOpen: false, isAnimating: false });

  const navigateTo = (id: SectionId) => {
    onNavigateRef.current?.(id);
    const { isOpen, isAnimating } = menuStateRef.current;
    if (isOpen && !isAnimating) {
      menuStateRef.current.isAnimating = true;
      menuStateRef.current.isOpen = false;
      closeMenuRef.current?.();
    }
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const navToggle = root.querySelector<HTMLElement>("[data-menu-toggle]");
    const menu = root.querySelector<HTMLElement>(".menu");
    const menuBg = root.querySelector<SVGPathElement>(".menu-path");
    const menuBgSvg = root.querySelector<SVGSVGElement>(".menu-bg-svg");
    const navLogoButton =
      root.querySelector<HTMLButtonElement>(".nav-logo button");
    const menuLinkEls = Array.from(
      root.querySelectorAll<HTMLElement>(".menu-col-links .fancy-nav-link"),
    );
    const menuInfoItems = Array.from(
      root.querySelectorAll<HTMLElement>(".menu-info-reveal"),
    );
    const menuOrnaments = Array.from(
      root.querySelectorAll<HTMLElement>(".menu-ornament"),
    );

    if (
      !navToggle ||
      !menu ||
      !menuBg ||
      !menuBgSvg
    ) {
      return;
    }

    const svgWidth = menuBgSvg.viewBox.baseVal.width;
    const svgHeight = menuBgSvg.viewBox.baseVal.height;
    const svgCenterX = svgWidth / 2;

    const OPEN_HIDDEN = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,0 L${svgWidth},0 Z`;
    const OPEN_BULGE = `M${svgWidth},345 Q${svgCenterX},620 0,345 L0,0 L${svgWidth},0 Z`;
    const OPEN_FULL = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,0 L${svgWidth},0 Z`;
    const CLOSE_START = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,${svgHeight} L${svgWidth},${svgHeight} Z`;
    const CLOSE_BULGE = `M${svgWidth},350 Q${svgCenterX},130 0,350 L0,${svgHeight} L${svgWidth},${svgHeight} Z`;
    const CLOSE_HIDDEN = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,${svgHeight} L${svgWidth},${svgHeight} Z`;

    let activeTimeline: gsap.core.Timeline | null = null;

    const context = gsap.context(() => {
      gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });
      gsap.set(menuLinkEls, { opacity: 0, y: 24 });
      gsap.set(menuInfoItems, { opacity: 0, y: 24 });
      gsap.set(menuOrnaments, { opacity: 0 });

      const openMenu = () => {
        menu.classList.add("is-open");
        menu.inert = false;
        setExpanded(true);

        activeTimeline = gsap.timeline({
          onComplete: () => {
            menuStateRef.current.isAnimating = false;
          },
        });

        activeTimeline
          .to(menuBg, {
            duration: 0.5,
            attr: { d: OPEN_BULGE },
            ease: "power4.in",
          })
          .to(menuBg, {
            duration: 0.5,
            attr: { d: OPEN_FULL },
            ease: "power4.out",
          });

        activeTimeline.to(
          menuOrnaments,
          {
            duration: 0.45,
            opacity: 1,
            ease: "power2.out",
          },
          "-=0.55",
        );
        activeTimeline.to(
          menuInfoItems,
          {
            duration: 0.75,
            opacity: 1,
            y: 0,
            ease: "power3.out",
            stagger: 0.07,
          },
          "-=0.45",
        );
        activeTimeline.to(
          menuLinkEls,
          {
            duration: 0.75,
            opacity: 1,
            y: 0,
            ease: "power3.out",
            stagger: 0.075,
          },
          "-=0.55",
        );
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) activeTimeline.progress(1);
      };

      const closeMenu = () => {
        gsap.set(menuBg, { attr: { d: CLOSE_START } });

        setExpanded(false);
        menu.inert = true;
        navToggle.focus();

        activeTimeline = gsap.timeline({
          onComplete: () => {
            menu.classList.remove("is-open");
            gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });
            gsap.set(menuLinkEls, { opacity: 0, y: 24 });
            gsap.set(menuInfoItems, { opacity: 0, y: 24 });
            gsap.set(menuOrnaments, { opacity: 0 });
            menuStateRef.current.isAnimating = false;
          },
        });

        activeTimeline
          .to(menuLinkEls, { duration: 0.3, opacity: 0 })
          .to(menuInfoItems, { duration: 0.3, opacity: 0 }, "<")
          .to(menuOrnaments, { duration: 0.25, opacity: 0 }, "<");

        activeTimeline
          .to(
            menuBg,
            {
              duration: 0.5,
              attr: { d: CLOSE_BULGE },
              ease: "power3.in",
            },
            "<",
          )
          .to(menuBg, {
            duration: 0.5,
            attr: { d: CLOSE_HIDDEN },
            ease: "power3.out",
          });
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) activeTimeline.progress(1);
      };

      closeMenuRef.current = closeMenu;

      const toggleMenu = () => {
        if (menuStateRef.current.isAnimating) return;
        menuStateRef.current.isAnimating = true;
        menuStateRef.current.isOpen = !menuStateRef.current.isOpen;
        if (menuStateRef.current.isOpen) openMenu();
        else closeMenu();
      };

      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape" && menuStateRef.current.isOpen && !menuStateRef.current.isAnimating) toggleMenu();
      };
      const onLogoClick = () => navigateTo("home");

      navToggle.addEventListener("click", toggleMenu);
      root.addEventListener("keydown", onKey);
      navLogoButton?.addEventListener("click", onLogoClick);

      return () => {
        navToggle.removeEventListener("click", toggleMenu);
        root.removeEventListener("keydown", onKey);
        navLogoButton?.removeEventListener("click", onLogoClick);
        activeTimeline?.kill();
        closeMenuRef.current = null;
      };
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="fancy-navbar">
      <div className="nav">
        <div className="nav-bar" dir="ltr">
          <div className="nav-logo">
            <button
              type="button"
              aria-label={images("home")}
              className="nav-logo-button"
            >
              <Image
                src={LOGO_SRC}
                alt={images("logo")}
                width={300}
                height={300}
                className="h-auto w-full"
                priority
              />
            </button>
          </div>
          <div className="flex items-center gap-4"><LanguageSwitcher desktop /><MenuButton expanded={expanded} controls="desktop-primary-nav" data-menu-toggle /></div>
        </div>

        <div className="menu" id="desktop-primary-nav" inert={!expanded}>
          <div className="menu-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MENU_BG_SRC}
              alt=""
              className="menu-bg-image"
            />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1131 861"
            className="menu-bg-svg"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <clipPath
                id="fancy-menu-clip"
                clipPathUnits="objectBoundingBox"
              >
                <path
                  id="menu-path"
                  className="menu-path"
                  transform="scale(0.000884173, 0.00116144)"
                  d="M1131,0 Q565.5,0 0,0 L0,0 L1131,0 Z"
                />
              </clipPath>
            </defs>
          </svg>

          <div className="menu-body">
            <div className="menu-col menu-col-info">
              <h2 className="menu-info-heading menu-info-reveal">
                {t("hello")}
              </h2>
              <p className="menu-info-bio menu-info-reveal">
                {t("bio")}
              </p>
              <MenuOrnament className="menu-info-reveal" />
              <p className="menu-info-role menu-info-reveal">
                {t("role")}
              </p>
              <ul className="menu-contact-list">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <>
                      <Icon aria-hidden className="menu-contact-icon" />
                      <span>{item.label}</span>
                    </>
                  );

                  return (
                    <li key={item.label} className="menu-info-reveal">
                      {"href" in item && item.href ? (
                        <a
                          href={item.href}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="menu-contact-item"
                        >
                          {content}
                        </a>
                      ) : (
                        <span className="menu-contact-item">{content}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <MenuOrnament orientation="vertical" className="menu-split" />

            <div className="menu-col menu-col-links">
              {menuLinks.map((link, index) => (
                <div key={link.id} className="menu-link-block">
                  {index > 0 ? <MenuOrnament /> : null}
                  <FancyNavLink
                    {...link}
                    label={t(link.id)}
                    isActive={activeId === link.id}
                    onNavigate={navigateTo}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FancyNavbar;
