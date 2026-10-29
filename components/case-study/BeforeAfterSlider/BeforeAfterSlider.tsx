"use client";

import {useLocale, useTranslations} from "next-intl";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import arrowStyles from "@/components/back-to-top.module.css";

export type StackSliderSlide = {
  /** Null / empty shows a blank cream placeholder */
  image: string | null;
  /** Optional square crop for small viewports */
  imageMobile?: string | null;
  alt?: string;
};

export type BeforeAfterSliderProps = {
  slides: StackSliderSlide[];
  className?: string;
  prevLabel?: string;
  nextLabel?: string;
  /** How many cards stay in the 3D stack (default 5). */
  stackSize?: number;
  title?: string;
  description?: string;
  centerHeader?: boolean;
};

const DEFAULT_STACK_SIZE = 5;
const MOBILE_MEDIA = "(max-width: 767px)";
/** Vertical stack step — keeps back cards visibly layered behind the front. */
const STACK_Y_BASE = -18;
const STACK_Y_STEP = 14;
const STACK_Z_STEP = 18;

function stackY(i: number) {
  return `${STACK_Y_BASE + STACK_Y_STEP * i}%`;
}

function stackZ(i: number) {
  return STACK_Z_STEP * i;
}


function ChevronLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BeforeAfterSlider({
  slides = [],
  className = "",
  prevLabel = "Previous",
  nextLabel = "Next",
  stackSize = DEFAULT_STACK_SIZE,
  title,
  description,
  centerHeader = false,
}: BeforeAfterSliderProps) {
  const tooltips = useTranslations("Tooltips");
  const locale = useLocale();
  const formatNumber = (number: number) => new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(number);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{
    goPrev: () => void;
    goNext: () => void;
    goTo: (index: number) => void;
  } | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;

    if (!root || !track || slides.length === 0) return;

    const mq = window.matchMedia(MOBILE_MEDIA);
    const visibleCount = Math.min(stackSize, slides.length);
    const backOffset = visibleCount - 1;

    let frontSlideIndex = 0;
    let isSliderAnimating = false;

    const getSlides = () => track.querySelectorAll<HTMLElement>(".bas__slide");

    const resolveSrc = (data: StackSliderSlide) => {
      if (mq.matches && data.imageMobile) return data.imageMobile;
      return data.image;
    };

    const createSlide = (data: StackSliderSlide) => {
      const slide = document.createElement("div");
      slide.className = "bas__slide";
      const src = resolveSrc(data);
      slide.innerHTML = `
<span class="bas__badge bas__badge--before">Before</span>
<span class="bas__badge bas__badge--after">After</span>
`;
      if (src) {
        const image = document.createElement("img");
        image.src = src;
        image.alt = data.alt ?? "";
        image.className = "bas__image";
        image.draggable = false;
        slide.append(image);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "bas__image bas__image--blank";
        placeholder.setAttribute("aria-hidden", "true");
        slide.append(placeholder);
      }
      return slide;
    };

    const placeStack = () => {
      getSlides().forEach((slide, i) => {
        gsap.set(slide, {
          xPercent: -50,
          y: stackY(i),
          z: stackZ(i),
          opacity: 1,
        });
      });
    };

    const syncIndex = (index: number) => {
      frontSlideIndex = index;
      setActiveIndex(index);
    };

    const rebuildStack = () => {
      getSlides().forEach((slide) => gsap.killTweensOf(slide));
      track.innerHTML = "";
      isSliderAnimating = false;

      for (let i = 0; i < visibleCount; i += 1) {
        const data = slides[(frontSlideIndex + i) % slides.length];
        track.appendChild(createSlide(data));
      }
      placeStack();
    };

    rebuildStack();

    function handleScrollDown() {
      const currentSlides = getSlides();
      const firstSlide = currentSlides[0];

      const nextIndex = (frontSlideIndex + 1) % slides.length;
      syncIndex(nextIndex);

      const newBackIndex = (frontSlideIndex + backOffset) % slides.length;
      const nextSlideData = slides[newBackIndex];
      const newSlide = createSlide(nextSlideData);

      track!.appendChild(newSlide);

      gsap.set(newSlide, {
        xPercent: -50,
        y: stackY(visibleCount),
        z: stackZ(visibleCount),
        opacity: 0,
      });

      const allSlides = getSlides();

      allSlides.forEach((slide, i) => {
        const targetPosition = i - 1;

        gsap.to(slide, {
          xPercent: -50,
          y: stackY(targetPosition),
          z: stackZ(targetPosition),
          opacity: targetPosition < 0 ? 0 : 1,
          duration: 1,
          ease: "power3.inOut",

          onComplete: () => {
            if (i === 0) {
              firstSlide.remove();
              isSliderAnimating = false;
            }
          },
        });
      });
    }

    function handleScrollUp() {
      const currentSlides = getSlides();
      const lastSlide = currentSlides[currentSlides.length - 1];

      const prevIndex =
        (frontSlideIndex - 1 + slides.length) % slides.length;
      syncIndex(prevIndex);

      const prevSlideData = slides[frontSlideIndex];
      const newSlide = createSlide(prevSlideData);

      track!.insertBefore(newSlide, track!.firstChild);

      gsap.set(newSlide, {
        xPercent: -50,
        y: stackY(-1),
        z: stackZ(-1),
        opacity: 0,
      });

      const slideQueue = Array.from(getSlides());

      slideQueue.forEach((slide, i) => {
        const targetPosition = i;

        gsap.to(slide, {
          xPercent: -50,
          y: stackY(targetPosition),
          z: stackZ(targetPosition),
          opacity: targetPosition > backOffset ? 0 : 1,
          duration: 1,
          ease: "power3.inOut",

          onComplete: () => {
            if (i === slideQueue.length - 1) {
              lastSlide.remove();
              isSliderAnimating = false;
            }
          },
        });
      });
    }

    function handleSlideChange(direction = "down") {
      if (isSliderAnimating) return;
      isSliderAnimating = true;

      if (direction === "down") {
        handleScrollDown();
      } else {
        handleScrollUp();
      }
    }

    function goTo(index: number) {
      if (isSliderAnimating) return;
      if (index < 0 || index >= slides.length) return;
      if (index === frontSlideIndex) return;

      const forwardSteps =
        (index - frontSlideIndex + slides.length) % slides.length;
      const backwardSteps =
        (frontSlideIndex - index + slides.length) % slides.length;

      if (forwardSteps === 1) {
        handleSlideChange("down");
        return;
      }
      if (backwardSteps === 1) {
        handleSlideChange("up");
        return;
      }

      syncIndex(index);
      rebuildStack();
    }

    apiRef.current = {
      goPrev: () => handleSlideChange("up"),
      goNext: () => handleSlideChange("down"),
      goTo,
    };

    const onBreakpoint = () => rebuildStack();
    mq.addEventListener("change", onBreakpoint);

    return () => {
      apiRef.current = null;
      mq.removeEventListener("change", onBreakpoint);
      getSlides().forEach((slide) => gsap.killTweensOf(slide));
      track.innerHTML = "";
    };
  }, [slides, stackSize]);

  const goPrev = useCallback(() => apiRef.current?.goPrev(), []);
  const goNext = useCallback(() => apiRef.current?.goNext(), []);
  const goTo = useCallback((index: number) => apiRef.current?.goTo(index), []);

  if (slides.length === 0) return null;

  const total = slides.length;
  const currentLabel = formatNumber(activeIndex + 1);
  const totalLabel = formatNumber(total);

  return (
    <div ref={rootRef} className={`bas${className ? ` ${className}` : ""}`}>
      {title || description ? (
        <header className={`bas__header${centerHeader ? " bas__header--center" : ""}`}>
          {title ? <h2 className="bas__title">{title}</h2> : null}
          {description ? (
            <p className="bas__description">{description}</p>
          ) : null}
        </header>
      ) : null}

      <div className="bas__carousel">
        <div className="bas__carousel-stage">
          <div className="bas__track" ref={trackRef} />

          <button
            type="button"
            className="bas__arrow bas__arrow--prev"
            aria-label={tooltips("previousSlide")}
            onClick={goPrev}
          >
            <ChevronLeftIcon />
            <span className={arrowStyles.tooltip} data-tooltip aria-hidden="true">{tooltips("previousSlide")}</span>
          </button>

          <button
            type="button"
            className="bas__arrow bas__arrow--next"
            aria-label={tooltips("nextSlide")}
            onClick={goNext}
          >
            <ChevronRightIcon />
            <span className={arrowStyles.tooltip} data-tooltip aria-hidden="true">{tooltips("nextSlide")}</span>
          </button>
        </div>

        <div className="bas__pagination" aria-live="polite">
          <p className="bas__counter localized-light-numerals" dir={locale === "fa" ? "rtl" : "ltr"}>
            <span className="bas__counter-current">{currentLabel}</span>
            <span className="bas__counter-sep"> / </span>
            <span className="bas__counter-total">{totalLabel}</span>
          </p>
          <div className="bas__dots" role="tablist" aria-label="Slides">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${slide.image ?? "blank"}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={locale === "fa" ? `رفتن به اسلاید ${formatNumber(index + 1)}` : `Go to slide ${formatNumber(index + 1)}`}
                  className={`bas__dot${isActive ? " is-active" : ""}`}
                  onClick={() => goTo(index)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile / tablet text controls — hidden on desktop */}
      <div className="bas__controls">
        <button
          type="button"
          className="bas__btn"
          aria-label={tooltips("previousSlide")}
          onClick={goPrev}
        >
          {prevLabel}
        </button>
        <button
          type="button"
          className="bas__btn"
          aria-label={tooltips("nextSlide")}
          onClick={goNext}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
