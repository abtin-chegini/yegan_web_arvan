"use client";

import {useTranslations} from "next-intl";
import { ArrowUpRight, Mail, Phone, type LucideIcon } from "lucide-react";
import type { SVGProps } from "react";
import styles from "./contact-links.module.css";
import { useContactAnimation } from "./use-contact-animation";

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export const contactRows: {
  label: string;
  value: string;
  href: string;
  Icon: LucideIcon | typeof LinkedInIcon;
}[] = [
  {
    label: "LinkedIn",
    value: "Yeganeh Heshmat",
    href: "https://www.linkedin.com/in/yeganeh-heshmat-784300229",
    Icon: LinkedInIcon,
  },
  {
    label: "Email Address",
    value: "Yeganeh.Heshmat@gmail.com",
    href: "mailto:Yeganeh.Heshmat@gmail.com",
    Icon: Mail,
  },
  {
    label: "Phone Number",
    value: "+98 910 66 49 039",
    href: "tel:+989106649039",
    Icon: Phone,
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
              <row.Icon className="h-5 w-5" />
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
