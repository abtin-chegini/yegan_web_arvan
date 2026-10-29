"use client";

import {useLocale, useTranslations} from "next-intl";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
	AnimatePresence,
	motion,
	useReducedMotion,
	type PanInfo,
} from "motion/react";
import { useCallback, useId, useState } from "react";

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
	const [isExpanded, setIsExpanded] = useState(false);
	const reduceMotion = useReducedMotion();
	const reactId = useId();
	const lastIndex = services.length - 1;
	const canPrev = activeIndex > 0;
	const canNext = activeIndex < lastIndex;
	const service = services[activeIndex]!;
	const panelId = `${reactId}-process-detail`;
	const triggerId = `${reactId}-process-read-more`;
	const extraDetail = t("focusAreas", {areas: service.items.map((item) => item.label).join("، ")});

	const goTo = useCallback(
		(next: number, dir: number) => {
			if (next < 0 || next > lastIndex || next === activeIndex) return;
			setIsExpanded(false);
			setDirection(dir);
			setActiveIndex(next);
		},
		[activeIndex, lastIndex],
	);

	const goPrev = () => goTo(activeIndex - 1, -1);
	const goNext = () => goTo(activeIndex + 1, 1);

	const onDragEnd = (_: unknown, info: PanInfo) => {
		const { offset, velocity } = info;
		if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) {
			goNext();
			return;
		}
		if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
			goPrev();
		}
	};

	return (
		<div className="flex h-full min-h-0 w-full flex-col justify-center gap-4">
			<aside className="fullpage-reveal flex shrink-0 flex-col gap-1.5">
				<h2 className={`font-serif ${isPersian ? "text-[1.7rem] whitespace-nowrap" : "text-[1.7rem]"} leading-[1.08] font-medium tracking-[-0.02em] text-[var(--section-process-fg)]`}>
					{t("processTitle")}
				</h2>
				<p className={`font-sans text-[0.8rem] font-normal leading-relaxed text-[var(--section-process-muted)] ${isPersian ? "mt-6" : ""}`}>
					{t("processIntro")}
				</p>
			</aside>

			<div className="fullpage-reveal flex min-h-0 w-full flex-1 flex-col items-center justify-center">
				<div className="flex w-full max-w-[22rem] flex-col items-center gap-5">
					<div
						className={cn(
							"w-full rounded-2xl",
							"border border-[var(--section-process-fg)]/[0.1]",
							"bg-[var(--section-process-card)]/70",
							"px-3.5 pt-4 pb-4",
						)}
					>
						<div className="relative mb-3 w-full overflow-hidden">
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
									<div className="flex h-[8.25rem] w-full items-center justify-center bg-transparent">
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

						{/* Title + description + read more */}
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
								<h3 className="font-serif text-[1.35rem] leading-[1.15] font-medium tracking-[-0.01em] text-[var(--section-process-fg)]">
									{service.title}
								</h3>

								<p
									className={cn(
										"mt-2 font-sans text-[0.8rem] font-normal leading-[1.5] text-[var(--section-process-muted)]",
										!isExpanded && "line-clamp-3",
									)}
								>
									{service.description}
								</p>

								<AnimatePresence initial={false}>
									{isExpanded ? (
										<motion.div
											id={panelId}
											role="region"
											aria-labelledby={triggerId}
											key={`${service.title}-extra`}
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
													: { duration: 0.36, ease: SLIDE_EASE }
											}
											className="overflow-hidden"
										>
											<p className="pt-2 font-sans text-[0.78rem] font-normal leading-[1.5] text-[var(--section-process-muted)]">
												{extraDetail}
											</p>
										</motion.div>
									) : null}
								</AnimatePresence>

								<button
									type="button"
									id={triggerId}
									aria-expanded={isExpanded}
									aria-controls={panelId}
									onClick={() => setIsExpanded((open) => !open)}
									className={cn(
										"mt-2.5 inline-flex flex-col items-center gap-0.5",
										"font-sans text-[0.72rem] font-medium tracking-[0.02em]",
										"text-[var(--section-process-fg)]",
										"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--section-process-fg)]",
									)}
								>
									<span>{isExpanded ? t("readLess") : t("readMore")}</span>
									<motion.span
										aria-hidden
										animate={{ rotate: isExpanded ? 180 : 0 }}
										initial={false}
										transition={
											reduceMotion
												? { duration: 0 }
												: { duration: 0.32, ease: SLIDE_EASE }
										}
										className="flex"
									>
										<ChevronDown className="size-3.5 stroke-[1.75] opacity-80" />
									</motion.span>
								</button>
							</motion.div>
						</AnimatePresence>
					</div>

					<nav
						aria-label="Service carousel"
						className="grid w-full max-w-[17.5rem] grid-cols-[2.75rem_1fr_2.75rem] items-center"
					>
						<button
							type="button"
							aria-label="Previous service"
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
							<ChevronLeft className="size-5" strokeWidth={1.75} />
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
							aria-label="Next service"
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
							<ChevronRight className="size-5" strokeWidth={1.75} />
						</button>
					</nav>
				</div>
			</div>
		</div>
	);
}
