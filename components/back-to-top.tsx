"use client";

import {useTranslations} from "next-intl";

import { ChevronUp } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";

import styles from "./back-to-top.module.css";

type BackToTopProps = {
  activeIndex?: number;
  onBackToTop?: (index: number, behavior: ScrollBehavior) => void;
  scrollRoot?: RefObject<HTMLElement | null>;
};

export function BackToTop({ activeIndex = 0, onBackToTop, scrollRoot }: BackToTopProps) {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Tooltips");
  const label = t("backToTop");

  useEffect(() => {
    const root = scrollRoot?.current;
    const update = () => {
      const containers = root?.querySelectorAll<HTMLElement>("[data-page-scroll]");
      const innerScrolled = Array.from(containers ?? []).some(
        (container) => container.closest("section")?.dataset.active !== "false" && container.scrollTop >= container.clientHeight,
      );
      setScrolled(innerScrolled || window.scrollY >= window.innerHeight || Boolean(root && root.scrollTop >= root.clientHeight && root.scrollTop > 0));
    };
    const frame = window.requestAnimationFrame(() => {
      update();
    });
    root?.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      root?.removeEventListener("scroll", update, true);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollRoot, activeIndex]);

  const visible = activeIndex > 0 || scrolled;

  const backToTop = () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    onBackToTop?.(0, behavior);
    const root = scrollRoot?.current;
    root?.querySelectorAll<HTMLElement>("[data-page-scroll]").forEach((container) => container.scrollTo({ top: 0, behavior }));
    root?.scrollTo({ top: 0, behavior });
    window.scrollTo({ top: 0, behavior });
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      disabled={!visible}
      data-visible={visible}
      className={styles.button}
      onClick={backToTop}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") event.stopPropagation();
      }}
    >
      <ChevronUp aria-hidden="true" strokeWidth={1.75} />
      <span className={styles.tooltip} data-tooltip aria-hidden="true">{label}</span>
    </button>
  );
}
