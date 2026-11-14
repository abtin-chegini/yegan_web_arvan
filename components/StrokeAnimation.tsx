"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./stroke-animation.css";

export type StrokeAnimationProps = {
  /** Set false if your app already initializes Lenis. */
  smoothScroll?: boolean;
};

/** Copy this component and stroke-animation.css into a Next.js App Router project.
 * Install dependencies with: pnpm add gsap lenis
 * Usage: <StrokeAnimation />
 */
export default function StrokeAnimation({
  smoothScroll = true,
}: StrokeAnimationProps) {
  const spotlightRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = spotlightRef.current;
    const path = pathRef.current;
    if (!section || !path) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = smoothScroll ? new Lenis() : null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const context = gsap.context(() => {
      const pathLength = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, section);

    let active = true;
    void document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });

    return () => {
      if (!active) return;
      active = false;
      context.revert();
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
      }
    };
  }, [smoothScroll]);

  return (
    <section ref={spotlightRef} className="spotlight">
      <div className="row">
        <div className="img" style={{ backgroundColor: "#F6F1EB" }} />
      </div>

      <div className="row">
        <div className="col">
          <div className="card">
            <h2>A cleaner way to handle incoming updates</h2>
            <p>
              Instead of showing every message or notification instantly, the
              app groups related items and presents them in an organized panel.
              It keeps your workspace calm, even when activity spikes.
            </p>
          </div>
        </div>
        <div className="col">
          <div className="img" style={{ backgroundColor: "#0D5990" }} />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="img" style={{ backgroundColor: "#F1ECE6" }} />
        </div>
        <div className="col">
          <div className="card">
            <h2>Built for increasing information demands</h2>
            <p>
              Whether it is files, notes, or incoming messages, the app sorts
              and prioritizes items automatically. It prevents clutter and helps
              maintain clarity during busy periods.
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="img" style={{ backgroundColor: "#0D5990" }} />
      </div>

      <div className="svg-path">
        <svg
          viewBox="0 0 1378 2760"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMin meet"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d="M639.668 100C639.668 100 105.669 100 199.669 601.503C293.669 1103.01 1277.17 691.502 1277.17 1399.5C1277.17 2107.5 -155.332 1968 140.168 1438.5C435.669 909.002 1442.66 2093.5 713.168 2659.5"
            stroke="#8FAED8"
            strokeWidth="200"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
