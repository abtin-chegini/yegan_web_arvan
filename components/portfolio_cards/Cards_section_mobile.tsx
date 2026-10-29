"use client";

import { useRouter } from "@/i18n/navigation";

import { PORTFOLIO_CARDS } from "@/components/portfolio_cards/portfolio-cards-data";
import StrokeHoverCard from "@/components/stroke_hover/stroke_hover";

export default function CardsSectionMobile() {
	const router = useRouter();

	return (
		<div className="portfolio-cards-mobile" data-no-section-swipe>
			{PORTFOLIO_CARDS.map((card) => (
				<div
					key={card.href}
					className="portfolio-cards-mobile__item"
					role="link"
					tabIndex={0}
					aria-label={`${card.title} — open project`}
					onClick={(event) => {
						if (
							(event.target as Element | null)?.closest?.(
								"[data-stroke-close]"
							)
						) {
							return;
						}
						const root = (event.currentTarget as HTMLElement).querySelector(
							".stroke-hover-card"
						) as HTMLElement | null;
						if (root?.dataset.revealed === "true") {
							router.push(card.href);
						}
					}}
					onKeyDown={(event) => {
						if (event.key !== "Enter" && event.key !== " ") return;
						event.preventDefault();
						const root = event.currentTarget.querySelector(
							".stroke-hover-card"
						) as HTMLElement | null;
						if (root?.dataset.revealed === "true") {
							router.push(card.href);
						} else {
							root?.dispatchEvent(new Event("pointerup", { bubbles: true }));
						}
					}}
				>
					<StrokeHoverCard
						title={card.title}
						description={card.description}
						image={card.mobileImage}
						href={card.href}
						lineColor={card.lineColor}
						tapToReveal
					/>
				</div>
			))}
		</div>
	);
}
