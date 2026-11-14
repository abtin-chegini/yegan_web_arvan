import { JsonLd } from "@/components/json-ld";
import { PortfolioPageView } from "@/components/portfolio_cards/portfolio-page";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "projects");
}

export default async function ProjectsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <>
    <JsonLd page="portfolio" locale={locale} path="projects" />
    <PortfolioPageView />
  </>;
}
