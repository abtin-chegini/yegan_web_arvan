import {setRequestLocale} from "next-intl/server";
import FancyNavbar from "@/components/fancyNavbar/fancynavbar";

export default async function TstPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <FancyNavbar />;
}
