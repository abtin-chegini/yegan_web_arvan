"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";

/** Path A — cream-shaped stroke */
const PATH_A = {
	viewBox: "0 0 1000 944",
	d: "M393.1 859.5C364.4 853.2 329.8 832.8 281.0 793.4C247.3 766.1 243.1 760.9 243.1 745.5C243.0 728.9 256.4 715.9 273.7 715.9C284.3 715.9 289.4 718.3 306.5 731.7C351.7 766.9 388.2 792.1 390.7 789.7C392.0 788.3 357.1 759.7 318.0 730.2C254.5 682.2 218.9 653.2 192.2 627.6C185.8 621.4 179.7 615.7 178.8 614.9C166.7 605.0 131.4 562.9 118.6 543.2C81.1 485.9 76.2 437.9 103.8 397.0C142.8 339.0 211.1 342.6 288.5 406.9C319.9 433.0 357.4 474.5 422.5 555.5C518.0 674.2 566.9 718.3 611.5 725.9C633.0 729.6 655.3 718.4 664.7 699.3C668.0 692.5 669.1 679.0 667.0 671.2C659.3 642.7 611.8 596.9 524.5 533.9C519.5 530.3 508.8 522.5 500.5 516.5C486.7 506.5 472.9 496.7 460.6 488.0C398.0 444.1 345.5 398.4 317.4 363.5C272.0 306.9 264.3 252.2 295.3 206.5C323.3 165.3 373.7 150.2 425.7 167.5C444.6 173.8 472.4 190.0 491.5 206.0C527.8 236.3 559.3 272.7 612.0 345.5C670.9 426.7 696.9 459.8 727.9 492.9C766.7 534.5 796.3 549.1 822.0 539.7C849.1 529.8 860.0 498.1 846.1 470.0C833.9 445.4 801.9 412.2 744.9 364.9C643.6 280.9 613.8 254.1 591.3 226.9C566.4 196.8 554.7 166.7 559.0 143.4C566.5 102.3 606.6 75.0 653.6 79.1C694.0 82.6 743.8 109.1 754.8 133.0C764.1 153.0 749.4 177.2 727.0 178.8C716.8 179.5 711.3 177.4 697.4 167.5C662.1 142.3 633.9 137.5 627.9 155.7C622.1 173.4 650.6 202.7 753.5 284.9C773.9 301.1 796.8 319.7 804.6 326.1C880.1 388.7 912.0 430.1 919.6 475.2C928.9 531.0 890.5 588.8 833.4 604.7C820.9 608.2 795.8 608.7 783.0 605.7C727.8 592.7 677.3 543.5 584.0 412.0C547.7 360.8 538.3 347.8 525.2 331.0C470.6 261.1 428.9 226.6 393.4 222.0C358.4 217.5 332.4 248.3 342.0 282.8C347.3 301.9 362.0 323.0 387.6 348.2C417.1 377.2 441.7 396.2 524.5 453.5C542.6 466.1 561.8 479.5 567.0 483.3C572.2 487.2 578.5 491.8 581.0 493.6C676.6 563.1 722.0 614.5 732.5 664.8C743.3 716.7 705.8 770.4 648.1 785.8C629.9 790.6 603.0 789.4 582.0 782.8C530.6 766.7 479.0 720.5 393.5 614.0C373.1 588.6 356.0 567.4 340.6 548.5C268.6 460.0 220.4 420.5 184.5 420.5C168.5 420.5 158.7 426.8 151.9 441.2C138.9 469.3 160.9 511.7 216.6 566.0C236.7 585.6 249.8 596.9 289.5 628.8C292.8 631.5 316.8 649.8 342.9 669.4C417.4 725.7 437.6 743.0 453.8 764.5C476.3 794.7 476.1 823.5 453.2 845.2C438.6 858.9 415.7 864.4 393.1 859.5Z",
} as const;

