"use client";

import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

export type ProductFeature = {
  id: string;
  title: string;
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
        "relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#F6F1EB] text-start text-black",
        "shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-xl",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black",
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
      <div className="relative z-10 flex h-full w-full flex-col p-2 sm:p-3">
        <div className="flex-1" />
        <h3 className="rounded-xl bg-[#F6F1EB] px-1.5 py-2 text-center font-serif text-[clamp(0.625rem,2.8vw,0.75rem)] leading-[1.45] font-medium text-black">
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
    <div dir="ltr" className={cn("relative mx-auto flex w-full max-w-xl flex-nowrap justify-center px-3 pt-6 pb-3", className)}>
      {features.slice(0, 3).map((feature, index) => (
        <FeatureCard key={feature.id} feature={feature} index={index} onClick={() => onFeatureClick(feature.id)} />
      ))}
    </div>
  );
}
