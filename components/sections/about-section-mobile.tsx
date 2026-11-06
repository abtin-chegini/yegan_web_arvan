"use client";

import { useTranslations } from "next-intl";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { aboutFeatures } from "@/components/sections/about-section";
import { Card, CardContent } from "@/components/ui/card";

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
		<div className="flex w-full items-center justify-center">
			<div
				className="mx-auto flex w-full max-w-[28rem] shrink-0 flex-col gap-5 py-2 text-start">
				<h2 className="fullpage-reveal mx-auto w-full shrink-0 max-w-[20rem] text-center font-serif text-[clamp(2rem,8.8vw,2.65rem)] leading-[1.12] font-medium tracking-[-0.02em] text-[var(--section-about-fg)]">
					{t("valuesTitle")}
				</h2>

				<div className="fullpage-reveal flex w-full shrink-0 flex-col gap-2.5">
					{aboutFeatures.map((feature, index) => {
						const isOpen = activeCardId === feature.id;
						const panelId = `${reactId}-${feature.id}-panel`;
						const triggerId = `${reactId}-${feature.id}-trigger`;
						const titleId = `${reactId}-${feature.id}-title`;

						return (
							<Card
								key={feature.id}
								size="sm"
								className="gap-0 rounded-2xl border border-[var(--section-about-fg)]/15 bg-[var(--section-about-card)] py-0 shadow-none ring-0"
							>
								<CardContent className="px-3 py-0">
									<button
										type="button"
										id={triggerId}
										aria-labelledby={titleId}
										aria-expanded={isOpen}
										aria-controls={panelId}
										onClick={() => toggleCard(feature.id)}
										onKeyDown={(event) => {
											if (event.key === " ") event.stopPropagation();
										}}
										className="flex w-full items-center gap-2.5 rounded-xl py-2.5 text-start focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--section-about-fg)]"
									>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={feature.mobileIcon ?? feature.icon}
											alt=""
											width={56}
											height={56}
											className="size-[52px] shrink-0 object-contain object-center min-[375px]:size-14"
										/>
										<span className="min-w-0 flex-1">
											<span id={titleId} className="block font-serif text-[1.25rem] leading-[1.2] font-medium tracking-[-0.01em] text-[var(--section-about-fg)] min-[375px]:text-[1.4rem]">
												{t(`features${index}title`)}
											</span>
											<span className="mt-1 block font-sans text-[0.8125rem] font-normal leading-[1.4] text-[var(--section-about-muted)] min-[375px]:text-[0.9375rem]">
												{t(`features${index}shortDescription`)}
											</span>
										</span>
										<span aria-hidden="true" className="grid size-[44px] shrink-0 place-items-center rounded-full border border-[rgb(29_53_87_/_0.1)] bg-white text-[#1d3557] shadow-[0_8px_22px_rgba(17,29,74,0.08)]">
											<motion.span
												animate={{ rotate: isOpen ? 180 : 0 }}
												initial={false}
												transition={{ duration: reduceMotion ? 0 : 0.25, ease: ACCORDION_EASE }}
												className="flex"
											>
												<ChevronDown className="size-[18px]" strokeWidth={1.75} />
											</motion.span>
										</span>
									</button>

									<motion.div
										id={panelId}
										role="region"
										aria-labelledby={triggerId}
										aria-hidden={!isOpen}
										inert={!isOpen}
										initial={false}
										animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
										transition={{ duration: reduceMotion ? 0 : 0.25, ease: ACCORDION_EASE }}
										className="overflow-hidden"
									>
										<p className="border-t border-[var(--section-about-fg)]/10 pt-2.5 pb-2.5 font-sans text-sm min-[375px]:text-[0.9375rem] font-normal leading-[1.45] text-[var(--section-about-muted)]">
											{t(`features${index}detail`)}
										</p>
									</motion.div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</div>
	);
}
