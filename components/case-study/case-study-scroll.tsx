"use client";

import { useRouter } from "@/i18n/navigation";
import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ResponsiveBackground } from "@/components/case-study/responsive-background";
import { PageIndicator } from "@/components/fullpage/page-indicator";
import { SectionBackground } from "@/components/fullpage/section-background";
import { BackToTop } from "@/components/back-to-top";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/sections/footer-section";
import { cn } from "@/lib/utils";
import type { CaseStudySection } from "@/lib/case-studies";
import { NAV_ROUTES } from "@/lib/nav-routes";
import { sections as siteSections } from "@/lib/sections";

type CaseStudyScrollProps = {
  sections: CaseStudySection[];
  indicatorLabels?: Record<string, string>;
  children: ReactNode;
};

const TRANSITION_MS = 900;
const WHEEL_THRESHOLD = 40;
const TOUCH_THRESHOLD = 36;

const contactSection = siteSections.find((section) => section.id === "contact")!;

const FOOTER_META = {
  id: "footer",
  label: "Footer",
} as const;

export function CaseStudyScroll({
  sections,
  indicatorLabels,
  children,
}: CaseStudyScrollProps) {
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
    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "button, a, input, textarea, select, [data-no-section-swipe]",
        ),
      );
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      goTo(activeIndexRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
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
      if (event.touches.length !== 1) return;
      const dx = touchStartX.current - (event.touches[0]?.clientX ?? 0);
      const dy = touchStartY.current - (event.touches[0]?.clientY ?? 0);
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx) * 1.2) {
        event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
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

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    root?.addEventListener("touchstart", onTouchStart, { passive: true });
    root?.addEventListener("touchmove", onTouchMove, { passive: false });
    root?.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      root?.removeEventListener("touchstart", onTouchStart);
      root?.removeEventListener("touchmove", onTouchMove);
      root?.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo]);

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
      className="relative h-dvh w-full overflow-hidden touch-pan-y"
    >
      <BackToTop activeIndex={activeIndex} onBackToTop={goTo} scrollRoot={rootRef} />
      <Navbar
        activeId={isFooterActive ? "contact" : "portfolio"}
        foreground={navForeground}
        onHomeClick={goHome}
      />

      <div
        className="h-full w-full transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
        style={{
          transform: `translate3d(0, -${activeIndex * 100}%, 0)`,
          transitionDuration: `${transitionMs}ms`,
        }}
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
              <div className="absolute inset-0 -z-10 overflow-hidden bg-[#FCF6EF]">
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
              <div className="relative z-10 flex h-full w-full min-h-0 flex-col">
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
