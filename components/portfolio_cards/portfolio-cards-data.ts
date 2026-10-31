export type PortfolioCardData = {
	frontImage: string;
	backImage: string;
	/** Landscape art used on the mobile stacked cards */
	mobileImage: string;
	title: string;
	description: string;
	descriptionFa?: string;
	href: string;
	lineColor: string;
};

export const PORTFOLIO_CARDS: PortfolioCardData[] = [
	{
		frontImage:
			"https://cdn.yeganehheshmat.com/portfolio/card_back_bilit4u.png",
		backImage:
			"https://cdn.yeganehheshmat.com/portfolio/card_front_bilit4u.png",
		mobileImage:
			"https://cdn.yeganehheshmat.com/portfolio/card_front_bilit4u_mobile.png",
		title: "Bilit4u",
		description:
			"Ticketing platform design and product experience for seamless event discovery.",
		descriptionFa:
			"طراحی پلتفرم فروش بلیت، تجربه کاربری محصول و توسعه فرانت‌اند برای کشف آسان رویدادها و خرید بی‌دردسر بلیت.",
		href: "/projects/bilit4u",
		lineColor: "#2D4D8B",
	},
	{
		frontImage:
			"https://cdn.yeganehheshmat.com/portfolio/card_back_tealnex.png",
		backImage:
			"https://cdn.yeganehheshmat.com/portfolio/card_front_tealnex.png",
		mobileImage:
			"https://cdn.yeganehheshmat.com/portfolio/card_front_tealnex_mobile.png",
		title: "Tealnex",
		description:
			"Brand and digital presence for a modern teal-forward product company.",
		descriptionFa:
			"طراحی رابط و تجربه کاربری و توسعه فرانت‌اند برای معرفی محصولات و خدمات دیجیتال Tealnex.",
		href: "/projects/tealnex",
		lineColor: "#FFC640",
	},
	{
		frontImage:
			"https://cdn.yeganehheshmat.com/portfolio/card_back_tealtile.png",
		backImage:
			"https://cdn.yeganehheshmat.com/portfolio/card_front_tealtile.png",
		mobileImage:
			"https://cdn.yeganehheshmat.com/portfolio/card_front_tealtile_mobile.png",
		title: "Tealtile",
		description:
			"Visual identity and interface system built around craft and material.",
		descriptionFa:
			"طراحی هویت برند، حضور دیجیتال و توسعه فرانت‌اند برای یک شرکت مدرن محصول‌محور با محوریت رنگ فیروزه‌ای.",
		href: "/projects/tealtile",
		lineColor: "#7EB8D4",
	},
];
