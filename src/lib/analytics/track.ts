/**
 * Analytics tracking utility.
 *
 * Events are only dispatched when the user has given explicit cookie/analytics consent.
 * This ensures GDPR / CCPA / PDPA compliance out of the box.
 */

/** Possible consent states stored in localStorage */
export type ConsentStatus = "accepted" | "declined" | "pending";

/**
 * Read the user's current analytics consent status from localStorage.
 * Returns "pending" when the value is unset or when running server-side.
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") return "pending";
  try {
    const stored = window.localStorage.getItem("cookie_consent");
    if (stored === "accepted") return "accepted";
    if (stored === "declined") return "declined";
  } catch {
    // localStorage may be blocked (e.g. private mode in Safari)
  }
  return "pending";
}

/**
 * Track an interaction event.
 *
 * - In development: always logs to the console (regardless of consent).
 * - In production: only fires the event when the user has accepted cookies.
 *
 * The event is dispatched as a native CustomEvent so any analytics adapter
 * (GTM, GA4, custom listener) can subscribe without tight coupling.
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  // Always log in development for easy debugging
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[Analytics] ${action} | category: ${category} | label: ${label ?? "–"} | value: ${value ?? "–"}`
    );
  }

  // Gate on consent in all environments
  if (typeof window === "undefined" || getConsentStatus() !== "accepted") {
    return;
  }

  try {
    const event = new CustomEvent("analytics-track", {
      detail: {
        action,
        category,
        label,
        value,
        timestamp: Date.now(),
      },
    });
    window.dispatchEvent(event);
  } catch {
    // Fail silently – analytics must never break the UI
  }
}

/**
 * Track a page-not-found (404) event.
 * Safe to call even before consent is set – will silently no-op.
 */
export function track404(path: string) {
  trackEvent("page_not_found", "error", path);
}

/**
 * Track the first successful unit conversion by a new visitor.
 */
export function trackFirstConversion(slug: string) {
  const key = "first_conversion_tracked";
  if (typeof window === "undefined") return;
  if (window.sessionStorage.getItem(key)) return; // only once per session
  window.sessionStorage.setItem(key, "1");
  trackEvent("conversion", "first", slug);
}
