import { useState, useEffect } from "react";

export interface DeviceDetails {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  hasMouse: boolean;
  prefersDarkMode: boolean;
  prefersReducedMotion: boolean;
  timeZone: string;
  language: string;
  isMounted: boolean;
}

/**
 * Reusable React Hook to gather extensive client-side hardware, viewport, and accessibility capabilities.
 */
export function useDevice(): DeviceDetails {
  const [details, setDetails] = useState<DeviceDetails>({
    width: 1200,
    height: 800,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    hasMouse: true,
    prefersDarkMode: false,
    prefersReducedMotion: false,
    timeZone: "UTC",
    language: "en",
    isMounted: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isTouchDevice = 
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        ("msMaxTouchPoints" in navigator && (navigator as unknown as { msMaxTouchPoints: number }).msMaxTouchPoints > 0);

      // Match media to detect hover support (implies mouse presence)
      const hoverMatch = window.matchMedia("(hover: hover)").matches;

      // Match prefers-reduced-motion media query
      const motionMatch = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Match dark mode preference
      const darkMatch = window.matchMedia("(prefers-color-scheme: dark)").matches;

      setDetails({
        width: w,
        height: h,
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        isDesktop: w >= 1024,
        isTouch: isTouchDevice,
        hasMouse: hoverMatch,
        prefersDarkMode: darkMatch,
        prefersReducedMotion: motionMatch,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        language: navigator.language || "en",
        isMounted: true,
      });
    };

    // Initialize values on mount
    handleResize();

    // Attach listeners
    window.addEventListener("resize", handleResize);

    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Browser compatibility checking for addEventListener on matchMedia
    if (darkQuery.addEventListener) {
      darkQuery.addEventListener("change", handleResize);
      motionQuery.addEventListener("change", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (darkQuery.removeEventListener) {
        darkQuery.removeEventListener("change", handleResize);
        motionQuery.removeEventListener("change", handleResize);
      }
    };
  }, []);

  return details;
}
