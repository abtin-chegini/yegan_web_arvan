"use client";

import { memo } from "react";
import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import type { WaveCardData } from "@/components/wave/types";

type FloatingWaveCardProps = {
  data: WaveCardData;
  index: number;
  className?: string;
};

function FloatingWaveCardComponent({
  data,
  index,
  className,
}: FloatingWaveCardProps) {
  const locale = useLocale();
  const number =
    data.number ?? String(index + 1).padStart(2, "0");
  const displayNumber = locale === "fa"
    ? number.replace(/^0+(?=\d)/, "").replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])
    : number;

  return (
    <div
      className={cn(
        "flex w-[min(12.25rem,18vw)] min-w-[9.5rem] flex-col items-center text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-white md:h-14 md:w-14",
          "border border-[#1d3557]/25"
        )}
      >
        <span className="approach-step-number font-serif text-base font-medium tracking-wide text-[#1d3557]/80 md:text-lg">
          {displayNumber}
        </span>
      </div>

      <h3 className="mt-4 font-serif text-xl font-semibold tracking-tight text-[#1d3557] md:text-2xl">
        {data.title}
      </h3>

      <p className="mt-2.5 max-w-[16ch] font-sans text-[0.8rem] font-normal leading-[1.65] text-[#3d4f6f] md:max-w-none md:text-sm">
        {data.description}
      </p>
    </div>
  );
}

export const FloatingWaveCard = memo(FloatingWaveCardComponent);
