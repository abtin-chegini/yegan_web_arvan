export type PortfolioCardData = {
	frontImage: string;
	backImage: string;
	/** Landscape art used on the mobile stacked cards */
	mobileImage: string;
	title: string;
	description: string;
	href: string;
	lineColor: string;
};

export const PORTFOLIO_CARDS: PortfolioCardData[] = [
	{
		frontImage:
			"https://ik.imagekit.io/s7yz964lq/assets/Portfolio/card_back_bilit4u.png",
		backImage:
			"https://ik.imagekit.io/s7yz964lq/assets/Portfolio/card_front_bilit4u.png",
		mobileImage:
			"https://ik.imagekit.io/s7yz964lq/assets/Portfolio/card_front_bilit4u_mobile.png",
		title: "Bilit4u",
		description:
			"Ticketing platform design and product experience for seamless event discovery.",
		href: "/projects/bilit4u",
		lineColor: "#2D4D8B",
	},
	{
		frontImage:
			"https://ik.imagekit.io/s7yz964lq/assets/Portfolio/card_back_tealnex.png",
		backImage:
			"https://ik.imagekit.io/s7yz964lq/assets/Portfolio/card_front_tealnex.png",
		mobileImage:
			"https://ik.imagekit.io/s7yz964lq/assets/Portfolio/card_front_tealnex_mobile.png",
		title: "Tealnex",
		description:
			"Brand and digital presence for a modern teal-forward product company.",
		href: "/projects/tealnex",
		lineColor: "#FFC640",
	},
	{
		frontImage:
			"https://ik.imagekit.io/s7yz964lq/assets/Portfolio/card_back_tealtile.png",
		backImage:
			"https://ik.imagekit.io/s7yz964lq/assets/Portfolio/card_front_tealtile.png",
		mobileImage:
			"https://ik.imagekit.io/s7yz964lq/assets/Portfolio/card_front_tealtile_mobile.png",
		title: "Tealtile",
		description:
			"Visual identity and interface system built around craft and material.",
		href: "/projects/tealtile",
		lineColor: "#7EB8D4",
	},
];
