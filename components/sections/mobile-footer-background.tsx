"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

import styles from "./mobile-footer-background.module.css";

const FOOTER_CDN = "https://cdn.yeganehheshmat.com/backgrounds/responsive_mobile";

export function MobileFooterBackground() {
  const locale = useLocale();
  const [useLocalAsset, setUseLocalAsset] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const xsFilename = locale === "fa"
    ? "SEC7_HOMEPAGE_360_XS_FA.jpg"
    : "SEC7_HOMEPAGE_360_XS_EN.jpg";
  const mobileFilename = locale === "fa"
    ? "SEC7_HOMEPAGE_360_MOBIL_FA.jpg"
    : "SEC7_HOMEPAGE_360_MOBILE_EN.jpg";
  const source = (filename: string) =>
    `${useLocalAsset ? "/images/mobile-footer" : FOOTER_CDN}/${filename}`;

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) setUseLocalAsset(true);
  }, []);

  return (
    <picture className={styles.background} data-mobile-footer-background>
      <source media="(min-width: 375px)" srcSet={source(mobileFilename)} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={source(xsFilename)}
        alt=""
        className={styles.image}
        loading="lazy"
        decoding="async"
        onError={() => setUseLocalAsset(true)}
      />
    </picture>
  );
}
