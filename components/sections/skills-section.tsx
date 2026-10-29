"use client";

import {useTranslations} from "next-intl";

import { SineWaveField } from "@/components/wave/sine-wave-field";

const approachCards = [
  {
    number: "01",
    title: "Understand",
    description:
      "I start by listening carefully — uncovering goals, constraints, and what truly matters.",
  },
  {
    number: "02",
    title: "Define",
    description:
      "I shape clarity from complexity, turning insights into a focused direction.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "I craft thoughtful experiences that feel intuitive, intentional, and refined.",
  },
  {
    number: "04",
    title: "Develop",
    description:
      "I stay close through build — aligning design and implementation with care.",
  },
  {
    number: "05",
    title: "Deliver",
    description:
      "I refine until it feels right — polished, purposeful, and ready to land.",
  },
];

export function SkillsSection() {
  const t = useTranslations("Home");
  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-8 md:gap-10">
      <header className="fullpage-reveal flex w-full max-w-3xl flex-col items-center gap-4 text-center">
        <h2 className="font-serif text-[clamp(2.1rem,4vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-[#1d3557]">
          {t("skillsTitle")}
        </h2>
        <p className="max-w-2xl font-sans text-[0.98rem] font-normal leading-[1.7] text-(--section-muted) md:text-lg">
          {t("skillsIntro")}
        </p>
      </header>

      <div className="fullpage-reveal -mt-[150px] flex w-full items-center justify-center">
        <SineWaveField
          speed={0.32}
          amplitude={30}
          cardCount={5}
          verticalOffset={-8}
          cardFloatAmplitude={6}
          wavelength={460}
          cards={approachCards.map((card, index) => ({...card, title: t(`approach${index}title`), description: t(`approach${index}description`)}))}
        />
      </div>
    </div>
  );
}
