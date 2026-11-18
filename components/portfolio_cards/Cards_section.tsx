"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Card from "@/components/portfolio_cards/Cards";
import { PORTFOLIO_CARDS } from "@/components/portfolio_cards/portfolio-cards-data";

const ROTATIONS = [-12, 0, 12];

export default function CardsSection() {
	const locale = useLocale();
	const t = useTranslations("SelectedWork");
	const container = useRef<HTMLDivElement>(null);
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	useGSAP(
		(context) => {
			const section = container.current;
			const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
			if (!section || !cards.length) return;
			let hasAnimated = false;

			// Grid owns the final positions; transforms only animate the opening stack.
			const centerStack = () => {
				gsap.set(cards, {
					x: (_index, card: HTMLDivElement) =>
						section.clientWidth / 2 - card.offsetLeft - card.offsetWidth / 2,
					rotate: 0,
				});
			};
			centerStack();

			cards.forEach((card) => {
				gsap.set(card.querySelector(".flip-card-front"), { rotateY: 0 });
				gsap.set(card.querySelector(".flip-card-back"), { rotateY: 180 });
			});

			const observer = new IntersectionObserver(
				([entry]) => {
					if (!entry.isIntersecting || hasAnimated) return;
					hasAnimated = true;

					context.add(() => {
						const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });
						cards.forEach((card, index) => {
							tl.to(card, { x: 0, rotate: ROTATIONS[index] }, 0);
							tl.to(card.querySelector(".flip-card-front"), { rotateY: -180 }, 0);
							tl.to(card.querySelector(".flip-card-back"), { rotateY: 0 }, 0);
						});
					});
					observer.disconnect();
				},
				{ threshold: 0.35 }
			);
			observer.observe(section);

			const resizeObserver = new ResizeObserver(() => {
				if (!hasAnimated) context.add(centerStack);
			});
			resizeObserver.observe(section);

			return () => {
				observer.disconnect();
				resizeObserver.disconnect();
			};
		},
		{ scope: container }
	);

	return (
		<div className="portfolio-cards" ref={container} role="group" aria-label="Project cards">
			{PORTFOLIO_CARDS.map((card, index) => (
				<Card
					key={card.href}
					id={`card-${index + 1}`}
					dir={locale === "fa" ? "rtl" : "ltr"}
					frontImage={card.frontImage}
					backImage={card.backImage}
					title={card.title}
					description={locale === "fa" ? card.descriptionFa ?? card.description : card.description}
					linkLabel={t("viewCaseStudy")}
					href={card.href}
					lineColor={card.lineColor}
					ref={(el) => {
						cardRefs.current[index] = el;
					}}
				/>
			))}
		</div>
	);
}
