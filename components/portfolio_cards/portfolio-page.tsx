"use client";

import {useTranslations} from "next-intl";

import { useEffect, useState } from "react";

import CardsSection from "@/components/portfolio_cards/Cards_section";
import CardsSectionMobile from "@/components/portfolio_cards/Cards_section_mobile";
import { SitePageScroll } from "@/components/site-page/site-page-scroll";
import { sections } from "@/lib/sections";
import { cn } from "@/lib/utils";

const portfolioSection = sections.find((section) => section.id === "portfolio")!;

function PortfolioCardsSlide() {
 const t = useTranslations("Nav");
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		const query = window.matchMedia("(max-width: 767px)");
		const update = () => setIsMobile(query.matches);
		update();
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, []);

	return (
		<div
			className={cn(
				"relative z-10 flex h-full w-full min-h-0 flex-col items-center",
				isMobile && "portfolio-slide-mobile",
			)}
		>
			<header
				className={cn(
					"shrink-0 text-center",
					isMobile
						? "portfolio-slide-mobile__title"
						: "-mt-6 sm:-mt-10 md:-mt-12",
				)}
			>
				<h1
					className={cn(
						"font-serif font-medium leading-[1.1] tracking-[-0.02em] text-[var(--section-portfolio-fg)]",
						isMobile
							? "text-[1.55rem]"
							: "text-[clamp(2.1rem,4.2vw,3.4rem)]",
					)}
				>
					{t("portfolio")}
				</h1>
			</header>

			<div className="relative min-h-0 w-full flex-1 overflow-hidden">
				{isMobile === null ? null : isMobile ? (
					<CardsSectionMobile />
				) : (
					<CardsSection />
				)}
			</div>
		</div>
	);
}

export function PortfolioPageView() {
 const t = useTranslations("Nav");
	return (
		<SitePageScroll
			activeNavId="portfolio"
			mainId="portfolio"
			mainLabel={t("portfolio")}
			mainSection={portfolioSection}
			showMainBackground={false}
			showPageIndicator={false}
			showScrollHint
		>
			<PortfolioCardsSlide />
		</SitePageScroll>
	);
}
