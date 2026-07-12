/**
 * Security utility – input sanitisation helpers.
 *
 * These functions use strict whitelisting to prevent XSS and injection attacks.
 * They should be called on ALL user-supplied strings before:
 *   - Rendering into the DOM
 *   - Passing to calculation logic
 *   - Including in analytics payloads
 */

/**
 * Sanitise a numeric input field.
 * Allows: digits (0-9), a single decimal point, a leading minus sign, and spaces.
 * Strips: any other character that could be used for script injection.
 */
export function sanitizeNumericInput(raw: string): string {
  if (typeof raw !== "string") return "";
  // Keep only numeric characters, decimal point, minus sign, and spaces
  return raw.replace(/[^0-9.\-\s]/g, "").trim();
}

/**
 * Sanitise a unit identifier (e.g. "kilogram", "meter", "celsius").
 * Allows: lowercase letters, digits, underscores, and hyphens.
 * Strips: any other character.
 */
export function sanitizeUnitId(raw: string): string {
  if (typeof raw !== "string") return "";
  return raw.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

/**
 * Sanitise a locale / language code (e.g. "en", "th", "zh").
 * Allows: 2–8 lowercase letters (BCP-47 primary subtag format).
 */
export function sanitizeLocale(raw: string): string {
  if (typeof raw !== "string") return "en";
  const match = raw.toLowerCase().match(/^[a-z]{2,8}$/);
  return match ? match[0] : "en";
}

/**
 * Escape HTML special characters before inserting arbitrary strings into the DOM.
 * Use this when you must insert a string into innerHTML or dangerouslySetInnerHTML.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate that a value is a finite, safe JavaScript number.
 * Returns the number or null when invalid.
 */
export function validateNumber(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n) || Number.isNaN(n)) return null;
  // Reject values outside JavaScript's safe integer range
  if (Math.abs(n) > Number.MAX_SAFE_INTEGER) return null;
  return n;
}
