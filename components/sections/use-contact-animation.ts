"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import styles from "./contact-links.module.css";

export function useContactAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const section = root.closest("section");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const text = gsap.utils.toArray<HTMLElement>("[data-contact-write]", root);
      const lines = root.querySelectorAll("[data-contact-line]");
      const icons = root.querySelectorAll("[data-contact-icon]");
      const timeline = gsap.timeline({ paused: true });
      const originals = text.map((element) => {
        const nodes = Array.from(element.childNodes);
        const content = element.textContent ?? "";
        // Keep the complete text in flow for stable wrapping and accessible names.
        const placeholder = document.createElement("span");
        placeholder.style.opacity = "0";
        placeholder.append(...nodes);
        const overlay = document.createElement("span");
        overlay.className = styles.typingOverlay;
        overlay.setAttribute("aria-hidden", "true");
        const written = document.createTextNode("");
        const cursor = document.createElement("span");
        cursor.className = styles.cursor;
        cursor.hidden = true;
        overlay.append(written, cursor);
        element.classList.add(styles.typingHost);
        element.replaceChildren(placeholder, overlay);
        return { element, nodes, content, written, cursor };
      });

      let position = 0.08;
      const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      originals.forEach(({ content, written, cursor }) => {
        const characters = Array.from(segmenter.segment(content), (part) => part.segment);
        const progress = { count: 0 };
        const duration = Math.max(0.16, characters.length * 0.018);
        timeline.fromTo(progress, { count: 0 }, {
          count: characters.length,
          duration,
          ease: "none",
          onStart: () => { cursor.hidden = false; },
          onUpdate: () => {
            written.textContent = characters.slice(0, Math.floor(progress.count)).join("");
          },
          onComplete: () => { cursor.hidden = true; },
        }, position);
        position += duration + 0.06;
      });
      timeline.fromTo(lines, { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power3.out" }, 0);
      timeline.fromTo(icons, { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.08, ease: "power2.out" }, 0.1);

      const isActive = () => section?.matches(
        ".fullpage-section-active, .case-study-section-active",
      );
      let active = false;
      const update = (visible: boolean) => {
        if (visible === active) return;
        active = visible;
        if (visible) {
          originals.forEach(({ written, cursor }) => {
            written.textContent = "";
            cursor.hidden = true;
          });
          timeline.restart();
        } else {
          timeline.pause(0);
          originals.forEach(({ written, cursor }) => {
            written.textContent = "";
            cursor.hidden = true;
          });
        }
      };
      const observer = new MutationObserver(() => update(Boolean(isActive())));
      if (section) {
        observer.observe(section, { attributes: true, attributeFilter: ["class"] });
        update(Boolean(isActive()));
      }
      const intersection = new IntersectionObserver(([entry]) => {
        if (!section) update(entry.isIntersecting);
      }, { threshold: 0.3 });
      intersection.observe(root);

      return () => {
        observer.disconnect();
        intersection.disconnect();
        timeline.kill();
        originals.forEach(({ element, nodes }) => {
          element.replaceChildren(...nodes);
          element.classList.remove(styles.typingHost);
        });
      };
    });

    return () => media.revert();
  }, []);

  return rootRef;
}
