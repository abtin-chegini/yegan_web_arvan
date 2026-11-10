"use client";

import {useLocale, useTranslations} from 'next-intl';
import {useCallback, useId} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';
import {AnimatedThemeToggler} from '@/components/ui/animated-theme-toggler';
import {setLocaleTransitionTarget} from '@/lib/locale-transition';
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox';
import styles from './menu-button.module.css';

export function LanguageSwitcher({desktop = false}: {desktop?: boolean}) {
  const t = useTranslations("Tooltips");
  const languageNames = useTranslations("MobileLanguageSwitcher");
  const tooltipId = useId();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const target = locale === 'en' ? 'fa' : 'en';

  const tooltip = t(target === 'fa' ? 'persian' : 'english');

  const changeDesktopLanguage = useCallback(async () => {
    const suffix = window.location.search + window.location.hash;
    setLocaleTransitionTarget(target);
    try {
      await new Promise<void>((resolve) => {
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          observer.disconnect();
          window.clearTimeout(timeout);
          resolve();
        };
        const observer = new MutationObserver(() => {
          if (document.documentElement.lang === target) finish();
        });
        observer.observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
        // Release the snapshot even if a route fails or takes unusually long.
        const timeout = window.setTimeout(finish, 5000);
        router.push(pathname + suffix, {locale: target, scroll: false});
      });
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => window.setTimeout(resolve, 750)),
      ]);
    } finally {
      setLocaleTransitionTarget(null);
    }
  }, [pathname, router, target]);

  if (!desktop) {
    return (
      <span className={styles.languageControl}>
        <Combobox
          items={['fa', 'en']}
          value={locale}
          itemToStringLabel={(value) => languageNames(value === 'fa' ? 'persian' : 'english')}
          onValueChange={(nextLocale) => {
            if (nextLocale !== 'en' && nextLocale !== 'fa') return;
            if (nextLocale === locale) return;
            const suffix = window.location.search + window.location.hash;
            router.replace(pathname + suffix, {locale: nextLocale});
          }}
        >
          <ComboboxTrigger
            aria-label={`${t("language")}: ${languageNames(locale === 'fa' ? 'persian' : 'english')}`}
            dir="ltr"
            className={`${styles.button} ${styles.languageSelect}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={locale === 'fa' ? '/farsi_icon.png' : '/EN_icon.png'}
              alt=""
              width={26}
              height={26}
              className={styles.languageIcon}
            />
          </ComboboxTrigger>
          <ComboboxContent
            side="bottom"
            align="end"
            collisionAvoidance={{side: 'none', align: 'shift', fallbackAxisSide: 'none'}}
            positionerClassName="z-[110]"
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
            lang={locale}
            className="min-w-32 border border-[#ebe1d6] bg-[#fcf6ef] text-[#233f63] motion-reduce:animate-none"
          >
            <ComboboxList>
              <ComboboxItem value="en" className="min-h-11">{languageNames('english')}</ComboboxItem>
              <ComboboxItem value="fa" className="min-h-11">{languageNames('persian')}</ComboboxItem>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </span>
    );
  }

  return (
    <span className={styles.languageControl}>
    <AnimatedThemeToggler
      duration={650}
      onToggleAction={changeDesktopLanguage}
      onMouseEnter={() => router.prefetch(pathname, {locale: target})}
      onFocus={() => router.prefetch(pathname, {locale: target})}
      lang={target}
      aria-describedby={tooltipId}
      aria-label={target === 'fa' ? 'تغییر زبان به فارسی' : 'Switch to English'}
      className={`${styles.button} ${styles.languageButton}${desktop ? '' : ` ${styles.languageButtonMobile}`}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={target === 'fa' ? '/farsi_icon.png' : '/EN_icon.png'} alt="" width={26} height={26} className={styles.languageIcon} />
    </AnimatedThemeToggler>
    <span id={tooltipId} role="tooltip" lang={target} dir={target === "fa" ? "rtl" : "ltr"} className={styles.languageTooltip}>{tooltip}</span>
    </span>
  );
}
