"use client";

import {useTranslations} from "next-intl";

import gsap from "gsap";
import arrowStyles from "@/components/back-to-top.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  cardScaleStep,
  cardYOffset,
  sliderCards as defaultSliderCards,
  stepDuration,
} from "@/components/card_slider/cards-data";
import { CardSliderMobile } from "@/components/card_slider/card_slider_mobile";
import { SliderCardContent } from "@/components/card_slider/slider-card-content";

function CardSliderDesktop() {
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

    let isDragging = false;
    let didDrag = false;
    let dragStartY = 0;
    let dragStartProgress = 0;
    let activePointerId: number | null = null;

    const indexFromProgress = (progress: number) =>
      Math.min(
        Math.max(0, Math.round(progress / segmentSize)),
        totalCards - 1,
      );

    const setTitle = (progress: number) => {
      titleEl.textContent =
        sliderCards[indexFromProgress(progress)]?.title ?? "";
    };

    const applyProgress = (progress: number) => {
      const activeIndex = Math.min(
        Math.floor(progress / segmentSize + 1e-6),
        totalCards - 1,
      );
      const segProgress = gsap.utils.clamp(
        0,
        1,
        (progress - activeIndex * segmentSize) / segmentSize,
      );

      setTitle(progress);

      cardEls.forEach((card, j) => {
        const isFront = j === activeIndex;
        const isPast = j < activeIndex;

        // Keep the visible front card on top so drag works on every slide
        card.style.zIndex = isPast ? "1" : isFront ? "40" : String(30 - j);
        card.style.pointerEvents = isFront ? "auto" : "none";

        if (isPast) {
          gsap.set(card, {
            yPercent: -250,
            rotationX: 35,
            scale: 1,
          });
        } else if (isFront) {
          gsap.set(card, {
            yPercent: gsap.utils.interpolate(-50, -200, segProgress),
            rotationX: gsap.utils.interpolate(0, 35, segProgress),
            scale: 1,
          });
        } else {
          const behindIndex = j - activeIndex;
          const currentYOffset = (behindIndex - segProgress) * cardYOffset;
          const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;
          gsap.set(card, {
            yPercent: -50 + currentYOffset,
            rotationX: 0,
            scale: currentScale,
          });
        }
      });
    };

    const syncButtons = () => {
      prevBtn.disabled = state.progress <= 0.001;
      nextBtn.disabled = state.progress >= lastProgress - 0.001;
      setTitle(state.progress);
    };

    const goToProgress = (target: number) => {
      const clamped = gsap.utils.clamp(0, lastProgress, target);
      if (Math.abs(clamped - state.progress) < 0.0001) {
        applyProgress(state.progress);
        syncButtons();
        return;
      }
      setTitle(clamped);
      tween?.kill();
      tween = gsap.to(state, {
        progress: clamped,
        duration: stepDuration,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => applyProgress(state.progress),
        onComplete: syncButtons,
      });
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    };

    cardEls.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50 + i * cardYOffset,
        scale: 1 - i * cardScaleStep,
      });
    });
    applyProgress(0);
    syncButtons();

    const goPrev = () => {
      const currentIndex = indexFromProgress(state.progress);
      goToProgress((currentIndex - 1) * segmentSize);
    };
    const goNext = () => {
      const currentIndex = indexFromProgress(state.progress);
      goToProgress((currentIndex + 1) * segmentSize);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      // Keep nav + case-study links interactive (don't start a drag)
      if (target.closest(".card-slider-nav, a, button, .slider-card-cta")) {
        return;
      }

      // Allow drag from the stack area (front card or empty sticky space)
      event.preventDefault();

      isDragging = true;
      didDrag = false;
      dragStartY = event.clientY;
      dragStartProgress = state.progress;
      activePointerId = event.pointerId;
      tween?.kill();
      sticky.classList.add("is-dragging");

      try {
        sticky.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging || event.pointerId !== activePointerId) return;

      const dy = event.clientY - dragStartY;
      if (Math.abs(dy) > 6) {
        didDrag = true;
        event.preventDefault();
      }

      // Drag up → next; drag down → previous
      const dragRange = 120;
      const deltaProgress = (-dy / dragRange) * segmentSize;
      state.progress = gsap.utils.clamp(
        0,
        lastProgress,
        dragStartProgress + deltaProgress,
      );
      applyProgress(state.progress);
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    };

    const endDrag = (event: PointerEvent) => {
      if (!isDragging || event.pointerId !== activePointerId) return;

      isDragging = false;
      activePointerId = null;
      sticky.classList.remove("is-dragging");

      try {
        sticky.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }

      const startIndex = Math.min(
        Math.max(0, Math.round(dragStartProgress / segmentSize)),
        totalCards - 1,
      );
      const delta = state.progress - dragStartProgress;
      const threshold = segmentSize * 0.18;

      let targetIndex = startIndex;
      if (didDrag) {
        if (delta > threshold) targetIndex = startIndex + 1;
        else if (delta < -threshold) targetIndex = startIndex - 1;
      }

      targetIndex = gsap.utils.clamp(0, totalCards - 1, targetIndex);
      goToProgress(targetIndex * segmentSize);
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    };

    prevBtn.addEventListener("click", goPrev);
    nextBtn.addEventListener("click", goNext);
    sticky.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    sticky.addEventListener("click", onClickCapture, true);

    return () => {
      tween?.kill();
      prevBtn.removeEventListener("click", goPrev);
      nextBtn.removeEventListener("click", goNext);
      sticky.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      sticky.removeEventListener("click", onClickCapture, true);
    };
  }, [sliderCards]);

  return (
    <div className="card-slider h-full overflow-hidden">
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
            <ChevronUp strokeWidth={1.75} />
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
            <ChevronDown strokeWidth={1.75} />
            <span className={arrowStyles.tooltip} data-tooltip aria-hidden="true">{tooltips("nextCard")}</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export function CardSlider() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile ? <CardSliderMobile /> : <CardSliderDesktop />;
}

export default CardSlider;
