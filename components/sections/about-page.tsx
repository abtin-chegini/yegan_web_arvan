"use client";

import {useTranslations} from "next-intl";

import {Link} from "@/i18n/navigation";
import { ArrowUpRight, ChevronRight, X } from "lucide-react";
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { SitePageScroll } from "@/components/site-page/site-page-scroll";
import { sections, type Section } from "@/lib/sections";
import styles from "./about-page.module.css";

const ASSETS = "https://ik.imagekit.io/s7yz964lq/assets/about";
const aboutSection: Section = {
  ...sections.find((section) => section.id === "about")!,
  image: `${ASSETS}/aboutme_background.jpg`,
  images: undefined,
  contentInset: "default",
  objectPosition: "center",
};

const education = [
  { image: "university_bachelor.svg", title: "Bachelor’s degree", subtitle: "Undergraduate education" },
  { image: "university_master.svg", title: "Master’s degree", subtitle: "Postgraduate education" },
];
type Experience = {
  image: string;
  name: string;
  role: string;
  type?: string;
  dates?: string;
  contributions?: string[];
  skills?: string[];
  href?: string;
};

// Draft experience content; replace the mock entries when final copy is ready.
const experience: Experience[] = [
  {
    image: "bilit4u_job.svg", name: "Bilit4U",
    role: "Product Design Manager & Frontend Developer",
    type: "Full-time", dates: "2024 – 2026",
    contributions: [
      "Led UX strategy and product design from concept to handoff",
      "Designed and built responsive front-end experiences",
      "Created scalable design patterns and reusable components",
    ],
    skills: ["UX Strategy", "UI Design", "Frontend Development"],
    href: "/projects/bilit4u",
  },
  { image: "payaneh_job.svg", name: "Payaneh", role: "Product Designer", type: "Full-time", dates: "2022 \u2013 2024", contributions: ["Mapped booking journeys and simplified complex reservation flows", "Designed responsive interfaces and interactive prototypes", "Collaborated with developers to bring designs into production"], skills: ["User Research", "Interaction Design", "Prototyping"], href: "/portfolio" },
  { image: "tealtile_job.svg", name: "Tealtile", role: "UI Designer & Frontend Developer", type: "Contract", dates: "2021 \u2013 2022", contributions: ["Designed a clear product browsing experience for a tile brand", "Built responsive pages with a focus on visual consistency", "Created reusable interface components and design guidelines"], skills: ["UI Design", "Responsive Design", "Frontend Development"], href: "/portfolio" },
  { image: "tealnex_job.svg", name: "Tealnex", role: "Product Designer & Developer", type: "Contract", dates: "2020 \u2013 2021", contributions: ["Translated business goals into clear website journeys", "Developed polished interfaces across desktop and mobile", "Refined page layouts and interactions through iterative feedback"], skills: ["UX Design", "Visual Design", "Web Development"], href: "/portfolio" },
];

function ExperienceCard({ company }: { company: Experience }) {
  const t = useTranslations("About");
  return (
    <Dialog>
      <DialogTrigger className={styles.jobCard} aria-label={`View work experience at ${company.name}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/${company.image}`} alt="" width={56} height={56} />
        <span className={styles.companyName}>{company.name}</span>
        {company.type && <span className={styles.employmentType}>{company.type}</span>}
        <ChevronRight className={styles.cardArrow} size={17} aria-hidden="true" />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={styles.experienceOverlay} />
        <DialogPrimitive.Popup className={styles.experienceDialog}>
          <div className={styles.dialogCompany}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/${company.image}`} alt="" width={72} height={72} />
            <span>{company.name}</span>
            {company.type && <span className={styles.employmentType}>{company.type}</span>}
            <DialogClose className={styles.dialogClose} aria-label="Close work experience"><X size={20} /></DialogClose>
          </div>
          <DialogTitle className={styles.experienceTitle}>{company.role}</DialogTitle>
          <DialogDescription className={styles.experienceDates}>
            {company.dates ? `${company.dates} · ${company.name}` : `Work experience at ${company.name}`}
          </DialogDescription>
          {company.contributions && (
            <section className={styles.contributions} aria-label="Responsibilities">
              <h3>{t("responsibilities")}</h3>
              <ul>{company.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}
          {company.skills && <ul className={styles.skillTags} aria-label="Skills">{company.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>}
          {company.href && <Link href={company.href} className={styles.selectedWork}>{t("work")} <ArrowUpRight size={19} aria-hidden="true" /></Link>}
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className={styles.sectionHeading}><span aria-hidden="true" className={styles.sprig}>❧</span>{children}</h2>;
}

export function AboutPageView() {
  const images = useTranslations("Images");
  const t = useTranslations("About");
  return (
    <SitePageScroll activeNavId="about" mainId="about" mainLabel={t("title")} mainSection={aboutSection}>
      <div className={styles.scroll} data-page-scroll>
        <main className={styles.layout}>
          <div className={styles.portrait}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/Yeganeh%20Heshmat%20Profile_11zon.png`} alt={images("portrait")} width={600} height={660} fetchPriority="high" />
          </div>
          <div className={styles.content}>
            <header className={styles.intro}>
              <h1>{t("title")}</h1>
              <p>{t("intro")}</p>
            </header>
            <div className={styles.details}>
              <div>
                <section aria-label="Education">
                  <SectionHeading>{t("education")}</SectionHeading>
                  <ul className={styles.cards}>
                    {education.map((item) => (
                      <li key={item.image} className={styles.educationCard}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${ASSETS}/${item.image}`} alt="" width={70} height={70} />
                        <div><h3>{t(item.title)}</h3><p>{t(item.subtitle)}</p></div>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className={styles.languages} aria-label="Languages">
                  <SectionHeading>{t("languages")}</SectionHeading>
                  <ul>{["Persian", "English", "Turkish", "French"].map((language) => <li key={language}>{t(language)}</li>)}</ul>
                </section>
              </div>
              <section aria-label="Experience">
                <SectionHeading>{t("experience")}</SectionHeading>
                <ul className={styles.cards}>
                  {experience.map((company) => (
                    <li key={company.image}>
                      <ExperienceCard company={company} />
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </main>
      </div>
    </SitePageScroll>
  );
}
