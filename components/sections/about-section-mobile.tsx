"use client";

import {useTranslations} from "next-intl";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { aboutFeatures } from "@/components/sections/about-section";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ACCORDION_EASE = [0.22, 1, 0.36, 1] as const;

export function AboutSectionMobile() {
 const t = useTranslations("Home");
	const [activeCardId, setActiveCardId] = useState<string | null>(null);
	const reduceMotion = useReducedMotion();
	const reactId = useId();

	const toggleCard = (id: string) => {
		setActiveCardId((current) => (current === id ? null : id));
	};

	return (
		<div className="flex h-full min-h-0 w-full flex-col items-stretch justify-center gap-5 text-start">
			<h2 className="fullpage-reveal mx-auto w-full max-w-[20rem] text-center font-serif text-[clamp(2.15rem,9.5vw,2.85rem)] leading-[1.12] font-medium tracking-[-0.02em] text-[var(--section-about-fg)]">
				{t("valuesTitle")}
			</h2>

			<div className="fullpage-reveal flex w-full flex-col gap-2.5">
				{aboutFeatures.map((feature, index) => {
					const isOpen = activeCardId === feature.id;
					const panelId = `${reactId}-${feature.id}-panel`;
					const triggerId = `${reactId}-${feature.id}-trigger`;

					return (
						<Card
							key={feature.id}
							size="sm"
							className="border border-[var(--section-about-fg)]/[0.08] bg-[var(--section-about-card)] py-0 shadow-none ring-0"
						>
							<CardContent className="flex flex-col px-3 py-2.5 text-start">
								<div className="flex flex-row items-start gap-3">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={feature.mobileIcon ?? feature.icon}
										alt=""
										width={52}
										height={52}
										className="mt-0.5 size-[3.15rem] shrink-0 object-contain object-center"
									/>

									<div className="min-w-0 flex-1">
										<h3 className="font-serif text-[1.05rem] leading-[1.2] font-medium tracking-[-0.01em] text-[var(--section-about-fg)]">
											{t(`features${index}title`)}
										</h3>

										<p className="mt-1 font-sans text-[0.72rem] font-normal leading-[1.45] text-[var(--section-about-muted)]">
											{t(`features${index}shortDescription`)}
										</p>

										<button
											type="button"
											id={triggerId}
											aria-expanded={isOpen}
											aria-controls={panelId}
											onClick={() => toggleCard(feature.id)}
											className={cn(
												"mt-2 flex w-full items-center justify-between gap-2",
												"text-start font-sans text-[0.72rem] font-medium tracking-[0.01em]",
												"text-[var(--section-about-gold)]",
												"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--section-about-fg)]",
											)}
										>
											<span className="underline decoration-[var(--section-about-gold)]/70 underline-offset-[3px]">
												{isOpen ? t("readLess") : t("readMore")}
											</span>

											<span
												className={cn(
													"flex size-7 shrink-0 items-center justify-center rounded-full",
													"border border-[var(--section-about-gold)]/30",
													isOpen
														? "bg-[var(--section-about-gold)]/20"
														: "bg-[var(--section-about-gold)]/12",
													"text-[var(--section-about-fg)]",
												)}
											>
												<motion.span
													aria-hidden
													animate={{ rotate: isOpen ? 180 : 0 }}
													initial={false}
													transition={
														reduceMotion
															? { duration: 0 }
															: { duration: 0.35, ease: ACCORDION_EASE }
													}
													className="flex"
												>
													<ChevronDown className="size-3.5 stroke-[2]" />
												</motion.span>
											</span>
										</button>
									</div>
								</div>

								<AnimatePresence initial={false}>
									{isOpen ? (
										<motion.div
											id={panelId}
											role="region"
											aria-labelledby={triggerId}
											key={`${feature.id}-panel`}
											initial={
												reduceMotion
													? { height: "auto", opacity: 1 }
													: { height: 0, opacity: 0, y: -4 }
											}
											animate={
												reduceMotion
													? { height: "auto", opacity: 1 }
													: { height: "auto", opacity: 1, y: 0 }
											}
											exit={
												reduceMotion
													? { height: 0, opacity: 0 }
													: { height: 0, opacity: 0, y: -4 }
											}
											transition={
												reduceMotion
													? { duration: 0 }
													: { duration: 0.36, ease: ACCORDION_EASE }
											}
											className="overflow-hidden"
										>
											<p className="pt-2.5 pl-[calc(3.15rem+0.75rem)] font-sans text-[0.74rem] font-normal leading-[1.55] text-[var(--section-about-muted)]">
												{t(`features${index}detail`)}
											</p>
										</motion.div>
									) : null}
								</AnimatePresence>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
