import {setRequestLocale} from "next-intl/server";
import { notFound } from "next/navigation";

import { CaseStudyPageView } from "@/components/case-study/case-study-page";
import {
  CASE_STUDY_SEC1_IMAGES_EN,
  CASE_STUDY_SEC1_IMAGES_FA,
  CASE_STUDY_SEC3_IMAGES_EN,
  CASE_STUDY_SEC3_IMAGES_FA,
  CASE_STUDY_SEC4_IMAGES_EN,
  CASE_STUDY_SEC4_IMAGES_FA,
  CASE_STUDY_SEC5_IMAGES_EN,
  CASE_STUDY_SEC6_IMAGES_EN,
  getAllCaseStudySlugs,
  getCaseStudy,
} from "@/lib/case-studies";

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

  const localizedStudy = locale === "en"
    ? {
        ...study,
        sections: study.sections.map((section) =>
          section.id === "overview"
            ? { ...section, images: CASE_STUDY_SEC1_IMAGES_EN }
            : section.id === "approach"
              ? { ...section, images: CASE_STUDY_SEC3_IMAGES_EN }
              : section.id === "design"
                ? { ...section, images: CASE_STUDY_SEC4_IMAGES_EN }
                : section.id === "development" && CASE_STUDY_SEC5_IMAGES_EN[slug]
                  ? { ...section, images: CASE_STUDY_SEC5_IMAGES_EN[slug] }
                  : section.id === "outcome"
                    ? { ...section, desktopImages: CASE_STUDY_SEC6_IMAGES_EN }
                    : section,
        ),
      }
    : locale === "fa"
      ? {
          ...study,
          sections: study.sections.map((section) =>
            section.id === "overview"
              ? { ...section, images: CASE_STUDY_SEC1_IMAGES_FA }
              : section.id === "approach"
                ? {
                    ...section,
                    images: CASE_STUDY_SEC3_IMAGES_FA,
                    objectFit: "cover" as const,
                    backgroundScale: 1,
                  }
                : section.id === "design"
                  ? {
                      ...section,
                      images: CASE_STUDY_SEC4_IMAGES_FA,
                      objectFit: "cover" as const,
                      backgroundScale: 1,
                    }
                  : section.id === "development" && CASE_STUDY_SEC5_IMAGES_EN[slug]
                    ? {
                        ...section,
                        images: CASE_STUDY_SEC5_IMAGES_EN[slug],
                        desktopImages: undefined,
                        objectFit: "cover" as const,
                        backgroundScale: 1,
                      }
                        : section.id === "outcome"
                          ? {
                              ...section,
                              desktopImages: CASE_STUDY_SEC6_IMAGES_EN,
                              objectFit: "cover" as const,
                              backgroundScale: 1,
                            }
                          : section,
          ),
        }
      : study;

  return <CaseStudyPageView study={localizedStudy} />;
}
