"use client";

import {useLocale, useTranslations} from "next-intl";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	AnimatePresence,
	motion,
	useReducedMotion,
	type PanInfo,
} from "motion/react";
import { useCallback, useState } from "react";

import { processServices } from "@/components/sections/process-section";
import { cn } from "@/lib/utils";

const SLIDE_EASE = [0.22, 1, 0.36, 1] as const;
const SWIPE_OFFSET = 48;
const SWIPE_VELOCITY = 420;

const slideVariants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 48 : -48,
		opacity: 0,
	}),
	center: {
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => ({
		x: direction > 0 ? -48 : 48,
		opacity: 0,
	}),
};



export function ProcessSectionMobile() {
 const t = useTranslations("Home");
 const isPersian = useLocale() === "fa";
 const services = processServices.map((service, index) => ({
   ...service,
   title: t(`service${index}title`),
   description: t(`service${index}description`),
   shortDescription: t(`service${index}shortDescription`),
   items: service.items.map((item, itemIndex) => ({...item, label: t(`serviceItem${index * 4 + itemIndex}`)}))
 }));

	const [activeIndex, setActiveIndex] = useState(0);
	const [direction, setDirection] = useState(0);
	const reduceMotion = useReducedMotion();
	const lastIndex = services.length - 1;
	const canPrev = activeIndex > 0;
	const canNext = activeIndex < lastIndex;
	const service = services[activeIndex]!;


	const goTo = useCallback(
		(next: number, dir: number) => {
			if (next < 0 || next > lastIndex || next === activeIndex) return;
			setDirection(isPersian ? -dir : dir);
			setActiveIndex(next);
		},
		[activeIndex, lastIndex, isPersian],
	);

	const goPrev = () => goTo(activeIndex - 1, -1);
	const goNext = () => goTo(activeIndex + 1, 1);

	const onDragEnd = (_: unknown, info: PanInfo) => {
		const offset = { x: info.offset.x * (isPersian ? -1 : 1) };
		const velocity = { x: info.velocity.x * (isPersian ? -1 : 1) };
		if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) {
			goNext();
			return;
		}
		if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
			goPrev();
		}
	};

	return (
		<div className="flex h-full min-h-0 w-full flex-col justify-center gap-[var(--mobile-home-content-gap,24px)]">
			<aside className="fullpage-reveal flex shrink-0 flex-col items-center gap-[var(--mobile-home-heading-gap,12px)] text-center">
				<h2 data-mobile-home-title className="mobile-section-title font-serif tracking-[-0.02em] text-[var(--section-process-fg)]">
					{t("processTitle")}
				</h2>
				<p data-mobile-home-description className="mobile-section-description font-sans text-[var(--section-process-muted)]">
					{t("processIntroMobile")}
				</p>
			</aside>

			<div className="fullpage-reveal flex min-h-0 w-full flex-1 flex-col items-center justify-center">
				<div className="flex w-full max-w-[22rem] flex-col items-center gap-5">
					<div
						className={cn(
							"w-full rounded-2xl",
							"border border-[var(--section-process-fg)]/[0.1]",
							"bg-[var(--section-process-card)]/70",
							"px-4 py-5",
						)}
					>
						<div className="relative mx-auto mb-4 w-full max-w-[13.5rem] overflow-hidden">
							<AnimatePresence initial={false} custom={direction} mode="wait">
								<motion.div
									key={service.title}
									role="group"
									aria-roledescription="slide"
									aria-label={`${service.title} (${activeIndex + 1} of ${services.length})`}
									custom={direction}
									variants={slideVariants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={
										reduceMotion
											? { duration: 0 }
											: { duration: 0.36, ease: SLIDE_EASE }
									}
									drag={reduceMotion ? false : "x"}
									dragConstraints={{ left: 0, right: 0 }}
									dragElastic={0.12}
									dragDirectionLock
									onDragEnd={onDragEnd}
									className="flex cursor-grab flex-col items-center touch-pan-y active:cursor-grabbing"
								>
									<div className="flex h-[7.5rem] w-full items-center justify-center bg-transparent">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={service.mobileIcon}
											alt=""
											width={360}
											height={220}
											draggable={false}
											className="h-full w-full bg-transparent object-contain object-center select-none"
											decoding="async"
										/>
									</div>
								</motion.div>
							</AnimatePresence>
						</div>

						{/* Desktop-style description and service details */}
						<AnimatePresence initial={false} mode="wait">
							<motion.div
								key={`${service.title}-copy`}
								initial={reduceMotion ? false : { opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
								transition={
									reduceMotion
										? { duration: 0 }
										: { duration: 0.3, ease: SLIDE_EASE }
								}
								className="mx-auto flex w-full max-w-[18.5rem] flex-col items-center text-center"
							>
								<h3 className="mobile-card-title font-serif tracking-[-0.01em] text-[var(--section-process-fg)]">
									{service.title}
								</h3>

                                <p className="mobile-card-description mt-2 font-sans text-[var(--section-process-muted)]">
                                    {service.description}
                                </p>
                                <div className="my-4 flex w-full items-center gap-2 py-1">
                                    <span className="h-px flex-1 bg-[var(--section-process-fg)]/15" />
                                    <span aria-hidden className="size-1.5 rotate-45 border border-[var(--section-process-fg)]/25 bg-[var(--section-process-fg)]/10" />
                                    <span className="h-px flex-1 bg-[var(--section-process-fg)]/15" />
                                </div>
                                <ul className="flex w-full flex-col gap-2.5 text-start">
                                    {service.items.map(({ label, Icon }) => (
                                        <li key={label} className="mobile-card-meta flex items-center gap-2.5 font-sans text-[var(--section-process-fg)]">
                                            <Icon aria-hidden className="size-3.5 shrink-0 stroke-[1.5] text-[var(--section-process-muted)]" />
                                            <span>{label}</span>
                                        </li>
                                    ))}
                                </ul>
							</motion.div>
						</AnimatePresence>
					</div>

					<nav
						aria-label="Service carousel"
						className="grid w-full max-w-[17.5rem] grid-cols-[2.75rem_1fr_2.75rem] items-center"
					>
						<button
							type="button"
							aria-label={isPersian ? "خدمت قبلی" : "Previous service"}
							disabled={!canPrev}
							onClick={goPrev}
							className={cn(
								"flex size-11 items-center justify-center rounded-full",
								"border border-[var(--section-process-fg)]/10",
								"bg-[var(--section-process-card)] text-[var(--section-process-fg)]",
								"shadow-[0_2px_10px_-4px_rgba(29,53,87,0.22)]",
								"transition-[opacity,transform] active:scale-[0.97]",
								"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--section-process-fg)]",
								!canPrev && "pointer-events-none opacity-35",
							)}
						>
							{isPersian ? <ChevronRight className="size-5" strokeWidth={1.75} /> : <ChevronLeft className="size-5" strokeWidth={1.75} />}
						</button>

						<div
							className="flex items-center justify-center gap-2"
							role="tablist"
							aria-label="Service slides"
						>
							{services.map((item, index) => {
								const isActive = index === activeIndex;
								return (
									<button
										key={item.title}
										type="button"
										role="tab"
										aria-selected={isActive}
										aria-label={`Go to ${item.title}`}
										onClick={() =>
											goTo(
												index,
												index > activeIndex ? 1 : index < activeIndex ? -1 : 0,
											)
										}
										className={cn(
											"rounded-full transition-[background-color,transform]",
											"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--section-process-fg)]",
											isActive
												? "size-2 bg-[var(--section-process-fg)]"
												: "size-1.5 bg-[var(--section-process-fg)]/25",
										)}
									/>
								);
							})}
						</div>

						<button
							type="button"
							aria-label={isPersian ? "خدمت بعدی" : "Next service"}
							disabled={!canNext}
							onClick={goNext}
							className={cn(
								"flex size-11 items-center justify-center justify-self-end rounded-full",
								"border border-[var(--section-process-fg)]/10",
								"bg-[var(--section-process-card)] text-[var(--section-process-fg)]",
								"shadow-[0_2px_10px_-4px_rgba(29,53,87,0.22)]",
								"transition-[opacity,transform] active:scale-[0.97]",
								"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--section-process-fg)]",
								!canNext && "pointer-events-none opacity-35",
							)}
						>
							{isPersian ? <ChevronLeft className="size-5" strokeWidth={1.75} /> : <ChevronRight className="size-5" strokeWidth={1.75} />}
						</button>
					</nav>
				</div>
			</div>
		</div>
	);
}
