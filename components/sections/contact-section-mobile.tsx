"use client";

import {useTranslations} from "next-intl";
import { ContactLinks } from "@/components/sections/contact-section";

import { useContactAnimation } from "./use-contact-animation";

export function ContactSectionMobile() {
  const rootRef = useContactAnimation();
  const t = useTranslations("Contact");
  return (
    <div ref={rootRef} className="mx-auto flex h-full w-full flex-col items-center justify-center text-center">
      <div className="flex w-full flex-col items-center">
        <h2 className="font-serif text-[1.85rem] font-medium leading-[1.18] tracking-[-0.02em] text-[var(--section-contact-fg)]">
          {t("title")}
        </h2>
        <p className="mt-3 w-full max-w-sm text-balance font-sans text-[0.92rem] font-normal leading-[1.9] text-[#c0965a]">
          {t("description")}
        </p>

        <ContactLinks />
      </div>
    </div>
  );
}
