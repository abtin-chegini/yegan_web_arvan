import type { Metadata } from "next";
import { SITE_URL, languageAlternates } from "@/lib/seo";
import { routing } from "@/i18n/routing";

// Keep the static redirect aligned with the site's default language.
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/`, languages: languageAlternates() },
  openGraph: { type: "website", title: "Yeganeh Heshmat", url: `${SITE_URL}/` },
  twitter: { card: "summary", title: "Yeganeh Heshmat" },
};

export default function RootPage() {
  return (
    <html lang={routing.defaultLocale} dir={routing.defaultLocale === "fa" ? "rtl" : "ltr"}>
      <head>
        <meta httpEquiv="refresh" content={`0;url=/${routing.defaultLocale}/`} />
        <title>Yeganeh Heshmat</title>
      </head>
      <body />
    </html>
  );
}
