"use client";

import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useEffect, useRef } from "react";

gsap.registerPlugin(CustomEase);

CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("glide", "0.8, 0, 0.2, 1");

const LOGO_SRC =
  "https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/yeganehheshmat_logo.svg?updatedAt=1792670046410";

const BACKDROP_TOP = ["01", "02", "03", "04", "05", "06"];
const BACKDROP_BOTTOM = ["07", "08", "09", "10", "11", "12"];

type PreloaderProps = {
  /** Fires when the fade-out begins — start hero caption immediately */
  onRevealStart?: () => void;
  /** Fires after the fade-out finishes — safe to unmount */
  onComplete?: () => void;
};

export function Preloader({ onRevealStart, onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let introTl: gsap.core.Timeline | null = null;
    let exitTl: gsap.core.Timeline | null = null;

    const q = gsap.utils.selector(root);
    const preloaderBtn = q(".preloader-btn-container")[0] as
      | HTMLElement
      | undefined;
    const btnOutlineTrack = root.querySelector(
      ".stroke-track",
    ) as SVGCircleElement | null;
    const btnOutlineProgress = root.querySelector(
      ".stroke-progress",
    ) as SVGCircleElement | null;

    if (!preloaderBtn || !btnOutlineTrack || !btnOutlineProgress) return;

    const svgPathLength = btnOutlineTrack.getTotalLength();

    gsap.set(preloaderBtn, {
      xPercent: -50,
      yPercent: -50,
      left: "50%",
      top: "50%",
      scale: 1,
    });

    gsap.set([btnOutlineTrack, btnOutlineProgress], {
      strokeDasharray: svgPathLength,
      strokeDashoffset: svgPathLength,
    });

    const playExit = () => {
      onRevealStart?.();

      exitTl?.kill();
      exitTl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      exitTl.to(q(".preloader, .preloader-backdrop"), {
        opacity: 0,
        duration: 1.4,
        ease: "power2.out",
      });
    };

    introTl = gsap.timeline({ delay: 0.6 });

    introTl
      .to(
        btnOutlineTrack,
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "hop",
        },
        0,
      )
      .to(
        q(".pbc-svg-stroke svg"),
        {
          rotation: 270,
          duration: 2,
          ease: "hop",
        },
        0,
      );

    const progressStops = [0.2, 0.25, 0.85, 1].map((base, i) => {
      if (i === 3) return 1;
      return base + (Math.random() - 0.5) * 0.1;
    });

    progressStops.forEach((stop, i) => {
      introTl!.to(btnOutlineProgress, {
        strokeDashoffset: svgPathLength - svgPathLength * stop,
        duration: 0.75,
        ease: "glide",
        delay: i === 0 ? 0.3 : 0.3 + Math.random() * 0.2,
      });
    });

    introTl.add(playExit);

    return () => {
      introTl?.kill();
      exitTl?.kill();
    };
  }, [onRevealStart, onComplete]);

  return (
    <div ref={rootRef} className="preloader-root" aria-busy="true" aria-live="polite">
      <div className="preloader-backdrop" aria-hidden>
        <div className="pb-row">
          {BACKDROP_TOP.map((label) => (
            <div className="pb-col" key={label}>
              <p>{label}</p>
            </div>
          ))}
        </div>
        <div className="pb-row">
          {BACKDROP_BOTTOM.map((label) => (
            <div className="pb-col" key={label}>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="preloader">
        <div className="preloader-btn-container" aria-hidden>
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet="https://ik.imagekit.io/s7yz964lq/backgrounds/HomePage/yeganehheshmat_logo2.png"
            />
            <img id="pbc-logo" src={LOGO_SRC} alt="" />
          </picture>
          <div className="pbc-svg-stroke">
            <svg
              viewBox="0 0 320 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <circle
                className="stroke-track"
                cx="160"
                cy="160"
                r="155"
                stroke="#d4c8b8"
                strokeWidth="2"
              />
              <circle
                className="stroke-progress"
                cx="160"
                cy="160"
                r="150"
                stroke="#1d3557"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
