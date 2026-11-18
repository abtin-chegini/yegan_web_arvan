"use client";

import { useRouter } from "@/i18n/navigation";
import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { MobilePageScroll, type MobilePageSlide } from "@/components/fullpage/mobile-page-scroll";
import { useMobileViewport } from "@/lib/use-mobile-viewport";
import { ResponsiveBackground } from "@/components/case-study/responsive-background";
import { PageIndicator } from "@/components/fullpage/page-indicator";
import { SectionBackground } from "@/components/fullpage/section-background";
import { BackToTop } from "@/components/back-to-top";
import { Navbar } from "@/components/navbar";
import { SiteFooter as FooterSection, useSiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import type { CaseStudySection } from "@/lib/case-studies";
import { NAV_ROUTES } from "@/lib/nav-routes";
import styles from "./case-study-scroll.module.css";


type CaseStudyScrollProps = {
  sections: CaseStudySection[];
  indicatorLabels?: Record<string, string>;
  studySlug?: string;
  children: ReactNode;
};

const TRANSITION_MS = 900;
const WHEEL_THRESHOLD = 40;
const TOUCH_THRESHOLD = 36;


const FOOTER_META = {
  id: "footer",
  label: "Footer",
} as const;

export function CaseStudyScroll(props: CaseStudyScrollProps) {
  const isMobile = useMobileViewport();
  return isMobile ? <MobileCaseStudyScroll {...props} /> : <DesktopCaseStudyScroll {...props} />;
}

function MobileCaseStudyScroll({ sections, studySlug, children }: CaseStudyScrollProps) {
  const { section: contactSection } = useSiteFooter();
  const content = Children.toArray(children);
  const slides: MobilePageSlide[] = sections.map((section, index) => ({
    id: section.id,
    label: section.label,
    navId: "portfolio",
    foreground: "#1d3557",
    content: content[index],
    background: <ResponsiveBackground
      images={section.images}
      desktopImages={section.desktopImages}
      objectFit={section.objectFit}
      objectPosition={section.objectPosition}
      backgroundScale={section.backgroundScale}
      solidBackground={section.solidBackground}
      priority={index === 0}
    />,
  }));
  slides.push({
    id: FOOTER_META.id,
    label: FOOTER_META.label,
    navId: "contact",
    foreground: contactSection.foreground,
    muted: contactSection.muted,
    content: <FooterSection />,
    background: <SectionBackground section={contactSection} />,
  });
  return <MobilePageScroll slides={slides} studySlug={studySlug} />;
}

function DesktopCaseStudyScroll({
  sections,
  indicatorLabels,
  studySlug,
  children,
}: CaseStudyScrollProps) {
  const { section: contactSection } = useSiteFooter();
  const router = useRouter();
  const contentSlides = Children.toArray(children);
  const slides = [...contentSlides, <FooterSection key="site-footer" />];
  const indicatorSections = useMemo(
    () => [
      ...sections.map((section) => ({ id: section.id, label: section.label })),
      FOOTER_META,
    ],
    [sections],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionMs, setTransitionMs] = useState(TRANSITION_MS);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const locked = useRef(false);
  const activeIndexRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const footerIndex = sections.length;
  const isFooterActive = activeIndex === footerIndex;

  const goTo = useCallback(
    (next: number, behavior: ScrollBehavior = "smooth") => {
      if (locked.current) return;
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      if (clamped === activeIndexRef.current) return;

      const duration = behavior === "instant" ? 0 : TRANSITION_MS;
      setTransitionMs(duration);
      locked.current = true;
      setIsAnimating(true);
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);

      if (window.matchMedia("(min-width: 1280px)").matches) {
        const root = rootRef.current;
        const section = root?.querySelectorAll<HTMLElement>("[data-case-study-track] > section")[clamped];
        if (root && section) {
          root.focus({ preventScroll: true });
          root.scrollTo({ top: section.offsetTop, behavior });
        }
      }

      window.setTimeout(() => {
        locked.current = false;
        setIsAnimating(false);
      }, duration);
    },
    [slides.length],
  );

  useEffect(() => {
    if (activeIndexRef.current < slides.length) return;
    const last = Math.max(0, slides.length - 1);
    activeIndexRef.current = last;
    setActiveIndex(last);
  }, [slides.length]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const nativeScroll = window.matchMedia("(min-width: 1280px)");

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "button, a, input, textarea, select, [data-no-section-swipe]",
        ),
      );
    };

    const onWheel = (event: WheelEvent) => {
      // Let the browser scroll the full content of an oversized Challenges
      // slide before continuing to the next section.
      if (nativeScroll.matches && sections[activeIndexRef.current]?.id === "challenge") return;
      event.preventDefault();
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      goTo(activeIndexRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (nativeScroll.matches && isInteractiveTarget(event.target)) return;
      if (nativeScroll.matches && sections[activeIndexRef.current]?.id === "challenge") return;
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(activeIndexRef.current + 1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(activeIndexRef.current - 1);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      touchStartX.current = event.touches[0]?.clientX ?? 0;
      touchStartY.current = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (nativeScroll.matches) return;
      if (event.touches.length !== 1) return;
      const dx = touchStartX.current - (event.touches[0]?.clientX ?? 0);
      const dy = touchStartY.current - (event.touches[0]?.clientY ?? 0);
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx) * 1.2) {
        event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (nativeScroll.matches) return;
      if (isInteractiveTarget(event.target)) return;
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const endY = event.changedTouches[0]?.clientY ?? 0;
      const dx = touchStartX.current - endX;
      const dy = touchStartY.current - endY;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      if (Math.abs(dy) <= Math.abs(dx) * 1.15) return;
      goTo(activeIndexRef.current + (dy > 0 ? 1 : -1));
    };

    const root = rootRef.current;

    const syncActiveSection = () => {
      if (!nativeScroll.matches || !root || locked.current) return;
      const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-case-study-track] > section"));
      const next = elements.findIndex((section) => section.offsetTop + section.offsetHeight > root.scrollTop + 1);
      if (next < 0 || next === activeIndexRef.current) return;
      activeIndexRef.current = next;
      setActiveIndex(next);
    };

    const syncScrollMode = () => {
      if (!root) return;
      const section = root.querySelectorAll<HTMLElement>("[data-case-study-track] > section")[activeIndexRef.current];
      root.scrollTo({ top: nativeScroll.matches ? section?.offsetTop ?? 0 : 0, behavior: "instant" });
    };

    nativeScroll.addEventListener("change", syncScrollMode);
    root?.addEventListener("scroll", syncActiveSection, { passive: true });
    syncScrollMode();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    root?.addEventListener("touchstart", onTouchStart, { passive: true });
    root?.addEventListener("touchmove", onTouchMove, { passive: false });
    root?.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      nativeScroll.removeEventListener("change", syncScrollMode);
      root?.removeEventListener("scroll", syncActiveSection);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      root?.removeEventListener("touchstart", onTouchStart);
      root?.removeEventListener("touchmove", onTouchMove);
      root?.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo, sections]);

  const goHome = useCallback(() => {
    router.push(NAV_ROUTES.home);
  }, [router]);

  const navForeground = isFooterActive
    ? contactSection.foreground
    : "#1d3557";
  const indicatorColor = isFooterActive
    ? contactSection.foreground
    : "#1d3557";

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      data-case-study={studySlug}
      className={cn("relative h-dvh w-full overflow-hidden touch-pan-y", styles.root)}
    >
      <BackToTop activeIndex={activeIndex} onBackToTop={goTo} scrollRoot={rootRef} />
      <Navbar
        activeId={isFooterActive ? "contact" : "portfolio"}
        foreground={navForeground}
        onHomeClick={goHome}
      />

      <div
        data-case-study-track
        className={cn("h-full w-full transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform", styles.track)}
        style={{
          "--case-study-offset": `-${activeIndex * 100}%`,
          transitionDuration: `${transitionMs}ms`,
        } as CSSProperties}
      >
        {slides.map((child, index) => {
          const isFooter = index === footerIndex;
          const section = isFooter ? null : sections[index];

          return (
            <section
              key={isFooter ? FOOTER_META.id : section!.id}
              id={isFooter ? FOOTER_META.id : section!.id}
              aria-label={isFooter ? FOOTER_META.label : section!.label}
              data-active={index === activeIndex}
              className={cn(
                "relative flex h-dvh w-full flex-col justify-center overflow-hidden px-5 pt-20 pb-12 sm:px-10 sm:pt-24 sm:pb-14",
                styles.section,
                section?.id === "challenge" && styles.challenge,
                isFooter && "lg:px-16 md:pt-28 lg:pt-32",
                index === activeIndex &&
                  !isAnimating &&
                  "case-study-section-active",
              )}
              style={
                isFooter
                  ? {
                      color: contactSection.foreground,
                      ["--section-muted" as string]: contactSection.muted,
                    }
                  : undefined
              }
            >
              <div className="absolute inset-0 z-0 overflow-hidden bg-[#FCF6EF]">
                {isFooter ? (
                  <SectionBackground section={contactSection} />
                ) : (
                  <ResponsiveBackground
                    images={section!.images}
                    desktopImages={section!.desktopImages}
                    objectFit={section!.objectFit}
                    objectPosition={section!.objectPosition}
                    backgroundScale={section!.backgroundScale}
                    solidBackground={section!.solidBackground}
                    priority={index === 0}
                  />
                )}
              </div>
              <div className={cn("relative z-10 flex h-full w-full min-h-0 flex-col", styles.content)}>
                {child}
              </div>
            </section>
          );
        })}
      </div>

      <PageIndicator
        sections={indicatorSections}
        labelOverrides={indicatorLabels}
        activeIndex={activeIndex}
        onGoTo={goTo}
        color={indicatorColor}
      />
    </div>
  );
}
