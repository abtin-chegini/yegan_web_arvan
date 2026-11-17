export const dynamic = "force-static";

// Explicit allowlist and order: keep the published sitemap exactly as approved.
// Do not derive entries from routes, project data, or page metadata alternates.
const paths = [
  "",
  "projects/",
  "about/",
  "contact/",
  "projects/bilit4u/",
  "projects/tealnex/",
  "projects/tealtile/",
] as const;

const origin = "https://yeganehheshmat.com";
const locales = ["fa", "en"] as const;

export function GET() {
  const entries = paths.flatMap((path) =>
    locales.map((locale) => `  <url>
    <loc>${origin}/${locale}/${path}</loc>
    <xhtml:link rel="alternate" hreflang="fa" href="${origin}/fa/${path}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${origin}/en/${path}"/>
  </url>`),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

${entries.join("\n\n")}

</urlset>
`;

  return new Response(xml, {
    headers: {"Content-Type": "application/xml; charset=utf-8"},
  });
}
