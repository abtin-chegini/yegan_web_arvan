"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";

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
import {
  ABOUT_IMAGES_EN,
  ABOUT_IMAGES_FA,
  CONTACT_IMAGES_EN,
  CONTACT_IMAGES_FA,
  HOME_IMAGES_EN,
  PORTFOLIO_IMAGES_EN,
  PORTFOLIO_IMAGES_FA,
  PROCESS_IMAGES_EN,
  PROCESS_IMAGES_FA,
  SKILLS_IMAGES_EN,
  SKILLS_IMAGES_FA,
  sections,
} from "@/lib/sections";

export function HomePage() {
  const locale = useLocale();
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

  const localizedSections = sections.map((section) =>
    locale === "en" && section.id === "home"
      ? {
          ...section,
          image: HOME_IMAGES_EN.fullHd,
          images: HOME_IMAGES_EN,
          objectFit: "fill" as const,
        }
      : locale === "en" && section.id === "about"
        ? {
            ...section,
            image: ABOUT_IMAGES_EN.fullHd,
            images: ABOUT_IMAGES_EN,
            objectFit: "fill" as const,
          }
        : locale === "en" && section.id === "process"
          ? {
              ...section,
              image: PROCESS_IMAGES_EN.fullHd,
              images: PROCESS_IMAGES_EN,
              objectFit: "fill" as const,
            }
          : locale === "en" && section.id === "skills"
            ? {
                ...section,
                image: SKILLS_IMAGES_EN.fullHd,
                images: SKILLS_IMAGES_EN,
                objectFit: "fill" as const,
              }
            : locale === "en" && section.id === "portfolio"
              ? {
                  ...section,
                  image: PORTFOLIO_IMAGES_EN.fullHd,
                  images: PORTFOLIO_IMAGES_EN,
                  objectFit: "fill" as const,
                }
              : locale === "en" && section.id === "contact"
                ? {
                    ...section,
                    image: CONTACT_IMAGES_EN.fullHd,
                    images: CONTACT_IMAGES_EN,
                    objectFit: "fill" as const,
                  }
                : locale === "fa" && section.id === "home"
                  ? {
                      ...section,
                      image: HOME_IMAGES_EN.fullHd,
                      images: HOME_IMAGES_EN,
                      objectFit: "fill" as const,
                    }
                  : locale === "fa" && section.id === "about"
                    ? {
                        ...section,
                        image: ABOUT_IMAGES_FA.fullHd,
                        images: ABOUT_IMAGES_FA,
                        objectPosition: "right bottom",
                        contentInset: "art-right" as const,
                      }
                    : locale === "fa" && section.id === "process"
                      ? {
                          ...section,
                          image: PROCESS_IMAGES_FA.fullHd,
                          images: PROCESS_IMAGES_FA,
                        }
                      : locale === "fa" && section.id === "skills"
                        ? {
                            ...section,
                            image: SKILLS_IMAGES_FA.fullHd,
                            images: SKILLS_IMAGES_FA,
                          }
                        : locale === "fa" && section.id === "portfolio"
                          ? {
                              ...section,
                              image: PORTFOLIO_IMAGES_FA.fullHd,
                              images: PORTFOLIO_IMAGES_FA,
                            }
                          : locale === "fa" && section.id === "contact"
                            ? {
                                ...section,
                                image: CONTACT_IMAGES_FA.fullHd,
                                images: CONTACT_IMAGES_FA,
                              }
                            : section,
  );

  const visibleSections =
    isMobile === true
      ? localizedSections.filter((section) => section.id !== "skills")
      : localizedSections;

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
