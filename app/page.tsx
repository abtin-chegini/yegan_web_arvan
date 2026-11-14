import type { Metadata } from "next";
import { SITE_URL, languageAlternates } from "@/lib/seo";

// The root remains the existing static redirect to /en/.
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/`, languages: languageAlternates() },
  openGraph: { type: "website", title: "Yeganeh Heshmat", url: `${SITE_URL}/` },
  twitter: { card: "summary", title: "Yeganeh Heshmat" },
};

export default function RootPage() {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta httpEquiv="refresh" content="0;url=/en/" />
        <title>Yeganeh Heshmat</title>
      </head>
      <body />
    </html>
  );
}
