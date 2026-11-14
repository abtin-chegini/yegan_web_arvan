import type { MetadataRoute } from "next";

import { languageAlternates, localizedUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { getAllCaseStudySlugs } from "@/lib/case-studies";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "about/",
    "portfolio/",
    "projects/",
    "contact/",
    ...getAllCaseStudySlugs().map((slug) => `projects/${slug}/`),
    "tst/",
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: localizedUrl(locale, path),
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
