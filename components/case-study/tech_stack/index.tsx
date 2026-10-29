"use client";

import type { CaseStudyTechContent } from "@/lib/case-study-content";

import TechStack from "./tech_stack";
import TechStackResponsive from "./tech_stack_responsive";

export type CaseStudyTechStackProps = {
  content: CaseStudyTechContent;
};

/**
 * Shared Tech Stack section.
 * Mobile: tech_stack_responsive. Desktop (md+): tech_stack.
 */
export function CaseStudyTechStack({ content }: CaseStudyTechStackProps) {
  return (
    <>
      <div className="h-full min-h-0 w-full md:hidden">
        <TechStackResponsive content={content} />
      </div>
      <div className="hidden h-full min-h-0 w-full md:block">
        <TechStack content={content} />
      </div>
    </>
  );
}

export { TechStack, TechStackResponsive };
export type { TechStackProps } from "./tech_stack";
export type { TechStackResponsiveProps } from "./tech_stack_responsive";
