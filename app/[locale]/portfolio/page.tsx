import {setRequestLocale} from "next-intl/server";
import { PortfolioPageView } from "@/components/portfolio_cards/portfolio-page";

export default async function PortfolioPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <PortfolioPageView />;
}
