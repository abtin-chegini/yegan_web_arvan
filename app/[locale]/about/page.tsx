import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {setRequestLocale} from "next-intl/server";
import { AboutPageView } from "@/components/sections/about-page";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "about");
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <>
    <JsonLd page="about" locale={locale} />
    <AboutPageView />
  </>;
}
