"use client";

import { useLocale } from "next-intl";

import styles from "./mobile-footer-background.module.css";

const FOOTER_CDN = "https://cdn.yeganehheshmat.com/backgrounds/responsive_mobile";

export function MobileFooterBackground() {
  const locale = useLocale();
  const xsFilename = locale === "fa"
    ? "SEC7_HOMEPAGE_360_XS_FA.jpg"
    : "SEC7_HOMEPAGE_360_XS_EN.jpg";
  const mobileFilename = locale === "fa"
    ? "SEC7_HOMEPAGE_360_MOBIL_FA.jpg"
    : "SEC7_HOMEPAGE_360_MOBILE_EN.jpg";
  return (
    <picture className={styles.background} data-mobile-footer-background>
      <source media="(min-width: 375px)" srcSet={`${FOOTER_CDN}/${mobileFilename}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${FOOTER_CDN}/${xsFilename}`}
        alt=""
        className={styles.image}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
