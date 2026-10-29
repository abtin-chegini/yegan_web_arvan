"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const NAVY = "#0B2A5B";
const NODE_FILL = "#FBF7F0";
/**
 * Line anchors the lower portion of the timeline canvas (below header).
 * ~64% leaves calm space above while keeping room for bottom items.
 */
const LINE_TOP = "64%";
/** Half of node diameter — clears connectors from the circle edge */
const NODE_RADIUS = "1.25rem";

type TimelineItem = {
  number: string;
  title: string;
  description: string;
  placement: "top" | "bottom";
  position: number;
  threshold: number;
};

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    number: "01",
    title: "Research & Competitor Analysis",
    description:
      "I studied similar platforms to define clearer booking UX patterns.",
    placement: "top",
    position: 0.09,
    threshold: 0.02,
  },
  {
    number: "02",
    title: "Wireframing & Iteration",
    description:
      "I refined wireframes while keeping the journey consistent.",
    placement: "bottom",
    position: 0.266,
    threshold: 0.22,
  },
  {
    number: "03",
    title: "Interaction Design",
    description:
      "I designed key interactions like dynamic search, hero animation switching, bilingual suggestions, and real-time user feedback.",
    placement: "top",
    position: 0.442,
    threshold: 0.4,
  },
  {
    number: "04",
    title: "Complex Flow Design",
    description:
      "I focused on complex flows like ticket results, date filters, live availability, and bus seat selection.",
    placement: "bottom",
    position: 0.618,
    threshold: 0.58,
  },
  {
    number: "05",
    title: "Front-End Execution",
    description:
      "I turned the final UI into responsive front-end screens with attention to structure, motion, usability, and technical limits.",
    placement: "top",
    position: 0.794,
    threshold: 0.76,
  },
  {
    number: "06",
    title: "Responsive Refinement",
    description:
      "I refined the responsive experience to keep complex booking flows clear and smooth on desktop and mobile.",
    placement: "bottom",
    position: 0.91,
    threshold: 0.94,
  },
];

const INTRO =
  "A focused path from research to responsive delivery — shaping each booking decision with clarity, consistency, and care.";

function useLocalizedStep(item: TimelineItem) {
  const locale = useLocale();
  const t = useTranslations("CaseStudies.processSteps");
  if (locale !== "fa") return item;
  return {
    ...item,
    title: t(`${item.number}.title`),
    description: t(`${item.number}.description`),
  };
}

function timelineNumber(number: string, locale: string) {
  return locale === "fa"
    ? String(Number(number)).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])
    : number;
}

function useSectionActive(ref: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;

    const sync = () => {
      setActive(section.getAttribute("data-active") === "true");
    };
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(section, {
      attributes: true,
      attributeFilter: ["data-active"],
    });
    return () => observer.disconnect();
  }, [ref]);

  return active;
}

