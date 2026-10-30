"use client";

import {useTranslations} from "next-intl";

import { FooterSection } from "@/components/sections/footer-section";
import { SitePageScroll } from "@/components/site-page/site-page-scroll";
import { useSiteFooter } from "@/components/site-footer";

export function ContactPageView() {
 const t = useTranslations("Nav");
 const { section: contactSection } = useSiteFooter();
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
