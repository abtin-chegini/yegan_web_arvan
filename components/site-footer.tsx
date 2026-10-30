"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Section } from "@/lib/sections";

const FooterContext = createContext<{ section: Section; content: ReactNode } | null>(null);

export function SiteFooterProvider({ section, content, children }: {
  section: Section;
  content: ReactNode;
  children: ReactNode;
}) {
  return <FooterContext.Provider value={{ section, content }}>{children}</FooterContext.Provider>;
}

export function useSiteFooter() {
  const footer = useContext(FooterContext);
  if (!footer) throw new Error("Site footer must be configured by the locale layout.");
  return footer;
}

export function SiteFooter() {
  return useSiteFooter().content;
}
