"use client";

import {useLocale, useTranslations} from "next-intl";

import {
  Boxes,
  Code2,
  Compass,
  GitBranch,
  Layers,
  LayoutTemplate,
  LineChart,
  MousePointerClick,
  Network,
  Search,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ServiceCard = {
  /** Phone process cards (≤767px) */
  mobileIcon: string;
  /** Tablet process cards (768px–1023px) */
  tabletIcon: string;
  /** Desktop process cards (≥1024px) */
  desktopIcon: string;
  title: string;
  description: string;
  /** One-line summary for compact mobile cards */
  shortDescription: string;
  items: { label: string; Icon: LucideIcon }[];
};

export const processServices: ServiceCard[] = [
  {
    mobileIcon:
      "https://cdn.yeganehheshmat.com/homepage/Product_Strategy_icon_mobile.png",
    tabletIcon:
      "https://cdn.yeganehheshmat.com/homepage/Product_Strategy_icon_tablet.png",
    desktopIcon:
      "https://cdn.yeganehheshmat.com/homepage/Product_Strategy_icon_new.png",
    title: "Product Strategy",
    description:
      "I partner on discovery and strategy to align business goals, understand the market landscape, and define the right path forward.",
    shortDescription:
      "Aligning business goals with the right product path forward.",
    items: [
      { label: "Product discovery", Icon: Search },
      { label: "Business alignment", Icon: Target },
      { label: "Competitive analysis", Icon: LineChart },
      { label: "Product direction", Icon: Compass },
    ],
  },
  {
    mobileIcon:
      "https://cdn.yeganehheshmat.com/homepage/Experience_Design_icon_mobile.png",
    tabletIcon:
      "https://cdn.yeganehheshmat.com/homepage/Experience_Design_icon_tablet.png",
    desktopIcon:
      "https://cdn.yeganehheshmat.com/homepage/Experience_Design_icon_new.png",
    title: "Experience Design",
    description:
      "I design intuitive experiences that are grounded in user needs, structured with clarity, and built to scale across complex digital products.",
    shortDescription:
      "Intuitive experiences grounded in user needs and clarity.",
    items: [
      { label: "User experience", Icon: MousePointerClick },
      { label: "Information architecture", Icon: Network },
      { label: "Interaction design", Icon: Workflow },
      { label: "Design systems", Icon: Layers },
    ],
  },
  {
    mobileIcon:
      "https://cdn.yeganehheshmat.com/homepage/Development_icon_mobile.png",
    tabletIcon:
      "https://cdn.yeganehheshmat.com/homepage/Development_icon_tablet.png",
    desktopIcon:
      "https://cdn.yeganehheshmat.com/homepage/Development_icon_new.png",
    title: "Development",
    description:
      "I collaborate closely with engineering to ensure smooth handoff, front-end alignment, and successful product implementation.",
    shortDescription:
      "Smooth handoff, front-end alignment, and successful implementation.",
    items: [
      { label: "Engineering collaboration", Icon: GitBranch },
      { label: "Front-End awareness", Icon: Code2 },
      { label: "Product implementation", Icon: Boxes },
      { label: "Design handoff", Icon: LayoutTemplate },
    ],
  },
];

/** Equal step offsets — same diagonal incline left → right */
const inclineOffsets = [
  "lg:translate-y-0",
  "lg:translate-y-10 xl:translate-y-12",
  "lg:translate-y-20 xl:translate-y-24",
] as const;

export function ProcessSection() {
 const t = useTranslations("Home");
 const isPersian = useLocale() === "fa";
 const services = processServices.map((service, index) => ({
   ...service,
   title: t(`service${index}title`),
   description: t(`service${index}description`),
   shortDescription: t(`service${index}shortDescription`),
   items: service.items.map((item, itemIndex) => ({...item, label: t(`serviceItem${index * 4 + itemIndex}`)}))
 }));

  return (
    <div className="flex h-full min-h-0 w-full flex-col justify-center">
      <div className="relative grid w-full items-start gap-8 lg:left-[100px] lg:grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.55fr)] lg:gap-x-32">
        <div className="fullpage-reveal grid grid-cols-1 gap-5 sm:grid-cols-3 sm:items-start sm:gap-4 lg:order-2 lg:w-[calc(100%+90px)] lg:gap-5">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className={cn(
                "border border-[var(--section-process-fg)]/12 bg-[var(--section-process-card)] py-0 shadow-none ring-0",
                inclineOffsets[index]
              )}
            >
              <CardContent className="flex flex-col gap-4 px-4 pt-5 pb-5 sm:px-5">
                <div className="mx-auto flex h-[7.5rem] w-full max-w-[13.5rem] items-center justify-center bg-transparent sm:h-[8.5rem] sm:max-w-[15rem] lg:max-w-[16rem]">
                  <picture className="block h-full w-full bg-transparent">
                    {/* ProcessSection renders from 768px up — tablet until lg */}
                    <source
                      media="(max-width: 1023px)"
                      srcSet={service.tabletIcon}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.desktopIcon}
                      alt=""
                      width={480}
                      height={280}
                      className="h-full w-full bg-transparent object-contain object-center"
                      decoding="async"
                    />
                  </picture>
                </div>

                <div className="flex flex-col gap-2 text-center">
                  <h3 className="font-serif text-[1.35rem] leading-tight font-medium text-[var(--section-process-fg)] sm:text-[1.45rem]">
                    {service.title}
                  </h3>
                  <p className="font-sans text-[0.78rem] font-normal leading-relaxed text-[var(--section-process-muted)] sm:text-[0.8rem]">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <span className="h-px flex-1 bg-[var(--section-process-fg)]/15" />
                  <span
                    aria-hidden
                    className="size-1.5 rotate-45 border border-[var(--section-process-fg)]/25 bg-[var(--section-process-fg)]/10"
                  />
                  <span className="h-px flex-1 bg-[var(--section-process-fg)]/15" />
                </div>

                <ul className="flex flex-col gap-2.5 text-start">
                  {service.items.map(({ label, Icon }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2.5 font-sans text-[0.78rem] font-normal text-[var(--section-process-fg)]"
                    >
                      <Icon
                        aria-hidden
                        className="size-3.5 shrink-0 stroke-[1.5] text-[var(--section-process-muted)]"
                      />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="fullpage-reveal flex flex-col gap-4 pt-1 lg:order-1 lg:pt-2 lg:pr-2">
          <h2 className={`font-serif ${isPersian ? "text-[clamp(1.8rem,3vw,2.6rem)] whitespace-nowrap" : "text-[clamp(2.4rem,4vw,3.75rem)]"} leading-[1.05] font-medium tracking-[-0.02em] text-[var(--section-process-fg)]`}>
            {t("processTitle")}
          </h2>
          <p className={`max-w-sm font-sans text-[0.9rem] font-normal leading-relaxed text-[var(--section-process-muted)] ${isPersian ? "mt-6" : ""}`}>
            {t("processIntro")}
          </p>
        </aside>
      </div>
    </div>
  );
}
