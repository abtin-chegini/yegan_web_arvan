"use client";

import {useLocale, useTranslations} from "next-intl";

import gsap from "gsap";
import { motion, useReducedMotion } from "motion/react";
import arrowStyles from "@/components/back-to-top.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import Dialog from "@/components/ui/smoothui/dialog";

import type { CaseStudyTechSlide, CaseStudyTechContent } from "@/lib/case-study-content";

const SLIDE_WIDTH = 200;
const SLIDE_HEIGHT = 275;
const SLIDE_GAP = 100;
const ARC_DEPTH = 200;
const CENTER_LIFT = 100;
const SCROLL_LERP = 0.05;

export type TechStackProps = {
  content: CaseStudyTechContent;
  /** Optional size variant for mobile */
  variant?: "desktop" | "mobile";
};

type ScrollApi = {
  goPrev: () => void;
  goNext: () => void;
};

/**
 * GSAP arc carousel — port of tech_stack/script.js.
 * Colored blank cards move via prev/next only; wheel keeps section scrolling.
 */
export function TechStack({ content, variant = "desktop" }: TechStackProps) {
  const tooltips = useTranslations("Tooltips");
  const isRtl = useLocale() === "fa";
  const reduceMotion = useReducedMotion();
  const [selectedSlide, setSelectedSlide] = useState<CaseStudyTechSlide | null>(null);
  const sliderRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollApiRef = useRef<ScrollApi | null>(null);
  const [activeTitle, setActiveTitle] = useState(
    content.slides[0]?.title ?? "",
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const slideCount = content.slides.length;
  const titlesKey = content.slides.map((slide) => slide.title).join("|");

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || slideCount === 0) return;

    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (slides.length !== slideCount) return;

    const titles = titlesKey.split("|");
    const isMobile = variant === "mobile";
    const slideWidth = isMobile ? 140 : SLIDE_WIDTH;
    const slideHeight = isMobile ? 190 : SLIDE_HEIGHT;
    const slideGap = isMobile ? 72 : SLIDE_GAP;
    const arcDepth = isMobile ? 120 : ARC_DEPTH;
    const centerLift = isMobile ? 56 : CENTER_LIFT;
    const preferReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const trackWidth = slideCount * slideGap;
    let windowWidth = slider.clientWidth || window.innerWidth;
    let windowHeight = slider.clientHeight || window.innerHeight;
    let windowCenterX = windowWidth / 2;
    // Sit the arc a bit lower so the heading has room above
    let arcBaselineY = windowHeight * (isMobile ? 0.5 : 0.52);

    let scrollTarget = 0;
    let scrollCurrent = 0;
    let activeSlideIndex = -1;
    let rafId = 0;
    let disposed = false;

    const slideParts = slides.map((slideEl) => ({
      slideEl,
      desc: slideEl.querySelector<HTMLElement>(".tech-stack-slider__desc"),
    }));

    function computeSlideTransform(slideIndex: number, scrollOffset: number) {
      let wrappedOffsetX =
        (((slideIndex * slideGap - scrollOffset) % trackWidth) + trackWidth) %
        trackWidth;

      if (wrappedOffsetX > trackWidth / 2) wrappedOffsetX -= trackWidth;

      if (isRtl) wrappedOffsetX *= -1;

      const slideCenterX = windowCenterX + wrappedOffsetX;
      const normalizedDist =
        (slideCenterX - windowCenterX) / (windowWidth * 0.5);
      const absDist = Math.min(Math.abs(normalizedDist), 1.3);

      const scaleFactor = Math.max(1 - absDist * 0.8, 0.25);
      const scaledWidth = slideWidth * scaleFactor;
      const scaledHeight = slideHeight * scaleFactor;

      const clampedDist = Math.min(absDist, 1);
      const arcDropY =
        (1 - Math.cos(clampedDist * Math.PI)) * 0.5 * arcDepth;
      const centerLiftY = Math.max(1 - absDist * 2, 0) * centerLift;

      return {
        x: slideCenterX - scaledWidth / 2,
        y: arcBaselineY - scaledHeight / 2 + arcDropY - centerLiftY,
        width: scaledWidth,
        height: scaledHeight,
        zIndex: Math.round((1 - absDist) * 100),
        distanceFromCenter: Math.abs(wrappedOffsetX),
      };
    }

    function layoutSlides(scrollOffset: number) {
      let closestIndex = 0;
      let closestDist = Infinity;
      const distances: number[] = [];

      slideParts.forEach(({ slideEl }, i) => {
        const transform = computeSlideTransform(i, scrollOffset);
        distances[i] = transform.distanceFromCenter;
        if (transform.distanceFromCenter < closestDist) {
          closestDist = transform.distanceFromCenter;
          closestIndex = i;
        }
        gsap.set(slideEl, {
          x: transform.x,
          y: transform.y,
          width: transform.width,
          height: transform.height,
          zIndex: transform.zIndex,
        });
      });

      slideParts.forEach(({ slideEl, desc }, i) => {
        const isSelected = i === closestIndex;
        let reveal = 0;
        if (isSelected) {
          reveal = preferReducedMotion
            ? 1
            : Math.max(1 - distances[i]! / (slideGap * 0.38), 0);
        }

        const isActive = isSelected && reveal > 0.45;
        slideEl.classList.toggle("tech-stack-slider__slide--active", isActive);

        if (desc) {
          gsap.set(desc, { autoAlpha: reveal });
        }
      });

      if (closestIndex !== activeSlideIndex) {
        activeSlideIndex = closestIndex;
        const nextTitle = titles[closestIndex] ?? "";
        setActiveTitle(nextTitle);
        setActiveIndex(closestIndex);
        if (titleRef.current) titleRef.current.textContent = nextTitle;
      }
    }

    function animate() {
      if (disposed) return;
      scrollCurrent += (scrollTarget - scrollCurrent) * SCROLL_LERP;
      layoutSlides(scrollCurrent);
      rafId = requestAnimationFrame(animate);
    }

    const onResize = () => {
      windowWidth = slider.clientWidth || window.innerWidth;
      windowHeight = slider.clientHeight || window.innerHeight;
      windowCenterX = windowWidth / 2;
      arcBaselineY = windowHeight * (isMobile ? 0.5 : 0.52);
      layoutSlides(scrollCurrent);
    };

    scrollApiRef.current = {
      goPrev: () => {
        scrollTarget -= slideGap;
      },
      goNext: () => {
        scrollTarget += slideGap;
      },
    };

    layoutSlides(0);
    rafId = requestAnimationFrame(animate);

    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      scrollApiRef.current = null;
      window.removeEventListener("resize", onResize);
    };
  }, [slideCount, titlesKey, variant, isRtl]);

  const goPrev = useCallback(() => {
    scrollApiRef.current?.goPrev();
  }, []);

  const goNext = useCallback(() => {
    scrollApiRef.current?.goNext();
  }, []);

  return (
    <section
      ref={sliderRef}
      className={
        variant === "mobile"
          ? "tech-stack-slider tech-stack-slider--mobile"
          : "tech-stack-slider"
      }
      aria-label="Tech stack carousel"
    >
      <header className="tech-stack-slider__header">
        <h2 className="tech-stack-slider__heading">{content.heading}</h2>
      </header>

      {content.slides.map((slide, index) => (
        <div
          key={slide.id}
          className="tech-stack-slider__slide"
          ref={(el) => {
            slideRefs.current[index] = el;
          }}
          data-active={index === activeIndex ? "true" : undefined}
        >
          <div className="tech-stack-slider__blank">
            <div className="tech-stack-slider__content">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.logo}
                alt=""
                className="tech-stack-slider__logo"
                draggable={false}
                decoding="async"
              />
              <p className="tech-stack-slider__desc">{slide.description}</p>
              <button
                type="button"
                className="tech-stack-slider__details"
                tabIndex={index === activeIndex ? 0 : -1}
                aria-haspopup="dialog"
                aria-label={isRtl ? `جزئیات بیشتر درباره ${slide.title}` : `More about ${slide.title}`}
                onClick={() => setSelectedSlide(slide)}
              >
                {isRtl ? "برای چی ؟" : "Show more"}
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="tech-stack-slider__nav" aria-label="Slide controls">
        <button
          type="button"
          className="tech-stack-slider__nav-btn"
          aria-label={tooltips("previousSlide")}
          onClick={goPrev}
        >
          {isRtl ? <ChevronRight strokeWidth={1.75} /> : <ChevronLeft strokeWidth={1.75} />}
          <span className={arrowStyles.tooltip} data-tooltip aria-hidden="true">{tooltips("previousSlide")}</span>
        </button>

        <p
          ref={titleRef}
          id="tech-stack-slide-title"
          className="tech-stack-slider__title"
        >
          {activeTitle}
        </p>

        <button
          type="button"
          className="tech-stack-slider__nav-btn"
          aria-label={tooltips("nextSlide")}
          onClick={goNext}
        >
          {isRtl ? <ChevronLeft strokeWidth={1.75} /> : <ChevronRight strokeWidth={1.75} />}
          <span className={arrowStyles.tooltip} data-tooltip aria-hidden="true">{tooltips("nextSlide")}</span>
        </button>
      </div>
      <Dialog
        open={selectedSlide !== null}
        onOpenChange={(open) => { if (!open) setSelectedSlide(null); }}
        title={selectedSlide?.title}
        className="max-h-[80dvh] overflow-y-auto sm:max-w-2xl"
      >
        {selectedSlide && (
          <motion.div
            key={selectedSlide.id}
            dir={isRtl ? "rtl" : "ltr"}
            className="space-y-5 text-start text-[#1d3557]"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } } }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedSlide.logo} alt="" className="h-14 w-24 object-contain" />
            {selectedSlide.detailsTitle && <h3 className="font-sans text-lg font-medium leading-relaxed">{selectedSlide.detailsTitle}</h3>}
            {selectedSlide.detailItems && (
              <ul className="space-y-5">
                {selectedSlide.detailItems.map((item) => (
                  <motion.li
                    key={item.title}
                    className="relative ps-5 before:absolute before:start-0 before:top-3 before:size-1.5 before:rounded-full before:bg-[#c0965a]"
                    variants={{ hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.3 } } }}
                  >
                    <h4 className="font-sans font-medium leading-7">{item.title}</h4>
                    <p className="mt-1 text-sm leading-7 text-[#3e4966]">{item.body}</p>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
        {selectedSlide?.details ? <p className="whitespace-pre-line text-start leading-relaxed">{selectedSlide.details}</p> : null}
      </Dialog>
    </section>
  );
}

export default TechStack;
