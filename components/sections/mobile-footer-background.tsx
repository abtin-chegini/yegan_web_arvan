"use client";

import { useLocale } from "next-intl";

export function MobileFooterBackground() {
  const locale = useLocale();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={locale === "fa"
        ? "/image/SEC7_HOMEPAGE_360_XS_FA.jpg"
        : "/image/SEC7_HOMEPAGE_360_XS_EN.jpg"}
      alt=""
      className="absolute inset-0 h-full w-full object-cover object-center"
      loading="lazy"
      decoding="async"
    />
  );
}
