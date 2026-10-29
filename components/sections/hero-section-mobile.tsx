"use client";

import {useLocale, useTranslations} from "next-intl";

import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";

import { useFullpage } from "@/components/fullpage/fullpage-context";

gsap.registerPlugin(SplitText, CustomEase);

CustomEase.create("hero-glide-mobile", "0.8, 0, 0.2, 1");

type HeroSectionMobileProps = {
  introReady?: boolean;
};

export function HeroSectionMobile({ introReady = false }: HeroSectionMobileProps) {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const { goTo } = useFullpage();

  useEffect(() => {
    if (!introReady) return;

    const root = rootRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!root || !title || !subtitle) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([root, title, subtitle], {opacity: 1});
      gsap.set([title, subtitle], {y: 0});
    });
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (locale === "fa") {
        // Animate the whole Persian title to preserve connected letter shaping.
        gsap.set(root, {opacity: 1});
        gsap.set(title, {y: 30, opacity: 0});
        gsap.set(subtitle, {y: 12, opacity: 0});
        const timeline = gsap.timeline();
        timeline.to(title, {y: 0, opacity: 1, duration: 0.75, ease: "power2.out"})
          .to(subtitle, {y: 0, opacity: 1, duration: 0.55, ease: "power2.out"}, "-=0.4");
        return () => { timeline.kill(); };
      }
      const split = new SplitText(title, {
        type: "words",
        wordsClass: "hero-word",
        mask: "words",
      });

      gsap.set(split.words, { yPercent: 105 });
      gsap.set(subtitle, { opacity: 0, y: 12 });
      gsap.set(root, { opacity: 1 });

      const tl = gsap.timeline();

      tl.to(split.words, {
        yPercent: 0,
        duration: 0.75,
        ease: "hero-glide-mobile",
        stagger: 0.05,
      }).to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.4",
      );

      return () => {
        tl.kill();
        split.revert();
      };

    });
    return () => media.revert();
  }, [introReady, locale]);

  return (
    <>
      <div
        ref={rootRef}
        className="hero-caption hero-caption-mobile absolute top-[200px] left-1/2 w-fit -translate-x-1/2 items-start text-start"
        style={{ opacity: introReady ? undefined : 0 }}
      >
        <h1 ref={titleRef} className="hero-caption-title">
          {t("name")}
        </h1>
        <p ref={subtitleRef} className="hero-caption-subtitle">
          {t("developer")}
          <br />
          {t("designer")}
        </p>
      </div>

      <button
        type="button"
        aria-label="Scroll to next section"
        onClick={() => goTo(1)}
        className="hero-scroll-hint"
        style={{ opacity: introReady ? 1 : 0 }}
      >
        <span className="hero-scroll-hint-frame" aria-hidden>
          <span className="hero-scroll-hint-wheel" />
        </span>
        <span className="hero-scroll-hint-chevrons" aria-hidden>
          <span />
          <span />
        </span>
      </button>
    </>
  );
}
