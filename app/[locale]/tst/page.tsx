import { pageMetadata } from "@/lib/seo";
import {setRequestLocale} from "next-intl/server";
import FancyNavbar from "@/components/fancyNavbar/fancynavbar";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "tst");
}

export default async function TstPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <FancyNavbar />;
}
