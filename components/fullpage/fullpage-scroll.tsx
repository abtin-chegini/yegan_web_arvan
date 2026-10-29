"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { FullpageContext } from "@/components/fullpage/fullpage-context";
import { PageIndicator } from "@/components/fullpage/page-indicator";
import { SectionBackground } from "@/components/fullpage/section-background";
import { BackToTop } from "@/components/back-to-top";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { sections as defaultSections, type Section, type SectionId } from "@/lib/sections";

export { useFullpage } from "@/components/fullpage/fullpage-context";

type FullpageScrollProps = {
  children: ReactNode;
  sections?: Section[];
};

const TRANSITION_MS = 900;
const WHEEL_THRESHOLD = 40;
const TOUCH_THRESHOLD = 36;

export function FullpageScroll({
  children,
  sections = defaultSections,
}: FullpageScrollProps) {
  const slides = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionMs, setTransitionMs] = useState(TRANSITION_MS);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const locked = useRef(false);
  const activeIndexRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

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
    [slides.length]
  );

  const goToId = useCallback(
    (id: SectionId) => {
      const index = sections.findIndex((section) => section.id === id);
      if (index >= 0) goTo(index);
    },
    [goTo, sections]
  );

  useEffect(() => {
    if (activeIndexRef.current < slides.length) return;
    const last = Math.max(0, slides.length - 1);
    activeIndexRef.current = last;
    setActiveIndex(last);
  }, [slides.length]);

  useEffect(() => {
    const isFormFieldFocused = () => {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (el as HTMLElement).isContentEditable
      );
    };

    const onWheel = (event: WheelEvent) => {
      if (isFormFieldFocused()) return;
      event.preventDefault();
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      goTo(activeIndexRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isFormFieldFocused()) return;
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(activeIndexRef.current + 1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(activeIndexRef.current - 1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        goTo(slides.length - 1);
      }
    };

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "button, a, input, textarea, select, [data-no-section-swipe]",
        ),
      );
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
  }, [slides.length, goTo]);

  return (
    <FullpageContext.Provider value={{ activeIndex, goTo, goToId }}>
      <div
        ref={rootRef}
        className="relative h-dvh w-full overflow-hidden touch-pan-y"
      >
        <BackToTop activeIndex={activeIndex} onBackToTop={goTo} scrollRoot={rootRef} />
        <Navbar />
        <div
          className="h-full w-full transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
          style={{
            transform: `translate3d(0, -${activeIndex * 100}%, 0)`,
            transitionDuration: `${transitionMs}ms`,
          }}
        >
          {slides.map((child, index) => {
            const section = sections[index];
            return (
              <section
                key={section.id}
                id={section.id}
                aria-label={section.label}
                data-active={index === activeIndex}
                className={cn(
                  "relative flex h-dvh w-full flex-col justify-center overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-14 md:pt-28 lg:pt-32",
                  section.contentInset === "art-left" &&
                    "px-5 md:pl-[min(34vw,22rem)] md:pr-10 lg:pl-[min(32vw,24rem)] lg:pr-14 xl:pl-[min(30vw,26rem)]",
                  section.contentInset === "art-right" &&
                    "px-5 pb-16 pr-5 md:pl-8 md:pr-[min(22vw,14rem)] md:pb-20 lg:pl-12 lg:pr-[min(24vw,16rem)] lg:pb-24",
                  section.contentInset === "default" &&
                    "px-5 sm:px-10 lg:px-16",
                  index === activeIndex &&
                    !isAnimating &&
                    "fullpage-section-active"
                )}
                style={{
                  color: section.foreground,
                  ["--section-muted" as string]: section.muted,
                }}
              >
                <div className="absolute inset-0 -z-10 overflow-hidden bg-[#FCF6EF]">
                  <SectionBackground
                    section={section}
                    priority={index === 0}
                  />
                </div>
                <div className="relative z-10 flex h-full w-full min-h-0 flex-col">
                  {child}
                </div>
              </section>
            );
          })}
        </div>

        <PageIndicator
          sections={sections}
          activeIndex={activeIndex}
          onGoTo={goTo}
          color={sections[activeIndex]?.foreground ?? "currentColor"}
        />
      </div>
    </FullpageContext.Provider>
  );
}
