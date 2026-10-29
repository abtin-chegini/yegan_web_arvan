"use client";

import {useTranslations} from "next-intl";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type PageIndicatorSection = {
  id: string;
  label: string;
};

type PageIndicatorProps = {
  sections: PageIndicatorSection[];
  labelOverrides?: Record<string, string>;
  activeIndex: number;
  onGoTo: (index: number) => void;
  color: string;
};

export function PageIndicator({
  sections,
  labelOverrides,
  activeIndex,
  onGoTo,
  color,
}: PageIndicatorProps) {
  const t = useTranslations("Tooltips");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.nav
      aria-label="Section navigation"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      className={cn(
        "fixed top-1/2 z-50 hidden -translate-y-1/2 md:flex",
        "right-3 flex-col items-center gap-2 rounded-full px-1.5 py-2.5 lg:right-4 lg:gap-2.5 lg:px-2 lg:py-3 xl:right-6 xl:gap-3 xl:px-2.5 xl:py-3.5",
        "border border-[#1d3557]/12 bg-[#FCF6EF]/88 shadow-[0_8px_28px_-12px_rgba(29,53,87,0.28)]",
        "backdrop-blur-md",
      )}
      style={{ color }}
    >
      {sections.map((section, index) => {
        const label = labelOverrides?.[section.id] ?? (t.has(`sections.${section.id}`) ? t(`sections.${section.id}`) : section.label);
        const isActive = index === activeIndex;
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={section.id}
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {isHovered ? (
                <motion.span
                  role="tooltip"
                  initial={{ opacity: 0, x: 8, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
                  className={cn(
                    "pointer-events-none absolute right-[calc(100%+0.55rem)] z-10 lg:right-[calc(100%+0.65rem)] xl:right-[calc(100%+0.7rem)]",
                    "whitespace-nowrap rounded-md px-2 py-1 lg:px-2.5 lg:py-1.5",
                    "border border-[#1d3557]/12 bg-[#FCF6EF]/95 text-[#1d3557]",
                    "font-sans text-[0.65rem] font-medium tracking-[0.02em] lg:text-[0.7rem] xl:text-[0.72rem]",
                    "shadow-[0_6px_18px_-10px_rgba(29,53,87,0.35)] backdrop-blur-sm",
                  )}
                >
                  {label}
                </motion.span>
              ) : null}
            </AnimatePresence>

            <motion.button
              type="button"
              aria-label={t("goTo", {section: label})}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onGoTo(index)}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.92 }}
              className="relative flex size-3 items-center justify-center rounded-full lg:size-3.5 xl:size-4"
            >
              <motion.span
                className={cn(
                  "block rounded-full border",
                  isActive
                    ? "size-1.5 border-current bg-current lg:size-2 xl:size-2.5"
                    : "size-1 border-current/45 bg-transparent lg:size-1.5 xl:size-2",
                )}
                animate={{
                  scale: isActive ? 1 : 0.92,
                  opacity: isActive ? 1 : 0.65,
                }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              />
              {isActive ? (
                <motion.span
                  layoutId="page-indicator-active-ring"
                  className="absolute inset-0 rounded-full border border-current/35"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ) : null}
            </motion.button>
          </div>
        );
      })}
    </motion.nav>
  );
}
