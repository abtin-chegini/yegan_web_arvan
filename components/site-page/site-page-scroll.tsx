"use client";

import { useRouter } from "@/i18n/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { PageIndicator } from "@/components/fullpage/page-indicator";
import { SectionBackground } from "@/components/fullpage/section-background";
import { BackToTop } from "@/components/back-to-top";
import { Navbar } from "@/components/navbar";
import { SiteFooter as FooterSection, useSiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import { type Section, type SectionId } from "@/lib/sections";

const TRANSITION_MS = 900;
const WHEEL_THRESHOLD = 40;
const TOUCH_THRESHOLD = 36;


type SitePageScrollProps = {
  activeNavId: SectionId;
  mainId: string;
  mainLabel: string;
  mainSection: Section;
  children: ReactNode;
  /** Append the shared site footer as a second slide (default true) */
  withFooter?: boolean;
  /** Section background artwork on the main slide (default true) */
  showMainBackground?: boolean;
  /** Right-side page dots (default true) */
  showPageIndicator?: boolean;
  /** Animated mouse scroll cue on the main slide (default false) */
  showScrollHint?: boolean;
};

export function SitePageScroll({
  activeNavId,
  mainId,
  mainLabel,
  mainSection,
  children,
  withFooter = true,
  showMainBackground = true,
  showPageIndicator = true,
  showScrollHint = false,
}: SitePageScrollProps) {
  const { section: contactSection } = useSiteFooter();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionMs, setTransitionMs] = useState(TRANSITION_MS);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const locked = useRef(false);
  const activeIndexRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const slides = useMemo(() => {
    const main = {
      id: mainId,
      label: mainLabel,
      section: mainSection,
      content: children,
      navId: activeNavId,
    };

    if (!withFooter) return [main];

    return [
      main,
      {
        id: "footer",
        label: "Footer",
        section: contactSection,
        content: <FooterSection key="site-footer" />,
        navId: "contact" as SectionId,
      },
    ];
  }, [activeNavId, children, mainId, mainLabel, mainSection, withFooter, contactSection]);

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
    if (slides.length <= 1) return;

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "button, a, input, textarea, select, [data-no-section-swipe]",
        ),
      );
    };

    const onWheel = (event: WheelEvent) => {
      const scroller = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-page-scroll]")
        : null;
      if (scroller && (
        (event.deltaY > 0 && scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 2) ||
        (event.deltaY < 0 && scroller.scrollTop > 2)
      )) return;
      event.preventDefault();
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      goTo(activeIndexRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveTarget(event.target)) return;
      const scroller = rootRef.current?.querySelector<HTMLElement>("section[data-active='true'] [data-page-scroll]");
      const down = ["ArrowDown", "PageDown", " "].includes(event.key);
      const up = ["ArrowUp", "PageUp"].includes(event.key);
      if (scroller && ((down && scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 2) || (up && scroller.scrollTop > 2))) {
        event.preventDefault();
        scroller.scrollBy({ top: (down ? 1 : -1) * (event.key.startsWith("Arrow") ? 40 : scroller.clientHeight * 0.8) });
        return;
      }
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
      if (event.target instanceof Element && event.target.closest("[data-page-scroll]")) return;
      if (event.touches.length !== 1) return;
      const dx = touchStartX.current - (event.touches[0]?.clientX ?? 0);
      const dy = touchStartY.current - (event.touches[0]?.clientY ?? 0);
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx) * 1.2) {
        event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (isInteractiveTarget(event.target)) return;
      const scroller = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-page-scroll]") : null;
      if (scroller && scroller.scrollHeight > scroller.clientHeight + 2) return;
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
  }, [goTo, slides.length]);

  const activeSlide = slides[activeIndex]!;

  return (
    <div
      ref={rootRef}
      className="relative h-dvh w-full overflow-hidden touch-pan-y"
    >
      <BackToTop activeIndex={activeIndex} onBackToTop={goTo} scrollRoot={rootRef} />
      <Navbar
        activeId={activeSlide.navId}
        foreground={activeSlide.section.foreground}
        onHomeClick={() => router.push("/")}
      />

      <div
        className="h-full w-full transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
        style={{
          transform: `translate3d(0, -${activeIndex * 100}%, 0)`,
          transitionDuration: `${transitionMs}ms`,
        }}
      >
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            id={slide.id}
            aria-label={slide.label}
            data-active={index === activeIndex}
            className={cn(
              "relative flex h-dvh w-full flex-col justify-center overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-14 md:pt-28 lg:pt-32",
              slide.section.contentInset === "art-left" &&
                "px-5 md:pl-[min(34vw,22rem)] md:pr-10 lg:pl-[min(32vw,24rem)] lg:pr-14 xl:pl-[min(30vw,26rem)]",
              slide.section.contentInset === "art-right" &&
                "px-5 pb-16 pr-5 md:pl-8 md:pr-[min(22vw,14rem)] md:pb-20 lg:pl-12 lg:pr-[min(24vw,16rem)] lg:pb-24",
              slide.section.contentInset === "default" &&
                "px-5 sm:px-10 lg:px-16",
              index === activeIndex &&
                !isAnimating &&
                "fullpage-section-active",
            )}
            style={{
              color: slide.section.foreground,
              ["--section-muted" as string]: slide.section.muted,
            }}
          >
            {showMainBackground || index > 0 ? (
              <div className="absolute inset-0 z-0 overflow-hidden bg-[#FCF6EF]">
                <SectionBackground
                  section={slide.section}
                  priority={index === 0}
                />
              </div>
            ) : null}
            <div className="relative z-10 flex h-full w-full min-h-0 flex-col">
              {slide.content}
            </div>
          </section>
        ))}
      </div>

      {showScrollHint && slides.length > 1 && activeIndex === 0 ? (
        <button
          type="button"
          aria-label="Scroll to next section"
          onClick={() => goTo(1)}
          className="hero-scroll-hint"
        >
          <span className="hero-scroll-hint-frame" aria-hidden>
            <span className="hero-scroll-hint-wheel" />
          </span>
          <span className="hero-scroll-hint-chevrons" aria-hidden>
            <span />
            <span />
          </span>
        </button>
      ) : null}

      {showPageIndicator && slides.length > 1 ? (
        <PageIndicator
          sections={slides.map(({ id, label }) => ({ id, label }))}
          activeIndex={activeIndex}
          onGoTo={goTo}
          color={activeSlide.section.foreground}
        />
      ) : null}
    </div>
  );
}
