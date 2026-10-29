"use client";

import { useEffect, useState } from "react";

import { ContactSection } from "@/components/sections/contact-section";
import { ContactSectionMobile } from "@/components/sections/contact-section-mobile";

/**
 * Site footer — same content as the homepage contact slide.
 * Used as the last fullpage section on home, portfolio, and case studies.
 */
export function FooterSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (isMobile === true) return <ContactSectionMobile />;
  return <ContactSection />;
}
