"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

import styles from "./mobile-bottom-navigation.module.css";

const items = [
  { key: "home", href: "/", icon: "home_icon.png" },
  { key: "projects", href: "/projects", icon: "project_icon.png" },
  { key: "about", href: "/about", icon: "about_icon.png" },
  { key: "contact", href: "/contact", icon: "contact_icon.png" },
] as const;

export function MobileBottomNavigation() {
  const t = useTranslations("MobileNavigation");
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const active = items.find(({ key, href }) =>
    key === "home"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`) ||
        (key === "projects" && pathname === "/portfolio"),
  )?.key;

  return (
    <nav className={styles.navigation} aria-label={t("label")}>
      <ul className={styles.items}>
        {items.map(({ key, href, icon }) => (
          <li key={key}>
            <Link
              href={href}
              className={styles.link}
              aria-current={active === key ? "page" : undefined}
            >
              <span className={styles.pill}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://cdn.yeganehheshmat.com/icons/navicons/${icon}`}
                  alt=""
                  width={32}
                  height={32}
                  className={styles.icon}
                  decoding="async"
                />
                <span>{t(key)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
