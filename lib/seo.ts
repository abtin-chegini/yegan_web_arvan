import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";

export const SITE_URL = "https://yeganehheshmat.com";

/** Matches the static export's trailingSlash convention, including locale homes. */
export function localizedUrl(locale: string, path = ""): string {
  const pathname = path.replace(/^\/+|\/+$/g, "");
  return `${SITE_URL}/${locale}/${pathname ? `${pathname}/` : ""}`;
}

export function languageAlternates(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((locale) => [locale, localizedUrl(locale, path)])),
    "x-default": localizedUrl(routing.defaultLocale, path),
  };
}

/** Called by each page at export time so nested routes retain their own URLs. */
export async function pageMetadata(locale: string, path = ""): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("title");
  const description = t("description");

  return {
    alternates: {
      canonical: localizedUrl(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: localizedUrl(locale, path),
      siteName: "Yeganeh Heshmat",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
    },
    twitter: { card: "summary", title, description },
  };
}
