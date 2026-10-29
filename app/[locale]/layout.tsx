import type { Metadata } from "next";
import { Baskervville, Geist_Mono, Manrope } from "next/font/google";

import "../globals.css";
import {NextIntlClientProvider, hasLocale} from "next-intl";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope-optimized",
  subsets: ["latin"],
  display: "swap",
});

const baskervville = Baskervville({
  variable: "--font-baskervville-optimized",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const baseMetadata: Metadata = {
  title: "Yeganeh Heshmat | Product Designer & Front-End Developer",
  description:
    "Explore Yeganeh Heshmat’s portfolio of product design, UX/UI design, and front-end development, featuring responsive websites and detailed project case studies.",
  keywords: [
    "Yeganeh Heshmat",
    "Yeganeh Heshmat portfolio",
    "product designer",
    "front-end developer",
    "UX/UI designer",
    "product design portfolio",
    "UX/UI design portfolio",
    "front-end development portfolio",
    "interaction design",
    "responsive web design",
    "user experience design",
    "user interface design",
    "design case studies",
  ],
  authors: [{ name: "Yeganeh Heshmat" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({locale, namespace: "Metadata"});
  return {...baseMetadata, title: t("title"), description: t("description")};
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages({locale});

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={`${geistMono.variable} ${manrope.variable} ${baskervville.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden"><NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider></body>
    </html>
  );
}
