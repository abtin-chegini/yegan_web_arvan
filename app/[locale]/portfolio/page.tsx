import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {setRequestLocale} from "next-intl/server";
import { PortfolioPageView } from "@/components/portfolio_cards/portfolio-page";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "portfolio");
}

export default async function PortfolioPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <>
    <JsonLd page="portfolio" locale={locale} />
    <PortfolioPageView />
  </>;
}
