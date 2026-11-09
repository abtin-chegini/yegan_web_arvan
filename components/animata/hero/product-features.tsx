"use client";

import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

export type ProductFeature = {
  id: string;
  title: string;
  category?: string;
  imageUrl: string | null;
  imageAlt?: string;
};

type ProductFeaturesProps = {
  features: ProductFeature[];
  onFeatureClick: (id: string) => void;
  className?: string;
};

function FeatureCard({
  feature,
  index,
  onClick,
}: {
  feature: ProductFeature;
  index: number;
  onClick: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const springValue = useSpring(0, { bounce: 0 });
  const zIndex = useTransform(springValue, (value) => Math.floor(value * 10) + 10 + index);
  const scale = useTransform(springValue, [0, 1], [1, 1.1]);
  const side = index === 0 ? 1 : index === 2 ? -1 : 0;
  const settled = {
    x: `${side * 15.625}%`,
    y: side === 0 ? "0%" : "3.90625%",
    opacity: 1,
    scale: side === 0 ? 1 : 0.95,
    rotate: -side * 6,
  };

  return (
    <motion.div
      className="relative aspect-[3/4] w-1/3 shrink-0"
      style={{ zIndex }}
      initial={reduceMotion ? settled : {
        x: `${side * 100}%`,
        y: "11.71875%",
        opacity: 0,
        rotate: 0,
        scale: side === 0 ? 1 : 0.9,
      }}
      whileInView={settled}
      viewport={{ once: true, amount: 0.15 }}
      transition={reduceMotion ? { duration: 0 } : {
        type: "spring",
        delay: [0.8, 0.4, 0.6][index],
      }}
    >
    <motion.button
      type="button"
      dir="auto"
      data-product-feature={feature.id}
      aria-label={feature.title}
      aria-haspopup="dialog"
      onClick={onClick}
      onHoverStart={() => springValue.set(1)}
      onHoverEnd={() => springValue.set(0)}
      onFocus={() => springValue.set(1)}
      onBlur={() => springValue.set(0)}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      style={{ scale: reduceMotion ? 1 : scale }}
      className={cn(
        "relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#1d3557]/12 bg-[#E8E0D4] text-start",
        "shadow-[0_8px_24px_rgba(29,53,87,0.12)] transition-shadow hover:shadow-xl",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d3557]",
      )}
    >
      {feature.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={feature.imageUrl}
          alt={feature.imageAlt ?? feature.title}
          className="absolute inset-0 h-full w-full object-cover object-top"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}
      <div className="relative z-10 flex h-full w-full flex-col gap-2 bg-linear-to-t from-[#1d3557]/55 from-15% to-transparent p-2 sm:p-3">
        {feature.category && (
          <span className="w-fit rounded-xl bg-[#1d3557]/80 px-2 py-1 font-sans text-xs font-medium leading-4 text-white">
            {feature.category}
          </span>
        )}
        <div className="flex-1" />
        <h3 className="rounded-xl bg-[#1d3557]/65 px-1.5 py-2 text-center font-serif text-[clamp(0.75rem,3.2vw,1rem)] leading-normal font-medium text-white backdrop-blur-sm">
          {feature.title}
        </h3>
      </div>
    </motion.button>
    </motion.div>
  );
}

/** The three product cards, without the demo heading, copy, or call to action. */
export default function ProductFeatures({ features, onFeatureClick, className }: ProductFeaturesProps) {
  return (
    <div dir="ltr" className={cn("relative mx-auto flex w-full max-w-xl flex-nowrap justify-center px-3 pt-6 pb-10", className)}>
      {features.slice(0, 3).map((feature, index) => (
        <FeatureCard key={feature.id} feature={feature} index={index} onClick={() => onFeatureClick(feature.id)} />
      ))}
    </div>
  );
}
