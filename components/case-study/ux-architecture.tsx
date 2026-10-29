"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useState } from "react";

import UxArchitectureResponsive from "@/components/case-study/ux_architecture_responsive/us_architecture_responsive";
import Dialog from "@/components/ui/smoothui/dialog";
import {
  type CaseStudyUxContent,
  type CaseStudyUxItem,
} from "@/lib/case-study-content";
import { cn } from "@/lib/utils";

const TITLE = "#1d3557";
const PLACEHOLDER_BLUE = "#173B70";

const EASE = [0.22, 1, 0.36, 1] as const;

const VIEWPORT = { once: true, amount: 0.2 } as const;

function fadeUpVariants(reduceMotion: boolean | null): Variants {
  if (reduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.2 },
      },
    };
  }

  return {
    hidden: {
      opacity: 0,
      y: 60,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: EASE,
      },
    },
  };
}

function staggerContainer(
  reduceMotion: boolean | null,
  stagger = 0.14,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: reduceMotion ? 0 : 0.06,
      },
    },
  };
}

function UxMedia({
  image,
  scale = 1,
  title,
  imageAlt,
  variants,
  onOpen,
}: {
  image: string | null;
  scale?: number;
  title: string;
  imageAlt?: string;
  variants: Variants;
  onOpen?: () => void;
}) {
  const media = (
    <>
      {image ? (
        <Image
          src={image}
          alt={imageAlt ?? title}
          fill
          sizes="(max-width: 640px) 14rem, 14rem"
          className="origin-top object-cover object-top"
          style={{ transform: `scale(${scale})` }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: PLACEHOLDER_BLUE }}
          aria-hidden
        />
      )}
    </>
  );

  return (
    <motion.div
      variants={variants}
      className={cn(
        "relative mx-auto aspect-[16/10] w-full max-w-[14rem] overflow-hidden rounded-lg",
        "sm:mx-0 sm:max-w-none",
        "shadow-[0_5px_18px_rgba(29,53,87,0.22)]",
      )}
    >
      {image && onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View larger: ${title}`}
          className={cn(
            "absolute inset-0 cursor-zoom-in overflow-hidden rounded-lg",
            "transition-[opacity,transform] hover:opacity-95 active:scale-[0.99]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d3557]",
          )}
        >
          {media}
        </button>
      ) : (
        media
      )}
    </motion.div>
  );
}

function UxArchitectureItemRow({
  item,
  reduceMotion,
  onOpenImage,
}: {
  item: CaseStudyUxItem;
  reduceMotion: boolean | null;
  onOpenImage: (item: CaseStudyUxItem) => void;
}) {
  const itemVariants = fadeUpVariants(reduceMotion);

  return (
    <motion.article
      className={cn(
        "grid items-center gap-4 py-2",
        "grid-cols-1",
        "sm:grid-cols-[minmax(8rem,10rem)_minmax(0,1fr)] sm:gap-5",
        "lg:grid-cols-[minmax(9rem,11rem)_minmax(0,1fr)] lg:gap-6",
      )}
      variants={staggerContainer(reduceMotion, 0.14)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <UxMedia
        image={item.image}
        scale={item.imageDesktopScale}
        title={item.title}
        imageAlt={item.imageAlt}
        variants={itemVariants}
        onOpen={item.image ? () => onOpenImage(item) : undefined}
      />

      <div className="min-w-0 text-start">
        <motion.h3
          variants={itemVariants}
          className="font-serif text-[1.1rem] leading-snug font-medium tracking-[-0.01em] sm:text-[1.25rem] lg:text-[1.35rem]"
        >
          {item.title}
        </motion.h3>
        <motion.p
          variants={itemVariants}
          className="mt-2 whitespace-pre-line font-sans text-[0.78rem] leading-relaxed text-[#1d3557]/85 sm:text-[0.88rem] sm:leading-[1.65] lg:text-[0.92rem]"
        >
          {item.description}
        </motion.p>
      </div>
    </motion.article>
  );
}

function CaseStudyUxArchitectureDesktop({
  content,
}: {
  content: CaseStudyUxContent;
}) {
  const reduceMotion = useReducedMotion();
  const introVariants = fadeUpVariants(reduceMotion);
  const [activeItem, setActiveItem] = useState<CaseStudyUxItem | null>(null);

  return (
    <div
      className="relative mx-auto flex h-full w-full max-w-5xl flex-col"
      style={{ color: TITLE }}
    >
      <motion.header
        className="mx-auto w-full max-w-3xl shrink-0 pt-1 text-center md:pt-2"
        variants={staggerContainer(reduceMotion, 0.16)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.h2
          variants={introVariants}
          className="font-serif text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.1] font-medium tracking-[-0.02em]"
        >
          {content.title ?? "UX Architecture"}
        </motion.h2>
        <motion.p
          variants={introVariants}
          className={cn(
            "mx-auto mt-3 font-sans text-[0.8rem] leading-relaxed text-[#1d3557]/88 sm:mt-4 sm:text-[0.9rem] sm:leading-[1.7]",
            content.title ? "w-full text-start" : "max-w-2xl",
          )}
        >
          {content.intro}
        </motion.p>
      </motion.header>

      <div
        className={cn(
          "mt-8 flex flex-col gap-5 lg:mt-10 lg:gap-6",
          content.title && "mx-auto w-full max-w-3xl",
        )}
      >
        {content.items.map((item) => (
          <UxArchitectureItemRow
            key={item.id}
            item={{ ...item, image: item.imageDesktop ?? item.image }}
            reduceMotion={reduceMotion}
            onOpenImage={setActiveItem}
          />
        ))}
      </div>

      <Dialog
        open={activeItem !== null}
        onOpenChange={(open) => {
          if (!open) setActiveItem(null);
        }}
        title={activeItem?.title}
        className={cn(
          "w-[min(78vw,72rem)] max-w-[min(78vw,72rem)] sm:max-w-[min(78vw,72rem)]",
          "max-h-[min(77vh,72rem)] gap-3 overflow-hidden p-3 sm:p-4",
        )}
      >
        {activeItem?.image ? (
          <div className="relative flex max-h-[min(68vh,64rem)] w-full items-center justify-center overflow-auto rounded-md bg-[#f8fafc]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.imageExpanded ?? activeItem.image}
              alt={activeItem.imageAlt ?? activeItem.title}
              className="h-auto w-full max-h-[min(68vh,64rem)] object-contain"
            />
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}

type CaseStudyUxArchitectureProps = {
  content: CaseStudyUxContent;
};

/**
 * Shared UX Architecture section.
 * Mobile: folder UI. Desktop (md+): image/text layout with lightbox.
 */
export function CaseStudyUxArchitecture({
  content,
}: CaseStudyUxArchitectureProps) {
  return (
    <>
      <div className="h-full min-h-0 w-full md:hidden">
        <UxArchitectureResponsive content={content} />
      </div>
      <div className="hidden h-full min-h-0 w-full md:block">
        <CaseStudyUxArchitectureDesktop content={content} />
      </div>
    </>
  );
}
