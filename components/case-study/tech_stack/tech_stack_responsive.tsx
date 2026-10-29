"use client";

import type { CaseStudyTechContent } from "@/lib/case-study-content";

import TechStack from "./tech_stack";

export type TechStackResponsiveProps = {
  content: CaseStudyTechContent;
};

/** Mobile tech stack — same GSAP arc slider with compact dimensions. */
export function TechStackResponsive({ content }: TechStackResponsiveProps) {
  return <TechStack content={content} variant="mobile" />;
}

export default TechStackResponsive;
