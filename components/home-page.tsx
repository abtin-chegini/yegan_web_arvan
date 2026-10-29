"use client";

import { useCallback, useEffect, useState } from "react";

import { FullpageScroll } from "@/components/fullpage/fullpage-scroll";
import { Preloader } from "@/components/preloader/preloader";
import { AboutSection } from "@/components/sections/about-section";
import { AboutSectionMobile } from "@/components/sections/about-section-mobile";
import { FooterSection } from "@/components/sections/footer-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HeroSectionMobile } from "@/components/sections/hero-section-mobile";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ProcessSectionMobile } from "@/components/sections/process-section-mobile";
import { SkillsSection } from "@/components/sections/skills-section";
import { sections } from "@/lib/sections";

export function HomePage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [showPreloader, setShowPreloader] = useState(true);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const handleRevealStart = useCallback(() => {
    setIntroReady(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  const visibleSections =
    isMobile === true
      ? sections.filter((section) => section.id !== "skills")
      : sections;

  return (
    <>
      {showPreloader ? (
        <Preloader
          onRevealStart={handleRevealStart}
          onComplete={handlePreloaderComplete}
        />
      ) : null}

      <FullpageScroll sections={visibleSections}>
        {isMobile === true ? (
          <HeroSectionMobile introReady={introReady} />
        ) : (
          <HeroSection introReady={introReady} />
        )}
        {isMobile === true ? <AboutSectionMobile /> : <AboutSection />}
        {isMobile === true ? <ProcessSectionMobile /> : <ProcessSection />}
        {isMobile !== true ? <SkillsSection /> : null}
        <PortfolioSection />
        <FooterSection />
      </FullpageScroll>
    </>
  );
}
