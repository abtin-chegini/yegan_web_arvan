import React from "react";
import { motion } from "motion/react";

interface CurveProps {
  color?: string;
  className?: string;
  side?: "left" | "right";
}

export const Curve = ({
  color = "rgb(185, 225, 237)",
  className = "",
  side = "left",
}: CurveProps) => {
  const height = typeof window !== "undefined" ? window.innerHeight : 1000;

  const initialPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q-100 ${height / 2} 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q100 ${height / 2} 100 0`;

  const curve = {
    initial: {
      d: initialPath,
    },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  const sideClass =
    side === "right" ? "right-[-99px] scale-x-[-1]" : "left-[-99px]";

  return (
    <svg
      className={`absolute top-0 ${sideClass} h-full w-[100px] stroke-none ${className}`}
      style={{ fill: color }}
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
};
