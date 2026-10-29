"use client";

import {useTranslations} from "next-intl";

import gsap from "gsap";
import arrowStyles from "@/components/back-to-top.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import {
  cardScaleStep,
  cardYOffset,
  sliderCards as defaultSliderCards,
  stepDuration,
} from "@/components/card_slider/cards-data";
import { SliderCardContent } from "@/components/card_slider/slider-card-content";

export function CardSliderMobile() {
  const tooltips = useTranslations("Tooltips");
  const images = useTranslations("Images");
  const work = useTranslations("SelectedWork");
  const sliderCards = useMemo(() => defaultSliderCards.map((card, index) =>
    ({
      ...card,
      title: work(`${["bilit4u", "tealnex", "tealtile"][index]}Title`),
      kicker: work(`${["bilit4u", "tealnex", "tealtile"][index]}Kicker`),
      description: work(`${["bilit4u", "tealnex", "tealtile"][index]}Description`),
    })
  ), [work]);
  const stickyRef = useRef<HTMLElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sticky = stickyRef.current;
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    const titleEl = titleRef.current;
    if (!sticky || !prevBtn || !nextBtn || !titleEl) return;

    const cardEls = gsap.utils.toArray<HTMLElement>(".card", sticky);
    const totalCards = cardEls.length;
    const segmentSize = 1 / totalCards;
    const lastProgress = (totalCards - 1) * segmentSize;
    const state = { progress: 0 };
    let tween: gsap.core.Tween | null = null;

    const activeTitle = (progress: number) => {
      const activeIndex = Math.min(
        Math.floor(progress / segmentSize + 0.001),
        totalCards - 1,
      );
      return sliderCards[activeIndex]?.title ?? "";
    };

    const applyProgress = (progress: number) => {
      const activeIndex = Math.min(
        Math.floor(progress / segmentSize),
        totalCards - 1,
      );
      const segProgress =
        (progress - activeIndex * segmentSize) / segmentSize;

      titleEl.textContent = activeTitle(progress);

      cardEls.forEach((card, j) => {
        const isFront = j === activeIndex;
        const isPast = j < activeIndex;

        card.style.zIndex = isPast ? "1" : isFront ? "40" : String(30 - j);
        card.style.pointerEvents = isFront ? "auto" : "none";

        if (isPast) {
          gsap.set(card, {
            xPercent: -250,
            yPercent: -50,
            rotationY: -35,
            scale: 1,
          });
        } else if (isFront) {
          gsap.set(card, {
            xPercent: gsap.utils.interpolate(-50, -200, segProgress),
            yPercent: -50,
            rotationY: gsap.utils.interpolate(0, -35, segProgress),
            scale: 1,
          });
        } else {
          const behindIndex = j - activeIndex;
          const currentXOffset = (behindIndex - segProgress) * cardYOffset;
          const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;
          gsap.set(card, {
            xPercent: -50 + currentXOffset,
            yPercent: -50,
            rotationY: 0,
            scale: currentScale,
          });
        }
      });
    };

    const syncButtons = () => {
      prevBtn.disabled = state.progress <= 0.001;
      nextBtn.disabled = state.progress >= lastProgress - 0.001;
      titleEl.textContent = activeTitle(state.progress);
    };

    const goToProgress = (target: number) => {
      const clamped = gsap.utils.clamp(0, lastProgress, target);
      if (Math.abs(clamped - state.progress) < 0.0001) return;
      tween?.kill();
      tween = gsap.to(state, {
        progress: clamped,
        duration: stepDuration,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: () => applyProgress(state.progress),
        onComplete: syncButtons,
      });
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    };

    cardEls.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50 + i * cardYOffset,
        yPercent: -50,
        rotationY: 0,
        scale: 1 - i * cardScaleStep,
      });
    });
    applyProgress(0);
    syncButtons();

    const goPrev = () => {
      const currentIndex = Math.round(state.progress / segmentSize);
      goToProgress((currentIndex - 1) * segmentSize);
    };
    const goNext = () => {
      const currentIndex = Math.round(state.progress / segmentSize);
      goToProgress((currentIndex + 1) * segmentSize);
    };

    prevBtn.addEventListener("click", goPrev);
    nextBtn.addEventListener("click", goNext);

    return () => {
      tween?.kill();
      prevBtn.removeEventListener("click", goPrev);
      nextBtn.removeEventListener("click", goNext);
    };
  }, [sliderCards]);

  return (
    <div className="card-slider card-slider-mobile h-full overflow-hidden">
      <section className="sticky-cards" ref={stickyRef}>
        {sliderCards.map((card) => (
          <div className="card" id={card.id} key={card.id}>
            <SliderCardContent
              title={card.title}
              kicker={card.kicker}
              description={card.description}
              image={card.image}
              alt={images(`projects.${card.href.split("/").pop()}.preview`)}
              href={card.href}
            />
          </div>
        ))}

        <div className="card-slider-nav" aria-label="Card stack controls">
          <button
            ref={prevBtnRef}
            type="button"
            className="card-slider-nav-btn"
            aria-label={tooltips("previousCard")}
          >
            <ChevronLeft strokeWidth={1.75} />
            <span className={arrowStyles.tooltip} data-tooltip aria-hidden="true">{tooltips("previousCard")}</span>
          </button>
          <span ref={titleRef} className="card-slider-nav-title">
            {sliderCards[0]?.title}
          </span>
          <button
            ref={nextBtnRef}
            type="button"
            className="card-slider-nav-btn"
            aria-label={tooltips("nextCard")}
          >
            <ChevronRight strokeWidth={1.75} />
            <span className={arrowStyles.tooltip} data-tooltip aria-hidden="true">{tooltips("nextCard")}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
