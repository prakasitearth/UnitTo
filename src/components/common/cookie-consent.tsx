"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/use-locale";

type ConsentStatus = "accepted" | "declined" | "pending";

const STORAGE_KEY = "cookie_consent";

/**
 * GDPR / CCPA / PDPA compliant Cookie Consent Banner.
 *
 * - Appears only on first visit (when no consent decision is stored).
 * - Accept  → saves "accepted" to localStorage and enables analytics.
 * - Decline → saves "declined" to localStorage and blocks analytics.
 * - Links to the Privacy Policy page.
 */
export const CookieConsent: React.FC = () => {
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [visible, setVisible] = useState(false);
  const { locale } = useLocale();

  // Read stored consent on mount (client-side only)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentStatus | null;
      if (stored === "accepted" || stored === "declined") {
        setStatus(stored);
        setVisible(false);
      } else {
        // No decision yet — show the banner after a short delay
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable (e.g. private mode) — do not show banner
    }
  }, []);

  const handleAccept = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch { /* ignore */ }
    setStatus("accepted");
    setVisible(false);

    // Fire a synthetic event so analytics adapters (GTM, GA4 etc.) can
    // initialise without the page needing to reload.
    window.dispatchEvent(new CustomEvent("cookie-consent-accepted"));
  }, []);

  const handleDecline = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "declined");
    } catch { /* ignore */ }
    setStatus("declined");
    setVisible(false);
  }, []);

  if (!visible || status !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[200] pb-safe animate-slideUp"
    >
      {/* Outer wrapper – add extra padding on mobile to clear BottomNav (h-16) */}
      <div className="m-3 mb-[4.5rem] lg:mb-3 lg:max-w-2xl lg:mx-auto">
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">

          {/* Icon */}
          <div className="flex-shrink-0 text-2xl select-none" aria-hidden="true">🍪</div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {locale === "th"
                ? "เราใช้คุกกี้เพื่อพัฒนาประสบการณ์และวิเคราะห์การใช้งาน โดยการยอมรับ คุณอนุญาตให้เราเก็บสถิติการใช้งานโดยไม่มีการส่งข้อมูลส่วนตัวไปยังเซิร์ฟเวอร์ใด ๆ"
                : "We use cookies to improve your experience and analyse usage. By accepting, you allow anonymous usage statistics — no personal data is sent to any server."}
              {" "}
              <Link
                href={`/${locale}/privacy`}
                className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {locale === "th" ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy"}
              </Link>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-zinc-700 rounded-lg transition-colors cursor-pointer"
              aria-label="Decline cookies"
            >
              {locale === "th" ? "ปฏิเสธ" : "Decline"}
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg transition-all shadow-md cursor-pointer"
              aria-label="Accept cookies"
            >
              {locale === "th" ? "ยอมรับ" : "Accept"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
