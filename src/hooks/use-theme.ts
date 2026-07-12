import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track";

export type Theme = "light" | "dark" | "system";

/**
 * Custom Hook สำหรับการจัดการระบบธีม (Light Mode, Dark Mode, System Mode)
 * รองรับการซิงค์ตามระบบ OS และเก็บสถานะลงใน LocalStorage อย่างปลอดภัยในฝั่ง Client
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved) {
        setTheme(saved);
      }
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const root = window.document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (currentTheme: Theme) => {
      root.classList.remove("light", "dark");
      
      const isDark = currentTheme === "dark" || (currentTheme === "system" && media.matches);
      
      if (isDark) {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.add("light");
        root.style.colorScheme = "light";
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    const handleSystemChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, [theme, isMounted]);

  const updateTheme = (newTheme: Theme) => {
    trackEvent("change_theme", "theme", newTheme);
    setTheme(newTheme);
  };

  return {
    theme: isMounted ? theme : "system",
    setTheme: updateTheme,
    isMounted,
  };
}
