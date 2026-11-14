import { getPageSchema, type SchemaPage } from "@/lib/structured-data";

/** Server-rendered script: included in static HTML, with no hydration dependency. */
export function JsonLd({ page, locale, path }: {
  page: SchemaPage;
  locale: string;
  path?: string;
}) {
  const schema = getPageSchema(page, locale, path);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
