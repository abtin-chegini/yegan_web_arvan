"use client";

import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { BackToTop } from "@/components/back-to-top";
import { FullpageContext } from "@/components/fullpage/fullpage-context";
import { MobileFooterBackground } from "@/components/sections/mobile-footer-background";
import { Navbar } from "@/components/navbar";
import type { SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";

import styles from "./mobile-page-scroll.module.css";

export type MobilePageSlide = {
  id: string;
  label: string;
  content: ReactNode;
  background?: ReactNode;
  navId: SectionId;
  foreground: string;
  muted?: string;
};

type MobilePageScrollProps = {
  slides: MobilePageSlide[];
  studySlug?: string;
};

/** Shared mobile scroll owner for routed pages; the working homepage stays separate. */
export function MobilePageScroll({ slides, studySlug }: MobilePageScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const pausedRef = useRef(false);
  const dialogOpenRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionIds = slides.map((slide) => slide.id).join(",");

  const setScrollPaused = useCallback((paused: boolean) => {
    pausedRef.current = paused;
    smootherRef.current?.paused(paused || dialogOpenRef.current);
  }, []);

  const goTo = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const elements = contentRef.current?.querySelectorAll<HTMLElement>("[data-mobile-page-section]");
    const target = elements?.[Math.max(0, Math.min((elements?.length ?? 1) - 1, index))];
    if (!target) return;
    const smooth = behavior !== "instant" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (smootherRef.current) smootherRef.current.scrollTo(target, smooth, "top top");
    else target.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" });
  }, []);

  const goToId = useCallback((id: SectionId) => {
    const index = slides.findIndex((slide) => slide.id === id);
    if (index >= 0) goTo(index);
  }, [slides, goTo]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    const activeClass = studySlug ? "case-study-section-active" : "fullpage-section-active";
    const media = gsap.matchMedia();
    media.add({
      mobile: "(max-width: 767px)",
      reducedMotion: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (!context.conditions?.mobile) return;
      const reducedMotion = Boolean(context.conditions.reducedMotion);
      // Unlock only this mounted mobile page; restore exact prior inline values
      // after ScrollSmoother has restored its own document styles.
      const properties = ["overflow-x", "overflow-y", "height", "overscroll-behavior"];
      const savedStyles = [document.documentElement, document.body].map((element) => ({
        element,
        values: properties.map((property) => ({
          property,
          value: element.style.getPropertyValue(property),
          priority: element.style.getPropertyPriority(property),
        })),
      }));
      savedStyles.forEach(({ element }) => {
        element.style.overflowX = "hidden";
        element.style.overflowY = "auto";
        element.style.height = "auto";
        element.style.overscrollBehavior = "auto";
      });

      const smoother = ScrollSmoother.create({
        wrapper,
        content,
        smooth: reducedMotion ? 0 : 0.1,
        smoothTouch: reducedMotion ? 0 : 0.1,
        effects: false,
        normalizeScroll: false,
      });
      smootherRef.current = smoother;
      if (pausedRef.current) smoother.paused(true);

      // Dialog portals are outside the transformed content. Keep the page
      // paused while allowing their own nested content to scroll normally.
      const syncDialog = () => {
        dialogOpenRef.current = Boolean(document.querySelector(
          '[role="dialog"][aria-modal="true"]:not([data-closed]):not([aria-hidden="true"]), [role="alertdialog"][aria-modal="true"]:not([data-closed]):not([aria-hidden="true"])',
        ));
        smoother.paused(pausedRef.current || dialogOpenRef.current);
      };
      const dialogObserver = new MutationObserver(syncDialog);
      dialogObserver.observe(document.body, {
        childList: true, subtree: true, attributes: true,
        attributeFilter: ["aria-modal", "aria-hidden", "data-closed"],
      });
      syncDialog();

      const elements = Array.from(content.querySelectorAll<HTMLElement>("[data-mobile-page-section]"));
      const triggers = elements.flatMap((element, index) => [
        ScrollTrigger.create({
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleClass: { targets: element, className: activeClass },
        }),
        ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => { if (self.isActive) setActiveIndex(index); },
        }),
      ]);

      // Accordion expansion, translated copy, fonts and images change section
      // positions. Refresh once per frame, without rebuilding the smoother.
      let refreshFrame = 0;
      let disposed = false;
      const scheduleRefresh = () => {
        if (disposed || refreshFrame) return;
        refreshFrame = window.requestAnimationFrame(() => {
          refreshFrame = 0;
          ScrollTrigger.refresh();
        });
      };
      const observer = new ResizeObserver(scheduleRefresh);
      elements.forEach((element) => observer.observe(element));
      document.fonts.ready.then(scheduleRefresh);

      const routeHistoryState = window.history.state;
      const savedScrollY = routeHistoryState?.__mobilePageScrollY;
      const routeUrl = window.location.pathname + window.location.search;
      let scrollTimer = 0;
      const saveScrollPosition = () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = 0;
        const state = window.history.state;
        const y = smoother.scrollTop();
        if (state && state.__mobilePageScrollY !== y &&
          window.location.pathname + window.location.search === routeUrl) {
          window.history.replaceState({ ...state, __mobilePageScrollY: y }, "", window.location.href);
        }
      };
      const trackScrollPosition = () => {
        // Avoid frequent History API writes on iOS; click capture flushes the
        // final position before a link or navigation button changes routes.
        if (!scrollTimer) scrollTimer = window.setTimeout(saveScrollPosition, 500);
      };
      const saveBeforeKeyNavigation = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") saveScrollPosition();
      };
      const followHash = () => {
        const target = elements.find((element) => `#${element.id}` === window.location.hash);
        if (target) {
          // Native hash entries otherwise discard Next's existing route state,
          // preventing its router from restoring this page on Back.
          if (window.history.state === null && routeHistoryState) {
            window.history.replaceState(routeHistoryState, "", window.location.href);
          }
          // Native hash navigation may scroll this fixed, overflow-hidden
          // wrapper. Reset it before measuring the document scroll target.
          wrapper.scrollTop = 0;
          smoother.scrollTo(target, false, "top top");
        }
      };
      window.addEventListener("scroll", trackScrollPosition, { passive: true });
      window.addEventListener("click", saveScrollPosition, true);
      window.addEventListener("keydown", saveBeforeKeyNavigation, true);
      window.addEventListener("hashchange", followHash);
      const initialFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (typeof savedScrollY === "number") smoother.scrollTo(savedScrollY, false);
        else followHash();
      });

      return () => {
        disposed = true;
        saveScrollPosition();
        observer.disconnect();
        dialogObserver.disconnect();
        window.cancelAnimationFrame(refreshFrame);
        window.cancelAnimationFrame(initialFrame);
        window.clearTimeout(scrollTimer);
        window.removeEventListener("scroll", trackScrollPosition);
        window.removeEventListener("click", saveScrollPosition, true);
        window.removeEventListener("keydown", saveBeforeKeyNavigation, true);
        window.removeEventListener("hashchange", followHash);
        triggers.forEach((trigger) => trigger.kill());
        smoother.kill();
        smootherRef.current = null;
        elements.forEach((element) => element.classList.remove(activeClass));
        const restoreStyles = () => savedStyles.forEach(({ element, values }) => values.forEach(({ property, value, priority }) => {
          if (value) element.style.setProperty(property, value, priority);
          else element.style.removeProperty(property);
        }));
        restoreStyles();
        // Base UI releases portal scroll locks with a zero-delay timer. Run
        // after that release, without touching a newly mounted scroll owner.
        queueMicrotask(() => window.setTimeout(() => {
          if (!ScrollSmoother.get() && !document.querySelector('[aria-modal="true"]')) restoreStyles();
        }, 0));
      };
    });
    return () => media.revert();
  }, [sectionIds, studySlug]);

  return (
    <FullpageContext.Provider value={{ activeIndex, goTo, goToId, setScrollPaused }}>
      <div className={styles.page} data-case-study={studySlug}>
        <div className={styles.fixedUi}>
          <Navbar activeId={slides[activeIndex]?.navId} foreground={slides[activeIndex]?.foreground} />
          <BackToTop activeIndex={activeIndex} />
        </div>
        <div ref={wrapperRef} data-mobile-smooth-wrapper>
          <div ref={contentRef} className={styles.content}>
            {slides.map((slide, index) => (
              <section
                key={slide.id}
                id={slide.id}
                data-mobile-page-section
                data-active={index === activeIndex}
                aria-label={slide.label}
                className={cn(styles.section, "relative flex w-full flex-col justify-start px-5 sm:px-10")}
                style={{ color: slide.foreground, ["--section-muted" as string]: slide.muted }}
              >
                {(slide.id === "footer" || slide.id === "contact") && <div className="absolute inset-0 z-0 overflow-hidden bg-[#FCF6EF]"><MobileFooterBackground /></div>}
                <div className={styles.sectionContent}>{slide.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </FullpageContext.Provider>
  );
}
