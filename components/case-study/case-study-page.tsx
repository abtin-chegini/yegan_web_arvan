"use client";

import {useLocale, useTranslations} from "next-intl";

import type { CaseStudy } from "@/lib/case-studies";
import { getCaseStudyContent } from "@/lib/case-study-content";
import BeforeAfterSlider from "@/components/case-study/BeforeAfterSlider";
import { ANNOTATIONS, CaseStudyBreakdown } from "@/components/case-study/breakdown";
import { CaseStudyOverview } from "@/components/case-study/overview";
import { CaseStudyProcess } from "@/components/case-study/process";
import { CaseStudyTechStack } from "@/components/case-study/tech_stack";
import { CaseStudyUxArchitecture } from "@/components/case-study/ux-architecture";
import { CaseStudyScroll } from "@/components/case-study/case-study-scroll";

type CaseStudyPageProps = {
  study: CaseStudy;
};

type CaseStudySectionContentProps = {
  study: CaseStudy;
  sectionIndex: number;
};

function CaseStudySectionContent({
  study,
  sectionIndex,
}: CaseStudySectionContentProps) {
  const locale = useLocale();
  const images = useTranslations("Images");
  const t = useTranslations(`CaseStudies.projects.${study.slug}`);
  const section = study.sections[sectionIndex];
  const content = getCaseStudyContent(study.slug);

  if (content) {
    if (sectionIndex === 0) {
      return <CaseStudyOverview content={{
        ...content.overview,
        title: t("title"),
        description: t("description"),
        metaCards: content.overview.metaCards.map((card) => ({...card, ...(study.slug === "bilit4u" && card.id === "role" ? {
          dialogTitle: t("roleDialog.title"),
          dialogItems: ["ux", "ui", "wireframes", "interaction", "development", "responsive"].map((id) => ({
            title: t(`roleDialog.items.${id}.title`), body: t(`roleDialog.items.${id}.body`),
          })),
        } : study.slug === "tealnex" && locale === "fa" && card.id === "role" ? {
          dialogItems: ["ux", "ui", "animation", "comparison", "preview", "search"].map((id) => ({
            body: t(`roleDialog.items.${id}`),
          })),
        } : study.slug === "tealtile" && locale === "fa" && card.id === "role" ? {
          dialogItems: ["discovery", "search", "preview", "installation", "responsive", "interaction"].map((id) => ({
            body: t(`roleDialog.items.${id}`),
          })),
        } : study.slug === "tealnex" && locale === "fa" && card.id === "industry" ? {
          dialogItems: ["digital", "interiors", "preview", "renovation", "comparison", "local"].map((id) => ({
            body: t(`industryDialog.items.${id}`),
          })),
        } : study.slug === "tealtile" && locale === "fa" && card.id === "industry" ? {
          dialogDescription: t("meta.industry.body"),
          dialogItems: ["discovery", "suppliers", "preview", "installers", "services"].map((id) => ({
            body: t(`industryDialog.items.${id}`),
          })),
        } : study.slug === "bilit4u" && card.id === "industry" ? {
          dialogTitle: t("industryDialog.title"),
          dialogItems: ["bus", "flight", "train", "hotel", "taxi", "tour"].map((id) => ({
            body: t(`industryDialog.items.${id}`),
          })),
        } : study.slug === "tealnex" && locale === "fa" && card.id === "scope" ? {
          dialogItems: ["website", "pages", "animation", "comparison", "preview", "search"].map((id) => ({
            body: t(`scopeDialog.items.${id}`),
          })),
        } : study.slug === "tealtile" && locale === "fa" && card.id === "scope" ? {
          dialogItems: ["platform", "pages", "search", "preview", "installation", "responsive"].map((id) => ({
            body: t(`scopeDialog.items.${id}`),
          })),
        } : study.slug === "bilit4u" && card.id === "scope" ? {
          dialogTitle: t("scopeDialog.title"),
          dialogItems: ["research", "flows", "ui", "booking", "development", "responsive", "interaction"].map((id) => ({
            body: t(`scopeDialog.items.${id}`),
          })),
        } : {}), title: t(`meta.${card.id}.title`), body: ["bilit4u", "tealtile", "tealnex"].includes(study.slug) && card.id === "platform" ? `https://${study.slug}.com${study.slug === "tealnex" ? "/" : ""}` : t(`meta.${card.id}.body`), ...(["bilit4u", "tealtile", "tealnex"].includes(study.slug) && card.id === "platform" ? {href: `https://${study.slug}.com${study.slug === "tealnex" ? "/" : ""}`} : {})})),
      }} />;
    }
    if (sectionIndex === 1) {
      return <CaseStudyBreakdown content={{...content.breakdown, productImageAlt: images(`projects.${study.slug}.product`), challenges: (content.breakdown.challenges ?? ANNOTATIONS).map((challenge) => ({...challenge, title: t(`challenges.${challenge.id}.title`), description: t(`challenges.${challenge.id}.description`)}))}} />;
    }
    if (sectionIndex === 2) return <CaseStudyProcess compactMobile={study.slug === "bilit4u"} />;
    if (sectionIndex === 3) {
      return (
        <BeforeAfterSlider
          centerHeader={locale === "fa" && ["bilit4u", "tealtile", "tealnex"].includes(study.slug)}
          slides={content.design.slides.map((slide, index) => ({
            image: slide.image,
            imageMobile: slide.imageMobile ?? undefined,
            alt: images(`projects.${study.slug}.design.${index}`),
          }))}
          title={locale === "fa" && ["bilit4u", "tealtile", "tealnex"].includes(study.slug) ? t("design.title") : content.design.title}
          description={locale === "fa" && ["bilit4u", "tealtile", "tealnex"].includes(study.slug) ? t("design.description") : content.design.description}
        />
      );
    }
    if (sectionIndex === 4) {
      const localizeUx = locale === "fa" && ["bilit4u", "tealtile", "tealnex"].includes(study.slug);
      return <CaseStudyUxArchitecture content={{
        ...content.uxArchitecture,
        ...(locale === "fa" && study.slug === "bilit4u" ? {mobileTabTitles: Object.fromEntries(["search", "results", "seats"].map((id) => [id, t(`uxArchitecture.items.${id}.mobileTitle`)]))} : {}),
        ...(localizeUx ? {title: t("uxArchitecture.title"), intro: t("uxArchitecture.intro")} : {}),
        items: content.uxArchitecture.items.map((item, index) => ({
          ...item,
          ...(localizeUx && t.has(`uxArchitecture.items.${item.id}.title`) ? {
            title: t(`uxArchitecture.items.${item.id}.title`),
            description: t(`uxArchitecture.items.${item.id}.description`),
          } : {}),
          imageAlt: images(`projects.${study.slug}.ux.${index}`),
        })),
      }} />;
    }
    if (sectionIndex === 5) {
      return <CaseStudyTechStack studySlug={study.slug} content={study.slug === "bilit4u" ? {
        ...content.techStack,
        heading: locale === "fa" ? t("techArchitecture.heading") : content.techStack.heading,
        slides: content.techStack.slides.map((slide) => {
          const reasonIds = slide.id === "tanstack" ? ["apis", "caching", "filtering"]
            : slide.id === "tailwind" ? ["development", "responsive", "consistency"]
            : slide.id === "zod" ? ["forms", "rules", "types"]
            : slide.id === "dexie" ? ["history", "filters", "storage"]
            : slide.id === "zustand" ? ["state", "booking", "performance"]
            : slide.id === "lottie" ? ["animations", "onboarding", "forms"]
            : slide.id === "nextjs" && locale === "fa" ? ["scalability", "seo", "ecosystem"] : null;
          if (!reasonIds) return slide;
          const prefix = `techArchitecture.${slide.id}`;
          return {
            ...slide,
            description: t(`${prefix}.description`),
            detailsTitle: t(`${prefix}.detailsTitle`),
            detailItems: reasonIds.map((id) => ({
              title: t(`${prefix}.reasons.${id}.title`),
              body: t(`${prefix}.reasons.${id}.body`),
            })),
          };
        }),
      } : study.slug === "tealnex" ? {
        ...content.techStack,
        slides: content.techStack.slides.map((slide) => {
          const reasonIds = slide.id === "tailwind"
            ? ["responsive", "consistency", "efficiency", "maintainability", "optimization"]
            : slide.id === "nextjs" ? ["scalability", "routing", "performance", "seo", "ecosystem"]
            : slide.id === "zustand" ? ["interactive", "architecture", "updates", "maintenance", "scalability"]
            : slide.id === "threejs" ? ["visualization", "rendering", "exploration", "materials", "extensibility"]
            : slide.id === "pdfjs" ? ["catalog", "viewing", "navigation", "preview", "integration"] : null;
          if (!reasonIds) return slide;
          const prefix = `techArchitecture.${slide.id}`;
          return {
            ...slide,
            ...(locale === "fa" ? {description: t(`${prefix}.description`)} : {}),
            detailItems: reasonIds.map((id) => ({
              title: t(`${prefix}.reasons.${id}.title`),
              body: t(`${prefix}.reasons.${id}.body`),
            })),
          };
        }),
      } : study.slug === "tealtile" ? {
        ...content.techStack,
        slides: content.techStack.slides.map((slide) => {
          const reasonIds = slide.id === "dexie"
            ? ["storage", "persistence", "offline", "structured", "integration"]
            : slide.id === "zod"
            ? ["purchase", "installers", "profile", "schemas", "errors"]
            : slide.id === "pdfjs"
            ? ["invoices", "integration", "catalog", "affiliate", "viewing"]
            : slide.id === "tanstack"
            ? ["products", "caching", "synchronization", "states", "affiliate"]
            : slide.id === "tailwind"
            ? ["responsive", "consistency", "efficiency", "maintainability", "optimization"]
            : slide.id === "nextjs"
            ? ["scalability", "routing", "performance", "seo", "ecosystem"]
            : slide.id === "zustand" ? ["cart", "centralized", "realtime", "updates", "scalability"] : null;
          if (!reasonIds) return slide;
          const prefix = `techArchitecture.${slide.id}`;
          return {
            ...slide,
            ...(locale === "fa" || ["tailwind", "tanstack", "pdfjs", "zod", "dexie"].includes(slide.id) ? {description: t(`${prefix}.description`)} : {}),
            detailItems: reasonIds.map((id) => ({
              title: t(`${prefix}.reasons.${id}.title`),
              body: t(`${prefix}.reasons.${id}.body`),
            })),
          };
        }),
      } : content.techStack} />;
    }
  }

  if (sectionIndex === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="font-sans text-sm tracking-[0.08em] text-[#3d5a9a] uppercase">
          Case Study
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2.2rem,6vw,3.75rem)] font-medium tracking-[-0.02em] text-[#1d3557]">
          {study.title}
        </h1>
        {study.kicker ? (
          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-[#3a3a3a]">
            {study.kicker}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="font-sans text-sm tracking-[0.08em] text-[#3d5a9a] uppercase">
        {section.label}
      </p>
      <h2 className="mt-3 font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-[-0.02em] text-[#1d3557]">
        {study.title}
      </h2>
    </div>
  );
}

export function CaseStudyPageView({ study }: CaseStudyPageProps) {
  const locale = useLocale();
  const t = useTranslations("CaseStudies");
  const indicatorLabels = locale === "fa" && study.slug === "bilit4u"
    ? { design: t("projects.bilit4u.design.tooltip") }
    : undefined;
  return (
    <CaseStudyScroll studySlug={study.slug} sections={study.sections} indicatorLabels={indicatorLabels}>
      {study.sections.map((section, index) => (
        <CaseStudySectionContent
          key={section.id}
          study={study}
          sectionIndex={index}
        />
      ))}
    </CaseStudyScroll>
  );
}
