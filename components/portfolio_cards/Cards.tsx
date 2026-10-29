"use client";

import { forwardRef, type CSSProperties, type KeyboardEvent } from "react";
import { useRouter } from "@/i18n/navigation";

import StrokeHoverCard from "@/components/stroke_hover/stroke_hover";

export type CardProps = {
	id: string;
	/** Shown before flip (card back art) */
	frontImage: string;
	/** Shown after flip — stroke-hover face */
	backImage: string;
	title: string;
	description: string;
	href: string;
	linkLabel?: string;
	accent?: string;
	cream?: string;
	lineColor?: string;
};

const faceStyle = (image: string): CSSProperties => ({
	backgroundImage: `url(${image})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
});

const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{
			id,
			frontImage,
			backImage,
			title,
			description,
			href,
			linkLabel,
			accent,
			cream,
			lineColor,
		},
		ref
	) => {
		const router = useRouter();

		const goToProject = () => {
			router.push(href);
		};

		const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				goToProject();
			}
		};

		return (
			<div
				className="portfolio-card"
				id={id}
				ref={ref}
				role="link"
				tabIndex={0}
				aria-label={`${title} — open project`}
				onClick={goToProject}
				onKeyDown={onKeyDown}
			>
				<div className="portfolio-card-wrapper">
					<div className="flip-card-inner">
						<div
							className="flip-card-front"
							style={faceStyle(frontImage)}
						/>

						<div className="flip-card-back">
							<StrokeHoverCard
								title={title}
								description={description}
								image={backImage}
								href={href}
								linkLabel={linkLabel}
								accent={accent}
								cream={cream}
								lineColor={lineColor}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

Card.displayName = "Card";

export default Card;
