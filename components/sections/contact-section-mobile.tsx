"use client";

import {useTranslations} from "next-intl";
import { ContactLinks } from "@/components/sections/contact-section";

import { useContactAnimation } from "./use-contact-animation";

export function ContactSectionMobile() {
  const rootRef = useContactAnimation();
  const t = useTranslations("Contact");
  return (
    <div data-mobile-footer ref={rootRef} className="mx-auto flex h-full w-full flex-col items-center justify-center text-center">
      <div className="flex w-full flex-col items-center">
        <h2 data-mobile-home-title className="mobile-section-title font-serif tracking-[-0.02em] text-[var(--section-contact-fg)]">
          {t("title")}
        </h2>
        <p data-mobile-home-description className="mobile-section-description mt-3 w-full max-w-sm text-balance font-sans text-[#c0965a]">
          {t("description")}
        </p>

        <ContactLinks />
      </div>
    </div>
  );
}
