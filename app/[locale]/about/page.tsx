import {setRequestLocale} from "next-intl/server";
import { AboutPageView } from "@/components/sections/about-page";

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <AboutPageView />;
}
