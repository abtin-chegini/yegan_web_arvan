"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Dialog from "@/components/ui/smoothui/dialog";
import {
  RESPONSIVE_IMAGE_SOURCES,
  type ResponsiveImages,
} from "@/lib/responsive-images";
import {
  CASE_STUDY_BLANK_MEDIA,
  type CaseStudyOverviewContent,
  type CaseStudyMetaCard,
} from "@/lib/case-study-content";
import { cn } from "@/lib/utils";

function MetaCardIcon({
  images,
}: {
  images: ResponsiveImages | null;
}) {
  return (
    <span className="relative block size-18 shrink-0 overflow-hidden sm:size-21 lg:size-23">
      {images ? (
        <picture className="absolute inset-0 block h-full w-full">
          {RESPONSIVE_IMAGE_SOURCES.map(({ key, minWidth }) => (
            <source
              key={key}
              media={`(min-width: ${minWidth}px)`}
              srcSet={images[key]}
            />
          ))}
          <img
            src={images.xs}
            alt=""
            className="absolute inset-0 h-full w-full object-contain object-center"
            loading="eager"
            decoding="async"
          />
        </picture>
      ) : (
        <span
          className="absolute inset-0 rounded-xl"
          style={{ backgroundColor: CASE_STUDY_BLANK_MEDIA }}
          aria-hidden
        />
      )}
    </span>
  );
}

type CaseStudyOverviewProps = {
  content: CaseStudyOverviewContent;
};

export function CaseStudyOverview({ content }: CaseStudyOverviewProps) {
  const [selectedCard, setSelectedCard] = useState<CaseStudyMetaCard | null>(null);
  const reduceMotion = useReducedMotion();
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-6 text-center sm:gap-8 lg:gap-10">
      <header className="fullpage-reveal flex w-full max-w-3xl flex-col items-center gap-3 sm:gap-4 lg:gap-5">
        <h1 className="font-serif text-[clamp(1.7rem,4.2vw,3.15rem)] leading-[1.15] font-medium tracking-[-0.02em] text-[#1d3557]">
          {content.title}
        </h1>
        <p className="max-w-2xl font-sans text-[0.85rem] leading-relaxed text-[#1d3557]/88 sm:text-[0.95rem] lg:text-[1.05rem] lg:leading-[1.7]">
          {content.description}
        </p>
      </header>

      <div
        className={cn(
          "fullpage-reveal grid w-full max-w-4xl grid-cols-1 gap-2.5",
          "sm:grid-cols-2 sm:gap-3 lg:gap-3.5",
        )}
      >
        {content.metaCards.map((card) => {
          const Card = card.href ? motion.a : motion.button;
          return (
          <Card
            type={card.href ? undefined : "button"}
            key={card.id}
            href={card.href}
            target={card.href ? "_blank" : undefined}
            rel={card.href ? "noopener noreferrer" : undefined}
            aria-haspopup={card.href ? undefined : "dialog"}
            onClick={card.href ? undefined : () => setSelectedCard(card)}
            whileHover={reduceMotion ? {} : { y: -4, scale: 1.015, boxShadow: "0 12px 28px -16px rgba(29, 53, 87, 0.3)" }}
            whileTap={reduceMotion ? {} : { scale: 0.985 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border border-[#1d3557]/12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d3557]",
              "bg-[#F7F0E6]/55 px-3 py-3 text-start",
              "sm:gap-3.5 sm:px-4 sm:py-3.5 lg:px-5 lg:py-4",
            )}
          >
            <MetaCardIcon images={card.icon} />
            <span className="min-w-0 flex-1 text-start">
              <span className="block font-serif text-[1.1rem] leading-tight font-medium tracking-[-0.01em] text-[#1d3557] sm:text-[1.25rem]">
                {card.title}
              </span>
              <span className="mt-1 block font-sans text-[0.75rem] leading-snug text-[#1d3557]/80 sm:text-[0.85rem] sm:leading-relaxed">
                {card.href ? <bdi dir="ltr">{card.body}</bdi> : card.body}
              </span>
            </span>
          </Card>
          );
        })}
      </div>
      <Dialog
        open={selectedCard !== null}
        onOpenChange={(open) => { if (!open) setSelectedCard(null); }}
        title={selectedCard?.dialogTitle ?? selectedCard?.title}
        className="max-h-[80dvh] overflow-y-auto text-[#1d3557] sm:max-w-2xl"
      >
        {selectedCard && (
          <motion.div
            key={selectedCard.id}
            className="flex items-start gap-4 text-start"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {selectedCard.dialogItems ? (
              <ul className="min-w-0 flex-1 list-disc space-y-3 ps-5 pt-2 font-sans text-sm leading-7">
                {selectedCard.dialogItems.map((item) => (
                  <li key={item.title ?? item.body}>{item.title && <strong className="font-semibold">{item.title}: </strong>}{item.body}</li>
                ))}
              </ul>
            ) : <p className="min-w-0 pt-2 font-sans text-sm leading-7">{selectedCard.body}</p>}
          </motion.div>
        )}
      </Dialog>
    </div>
  );
}
