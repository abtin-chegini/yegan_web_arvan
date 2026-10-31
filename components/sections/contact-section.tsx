"use client";

import {useTranslations} from "next-intl";
import { ArrowUpRight } from "lucide-react";
import styles from "./contact-links.module.css";
import { useContactAnimation } from "./use-contact-animation";

export const contactRows: {
  label: string;
  value: string;
  href: string;
  icon: string;
  mobileIcon: string;
}[] = [
  {
    label: "LinkedIn",
    value: "Yeganeh Heshmat",
    href: "https://www.linkedin.com/in/yeganeh-heshmat-784300229",
    icon: "https://cdn.yeganehheshmat.com/icons/social/linkdin_icon.svg",
    mobileIcon: "https://cdn.yeganehheshmat.com/icons/social/linkdin_icon.png",
  },
  {
    label: "Email Address",
    value: "Yeganeh.Heshmat@gmail.com",
    href: "mailto:Yeganeh.Heshmat@gmail.com",
    icon: "https://cdn.yeganehheshmat.com/icons/social/email_icon.svg",
    mobileIcon: "https://cdn.yeganehheshmat.com/icons/social/email_icon.png",
  },
];

export function ContactSection() {
  const rootRef = useContactAnimation();
  const t = useTranslations("Contact");
  return (
    <div ref={rootRef} className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center text-center">
      <div className="flex w-full flex-col items-center">
        <h2 className="font-serif text-[clamp(2.1rem,4.2vw,3.4rem)] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--section-contact-fg)]">
          {t("title")}
        </h2>
        <p className="mt-4 w-full max-w-3xl text-balance font-sans text-[1.02rem] font-normal leading-[1.9] text-[#c0965a] md:text-lg">
          {t("description")}
        </p>

        <ContactLinks />
      </div>
    </div>
  );
}

export function ContactLinks() {
  const t = useTranslations("Contact");

  return (
    <ul className={`${styles.links} mt-8 w-full max-w-xl text-start sm:mt-10`}>
      {contactRows.map((row, index) => (
        <li key={row.label} className={styles.row}>
          {index > 0 && <span data-contact-line className={styles.line} aria-hidden="true" />}
          <a
            href={row.href}
            target={row.href.startsWith("http") ? "_blank" : undefined}
            rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={styles.link}
          >
            <span data-contact-icon className={styles.icon} aria-hidden="true">
              <picture>
                <source media="(min-width: 768px)" srcSet={row.icon} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={row.mobileIcon} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
              </picture>
            </span>
            <span className="min-w-0 flex-1 font-sans">
              <span data-contact-write className={`${styles.typed} block text-sm font-medium leading-6`}>
                {t(row.label)}
              </span>
              <span className="mt-1 block text-[0.85rem] leading-6 text-[var(--section-contact-muted)] sm:text-base">
                <bdi data-contact-write dir="ltr" className={`${styles.typed} ${styles.value} tabular-nums`}>{row.value}</bdi>
              </span>
            </span>
            {row.href.startsWith("http") && (
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--section-contact-muted)]" aria-hidden="true" />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
