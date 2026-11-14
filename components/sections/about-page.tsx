"use client";

import {useTranslations} from "next-intl";

import {Link} from "@/i18n/navigation";
import { ArrowUpRight, ChevronRight, X } from "lucide-react";
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { SitePageScroll } from "@/components/site-page/site-page-scroll";
import { sections, type Section } from "@/lib/sections";
import styles from "./about-page.module.css";

const ASSETS = "https://cdn.yeganehheshmat.com/aboutme";
const aboutSection: Section = {
  ...sections.find((section) => section.id === "about")!,
  image: "https://ik.imagekit.io/s7yz964lq/assets/about/aboutme_background.jpg",
  images: undefined,
  contentInset: "default",
  objectPosition: "center",
};

const education = [
  { image: "university_bachelor.svg", title: "Bachelor’s degree", subtitle: "Undergraduate education" },
  { image: "university_master.svg", title: "Master’s degree", subtitle: "Postgraduate education" },
];
type Experience = {
  id: "bilit4u" | "payaneh" | "tealtile" | "tealnex";
  image: string;
  href: string;
};

type ExperienceContent = {
  name: string;
  role: string;
  type: string;
  dates: string;
  contributions: string[];
  skills: string[];
};

const experience: Experience[] = [
  { id: "bilit4u", image: "bilit4u_job.svg", href: "/projects/bilit4u" },
  // Payaneh has no case study yet; keep its link on the portfolio overview.
  { id: "payaneh", image: "payaneh_job.svg", href: "/portfolio" },
  { id: "tealtile", image: "tealtile_job.svg", href: "/projects/tealtile" },
  { id: "tealnex", image: "tealnex_job.svg", href: "/projects/tealnex" },
];

function ExperienceCard({ company }: { company: Experience }) {
  const t = useTranslations("About");
  const content = t.raw(`companies.${company.id}`) as ExperienceContent;
  return (
    <Dialog>
      <DialogTrigger className={styles.jobCard} aria-label={t("viewExperience", { company: content.name })}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/${company.image}`} alt="" width={56} height={56} />
        <span className={styles.companyName}>{content.name}</span>
        <span className={styles.employmentType}>{content.type}</span>
        <ChevronRight className={styles.cardArrow} size={17} aria-hidden="true" />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={styles.experienceOverlay} />
        <DialogPrimitive.Popup className={styles.experienceDialog}>
          <div className={styles.dialogCompany}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/${company.image}`} alt="" width={72} height={72} />
            <span>{content.name}</span>
            <span className={styles.employmentType}>{content.type}</span>
            <DialogClose className={styles.dialogClose} aria-label={t("closeExperience")}><X size={20} /></DialogClose>
          </div>
          <DialogTitle className={styles.experienceTitle}>{content.role}</DialogTitle>
          <DialogDescription className={styles.experienceDates}>
            <bdi>{content.dates}</bdi> · {content.name}
          </DialogDescription>
          <section className={styles.contributions} aria-label={t("responsibilities")}>
            <h3>{t("responsibilities")}</h3>
            <ul>{content.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <ul className={styles.skillTags} aria-label={t("skills")}>
            {content.skills.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
          <Link href={company.href} className={styles.selectedWork}>{t("work")} <ArrowUpRight size={19} aria-hidden="true" /></Link>
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
            <img src={`${ASSETS}/aboutme_Yeganeh_Heshmat_Profile_11.png`} alt={images("portrait")} width={600} height={660} fetchPriority="high" />
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
