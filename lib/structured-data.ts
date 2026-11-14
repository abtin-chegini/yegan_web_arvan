import "server-only";

import schemaData from "@/lib/schema-data.json";
import { localizedUrl } from "@/lib/seo";

export type SchemaPage = keyof typeof schemaData.locales.en.pages;
type SchemaLocale = keyof typeof schemaData.locales;

/** Shared identities stay stable; each translated page describes its canonical URL. */
export function getPageSchema(page: SchemaPage, locale: string, path?: string) {
  if (!(locale in schemaData.locales)) throw new Error(`Unsupported schema locale: ${locale}`);
  const localized = schemaData.locales[locale as SchemaLocale];
  const pageData = localized.pages[page];
  const graph = {
    "@context": schemaData["@context"],
    "@graph": [
      schemaData.shared.website,
      {
        ...schemaData.shared.person,
        ...localized.person,
        ...("person" in pageData ? pageData.person : {}),
      },
      ...pageData.nodes,
    ],
  };

  // /projects/ renders the portfolio too, but keeps its own canonical page/list IDs.
  if (page === "portfolio" && path === "projects") {
    return JSON.parse(JSON.stringify(graph).replaceAll(
      localizedUrl(locale, "portfolio"), localizedUrl(locale, path),
    )) as typeof graph;
  }
  return graph;
}
