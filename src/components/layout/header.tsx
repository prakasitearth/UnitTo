"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";

interface HeaderProps {
  categories: Array<{ id: string; name: string; icon: string }>;
  onSearchOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ categories, onSearchOpen }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t, tCategory, supportedLanguages } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Refs for focus management
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const moreMenuButtonRef = useRef<HTMLButtonElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const firstDrawerLinkRef = useRef<HTMLButtonElement>(null);

  // ── Theme toggle ──────────────────────────────────────────────────────────
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const handleMobileSearchClick = () => {
    setMobileMenuOpen(false);
    onSearchOpen();
  };

  // ── Mobile drawer focus trap ───────────────────────────────────────────────
  // When drawer opens, move focus to the first interactive element inside it.
  useEffect(() => {
    if (mobileMenuOpen) {
      // Small delay to let the DOM render the drawer
      const t = setTimeout(() => firstDrawerLinkRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      // Restore focus to the hamburger button when drawer closes
      mobileMenuButtonRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  // Trap Tab/Shift+Tab inside mobile drawer; Escape closes it
  const handleDrawerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || !mobileDrawerRef.current) return;

      const focusable = Array.from(
        mobileDrawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), select, input, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  // ── "More +" dropdown keyboard navigation ──────────────────────────────────
  const handleMoreButtonKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          setMoreMenuOpen((prev) => !prev);
          break;
        case "ArrowDown":
          e.preventDefault();
          setMoreMenuOpen(true);
          // Focus first menu item after render
          setTimeout(() => {
            const first = moreMenuRef.current?.querySelector<HTMLElement>(
              '[role="menuitem"]'
            );
            first?.focus();
          }, 50);
          break;
        case "Escape":
          setMoreMenuOpen(false);
          moreMenuButtonRef.current?.focus();
          break;
      }
    },
    []
  );

  const handleMenuItemKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>, index: number, total: number) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setMoreMenuOpen(false);
          moreMenuButtonRef.current?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          {
            const items = moreMenuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
            if (items && index < total - 1) items[index + 1].focus();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          {
            const items = moreMenuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
            if (items && index > 0) items[index - 1].focus();
            else moreMenuButtonRef.current?.focus();
          }
          break;
        case "Home":
          e.preventDefault();
          moreMenuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')[0]?.focus();
          break;
        case "End":
          e.preventDefault();
          {
            const items = moreMenuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
            if (items) items[items.length - 1]?.focus();
          }
          break;
      }
    },
    []
  );

  const extraCategories = categories.slice(5);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-500 hover:opacity-90 transition-opacity">
          <span className="text-2xl font-black tracking-tight font-sans">
            Unitto<span className="text-gray-900 dark:text-gray-100">Go</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1" aria-label="Desktop Navigation">
          {categories.slice(0, 5).map((cat) => {
            const isActive = pathname === `/${cat.id}`;
            const localizedCatName = tCategory(cat.id, cat.name, "").name;
            return (
              <Link
                key={cat.id}
                href={`/${cat.id}`}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-900/60"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{localizedCatName}</span>
              </Link>
            );
          })}

          {/* "More +" Dropdown – fully keyboard accessible */}
          {categories.length > 5 && (
            <div
              className="relative"
              onMouseLeave={() => setMoreMenuOpen(false)}
            >
              {/* Trigger button */}
              <button
                ref={moreMenuButtonRef}
                id="more-menu-button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                onMouseEnter={() => setMoreMenuOpen(true)}
                onKeyDown={handleMoreButtonKeyDown}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  moreMenuOpen
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-900/60"
                }`}
                aria-expanded={moreMenuOpen}
                aria-haspopup="menu"
                aria-controls="more-menu"
              >
                <span>{t("more")}</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {moreMenuOpen && (
                <div
                  ref={moreMenuRef}
                  id="more-menu"
                  role="menu"
                  aria-labelledby="more-menu-button"
                  onMouseEnter={() => setMoreMenuOpen(true)}
                  className="absolute right-0 mt-1 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 w-64 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn grid grid-cols-1 max-h-[380px] overflow-y-auto"
                >
                  {extraCategories.map((cat, index) => {
                    const isActive = pathname === `/${cat.id}`;
                    const localizedCatName = tCategory(cat.id, cat.name, "").name;
                    return (
                      <Link
                        key={cat.id}
                        href={`/${cat.id}`}
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => setMoreMenuOpen(false)}
                        onKeyDown={(e) => handleMenuItemKeyDown(e, index, extraCategories.length)}
                        className={`flex items-center space-x-2.5 px-4 py-2.5 text-sm font-semibold transition-all hover:bg-slate-50 dark:hover:bg-zinc-900/50 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-950/30 ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/20"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="text-base" aria-hidden="true">{cat.icon}</span>
                        <span className="truncate">{localizedCatName}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">

          {/* Language Selector – Desktop */}
          <div className="hidden sm:flex items-center">
            {/* Visually hidden label for screen readers */}
            <label htmlFor="desktop-lang-select" className="sr-only">
              {t("languageLabel") || "Language"}
            </label>
            <select
              id="desktop-lang-select"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="bg-transparent border border-gray-200 dark:border-zinc-800 rounded-xl px-2 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-2xs hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer outline-none"
              aria-label="Language selection"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={onSearchOpen}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Open Search Overlay"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Theme Toggle – Desktop */}
          <button
            onClick={toggleTheme}
            className="hidden sm:block p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label={`Toggle theme (current: ${theme})`}
          >
            {theme === "light" && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
            {theme === "dark" && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {theme === "system" && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            ref={mobileMenuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer – with keyboard focus trap */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          ref={mobileDrawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onKeyDown={handleDrawerKeyDown}
          className="lg:hidden border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-4 shadow-inner transition-all animate-fadeIn"
        >
          {/* 1. Mobile Search Bar Trigger */}
          <button
            ref={firstDrawerLinkRef}
            onClick={handleMobileSearchClick}
            className="flex items-center w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-xl text-gray-400 dark:text-gray-500 font-semibold text-xs text-left cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t("searchPlaceholder")}
          </button>

          {/* 2. Mobile Categories Grid */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
              {t("categoriesTitle")}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const isActive = pathname === `/${cat.id}`;
                const localizedCatName = tCategory(cat.id, cat.name, "").name;
                return (
                  <Link
                    key={cat.id}
                    href={`/${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-zinc-900/40 hover:bg-gray-50 dark:hover:bg-zinc-900/80 border border-gray-100/50 dark:border-zinc-900/60"
                    }`}
                  >
                    <span aria-hidden="true">{cat.icon}</span>
                    <span className="truncate">{localizedCatName}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. Mobile Language Selector */}
          <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-2">
            <label htmlFor="mobile-lang-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 block">
              Language / ภาษา
            </label>
            <div className="px-3">
              <select
                id="mobile-lang-select"
                value={locale}
                onChange={(e) => {
                  setLocale(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-3xs outline-none cursor-pointer"
                aria-label="Language selection"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white dark:bg-zinc-900">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Mobile Theme Toggle */}
          <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3">
              Theme / ธีมหน้าเว็บ
            </div>
            <div className="grid grid-cols-3 gap-2 px-3">
              <button
                onClick={() => setTheme("light")}
                className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  theme === "light"
                    ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-950/20"
                    : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-gray-400"
                }`}
                aria-pressed={theme === "light"}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  theme === "dark"
                    ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-950/20"
                    : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-gray-400"
                }`}
                aria-pressed={theme === "dark"}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  theme === "system"
                    ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-950/20"
                    : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-gray-400"
                }`}
                aria-pressed={theme === "system"}
              >
                💻 Auto
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
