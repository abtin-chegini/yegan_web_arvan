"use client";

import {useTranslations} from "next-intl";

import CardsSection from "@/components/portfolio_cards/Cards_section";
import CardsSectionMobile from "@/components/portfolio_cards/Cards_section_mobile";
import { SitePageScroll } from "@/components/site-page/site-page-scroll";
import { sections } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { useMobileViewport } from "@/lib/use-mobile-viewport";

const portfolioSection = sections.find((section) => section.id === "portfolio")!;

function PortfolioCardsSlide() {
	const t = useTranslations("Nav");
	const isMobile = useMobileViewport();
	const heading = (
		<header className={cn("text-center", isMobile && "portfolio-slide-mobile__title")}>
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
	);

	if (isMobile) {
		return (
			<div className="portfolio-slide-mobile relative z-10 flex h-full w-full min-h-0 flex-col items-center">
				{heading}
				<CardsSectionMobile />
			</div>
		);
	}

	return (
		<>
			{heading}
			<CardsSection />
		</>
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
			mainLayoutClassName="portfolio-layout"
		>
			<PortfolioCardsSlide />
		</SitePageScroll>
	);
}
