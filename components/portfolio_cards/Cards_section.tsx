"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Card from "@/components/portfolio_cards/Cards";
import { PORTFOLIO_CARDS } from "@/components/portfolio_cards/portfolio-cards-data";

const POSITIONS = [20, 50, 80];
const ROTATIONS = [-12, 0, 12];

export default function CardsSection() {
	const locale = useLocale();
	const t = useTranslations("SelectedWork");
	const container = useRef<HTMLDivElement>(null);
	const cardsSectionRef = useRef<HTMLElement>(null);
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
	const hasAnimated = useRef(false);

	useGSAP(
		() => {
			const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
			if (!cards.length) return;

			cards.forEach((card) => {
				gsap.set(card, {
					left: "50%",
					xPercent: -50,
					yPercent: -50,
					rotate: 0,
				});

				const frontEl = card.querySelector(".flip-card-front");
				const backEl = card.querySelector(".flip-card-back");
				gsap.set(frontEl, { rotateY: 0 });
				gsap.set(backEl, { rotateY: 180 });
			});
		},
		{ scope: container }
	);

	useEffect(() => {
		const section = cardsSectionRef.current;
		if (!section) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting || hasAnimated.current) return;
				hasAnimated.current = true;

				const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
				const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

				cards.forEach((card, index) => {
					const frontEl = card.querySelector(".flip-card-front");
					const backEl = card.querySelector(".flip-card-back");

					tl.to(
						card,
						{
							left: `${POSITIONS[index]}%`,
							rotate: ROTATIONS[index],
							duration: 1,
						},
						0
					);

					tl.to(
						frontEl,
						{
							rotateY: -180,
							duration: 1,
						},
						0
					);

					tl.to(
						backEl,
						{
							rotateY: 0,
							duration: 1,
						},
						0
					);
				});

				observer.disconnect();
			},
			{ threshold: 0.35 }
		);

		observer.observe(section);

		return () => observer.disconnect();
	}, []);

	return (
		<div className="portfolio-cards" ref={container}>
			<section className="cards" ref={cardsSectionRef} aria-label="Project cards">
				{PORTFOLIO_CARDS.map((card, index) => (
					<Card
						key={card.href}
						id={`card-${index + 1}`}
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
			</section>
		</div>
	);
}
