// Shared client-side navigation state survives the locale layout remount.
let targetLocale: string | null = null;

export function getLocaleTransitionTarget() {
  return targetLocale;
}

export function setLocaleTransitionTarget(locale: string | null) {
  targetLocale = locale;
}
