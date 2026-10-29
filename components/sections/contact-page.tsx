"use client";

import {useTranslations} from "next-intl";

import { FooterSection } from "@/components/sections/footer-section";
import { SitePageScroll } from "@/components/site-page/site-page-scroll";
import { sections } from "@/lib/sections";

const contactSection = sections.find((section) => section.id === "contact")!;

export function ContactPageView() {
 const t = useTranslations("Nav");
  return (
    <SitePageScroll
      activeNavId="contact"
      mainId="contact"
      mainLabel={t("contact")}
      mainSection={contactSection}
      withFooter={false}
    >
      <FooterSection />
    </SitePageScroll>
  );
}
