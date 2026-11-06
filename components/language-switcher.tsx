"use client";

import {useLocale, useTranslations} from 'next-intl';
import {useId} from 'react';
import {Link, usePathname, useRouter} from '@/i18n/navigation';
import styles from './menu-button.module.css';

export function LanguageSwitcher({desktop = false}: {desktop?: boolean}) {
  const t = useTranslations("Tooltips");
  const tooltipId = useId();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const target = locale === 'en' ? 'fa' : 'en';

  const tooltip = t(target === 'fa' ? 'persian' : 'english');

  if (!desktop) {
    return (
      <span className={`${styles.languageControl} ${styles.languageDropdown}`}>
        <select
          aria-label={t("language")}
          value={locale}
          dir="ltr"
          className={`${styles.button} ${styles.languageSelect}`}
          onChange={(event) => {
            const nextLocale = event.target.value;
            if (nextLocale !== 'en' && nextLocale !== 'fa') return;
            if (nextLocale === locale) return;
            const suffix = window.location.search + window.location.hash;
            router.replace(pathname + suffix, {locale: nextLocale});
          }}
        >
          <option value="fa" lang="fa">FA</option>
          <option value="en" lang="en">EN</option>
        </select>
      </span>
    );
  }

  return (
    <span className={styles.languageControl}>
    <Link
      href={pathname}
      locale={target}
      hrefLang={target}
      lang={target}
      aria-describedby={tooltipId}
      aria-label={target === 'fa' ? 'تغییر زبان به فارسی' : 'Switch to English'}
      className={`${styles.button} ${styles.languageButton}${desktop ? '' : ` ${styles.languageButtonMobile}`}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={target === 'fa' ? '/farsi_icon.png' : '/EN_icon.png'} alt="" width={26} height={26} className={styles.languageIcon} />
    </Link>
    <span id={tooltipId} role="tooltip" lang={target} dir={target === "fa" ? "rtl" : "ltr"} className={styles.languageTooltip}>{tooltip}</span>
    </span>
  );
}
