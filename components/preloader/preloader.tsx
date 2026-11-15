"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

const LOGO_SRC =
  "https://cdn.yeganehheshmat.com/yeganehheshmat_logo.svg";
const TRACK_LENGTH = 2 * Math.PI * 155;
const PROGRESS_LENGTH = 2 * Math.PI * 150;

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

    let progressTween: gsap.core.Tween | null = null;
    let exitTl: gsap.core.Timeline | null = null;
    let disposed = false;
    let finishing = false;
    let readinessTimer: number | undefined;

    const logo = root.querySelector<HTMLImageElement>("#pbc-logo");
    const btnOutlineProgress = root.querySelector(
      ".stroke-progress",
    ) as SVGCircleElement | null;

    if (!btnOutlineProgress) return;

    // Use the circle's real length so pixel rounding cannot hide the fill.
    gsap.set(btnOutlineProgress, {
      strokeDasharray: PROGRESS_LENGTH,
      strokeDashoffset: PROGRESS_LENGTH,
    });
    progressTween = gsap.to(btnOutlineProgress, {
      strokeDashoffset: PROGRESS_LENGTH * 0.1,
      duration: 1.5,
      ease: "power1.out",
      autoRound: false,
    });

    const playExit = () => {
      onRevealStart?.();

      exitTl?.kill();
      exitTl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      exitTl.to(root, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const finish = () => {
      if (disposed || finishing) return;
      finishing = true;
      window.clearTimeout(readinessTimer);
      progressTween?.kill();
      progressTween = gsap.to(btnOutlineProgress, {
        strokeDashoffset: 0,
        duration: 0.4,
        ease: "power1.inOut",
        autoRound: false,
        onComplete: playExit,
      });
    };

    // Wait only for the first screen, after the responsive layout has mounted.
    // Slow third-party assets must not keep an otherwise usable page covered.
    readinessTimer = window.setTimeout(finish, 2000);
    const readinessFrame = window.requestAnimationFrame(() => {
      const heroImage = document.querySelector<HTMLImageElement>("#home img");
      const images = [logo, heroImage].filter((image): image is HTMLImageElement => image !== null);
      const ready = images.map((image) => image.decode().catch(() => {}));
      void Promise.all([...ready, document.fonts.ready]).then(finish);
    });

    return () => {
      disposed = true;
      window.clearTimeout(readinessTimer);
      window.cancelAnimationFrame(readinessFrame);
      progressTween?.kill();
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
              srcSet="https://cdn.yeganehheshmat.com/yeganehheshmat_logo2.png"
            />
            <img id="pbc-logo" src={LOGO_SRC} alt="" width={224} height={224} loading="eager" fetchPriority="high" decoding="async" />
          </picture>
          <div className="pbc-svg-stroke">
            <svg
              viewBox="0 0 320 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: "rotate(-90deg)" }}
              aria-hidden
            >
              <circle
                className="stroke-track"
                cx="160"
                cy="160"
                r="155"
                strokeDasharray={TRACK_LENGTH}
                strokeDashoffset={0}
                stroke="#d4c8b8"
                strokeWidth="2"
              />
              <circle
                className="stroke-progress"
                cx="160"
                cy="160"
                r="150"
                strokeDasharray={PROGRESS_LENGTH}
                strokeDashoffset={PROGRESS_LENGTH}
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
