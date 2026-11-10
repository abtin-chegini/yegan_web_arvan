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
				className="mx-auto flex w-full max-w-[28rem] shrink-0 flex-col gap-[var(--mobile-home-content-gap,24px)] py-0 text-start">
				<h2 data-mobile-home-title className="mobile-section-title fullpage-reveal mx-auto w-full shrink-0 max-w-[20rem] text-center font-serif tracking-[-0.02em] text-[var(--section-about-fg)]">
					{t("valuesTitleMobile")}
				</h2>

				<div className="fullpage-reveal flex w-full shrink-0 flex-col gap-3">
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
								<CardContent className="px-4 py-0">
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
										className="flex w-full min-h-[90px] items-center gap-3 rounded-xl py-[1px] text-start focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--section-about-fg)]"
									>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={feature.mobileIcon ?? feature.icon}
											alt=""
											width={64}
											height={64}
											className="size-14 shrink-0 object-contain object-center min-[375px]:size-16"
											onError={({currentTarget}) => {
												const filename = (feature.mobileIcon ?? feature.icon).split("/").pop();
												const fallback = `/homepage/${filename}`;
												if (currentTarget.getAttribute("src") !== fallback) currentTarget.src = fallback;
											}}
										/>
										<span className="min-w-0 flex-1">
											<span id={titleId} className="mobile-card-title block font-serif tracking-[-0.01em] text-[var(--section-about-fg)]">
												{t(`features${index}title`)}
											</span>
											<span className="mobile-card-description mt-1 block overflow-hidden text-ellipsis font-sans text-[var(--section-about-muted)]" style={{whiteSpace: "nowrap", overflowWrap: "normal"}}>
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
										<p className="mobile-card-description border-t border-[var(--section-about-fg)]/10 pt-3 pb-4 font-sans text-[var(--section-about-muted)]">
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
