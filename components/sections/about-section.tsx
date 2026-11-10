"use client";

import {useLocale, useTranslations} from "next-intl";
import {useState} from "react";

import { Card, CardContent } from "@/components/ui/card";

export type AboutFeature = {
  id: string;
  icon: string;
  tabletIcon: string;
  mobileIcon?: string;
  /** Desktop card text (unchanged presentation) */
  label: string;
  /** Mobile accordion title */
  title: string;
  /** Mobile closed-card summary (1–2 lines) */
  shortDescription: string;
  /** Mobile expanded detail */
  detail: string;
};

export const aboutFeatures: AboutFeature[] = [
  {
    id: "authenticity",
    icon: "https://cdn.yeganehheshmat.com/homepage/develop_size1.svg",
    tabletIcon: "https://cdn.yeganehheshmat.com/homepage/design_size2.svg",
    mobileIcon: "https://cdn.yeganehheshmat.com/homepage/develop_size1.png",
    label: "Focused on scalable digital products",
    title: "Authenticity",
    shortDescription:
      "I believe in honest work and building real connections.",
    detail:
      "Authenticity means staying true to my values, being transparent in my work, and building genuine relationships. I believe that real impact comes from honesty, openness, and a deep respect for the people I work with.",
  },
  {
    id: "growth",
    icon: "https://cdn.yeganehheshmat.com/homepage/growth_size1.svg",
    tabletIcon: "https://cdn.yeganehheshmat.com/homepage/growth_size2.svg",
    mobileIcon: "https://cdn.yeganehheshmat.com/homepage/growth_size2.png",
    label: "Focused on scalable digital products",
    title: "Growth",
    shortDescription:
      "I embrace change as a path to a better, more meaningful future.",
    detail:
      "Growth is a continuous practice of learning, refining craft, and adapting with intention. I stay curious, welcome feedback, and turn challenges into clearer, stronger product decisions.",
  },
  {
    id: "impact",
    icon: "https://cdn.yeganehheshmat.com/homepage/design_size1.svg",
    tabletIcon: "https://cdn.yeganehheshmat.com/homepage/design_size2.svg",
    mobileIcon: "https://cdn.yeganehheshmat.com/homepage/design_size2.png",
    label: "Focused on scalable digital products",
    title: "Impact",
    shortDescription:
      "I aim to create work that brings real value and positive change.",
    detail:
      "Impact means designing experiences that help people move with clarity and confidence. I focus on outcomes that serve users, support business goals, and hold up in real-world use.",
  },
  {
    id: "balance",
    icon: "https://cdn.yeganehheshmat.com/homepage/people_size1.svg",
    tabletIcon: "https://cdn.yeganehheshmat.com/homepage/people_size2.png",
    mobileIcon: "https://cdn.yeganehheshmat.com/homepage/people_size1.png",
    label: "Focused on scalable digital products",
    title: "Balance",
    shortDescription:
      "I value a sustainable rhythm where work and life support each other.",
    detail:
      "Balance keeps creativity and craft sustainable. I work with focus and care, while protecting the space needed for clear thinking, thoughtful collaboration, and long-term quality.",
  },
];

export function AboutFeatureIcon({
  feature,
  mobile = false,
  className,
}: {
  feature: AboutFeature;
  mobile?: boolean;
  className?: string;
}) {
  const [useLocalAsset, setUseLocalAsset] = useState(false);
  const source = (url: string) => useLocalAsset
    ? `/homepage/${url.split("/").pop()}`
    : url;

  return (
    <picture className="shrink-0" data-home-about-icon={feature.id}>
      {!mobile && <>
        <source media="(min-width: 1024px)" srcSet={source(feature.icon)} />
        <source media="(min-width: 768px)" srcSet={source(feature.tabletIcon)} />
      </>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={source(feature.mobileIcon ?? feature.icon)}
        alt=""
        width={mobile ? 64 : 56}
        height={mobile ? 64 : 56}
        className={className}
        onError={() => setUseLocalAsset(true)}
      />
    </picture>
  );
}

export function AboutSection() {
  const t = useTranslations("Home");
  const isPersian = useLocale() === "fa";
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-7 text-center sm:gap-8 lg:gap-9">
      <div className="fullpage-reveal flex w-full max-w-3xl flex-col items-center gap-5">
        <h2 className="font-serif text-[clamp(1.55rem,2.8vw,2.55rem)] leading-[1.28] font-medium tracking-[-0.01em] text-[var(--section-about-fg)]">
          {t("aboutTitle")}
        </h2>

        <p className="font-sans text-[0.88rem] font-normal leading-[1.75] text-[var(--section-about-muted)] sm:text-[0.95rem]">
          {t("aboutIntro")}
        </p>
      </div>

      <div dir={isPersian ? "rtl" : "ltr"} className={isPersian ? "fullpage-reveal grid w-fit max-w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" : "fullpage-reveal grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4"}>
        {aboutFeatures.map((feature, index) => (
          <Card
            key={feature.icon}
            size="sm"
            className="border border-[var(--section-about-fg)]/[0.08] bg-[var(--section-about-card)] py-0 shadow-none ring-0"
          >
            <CardContent className={isPersian ? "flex items-center gap-2.5 px-3.5 py-2.5 text-start" : "flex items-center gap-3 px-3 py-3 text-start"}>
              <AboutFeatureIcon
                feature={feature}
                className={isPersian ? "size-11 object-contain sm:size-12" : "size-12 object-contain sm:size-14"}
              />
              <p className="font-sans text-[0.75rem] font-normal leading-snug text-[var(--section-about-fg)] sm:text-[0.8rem]">
                {t(`features${index}label`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fullpage-reveal flex w-full max-w-lg flex-col items-center gap-4">
        <div className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-[var(--section-about-gold)]/65" />
          <span
            aria-hidden
            className="inline-block size-2 rotate-45 border border-[var(--section-about-gold)] bg-[var(--section-about-gold)]/20"
          />
          <span className="h-px flex-1 bg-[var(--section-about-gold)]/65" />
        </div>

        <p className={`font-serif ${isPersian ? "text-[clamp(1.25rem,2.5vw,1.65rem)]" : "text-[clamp(1.1rem,2.2vw,1.45rem)]"} font-medium italic tracking-wide text-[var(--section-about-gold)]`}>
          {!isPersian && <span className="mr-1 text-[1.35em] not-italic" aria-hidden>
            “
          </span>}
          {t("motto")}
          {!isPersian && <span className="ml-1 text-[1.35em] not-italic" aria-hidden>
            ”
          </span>}
        </p>
      </div>
    </div>
  );
}
