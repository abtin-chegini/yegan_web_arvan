import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {setRequestLocale} from "next-intl/server";
import { ContactPageView } from "@/components/sections/contact-page";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "contact");
}

export default async function ContactPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <>
    <JsonLd page="contact" locale={locale} />
    <ContactPageView />
  </>;
}