/** Path B — secondary stroke */
const PATH_B = {
	viewBox: "0 0 883 1000",
	d: "M277.0 982.9C227.0 977.7 184.0 943.5 168.2 896.5C153.7 853.0 166.6 811.7 208.0 769.9C246.6 730.8 305.5 698.5 405.5 661.3C427.8 653.0 430.2 652.2 501.0 627.7C609.2 590.2 643.6 576.7 690.5 553.0C760.5 517.8 793.3 483.8 793.3 446.5C793.3 422.1 779.6 400.7 759.0 392.9C729.4 381.7 678.5 400.3 591.0 454.3C563.3 471.4 503.9 510.9 452.2 546.7C332.2 629.8 254.7 668.8 188.0 679.7C171.8 682.3 139.7 682.1 126.5 679.2C73.7 667.7 33.7 627.2 22.3 573.7C19.9 562.5 19.9 534.7 22.3 524.0C33.9 472.8 70.2 429.9 131.8 394.6C179.2 367.4 235.1 346.0 329.0 319.2C411.8 295.5 451.1 283.7 485.0 272.3C597.0 234.8 644.5 205.6 655.5 167.7C657.4 161.1 657.7 146.9 656.0 139.5C653.5 128.2 643.9 114.0 634.2 107.2C596.8 81.1 547.8 95.0 425.0 166.3C416.5 171.3 406.6 176.9 403.0 179.0C399.4 181.0 391.6 185.6 385.5 189.1C379.4 192.7 368.0 199.4 360.0 204.0C352.0 208.6 339.6 215.8 332.5 220.0C325.4 224.2 314.3 230.5 308.0 234.0C301.7 237.5 293.6 242.1 290.0 244.2C277.7 251.5 226.5 276.6 211.5 282.7C141.7 310.9 94.4 308.9 64.0 276.3C30.3 240.2 27.2 187.4 56.1 139.2C80.1 99.1 124.4 62.5 153.6 58.6C178.4 55.2 201.6 80.6 197.1 106.1C194.7 120.0 188.4 128.2 171.0 140.0C137.1 162.9 120.0 183.2 120.0 200.4C120.0 217.3 132.8 223.7 155.2 218.0C185.9 210.1 230.2 186.5 337.5 120.8C376.4 96.9 394.4 86.2 416.8 73.3C519.1 14.6 585.0 -2.3 640.5 16.1C712.8 40.0 755.5 124.5 731.8 197.0C717.3 241.5 675.3 279.9 608.4 309.5C573.8 324.9 522.4 343.3 477.5 356.5C472.6 358.0 463.3 360.7 456.9 362.5C443.8 366.4 420.5 372.9 383.2 383.1C325.3 398.9 307.6 404.2 273.0 415.7C232.0 429.3 206.3 440.0 178.5 454.8C128.0 481.7 102.2 508.9 97.9 539.6C94.3 565.7 110.6 591.1 137.3 600.8C147.5 604.5 174.2 604.7 189.0 601.1C230.0 591.4 276.5 568.2 342.5 524.5C365.0 509.6 377.9 500.7 417.8 472.6C474.3 432.8 517.9 403.0 538.0 390.4C613.6 343.2 663.2 320.8 711.5 311.8C727.6 308.8 757.0 308.6 770.5 311.3C842.7 325.9 887.5 408.6 865.4 486.0C862.1 497.3 850.6 520.2 842.3 532.0C833.9 543.9 811.8 566.1 798.5 576.1C745.4 616.1 685.0 643.2 539.0 692.5C435.8 727.4 393.5 743.2 352.0 762.5C337.4 769.2 332.2 772.0 315.3 781.7C261.3 812.6 236.9 845.0 245.9 873.9C261.6 924.4 337.3 919.9 449.0 861.7C474.6 848.4 494.6 837.0 531.3 814.6C547.2 804.9 582.5 782.2 615.5 760.5C719.3 692.2 758.8 673.0 796.3 673.0C834.8 673.0 863.0 701.9 863.0 741.5C863.0 775.4 840.2 809.7 794.1 844.9C758.1 872.4 692.3 912.8 675.5 917.6C648.2 925.4 622.1 900.7 628.4 873.0C632.0 857.1 637.4 851.5 668.0 832.5C696.9 814.6 726.3 795.1 741.5 783.7C754.7 773.8 767.3 763.0 766.6 762.3C764.9 760.6 720.2 786.7 676.5 815.0C666.0 821.7 651.9 830.9 645.0 835.3C638.1 839.7 630.1 844.8 627.2 846.6C555.2 892.9 490.2 929.0 447.5 946.5C442.6 948.5 434.7 951.8 430.0 953.7C374.9 976.4 318.6 987.2 277.0 982.9Z",
} as const;

