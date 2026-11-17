"use client";

import styles from "./mobile-footer-background.module.css";

const FOOTER_CDN = "https://cdn.yeganehheshmat.com/backgrounds/responsive_mobile";

export function MobileFooterBackground() {
  return (
    <picture className={styles.background} data-mobile-footer-background>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${FOOTER_CDN}/SEC7_HOMEPAGE_360_MOBILE_EN.jpg`}
        alt=""
        className={styles.image}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