function useTimelineProgress(active: boolean) {
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);

  useEffect(() => {
    if (reduceMotion) {
      progress.jump(active ? 1 : 0);
      return;
    }

    if (!active) {
      progress.jump(0);
      return;
    }

    progress.jump(0);

    let controls: ReturnType<typeof animate> | undefined;
    const frame = window.requestAnimationFrame(() => {
      controls = animate(progress, [0, 1], {
        duration: 2.9,
        ease: [0.22, 1, 0.36, 1],
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      controls?.stop();
    };
  }, [active, progress, reduceMotion]);

  return progress;
}

function useNodeActive(progress: MotionValue<number>, threshold: number) {
  const subscribe = useCallback(
    (onChange: () => void) => progress.on("change", onChange),
    [progress]
  );
  const getSnapshot = useCallback(
    () => progress.get() >= threshold,
    [progress, threshold]
  );
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function DashedConnector({
  placement,
  active,
  reduceMotion,
}: {
  placement: "top" | "bottom";
  active: boolean;
  reduceMotion: boolean | null;
}) {
  const instant = Boolean(reduceMotion);
  const isTop = placement === "top";

  return (
    <motion.div
      className={cn(
        "w-px border-l border-dashed",
        isTop ? "origin-bottom" : "origin-top",
      )}
      style={{
        borderColor: NAVY,
        height: 36,
      }}
      initial={false}
      animate={
        active
          ? { scaleY: 1, opacity: 0.85 }
          : { scaleY: instant ? 1 : 0, opacity: instant ? 0.85 : 0 }
      }
      transition={{
        duration: instant ? 0 : 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden
    />
  );
}

function StepContent({
  item,
  active,
  reduceMotion,
}: {
  item: TimelineItem;
  active: boolean;
  reduceMotion: boolean | null;
}) {
  const instant = Boolean(reduceMotion);
  const isTop = item.placement === "top";
  const localizedItem = useLocalizedStep(item);

  return (
    <motion.div
      className="flex w-[9.75rem] flex-col items-center text-center xl:w-[10.5rem]"
      initial={false}
      animate={
        active
          ? { opacity: 1, y: 0 }
          : {
              opacity: instant ? 1 : 0,
              y: instant ? 0 : isTop ? 10 : -10,
            }
      }
      transition={{
        duration: instant ? 0 : 0.5,
        delay: instant ? 0 : 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <h3
        className="font-serif text-[0.92rem] leading-snug font-medium tracking-[-0.01em] xl:text-[0.98rem]"
        style={{ color: NAVY }}
      >
        {localizedItem.title}
      </h3>
      <p
        className="mt-1.5 font-sans text-[0.68rem] leading-relaxed xl:text-[0.72rem] xl:leading-[1.55]"
        style={{ color: NAVY }}
      >
        {localizedItem.description}
      </p>
    </motion.div>
  );
}

function TimelineNode({
  item,
  active,
  reduceMotion,
}: {
  item: TimelineItem;
  active: boolean;
  reduceMotion: boolean | null;
}) {
  const locale = useLocale();
  const instant = Boolean(reduceMotion);

  return (
    <motion.div
      className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border"
      style={{
        backgroundColor: NODE_FILL,
        borderColor: NAVY,
        borderWidth: 1.5,
      }}
      initial={false}
      animate={active ? { opacity: 1 } : { opacity: instant ? 1 : 0.38 }}
      transition={{ duration: instant ? 0 : 0.3 }}
    >
      <span
        className="timeline-step-number flex size-full items-center justify-center font-serif text-[1.15rem] leading-none tracking-tight tabular-nums"
        style={{ color: NAVY }}
      >
        {timelineNumber(item.number, locale)}
      </span>
    </motion.div>
  );
}

function DesktopTimeline({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const isRtl = useLocale() === "fa";
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="relative h-full w-full">
      {/* Horizontal anchor — lower portion of the canvas */}
      <div
        className="absolute inset-x-[2%] -translate-y-1/2"
        style={{ top: LINE_TOP }}
      >
        <div
          className="relative h-px w-full"
          style={{ backgroundColor: `${NAVY}33` }}
        >
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{
              transformOrigin: isRtl ? "right center" : "left center",
              backgroundColor: NAVY,
              scaleX,
              height: 1.5,
              width: "100%",
            }}
          />
          <span
            className="absolute top-1/2 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: NAVY }}
            aria-hidden
          />
          <span
            className="absolute top-1/2 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: NAVY }}
            aria-hidden
          />
        </div>
      </div>

      {TIMELINE_ITEMS.map((item) => (
        <DesktopStep
          key={item.number}
          item={item}
          progress={progress}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}

function DesktopStep({
  item,
  progress,
  reduceMotion,
}: {
  item: TimelineItem;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const isRtl = useLocale() === "fa";
  const active = useNodeActive(progress, item.threshold);
  const isTop = item.placement === "top";

  return (
    <div
      className="absolute top-0 bottom-0 w-[11rem] -translate-x-1/2 xl:w-[12rem]"
      style={{ left: `${2 + (isRtl ? 1 - item.position : item.position) * 96}%` }}
    >
      {/* Above-line content — floats just above the node */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end pb-1"
        style={{ bottom: `calc(100% - ${LINE_TOP} + ${NODE_RADIUS})` }}
      >
        {isTop ? (
          <div className="flex flex-col items-center gap-2.5">
            <StepContent
              item={item}
              active={active}
              reduceMotion={reduceMotion}
            />
            <DashedConnector
              placement="top"
              active={active}
              reduceMotion={reduceMotion}
            />
          </div>
        ) : null}
      </div>

      {/* Node — perfectly centered on the line */}
      <div
        className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ top: LINE_TOP }}
      >
        <TimelineNode
          item={item}
          active={active}
          reduceMotion={reduceMotion}
        />
      </div>

      {/* Below-line content */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-start pt-1"
        style={{ top: `calc(${LINE_TOP} + ${NODE_RADIUS})` }}
      >
        {!isTop ? (
          <div className="flex flex-col items-center gap-2.5">
            <DashedConnector
              placement="bottom"
              active={active}
              reduceMotion={reduceMotion}
            />
            <StepContent
              item={item}
              active={active}
              reduceMotion={reduceMotion}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Reserved icon slot — empty until real assets are provided */
const MOBILE_ICON_SLOT = "size-8 shrink-0";

const mobileEase = [0.22, 1, 0.36, 1] as const;

const mobileListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.38,
      delayChildren: 0.12,
    },
  },
};

const mobileStepVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

const mobileMarkerVariants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: mobileEase },
  },
};

const mobileIconVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: mobileEase },
  },
};

const mobileTitleVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: mobileEase },
  },
};

const mobileDescVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: mobileEase },
  },
};

