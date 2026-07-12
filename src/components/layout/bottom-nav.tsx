"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";

interface BottomNavProps {
  onSearchOpen: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onSearchOpen }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t, supportedLanguages } = useLocale();

  // Toggle theme utility
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  // Check active state
  const isHomeActive = pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-gray-100 dark:border-zinc-900/80 pb-[env(safe-area-inset-bottom)] shadow-lg transition-colors duration-200">
      <div className="grid grid-cols-4 items-center justify-between h-14 max-w-lg mx-auto px-2">
        
        {/* 🏠 Home Option */}
        <Link
          href={`/${locale}`}
          className={`flex flex-col items-center justify-center space-y-1 py-1 rounded-xl transition-all ${
            isHomeActive
              ? "text-blue-600 dark:text-blue-400 font-bold scale-105"
              : "text-gray-500 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] tracking-tight">{t("popularTools").split(" ")[0]}</span>
        </Link>

        {/* 🔍 Search Option */}
        <button
          onClick={onSearchOpen}
          className="flex flex-col items-center justify-center space-y-1 py-1 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] tracking-tight">{t("searchPlaceholder").split(" ")[0] || "Search"}</span>
        </button>

        {/* 🌐 Custom Language Select Overlay (Accessible Native Dropdown) */}
        <div className="relative flex flex-col items-center justify-center space-y-1 py-1 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m-4-3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <span className="text-[10px] tracking-tight">Language</span>
          
          {/* Fully Overlayed Transparent Select Box */}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer select-none outline-none"
            aria-label="Change language selection"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-white dark:bg-zinc-900 text-gray-900">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🎨 Theme Switcher Option */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center space-y-1 py-1 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer"
          aria-label="Toggle display theme mode"
        >
          {theme === "light" && (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              <span className="text-[10px] tracking-tight">Light</span>
            </>
          )}
          {theme === "dark" && (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="text-[10px] tracking-tight">Dark</span>
            </>
          )}
          {theme === "system" && (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] tracking-tight">Auto</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
