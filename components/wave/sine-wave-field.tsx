"use client";

import { useAnimationFrame } from "motion/react";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { FloatingWaveCard } from "@/components/wave/floating-wave-card";
import type { SineWaveFieldProps, WaveCardData } from "@/components/wave/types";
import { cn } from "@/lib/utils";

const DEFAULT_CARDS: WaveCardData[] = [
  {
    title: "Understand",
    description:
      "I start by listening carefully — uncovering goals, constraints, and what truly matters.",
  },
  {
    title: "Define",
    description:
      "I shape clarity from complexity, turning insights into a focused direction.",
  },
  {
    title: "Design",
    description:
      "I craft thoughtful experiences that feel intuitive, intentional, and refined.",
  },
  {
    title: "Develop",
    description:
      "I stay close through build — aligning design and implementation with care.",
  },
  {
    title: "Deliver",
    description:
      "I refine until it feels right — polished, purposeful, and ready to land.",
  },
];


function buildWavePath(
  width: number,
  height: number,
  amplitude: number,
  wavelength: number,
  phase: number,
  verticalOffset: number
): string {
  const midY = height / 2 + verticalOffset;
  const steps = Math.max(48, Math.ceil(width / 8));
  let d = "";

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y =
      midY + amplitude * Math.sin((x / wavelength) * Math.PI * 2 + phase);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  return d;
}

function waveYAt(
  x: number,
  height: number,
  amplitude: number,
  wavelength: number,
  phase: number,
  verticalOffset: number
): number {
  const midY = height / 2 + verticalOffset;
  return midY + amplitude * Math.sin((x / wavelength) * Math.PI * 2 + phase);
}

export function SineWaveField({
  speed = 0.35,
  amplitude = 28,
  cardCount = 4,
  verticalOffset = 0,
  cardFloatAmplitude = 7,
  wavelength = 420,
  cards = DEFAULT_CARDS,
  className,
}: SineWaveFieldProps) {
  const isRtl = useLocale() === "fa";
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const phaseRef = useRef(0);
  const lastTsRef = useRef(0);
  const propsRef = useRef({
    speed,
    amplitude,
    verticalOffset,
    cardFloatAmplitude,
    wavelength,
  });

  useEffect(() => {
    propsRef.current = {
      speed,
      amplitude,
      verticalOffset,
      cardFloatAmplitude,
      wavelength,
    };
  }, [speed, amplitude, verticalOffset, cardFloatAmplitude, wavelength]);

  const resolvedCards = useMemo(() => {
    const count = Math.max(1, cardCount);
    return Array.from({ length: count }, (_, i) => cards[i % cards.length]!);
  }, [cardCount, cards]);

  const cardMeta = useMemo(
    () =>
      resolvedCards.map((_, i) => {
        const n = resolvedCards.length;
        const t = n === 1 ? 0.5 : (i + 1) / (n + 1);
        const leftPercent = (isRtl ? 1 - t : t) * 100;
        const isRightmost = n > 1 && i === (isRtl ? 0 : n - 1);
        return {
          // Give only the rightmost pair more horizontal breathing room.
          leftPercent: leftPercent + (isRightmost ? 4 : 0),
          floatPhase: i * 1.37 + 0.4,
        };
      }),
    [resolvedCards, isRtl]
  );

  const cardMetaRef = useRef(cardMeta);
  useEffect(() => {
    cardMetaRef.current = cardMeta;
  }, [cardMeta]);

  const setCardRef = useCallback((index: number, el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      sizeRef.current = { width: rect.width, height: rect.height };
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((ts) => {
    if (!lastTsRef.current) lastTsRef.current = ts;
    const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
    lastTsRef.current = ts;

    const {
      speed: spd,
      amplitude: amp,
      verticalOffset: vOff,
      cardFloatAmplitude: floatAmp,
      wavelength: waveLen,
    } = propsRef.current;

    phaseRef.current += spd * dt;
    if (phaseRef.current > Math.PI * 2) {
      phaseRef.current %= Math.PI * 2;
    }

    const { width, height } = sizeRef.current;
    if (width <= 0 || height <= 0) return;

    const phase = phaseRef.current;

    if (pathRef.current) {
      pathRef.current.setAttribute(
        "d",
        buildWavePath(width, height, amp, waveLen, phase, vOff)
      );
    }

    const metaList = cardMetaRef.current;
    for (let i = 0; i < metaList.length; i++) {
      const cardEl = cardRefs.current[i];
      const meta = metaList[i];
      if (!cardEl || !meta) continue;

      const x = (meta.leftPercent / 100) * width;
      const waveY = waveYAt(x, height, amp, waveLen, phase, vOff);
      const floatY = floatAmp * Math.sin(phase * 1.15 + meta.floatPhase);
      // Sit circle slightly above the wave (wave path unchanged)
      const y = waveY + floatY - 20;

      cardEl.style.transform = `translate3d(-50%, ${y}px, 0)`;
    }
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-[min(56vh,32rem)] w-full overflow-visible",
        className
      )}
      aria-hidden
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="sine-wave-stroke"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#1d3557" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#1d3557" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1d3557" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill="none"
          stroke="url(#sine-wave-stroke)"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {resolvedCards.map((card, index) => {
        const meta = cardMeta[index]!;
        return (
          <div
            key={`${card.title}-${index}`}
            ref={(node) => setCardRef(index, node)}
            className="absolute top-0 will-change-transform"
            style={{
              left: `${meta.leftPercent}%`,
              transform: "translate3d(-50%, 0, 0)",
            }}
          >
            <FloatingWaveCard data={card} index={index} />
          </div>
        );
      })}
    </div>
  );
}