function MobileTimelineStep({
  item,
  isLast,
}: {
  item: TimelineItem;
  isLast: boolean;
}) {
  const locale = useLocale();
  const localizedItem = useLocalizedStep(item);
  return (
    <motion.li
      className="relative flex gap-3 sm:gap-3.5"
      variants={mobileStepVariants}
    >
      <div className="relative z-10 flex w-9 shrink-0 justify-center sm:w-10">
        <motion.div
          className="flex size-9 items-center justify-center rounded-full border bg-[#FBF7F0] sm:size-10"
          style={{ borderColor: NAVY, borderWidth: 1.5 }}
          variants={mobileMarkerVariants}
        >
          <span
            className="timeline-step-number font-serif text-[0.95rem] leading-none tracking-tight tabular-nums sm:text-[1.05rem]"
            style={{ color: NAVY }}
          >
            {timelineNumber(item.number, locale)}
          </span>
        </motion.div>
      </div>

      <div
        className={cn(
          "min-w-0 flex-1",
          isLast ? "pb-1" : "pb-7 sm:pb-8",
        )}
      >
        <div className="flex items-start gap-2.5 sm:gap-3">
          {/* Empty icon placeholder — preserves final icon footprint */}
          <motion.span
            className={MOBILE_ICON_SLOT}
            variants={mobileIconVariants}
            aria-hidden
          />
          <div className="min-w-0 flex-1 pt-0.5">
            <motion.h3
              className="font-serif text-[0.95rem] leading-snug font-medium tracking-[-0.01em] sm:text-[1.02rem]"
              style={{ color: NAVY }}
              variants={mobileTitleVariants}
            >
              {localizedItem.title}
            </motion.h3>
            <motion.p
              className="mt-1.5 font-sans text-[0.75rem] leading-relaxed text-[#0B2A5B]/85 sm:text-[0.8rem] sm:leading-[1.6]"
              variants={mobileDescVariants}
            >
              {localizedItem.description}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

/**
 * xs / sm only — vertical process timeline.
 * md+ continues to use DesktopTimeline unchanged.
 */
function MobileTimeline({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean | null;
}) {
  const instant = Boolean(reduceMotion);

  const listVariants = instant
    ? {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0, delayChildren: 0 },
        },
      }
    : mobileListVariants;

  return (
    <div className="relative">
      {/* Track + progressive fill — centered on the marker column */}
      <div
        className="pointer-events-none absolute top-4 bottom-4 start-[1.125rem] w-px -translate-x-1/2 rtl:translate-x-1/2 sm:start-5"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `${NAVY}28` }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 origin-top"
          style={{ backgroundColor: NAVY, height: "100%", width: 1.5 }}
          initial={false}
          animate={
            active
              ? { scaleY: 1, opacity: 1 }
              : {
                  scaleY: instant ? 1 : 0,
                  opacity: instant ? 1 : 0,
                }
          }
          transition={
            instant
              ? { duration: 0 }
              : {
                  duration: 2.35,
                  ease: mobileEase,
                  delay: active ? 0.08 : 0,
                }
          }
        />
        <span
          className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: NAVY }}
        />
        <span
          className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full"
          style={{ backgroundColor: NAVY }}
        />
      </div>

      <motion.ol
        className="relative m-0 list-none p-0"
        variants={listVariants}
        initial={false}
        animate={active ? "visible" : "hidden"}
      >
        {TIMELINE_ITEMS.map((item, index) => (
          <MobileTimelineStep
            key={item.number}
            item={item}
            isLast={index === TIMELINE_ITEMS.length - 1}
          />
        ))}
      </motion.ol>
    </div>
  );
}

const subscribeToMount = () => () => {};
const getMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

export function CaseStudyProcess() {
  const locale = useLocale();
  const t = useTranslations("CaseStudies");
  const sectionRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(subscribeToMount, getMountedSnapshot, getServerMountedSnapshot);
  const preferReducedMotion = useReducedMotion();
  const reduceMotion = mounted ? preferReducedMotion : false;
  const active = useSectionActive(sectionRef);
  const progress = useTimelineProgress(Boolean(mounted && active));


  return (
    <div
      ref={sectionRef}
      className="relative mx-auto flex h-full w-full max-w-[96rem] flex-col"
      style={{ color: NAVY }}
    >
      <header className={cn("shrink-0 pt-1 md:pt-2", locale === "fa" ? "mx-auto w-full max-w-4xl text-center" : "max-w-xl text-start")}>
        <h2 className="font-serif text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.1] font-medium tracking-[-0.02em]">
          {locale === "fa" ? t("processTitle") : "The Process"}
        </h2>
        <p className={cn("mt-3 font-sans text-[0.85rem] leading-relaxed text-[#0B2A5B]/85 sm:text-[0.92rem] sm:leading-[1.65]", locale === "fa" ? "mx-auto max-w-3xl text-pretty" : "max-w-md")}>
          {locale === "fa" ? t("processDescription") : INTRO}
        </p>
      </header>

      {/* xs / sm — vertical timeline (md+ hidden) */}
      <div
        className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pe-1 md:hidden"
        data-no-section-swipe
      >
        <MobileTimeline
          active={Boolean(mounted && active)}
          reduceMotion={reduceMotion}
        />
      </div>

      {/*
        Timeline canvas fills remaining height.
        Line sits at LINE_TOP (~64%) so calm space remains between intro and track,
        while bottom items still have room — matching the reference orientation.
      */}
      <div className="relative mt-6 hidden min-h-0 w-full flex-1 md:block md:mt-8">
        <DesktopTimeline progress={progress} reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}
