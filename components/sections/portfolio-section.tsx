"use client";

import {useTranslations} from "next-intl";
import { CardSlider } from "@/components/card_slider/card_slider";

export function PortfolioSection() {
 const t = useTranslations("Home");
  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 bottom-[calc(86%+12px)] flex flex-col items-center gap-2 text-center md:bottom-[calc(87.5%+37px)] min-[1001px]:bottom-[calc(80%+37px)]">
        <h2 className="font-serif text-[clamp(1.55rem,2.8vw,2.55rem)] leading-[1.05] font-medium tracking-[-0.02em] text-[var(--section-portfolio-fg)]">
          {t("workTitle")}
        </h2>
        <p className="font-sans text-[0.9rem] font-normal leading-relaxed text-[var(--section-portfolio-muted)]">
          {t("workIntro")}
        </p>
      </header>
      <CardSlider />
    </>
  );
}
