// Animation variants for navbar components

export const menuSlide = {
	initial: { x: "calc(100% + 100px)" },
	enter: {
		x: "0",
		transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }
	},
	exit: {
		x: "calc(100% + 100px)",
		transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }
	}
};

export const slide = {
	initial: { x: -80 },
	enter: (i: number) => ({
		x: 0,
		transition: {
			duration: 0.8,
			ease: [0.76, 0, 0.24, 1] as const,
			delay: 0.05 * i
		}
	}),
	exit: (i: number) => ({
		x: -80,
		transition: {
			duration: 0.8,
			ease: [0.76, 0, 0.24, 1] as const,
			delay: 0.05 * i
		}
	})
};

export const scale = {
	open: {
		scale: 1,
		transition: { duration: 0.3 }
	},
	closed: {
		scale: 0,
		transition: { duration: 0.4 }
	}
};

export const navbarAnimations = {
	initial: {
		y: -50,
		x: "-50%",
		opacity: 0,
	},
	animate: {
		y: 0,
		x: "-50%",
		opacity: 1,
		transition: {
			type: "spring",
			damping: 10,
			stiffness: 100,
		},
	},
	exit: {
		y: -50,
		opacity: 0,
	},
};

export const hamburgerVariants = {
	open: {
		rotate: ["0deg", "0deg", "45deg"],
		top: ["35%", "50%", "50%"],
	},
	closed: {
		rotate: ["45deg", "0deg", "0deg"],
		top: ["50%", "50%", "35%"],
	},
};

export const hamburgerMiddleVariants = {
	open: {
		rotate: ["0deg", "0deg", "-45deg"],
	},
	closed: {
		rotate: ["-45deg", "0deg", "0deg"],
	},
};

export const hamburgerBottomVariants = {
	open: {
		rotate: ["0deg", "0deg", "45deg"],
		left: "50%",
		bottom: ["35%", "50%", "50%"],
	},
	closed: {
		rotate: ["45deg", "0deg", "0deg"],
		left: "calc(40% + 10px)",
		bottom: ["50%", "50%", "35%"],
	},
};
