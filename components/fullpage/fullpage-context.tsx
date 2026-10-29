"use client";

import { createContext, useContext } from "react";

import type { SectionId } from "@/lib/sections";

export type FullpageContextValue = {
  activeIndex: number;
  goTo: (index: number) => void;
  goToId: (id: SectionId) => void;
};

export const FullpageContext = createContext<FullpageContextValue | null>(null);

export function useFullpage() {
  const context = useContext(FullpageContext);
  if (!context) {
    throw new Error("useFullpage must be used within FullpageScroll");
  }
  return context;
}
