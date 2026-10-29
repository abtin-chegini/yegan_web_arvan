import {setRequestLocale} from "next-intl/server";
import { ContactPageView } from "@/components/sections/contact-page";

export default async function ContactPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <ContactPageView />;
}
