"use client";

import {useTranslations} from "next-intl";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import styles from "./menu-button.module.css";

type MenuButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  expanded: boolean;
  controls: string;
};

export function MenuIcon({ expanded }: { expanded: boolean }) {
  return (
    <span className={styles.icon} data-expanded={expanded} aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  function MenuButton({ expanded, controls, className = "", ...props }, ref) {
    const t = useTranslations("Nav");
    return (
      <button
        {...props}
        ref={ref}
        type="button"
        className={`${styles.button} ${className}`}
        aria-label={expanded ? t("close") : t("open")}
        aria-expanded={expanded}
        aria-controls={controls}
      >
        <span className={styles.label}>{t("menu")}</span>
        <span className={styles.dot} aria-hidden="true" />
        <MenuIcon expanded={expanded} />
      </button>
    );
  },
);