const DEFAULT_CREAM = "#F8F4EE";
const DEFAULT_ACCENT = "#2D4D8B";
const DEFAULT_LINE = "#FFC640";
const STROKE_DURATION = 0.5;

export type StrokeHoverCardProps = {
	title: string;
	description: string;
	image: string;
	/** Primary stroke color (path A). Default: #2D4D8B */
	accent?: string;
	/** Secondary stroke color (path B). Default: #F8F4EE */
	cream?: string;
	/** Top accent line + link underline. Default: #FFC640 */
	lineColor?: string;
	href?: string;
	linkLabel?: string;
	className?: string;
	id?: string;
	/**
	 * Touch-friendly reveal: first tap plays the stroke → content animation
	 * and sets data-revealed="true" (second tap can navigate).
	 */
	tapToReveal?: boolean;
};

function StrokeOverlay({
	className,
	viewBox,
	path,
	stroke,
}: {
	className: string;
	viewBox: string;
	path: string;
	stroke: string;
}) {
	return (
		<div className={className}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox={viewBox}
				preserveAspectRatio="none"
				aria-hidden
			>
				<path
					fillRule="evenodd"
					d={path}
					fill="none"
					stroke={stroke}
					strokeWidth={200}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
}

/**
 * Stroke-hover card. Styles live in app/globals.css (.stroke-hover-card*).
 * Peer dep: gsap
 */
export default function StrokeHoverCard({
	title,
	description,
	image,
	accent = DEFAULT_ACCENT,
	cream = DEFAULT_CREAM,
	lineColor = DEFAULT_LINE,
	href = "#",
	linkLabel = "View Case Study",
	className = "",
	id,
	tapToReveal = false,
}: StrokeHoverCardProps) {
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;

		const cardPaths = root.querySelectorAll<SVGPathElement>(
			".stroke-hover-card__stroke path"
		);
		const strokeLayers = root.querySelectorAll<HTMLElement>(
			".stroke-hover-card__stroke"
		);
		const imageEl = root.querySelector<HTMLElement>(".stroke-hover-card__bg");
		const panel = root.querySelector<HTMLElement>(".stroke-hover-card__panel");
		const content = root.querySelector<HTMLElement>(
			".stroke-hover-card__content"
		);
		if (!imageEl || !panel || !content) return;

		cardPaths.forEach((path) => {
			const length = path.getTotalLength();
			path.style.strokeDasharray = `${length}`;
			path.style.strokeDashoffset = `${length}`;
		});

		gsap.set(panel, { opacity: 0 });
		gsap.set(content, { opacity: 0, y: 14 });
		gsap.set(imageEl, { opacity: 1 });
		gsap.set(strokeLayers, { opacity: 1 });
		root.dataset.revealed = "false";
		panel.setAttribute("aria-hidden", "true");

		let tl: gsap.core.Timeline | undefined;
		let revealed = false;

		const onEnter = () => {
			if (tl) tl.kill();
			tl = gsap.timeline();

			cardPaths.forEach((path) => {
				tl!.to(
					path,
					{
						strokeDashoffset: 0,
						attr: { "stroke-width": 700 },
						duration: STROKE_DURATION,
						ease: "power2.out",
					},
					0
				);
			});

			tl.set(imageEl, { opacity: 0 }, STROKE_DURATION);
			tl.set(strokeLayers, { opacity: 0 }, STROKE_DURATION);
			tl.set(panel, { opacity: 1 }, STROKE_DURATION);
			tl.set(content, { opacity: 1, y: 0 }, STROKE_DURATION);
			tl.call(() => {
				revealed = true;
				root.dataset.revealed = "true";
				panel.setAttribute("aria-hidden", "false");
			});
		};

		const onLeave = () => {
			if (tl) tl.kill();
			tl = gsap.timeline();
			revealed = false;
			root.dataset.revealed = "false";
			panel.setAttribute("aria-hidden", "true");

			tl.to(content, {
				opacity: 0,
				y: 10,
				duration: 0.25,
				ease: "power2.in",
			});

			tl.to(
				panel,
				{ opacity: 0, duration: 0.35, ease: "power2.inOut" },
				"+=0.02"
			);
			tl.to(imageEl, { opacity: 1, duration: 0.35, ease: "power2.inOut" }, "<");
			tl.to(
				strokeLayers,
				{ opacity: 1, duration: 0.35, ease: "power2.inOut" },
				"<"
			);

			cardPaths.forEach((path) => {
				const length = path.getTotalLength();
				tl!.to(
					path,
					{
						strokeDashoffset: length,
						attr: { "stroke-width": 200 },
						duration: 0.8,
						ease: "power2.out",
					},
					"<"
				);
			});
		};

		const onTap = (event: Event) => {
			if (!tapToReveal || revealed) return;
			if ((event.target as Element | null)?.closest?.("[data-stroke-close]")) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			onEnter();
		};

		const onClose = (event: Event) => {
			event.preventDefault();
			event.stopPropagation();
			if (!revealed) return;
			onLeave();
		};

		const closeBtn = root.querySelector<HTMLElement>(
			"[data-stroke-close]"
		);

		if (tapToReveal) {
			// Touch: tap reveals and stays (mouseleave would instantly undo on mobile)
			root.addEventListener("pointerup", onTap);
			closeBtn?.addEventListener("click", onClose);
			closeBtn?.addEventListener("pointerup", onClose);
		} else {
			root.addEventListener("mouseenter", onEnter);
			root.addEventListener("mouseleave", onLeave);
		}

		return () => {
			root.removeEventListener("mouseenter", onEnter);
			root.removeEventListener("mouseleave", onLeave);
			root.removeEventListener("pointerup", onTap);
			closeBtn?.removeEventListener("click", onClose);
			closeBtn?.removeEventListener("pointerup", onClose);
			tl?.kill();
		};
	}, [tapToReveal]);

	return (
		<div
			ref={rootRef}
			id={id}
			className={`stroke-hover-card${className ? ` ${className}` : ""}${
				tapToReveal ? " stroke-hover-card--tap" : ""
			}`}
			style={
				{
					"--stroke-accent": accent,
					"--stroke-cream": cream,
					"--stroke-line": lineColor,
				} as CSSProperties
			}
		>
			<img
				className="stroke-hover-card__bg"
				src={image}
				alt=""
				draggable={false}
			/>
			<StrokeOverlay
				className="stroke-hover-card__stroke stroke-hover-card__stroke--base"
				viewBox={PATH_A.viewBox}
				path={PATH_A.d}
				stroke={accent}
			/>
			<StrokeOverlay
				className="stroke-hover-card__stroke stroke-hover-card__stroke--accent"
				viewBox={PATH_B.viewBox}
				path={PATH_B.d}
				stroke={cream}
			/>
			<div className="stroke-hover-card__panel" aria-hidden>
				{tapToReveal ? (
					<button
						type="button"
						className="stroke-hover-card__close"
						data-stroke-close
						aria-label="Close card details"
					>
						<span aria-hidden>×</span>
					</button>
				) : null}
				<div className="stroke-hover-card__content">
					<span className="stroke-hover-card__line" />
					<h3 className="stroke-hover-card__title">{title}</h3>
					<p className="stroke-hover-card__desc">{description}</p>
					<span className="stroke-hover-card__link">
						<span className="stroke-hover-card__link-text">{linkLabel}</span>
						<span className="stroke-hover-card__link-arrow" aria-hidden>
							→
						</span>
					</span>
				</div>
			</div>
		</div>
	);
}
