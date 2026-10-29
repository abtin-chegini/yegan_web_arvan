import {setRequestLocale} from "next-intl/server";
import { notFound } from "next/navigation";

import { CaseStudyPageView } from "@/components/case-study/case-study-page";
import { getAllCaseStudySlugs, getCaseStudy } from "@/lib/case-studies";

type ProjectPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const study = getCaseStudy(slug);

  if (!study) notFound();

  return <CaseStudyPageView study={study} />;
}
