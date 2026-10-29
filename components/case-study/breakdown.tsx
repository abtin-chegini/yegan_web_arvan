"use client";

import {useLocale, useTranslations} from "next-intl";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  CASE_STUDY_BLANK_MEDIA,
  type CaseStudyBreakdownContent,
  type CaseStudyChallenge,
} from "@/lib/case-study-content";
import { cn } from "@/lib/utils";

const ACCENT = "#C99140";
const TITLE = "#111D4A";
const BODY = "#3E4966";
const DESKTOP_MQ = "(min-width: 768px)";

type Annotation = CaseStudyChallenge;

function ChallengeNumber({ number }: { number: string }) {
  const locale = useLocale();
  return (
    <span className="challenge-number">
      {locale === "fa" ? new Intl.NumberFormat("fa", { useGrouping: false }).format(Number(number)) : number}
    </span>
  );
}

export const ANNOTATIONS: Annotation[] = [
  {
    id: "direction",
    number: "01",
    title: "Evolving Product Direction",
    description:
      "Translating early wireframes into a refined interface while maintaining consistency between design decisions and the final product.",
    side: "left",
    anchorX: 0.14,
    anchorY: 0.16,
  },
  {
    id: "search",
    number: "02",
    title: "Dynamic Search Experience",
    description:
      "A focused travel search flow combining origin, destination and date selection into a clear interactive booking experience.",
    side: "right",
    anchorX: 0.72,
    anchorY: 0.34,
  },
  {
    id: "cities",
    number: "03",
    title: "Bilingual City Suggestions",
    description:
      "A contextual city search experience with destination suggestions designed to support both Persian and English user journeys.",
    side: "left",
    anchorX: 0.38,
    anchorY: 0.48,
  },
  {
    id: "seats",
    number: "04",
    title: "Interactive Seat Selection",
    description:
      "A dynamic bus seat selector supporting multiple seat states, passenger categories, availability and immediate visual feedback.",
    side: "left",
    anchorX: 0.28,
    anchorY: 0.8,
  },
  {
    id: "results",
    number: "05",
    title: "Real-Time Ticket Results",
    description:
      "Live ticket results displaying departure time, pricing, seat availability and actionable booking controls.",
    side: "right",
    anchorX: 0.88,
    anchorY: 0.56,
  },
  {
    id: "hierarchy",
    number: "06",
    title: "Responsive Information Hierarchy",
    description:
      "Organizing a dense booking experience while keeping filters, dates, ticket information and actions visually easy to scan.",
    side: "right",
    anchorX: 0.88,
    anchorY: 0.86,
  },
];

type Point = { x: number; y: number };

