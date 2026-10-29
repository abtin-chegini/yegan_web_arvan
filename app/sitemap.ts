import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getAllCaseStudySlugs } from "@/lib/case-studies";

export const dynamic = "force-static";

const SITE_URL = "https://yeganehheshmat.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "about/",
    "portfolio/",
    "contact/",
    ...getAllCaseStudySlugs().map((slug) => `projects/${slug}/`),
    "tst/",
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}/${path}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((language) => [
            language,
            `${SITE_URL}/${language}/${path}`,
          ]),
        ),
      },
    })),
  );
}
