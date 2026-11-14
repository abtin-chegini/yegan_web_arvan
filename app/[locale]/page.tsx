import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {setRequestLocale} from "next-intl/server";
import { HomePage } from "@/components/home-page";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "");
}

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <>
    <JsonLd page="home" locale={locale} />
    <HomePage />
  </>;
}