type ConnectorGeometry = {
  id: string;
  path: string;
  length: number;
  target: Point;
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

const MARKER_OUTER_R = 5.5;
const MARKER_INNER_R = 1.75;
/** Clear gap between stroke end and marker rim */
const LINE_END_GAP = 6;
const ELBOW_CLEARANCE = MARKER_OUTER_R + LINE_END_GAP + 10;

function buildSteppedPath(start: Point, target: Point, side: "left" | "right") {
  const gap = Math.abs(target.x - start.x);
  let elbowX =
    side === "left"
      ? start.x + Math.max(24, gap * 0.42)
      : start.x - Math.max(24, gap * 0.42);

  // Keep the vertical leg outside the marker so it never clips the circle
  if (side === "left") {
    elbowX = Math.min(elbowX, target.x - ELBOW_CLEARANCE);
    // If start is already too close, keep elbow just past start toward target
    elbowX = Math.max(elbowX, start.x + 12);
  } else {
    elbowX = Math.max(elbowX, target.x + ELBOW_CLEARANCE);
    elbowX = Math.min(elbowX, start.x - 12);
  }

  const approachesFromLeft = elbowX <= target.x;
  const endX =
    target.x +
    (approachesFromLeft ? -1 : 1) * (MARKER_OUTER_R + LINE_END_GAP);

  const path = `M ${start.x} ${start.y} H ${elbowX} V ${target.y} H ${endX}`;
  const length =
    Math.abs(elbowX - start.x) +
    Math.abs(target.y - start.y) +
    Math.abs(endX - elbowX);

  return { path, length };
}

function AnnotationBlock({
  annotation,
  connectorRef,
  align,
  open,
  index,
  reduceMotion,
  className,
}: {
  annotation: Annotation;
  connectorRef: (el: HTMLSpanElement | null) => void;
  align: "left" | "right";
  open: boolean;
  index: number;
  reduceMotion: boolean | null;
  className?: string;
}) {
  const isRight = align === "right";
  const delay = 0.12 + index * 0.08;
  const instant = Boolean(reduceMotion);

  return (
    <motion.article
      className={cn(
        "relative max-w-[15.5rem] xl:max-w-[16.5rem]",
        isRight ? "text-left" : "ml-auto text-right",
        className,
      )}
      initial={false}
      animate={
        open
          ? { opacity: 1, x: 0 }
          : {
            opacity: instant ? 1 : 0,
            x: instant ? 0 : isRight ? 16 : -16,
          }
      }
      transition={{
        duration: instant ? 0 : 0.55,
        delay: instant ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className={cn(
          "mb-2 inline-flex items-center gap-2",
          isRight ? "flex-row-reverse" : "flex-row",
        )}
      >
        <motion.span
          className="flex size-8 shrink-0 items-center justify-center rounded-full border font-serif text-[0.8rem] leading-none xl:size-9 xl:text-[0.9rem]"
          style={
            {
              color: ACCENT,
              borderColor: ACCENT,
            } as CSSProperties
          }
          initial={false}
          animate={
            open
              ? { scale: 1, opacity: 1 }
              : { scale: instant ? 1 : 0, opacity: instant ? 1 : 0 }
          }
          transition={{
            type: instant ? "tween" : "spring",
            stiffness: 420,
            damping: 24,
            mass: 0.7,
            delay: instant ? 0 : delay + 0.05,
            duration: instant ? 0 : undefined,
          }}
        >
          <motion.span
            initial={false}
            animate={
              open
                ? { opacity: 1, scale: 1 }
                : { opacity: instant ? 1 : 0, scale: instant ? 1 : 0.6 }
            }
            transition={{
              duration: instant ? 0 : 0.35,
              delay: instant ? 0 : delay + 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ChallengeNumber number={annotation.number} />
          </motion.span>
        </motion.span>
        <motion.span
          ref={connectorRef}
          className={cn(
            "block h-px w-5 shrink-0 xl:w-6",
            isRight ? "origin-right" : "origin-left",
          )}
          style={{ backgroundColor: ACCENT }}
          aria-hidden
          initial={false}
          animate={
            open
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: instant ? 1 : 0, opacity: instant ? 1 : 0 }
          }
          transition={{
            duration: instant ? 0 : 0.4,
            delay: instant ? 0 : delay + 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
      <h3 dir="auto"
        className="font-serif text-[0.98rem] leading-snug font-medium tracking-[-0.01em] xl:text-[1.05rem]"
        style={{ color: TITLE }}
      >
        {annotation.title}
      </h3>
      <p dir="auto"
        className="mt-1.5 font-sans text-[0.72rem] leading-relaxed xl:text-[0.78rem] xl:leading-[1.55]"
        style={{ color: BODY }}
      >
        {annotation.description}
      </p>
    </motion.article>
  );
}


const MOBILE_PANEL_TRANSITION = {
  duration: 0.22,
  ease: [0.645, 0.045, 0.355, 1] as [number, number, number, number],
};
const MOBILE_HEIGHT_SPRING = {
  bounce: 0.08,
  duration: 0.3,
  type: "spring" as const,
};

function MobileAnnotationList({
  annotations,
  open,
  reduceMotion,
}: {
  annotations: Annotation[];
  open: boolean;
  reduceMotion: boolean | null;
}) {
  const instant = Boolean(reduceMotion);
  const listId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenId(null);
    }, 180);
  }, [clearCloseTimeout]);

  useEffect(() => clearCloseTimeout, [clearCloseTimeout]);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setOpenId(null);
  }

  return (
    <ul
      className="mt-3 flex w-full flex-col gap-1 sm:mt-4"
      onPointerLeave={scheduleClose}
    >
      {annotations.map((annotation, index) => {
        const isOpen = openId === annotation.id;
        const panelId = `challenge-panel-${listId}-${annotation.id}`;

        return (
          <motion.li
            key={annotation.id}
            className="border-b border-[#111D4A]/08 last:border-b-0"
            initial={false}
            animate={
              open
                ? { opacity: 1, y: 0 }
                : { opacity: instant ? 1 : 0, y: instant ? 0 : 10 }
            }
            transition={{
              duration: instant ? 0 : 0.45,
              delay: instant ? 0 : 0.1 + index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            onPointerEnter={() => {
              clearCloseTimeout();
              setOpenId(annotation.id);
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={cn(
                "flex w-full items-center gap-2.5 py-2 text-left outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-[#C99140]/40",
                isOpen ? "bg-[#111D4A]/04" : "bg-transparent",
              )}
              onClick={() => {
                clearCloseTimeout();
                setOpenId((current) =>
                  current === annotation.id ? null : annotation.id,
                );
              }}
              onFocus={() => {
                clearCloseTimeout();
                setOpenId(annotation.id);
              }}
            >
              <motion.span
                className="flex size-6 shrink-0 items-center justify-center rounded-full border font-serif text-[0.7rem] leading-none sm:size-7 sm:text-[0.75rem]"
                style={{ borderColor: ACCENT, color: ACCENT }}
                initial={false}
                animate={
                  open
                    ? { scale: 1, opacity: 1 }
                    : { scale: instant ? 1 : 0, opacity: instant ? 1 : 0 }
                }
                transition={{
                  type: instant ? "tween" : "spring",
                  stiffness: 420,
                  damping: 24,
                  delay: instant ? 0 : 0.12 + index * 0.05,
                  duration: instant ? 0 : undefined,
                }}
              >
                <ChallengeNumber number={annotation.number} />
              </motion.span>
              <h3 dir="auto"
                className="min-w-0 flex-1 font-serif text-[0.9rem] leading-snug font-medium sm:text-[0.95rem]"
                style={{ color: TITLE }}
              >
                {annotation.title}
              </h3>
            </button>

            <motion.div
              id={panelId}
              role="region"
              aria-hidden={!isOpen}
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={
                instant
                  ? { duration: 0 }
                  : {
                      height: MOBILE_HEIGHT_SPRING,
                      opacity: MOBILE_PANEL_TRANSITION,
                    }
              }
              className="overflow-hidden"
            >
              <p dir="auto"
                className="pb-2.5 pl-[2.125rem] pr-1 font-sans text-[0.7rem] leading-relaxed sm:pl-9 sm:text-[0.72rem]"
                style={{ color: BODY }}
              >
                {annotation.description}
              </p>
            </motion.div>
          </motion.li>
        );
      })}
    </ul>
  );
}

/** Mobile-only: numbered pins on the product image (no connectors) */
function MobileImagePins({
  annotations,
  imageAlt,
  open,
  reduceMotion,
  productImage,
}: {
  open: boolean;
  reduceMotion: boolean | null;
  productImage: string | null;
  annotations: Annotation[];
  imageAlt: string;
}) {
  const instant = Boolean(reduceMotion);

  return (
    <div className="relative mx-auto w-fit max-w-full">
      {productImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={productImage}
          alt={imageAlt}
          className="block h-auto max-h-[34dvh] w-auto max-w-full sm:max-h-[38dvh]"
          loading="eager"
          decoding="async"
        />
      ) : (
        <div
          className="mx-auto h-[34dvh] w-[min(100%,16rem)] rounded-xl sm:h-[38dvh]"
          style={{ backgroundColor: CASE_STUDY_BLANK_MEDIA }}
          aria-hidden
        />
      )}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {annotations.map((annotation, index) => (
          <motion.span
            key={annotation.id}
            className="absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-[#FCF8F2]/95 font-serif text-[0.65rem] leading-none shadow-[0_1px_4px_rgba(17,29,74,0.12)] sm:size-7 sm:text-[0.7rem]"
            style={{
              left: `${annotation.anchorX * 100}%`,
              top: `${annotation.anchorY * 100}%`,
              borderColor: ACCENT,
              color: ACCENT,
            }}
            initial={false}
            animate={
              open
                ? { scale: 1, opacity: 1 }
                : { scale: instant ? 1 : 0, opacity: instant ? 1 : 0 }
            }
            transition={{
              type: instant ? "tween" : "spring",
              stiffness: 400,
              damping: 22,
              delay: instant ? 0 : 0.2 + index * 0.07,
              duration: instant ? 0 : undefined,
            }}
          >
            <ChallengeNumber number={annotation.number} />
          </motion.span>
        ))}
      </div>
    </div>
  );
}

type CaseStudyBreakdownProps = {
  content: CaseStudyBreakdownContent;
};

export function CaseStudyBreakdown({ content }: CaseStudyBreakdownProps) {
  const t = useTranslations("CaseStudies");
  const locale = useLocale();
  const productImage = content.productImage;
  const annotations = content.challenges ?? ANNOTATIONS;
  const mobileAnnotations = annotations.slice(0, 5);
  const imageAlt = content.productImageAlt ?? "Product interface case study";
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const startRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_MQ);

  const [imageReady, setImageReady] = useState(!productImage);
  const [active, setActive] = useState(false);
  const [connectors, setConnectors] = useState<ConnectorGeometry[]>([]);
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });

  const leftAnnotations = annotations.filter((item) => item.side === "left");
  const rightAnnotations = annotations.filter((item) => item.side === "right");

  const measure = useCallback(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    if (!root || !image || !image.complete || image.naturalWidth === 0) return;

    const rootRect = root.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    setOverlaySize({ width: rootRect.width, height: rootRect.height });

    const next: ConnectorGeometry[] = annotations.map((annotation) => {
      const startEl = startRefs.current[annotation.id];
      const startRect = startEl?.getBoundingClientRect();

      const target: Point = {
        x: imageRect.left - rootRect.left + imageRect.width * annotation.anchorX,
        y: imageRect.top - rootRect.top + imageRect.height * annotation.anchorY,
      };

      const start: Point = startRect
        ? {
          x:
            annotation.side === "left"
              ? startRect.right - rootRect.left
              : startRect.left - rootRect.left,
          y: startRect.top - rootRect.top + startRect.height / 2,
        }
        : {
          x:
            annotation.side === "left"
              ? imageRect.left - rootRect.left - 40
              : imageRect.right - rootRect.left + 40,
          y: target.y,
        };

      const { path, length } = buildSteppedPath(start, target, annotation.side);
      return { id: annotation.id, path, length, target };
    });

    setConnectors(next);
  }, [annotations]);

  useLayoutEffect(() => {
    if (!isDesktop || !imageReady) return;
    measure();
  }, [isDesktop, imageReady, measure]);

  useEffect(() => {
    if (!active || !isDesktop) return;
    const id = window.requestAnimationFrame(() => {
      measure();
      window.setTimeout(measure, 80);
    });
    return () => window.cancelAnimationFrame(id);
  }, [active, isDesktop, measure]);

  useEffect(() => {
    if (!isDesktop) return;

    const root = rootRef.current;
    const image = imageRef.current;
    if (!root) return;

    const observer = new ResizeObserver(() => {
      measure();
    });

    observer.observe(root);
    if (image) observer.observe(image);
    if (imageWrapRef.current) observer.observe(imageWrapRef.current);

    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isDesktop, measure, imageReady]);

  useEffect(() => {
    const section = rootRef.current?.closest("section");
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
  }, []);

  const showMotion = active && !reduceMotion;

  return (
    <div
      ref={rootRef}
      dir="ltr"
      className="relative mx-auto flex h-full w-full max-w-[96rem] flex-col"
      style={{ color: TITLE }}
    >
      <header className={cn("shrink-0 pt-1 md:pt-2", locale === "fa" ? "w-full text-center" : "max-w-xl text-left")}>
        <h2 className="font-serif text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.1] font-medium tracking-[-0.02em]">
          {t("challengesTitle")}
        </h2>
      </header>

      {/* Mobile / tablet — compact expandable challenges (no scroll) */}
      <div className="mt-2 flex min-h-0 flex-1 flex-col justify-center overflow-hidden md:mt-4 md:hidden">
        <motion.div
          className="mx-auto w-full max-w-xl shrink-0"
          initial={false}
          animate={
            showMotion
              ? { opacity: 1, y: 0 }
              : { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <MobileImagePins
            annotations={mobileAnnotations}
            imageAlt={imageAlt}
            open={showMotion || Boolean(reduceMotion)}
            reduceMotion={reduceMotion}
            productImage={productImage}
          />
        </motion.div>
        <motion.div
          initial={false}
          animate={
            showMotion
              ? { opacity: 1, y: 0 }
              : { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 12 }
          }
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 overflow-hidden"
        >
          <MobileAnnotationList
            annotations={mobileAnnotations}
            open={showMotion || Boolean(reduceMotion)}
            reduceMotion={reduceMotion}
          />
        </motion.div>
      </div>

      {/* Desktop annotated layout */}
      <div className="mt-2 hidden min-h-0 flex-1 items-center md:mt-3 md:grid md:grid-cols-[minmax(10rem,0.85fr)_minmax(0,2.7fr)_minmax(10rem,0.85fr)] md:gap-2 lg:gap-4 xl:gap-6">
        <motion.div
          className="flex h-full flex-col justify-between gap-6 py-2 lg:gap-8 lg:py-4 xl:py-5"
          initial={false}
        >
          {leftAnnotations.map((annotation, index) => (
            <AnnotationBlock
              key={annotation.id}
              annotation={annotation}
              align="left"
              open={showMotion || Boolean(reduceMotion)}
              index={index}
              reduceMotion={reduceMotion}
              connectorRef={(el) => {
                startRefs.current[annotation.id] = el;
              }}
            />
          ))}
        </motion.div>

        <motion.div
          ref={imageWrapRef}
          className="relative flex h-full items-center justify-center self-stretch"
          initial={false}
          animate={
            showMotion
              ? { opacity: 1, y: 0 }
              : { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 }
          }
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {productImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imageRef}
              src={productImage}
              alt={imageAlt}
              className="h-auto max-h-[min(78dvh,52rem)] w-full object-contain drop-shadow-[0_18px_40px_rgba(17,29,74,0.08)]"
              loading="eager"
              decoding="async"
              onLoad={() => {
                setImageReady(true);
                requestAnimationFrame(measure);
              }}
            />
          ) : (
            <div
              className="h-[min(60dvh,28rem)] w-full max-w-xl rounded-2xl"
              style={{ backgroundColor: CASE_STUDY_BLANK_MEDIA }}
              aria-hidden
            />
          )}
        </motion.div>

        <motion.div
          className="flex h-full flex-col justify-between gap-6 py-2 lg:gap-8 lg:py-4 xl:py-5"
          initial={false}
        >
          {rightAnnotations.map((annotation, index) => (
            <AnnotationBlock
              key={annotation.id}
              annotation={annotation}
              align="right"
              open={showMotion || Boolean(reduceMotion)}
              index={index}
              reduceMotion={reduceMotion}
              connectorRef={(el) => {
                startRefs.current[annotation.id] = el;
              }}
            />
          ))}
        </motion.div>
      </div>

      {isDesktop && overlaySize.width > 0 ? (
        <svg
          className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full overflow-visible md:block"
          width={overlaySize.width}
          height={overlaySize.height}
          viewBox={`0 0 ${overlaySize.width} ${overlaySize.height}`}
          aria-hidden
        >
          {connectors.map((connector, index) => {
            const lineDelay = 0.35 + index * 0.09;
            const markerDelay = lineDelay + 0.55;

            return (
              <g key={connector.id}>
                <motion.path
                  d={connector.path}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={1.15}
                  strokeLinecap="butt"
                  strokeLinejoin="round"
                  initial={false}
                  animate={
                    showMotion
                      ? { pathLength: 1, opacity: 1 }
                      : {
                        pathLength: reduceMotion ? 1 : 0,
                        opacity: reduceMotion ? 1 : 0,
                      }
                  }
                  transition={{
                    pathLength: {
                      duration: reduceMotion ? 0 : 0.75,
                      delay: reduceMotion ? 0 : lineDelay,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    opacity: {
                      duration: reduceMotion ? 0 : 0.25,
                      delay: reduceMotion ? 0 : lineDelay,
                    },
                  }}
                />
                <motion.circle
                  cx={connector.target.x}
                  cy={connector.target.y}
                  r={MARKER_OUTER_R}
                  fill="#FCF8F2"
                  stroke={ACCENT}
                  strokeWidth={1.25}
                  initial={false}
                  animate={
                    showMotion
                      ? { scale: 1, opacity: 1 }
                      : {
                        scale: reduceMotion ? 1 : 0,
                        opacity: reduceMotion ? 1 : 0,
                      }
                  }
                  transition={{
                    type: reduceMotion ? "tween" : "spring",
                    stiffness: 380,
                    damping: 22,
                    delay: reduceMotion ? 0 : markerDelay,
                    duration: reduceMotion ? 0 : undefined,
                  }}
                  style={{
                    transformOrigin: `${connector.target.x}px ${connector.target.y}px`,
                  }}
                />
                <motion.circle
                  cx={connector.target.x}
                  cy={connector.target.y}
                  r={MARKER_INNER_R}
                  fill={ACCENT}
                  initial={false}
                  animate={
                    showMotion
                      ? { scale: 1, opacity: 1 }
                      : {
                        scale: reduceMotion ? 1 : 0,
                        opacity: reduceMotion ? 1 : 0,
                      }
                  }
                  transition={{
                    type: reduceMotion ? "tween" : "spring",
                    stiffness: 420,
                    damping: 20,
                    delay: reduceMotion ? 0 : markerDelay + 0.08,
                    duration: reduceMotion ? 0 : undefined,
                  }}
                  style={{
                    transformOrigin: `${connector.target.x}px ${connector.target.y}px`,
                  }}
                />
              </g>
            );
          })}
        </svg>
      ) : null}
    </div>
  );
}
