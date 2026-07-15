"use client";

import React from "react";
import Link from "next/link";
import { getWebSiteSchema } from "@/lib/seo/metadata";
import { RecentConversions } from "@/components/converter/recent-conversions";
import { useRecentConversions } from "@/hooks/use-recent-conversions";
import { useFavoriteConversions } from "@/hooks/use-favorite-conversions";
import { useLocale } from "@/hooks/use-locale";
import { trackEvent } from "@/lib/analytics/track";
import unitsDataRaw from "@/data/units.json";
import { ConversionDatabase } from "@/types/converter";

const db = unitsDataRaw as unknown as ConversionDatabase;

// Quick conversion configurations mapped to their slugs and unit IDs
const QUICK_CHIPS = [
  { from: "centimeter", to: "inch", slug: "cm-to-inches" },
  { from: "inch", to: "centimeter", slug: "inches-to-cm" },
  { from: "kilogram", to: "pound", slug: "kg-to-lbs" },
  { from: "pound", to: "kilogram", slug: "lbs-to-kg" },
  { from: "kilometer", to: "mile", slug: "km-to-miles" },
  { from: "mile", to: "kilometer", slug: "miles-to-km" },
  { from: "celsius", to: "fahrenheit", slug: "celsius-to-fahrenheit" },
  { from: "fahrenheit", to: "celsius", slug: "fahrenheit-to-celsius" }
];

// Helper to determine chips color schemes dynamically
const getChipStyle = (index: number) => {
  const styles = [
    "bg-blue-50/80 border-blue-100/80 text-blue-600 hover:bg-blue-100 hover:border-blue-500 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400",
    "bg-indigo-50/80 border-indigo-100/80 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-500 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-400",
    "bg-cyan-50/80 border-cyan-100/80 text-cyan-600 hover:bg-cyan-100 hover:border-cyan-500 dark:bg-cyan-950/20 dark:border-cyan-900/30 dark:text-cyan-400"
  ];
  return styles[index % 3];
};

interface CategoryStyle {
  iconClass: string;
  hoverClass: string;
  badgeClass: string;
  textClass: string;
}

// Unified Design System accents themed around the 'Ocean-to-Sky Tech' palette
const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  length: {
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    hoverClass: "hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-blue-50/60 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100/20 dark:border-blue-900/30",
    textClass: "group-hover:text-blue-600 dark:group-hover:text-blue-400"
  },
  weight: {
    iconClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    hoverClass: "hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-100/20 dark:border-indigo-900/30",
    textClass: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
  },
  temperature: {
    iconClass: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
    hoverClass: "hover:border-sky-500 hover:shadow-md hover:shadow-sky-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-sky-50/60 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400 border-sky-100/20 dark:border-sky-900/30",
    textClass: "group-hover:text-sky-600 dark:group-hover:text-sky-400"
  },
  area: {
    iconClass: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
    hoverClass: "hover:border-cyan-500 hover:shadow-md hover:shadow-cyan-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-cyan-50/60 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400 border-cyan-100/20 dark:border-cyan-900/30",
    textClass: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400"
  },
  volume: {
    iconClass: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
    hoverClass: "hover:border-teal-500 hover:shadow-md hover:shadow-teal-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-teal-50/60 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 border-teal-100/20 dark:border-teal-900/30",
    textClass: "group-hover:text-teal-600 dark:group-hover:text-teal-400"
  },
  speed: {
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    hoverClass: "hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-blue-50/60 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100/20 dark:border-blue-900/30",
    textClass: "group-hover:text-blue-600 dark:group-hover:text-blue-400"
  },
  time: {
    iconClass: "bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400",
    hoverClass: "hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-100/20 dark:border-indigo-900/30",
    textClass: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
  },
  pressure: {
    iconClass: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
    hoverClass: "hover:border-sky-500 hover:shadow-md hover:shadow-sky-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-sky-50/60 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400 border-sky-100/20 dark:border-sky-900/30",
    textClass: "group-hover:text-sky-600 dark:group-hover:text-sky-400"
  },
  energy: {
    iconClass: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
    hoverClass: "hover:border-cyan-500 hover:shadow-md hover:shadow-cyan-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-cyan-50/60 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400 border-cyan-100/20 dark:border-cyan-900/30",
    textClass: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400"
  },
  power: {
    iconClass: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
    hoverClass: "hover:border-teal-500 hover:shadow-md hover:shadow-teal-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-teal-50/60 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 border-teal-100/20 dark:border-teal-900/30",
    textClass: "group-hover:text-teal-600 dark:group-hover:text-teal-400"
  },
  data: {
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    hoverClass: "hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-blue-50/60 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100/20 dark:border-blue-900/30",
    textClass: "group-hover:text-blue-600 dark:group-hover:text-blue-400"
  },
  force: {
    iconClass: "bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400",
    hoverClass: "hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-100/20 dark:border-indigo-900/30",
    textClass: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
  },
  angle: {
    iconClass: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
    hoverClass: "hover:border-sky-500 hover:shadow-md hover:shadow-sky-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-sky-50/60 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400 border-sky-100/20 dark:border-sky-900/30",
    textClass: "group-hover:text-sky-600 dark:group-hover:text-sky-400"
  },
  density: {
    iconClass: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
    hoverClass: "hover:border-cyan-500 hover:shadow-md hover:shadow-cyan-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-cyan-50/60 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400 border-cyan-100/20 dark:border-cyan-900/30",
    textClass: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400"
  },
  electric_current: {
    iconClass: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
    hoverClass: "hover:border-teal-500 hover:shadow-md hover:shadow-teal-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-teal-50/60 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 border-teal-100/20 dark:border-teal-900/30",
    textClass: "group-hover:text-teal-600 dark:group-hover:text-teal-400"
  },
  fuel_consumption: {
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    hoverClass: "hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-blue-50/60 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100/20 dark:border-blue-900/30",
    textClass: "group-hover:text-blue-600 dark:group-hover:text-blue-400"
  },
  currency: {
    iconClass: "bg-indigo-50 text-indigo-655 dark:bg-indigo-950/40 dark:text-indigo-400",
    hoverClass: "hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-1.5",
    badgeClass: "bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-100/20 dark:border-indigo-900/30",
    textClass: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
  }
};

export default function Home() {
  const { locale, t, tUnit, tCategory } = useLocale();
  const { history, isMounted: recentMounted } = useRecentConversions();
  const { favorites, isMounted: favMounted } = useFavoriteConversions();
  const websiteSchema = getWebSiteSchema();

  const handleSearchTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent("trigger_search", "homepage", "search_box");
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  return (
    <div className="relative animate-fadeIn text-gray-900 dark:text-gray-100">
      {/* Dynamic structured data script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* 1. HERO & SIGNATURE SEARCH SECTION (Pure White with Blueprint grids) */}
      <section className="relative bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900/60 overflow-hidden py-14 md:py-20">
        {/* Decorative Blueprint elements */}
        <div className="absolute inset-0 radial-glow pointer-events-none z-0" />
        <div className="absolute inset-0 bg-blueprint bg-blueprint-fade pointer-events-none z-0 opacity-70" />
        
        {/* Blueprint horizontal rules */}
        <div className="absolute top-2 left-6 right-6 hidden sm:flex justify-between pointer-events-none opacity-20 dark:opacity-10 text-sky-600 dark:text-sky-400 font-mono text-[6.5px] tracking-widest">
          <span>[SYS-INIT: STATUS_OK]</span>
          <span>| | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |</span>
          <span>[UC-REF: 0x5F3759DF]</span>
          <span>| | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |</span>
          <span>[SCALE: 1.000]</span>
        </div>

        {/* Blueprint vertical axis rulers */}
        <div className="absolute top-0 bottom-0 left-3 w-1.5 hidden md:flex flex-col justify-between py-10 pointer-events-none opacity-15 dark:opacity-10 text-sky-600 dark:text-sky-400 font-mono text-[6px]">
          <span>— 00</span>
          <span>— 10</span>
          <span>— 20</span>
          <span>— 30</span>
          <span>— 40</span>
          <span>— 50</span>
          <span>— 60</span>
          <span>— 70</span>
          <span>— 80</span>
          <span>— 90</span>
          <span>— 99</span>
        </div>
        <div className="absolute top-0 bottom-0 right-3 w-1.5 hidden md:flex flex-col justify-between py-10 pointer-events-none opacity-15 dark:opacity-10 text-sky-600 dark:text-sky-400 font-mono text-[6px] text-right">
          <span>00 —</span>
          <span>10 —</span>
          <span>20 —</span>
          <span>30 —</span>
          <span>40 —</span>
          <span>50 —</span>
          <span>60 —</span>
          <span>70 —</span>
          <span>80 —</span>
          <span>90 —</span>
          <span>99 —</span>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 dark:opacity-5 text-sky-500 font-mono text-2xl font-light">
          +
        </div>

        {/* Hero content container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-6">
          

          <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-black text-gray-955 dark:text-gray-55 tracking-tight leading-none">
            {t("heroTitle").split("Real-time")[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#032b73] to-[#0ea5e9] dark:from-slate-200 dark:to-sky-400">
              Real-time
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-semibold">
            {t("heroDesc")}
          </p>

          {/* Signature Spotlight Search Container */}
          <div className="max-w-2xl mx-auto px-4 sm:px-0 pt-4 relative group">
            {/* Corner blueprint guidelines */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-sky-500/25 dark:border-sky-400/20 group-hover:border-sky-500/60 dark:group-hover:border-sky-400/50 transition-colors pointer-events-none hidden sm:block" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-sky-500/25 dark:border-sky-400/20 group-hover:border-sky-500/60 dark:group-hover:border-sky-400/50 transition-colors pointer-events-none hidden sm:block" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-sky-500/25 dark:border-sky-400/20 group-hover:border-sky-500/60 dark:group-hover:border-sky-400/50 transition-colors pointer-events-none hidden sm:block" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-sky-500/25 dark:border-sky-400/20 group-hover:border-sky-500/60 dark:group-hover:border-sky-400/50 transition-colors pointer-events-none hidden sm:block" />
            
            <button
              onClick={handleSearchTrigger}
              className="flex items-center w-full px-6 py-4.5 bg-white dark:bg-zinc-950 border border-slate-200/90 dark:border-zinc-800/80 hover:border-sky-500 dark:hover:border-sky-500 rounded-xl text-slate-400 dark:text-slate-500 shadow-lg shadow-sky-500/4% hover:shadow-xl hover:shadow-sky-500/8% transition-all duration-200 text-left cursor-pointer outline-none focus:ring-4 focus:ring-sky-500/20 dark:focus:ring-sky-500/30"
            >
              <svg className="w-5.5 h-5.5 text-sky-500 dark:text-sky-400 mr-3 transition-transform duration-200 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm sm:text-base font-mono font-semibold text-slate-500 dark:text-slate-400 tracking-tight">{t("searchPlaceholder")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. HISTORY & QUICK LINKS SECTION (Soft Gray alternating rhythm) */}
      <section className="bg-slate-50/45 dark:bg-zinc-900/10 border-b border-slate-100 dark:border-zinc-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {/* Quick Link Chips (Recent, Favorites, or Recommended) */}
          <div className="max-w-3xl mx-auto space-y-2.5">
            {recentMounted && favMounted && (history.length > 0 || favorites.length > 0) ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                {/* Favorites row */}
                {favorites.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2.5 px-4 sm:px-0 py-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 flex items-center">
                      {locale === "th" ? "หน่วยโปรด" : "Favorites"}:
                    </span>
                    {favorites.slice(0, 4).map((fav) => {
                      const fromLabel = tUnit(fav.fromUnitId, fav.fromUnitId);
                      const toLabel = tUnit(fav.toUnitId, fav.toUnitId);
                      return (
                        <Link
                          key={fav.id}
                          href={`/${locale}/${fav.slug}`}
                          className="text-xs font-bold px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 dark:bg-amber-500/5 dark:hover:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-450 rounded-xl transition-all duration-155 active:scale-95 shadow-2xs hover:border-amber-500"
                        >
                          {fromLabel} ➔ {toLabel}
                        </Link>
                      );
                    })}
                  </div>
                )}
                
                {/* Recents row */}
                {history.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2.5 px-4 sm:px-0 py-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 flex items-center">
                      {locale === "th" ? "ใช้ล่าสุด" : "Recent"}:
                    </span>
                    {history.slice(0, 4).map((item) => {
                      const fromLabel = tUnit(item.fromUnitId, item.fromUnitId);
                      const toLabel = tUnit(item.toUnitId, item.toUnitId);
                      const slugFrom = item.fromUnitId.replace(/\s+/g, "-");
                      const slugTo = item.toUnitId.replace(/\s+/g, "-");
                      const slugPath = `/${slugFrom}-to-${slugTo}`.toLowerCase();
                      return (
                        <Link
                          key={item.id}
                          href={`/${locale}${slugPath}`}
                          className="text-xs font-bold px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-550/5 dark:hover:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl transition-all duration-155 active:scale-95 shadow-2xs hover:border-blue-500"
                        >
                          {fromLabel} ➔ {toLabel}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Fallback to Default Quick Chips */
              <div className="flex flex-wrap items-center justify-center gap-3 px-4 sm:px-0 py-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 flex items-center">
                  {locale === "th" ? "แนะนำ" : "Recommended"}:
                </span>
                {QUICK_CHIPS.map((chip, idx) => {
                  const fromLabel = tUnit(chip.from, chip.from);
                  const toLabel = tUnit(chip.to, chip.to);
                  const chipColorClass = getChipStyle(idx);
                  return (
                    <Link
                      key={chip.slug}
                      href={`/${locale}/${chip.slug}`}
                      onClick={() => trackEvent("click_quick_chip", "homepage", chip.slug)}
                      className={`text-xs font-extrabold px-3.5 py-1.5 border rounded-xl transition-all duration-150 active:scale-95 shadow-2xs ${chipColorClass}`}
                    >
                      {fromLabel} ➔ {toLabel}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Conversions History Widget */}
          <RecentConversions />
        </div>
      </section>

      {/* 3. CATEGORIES SECTION (Pure White background) */}
      <section className="bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900/40 py-14 md:py-20" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row items-baseline justify-between border-b border-slate-200/80 dark:border-zinc-900 pb-2">
            <h2 id="categories-heading" className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-50 font-sans tracking-tight">
              {t("categoriesTitle")}
            </h2>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold uppercase tracking-wider mt-1 md:mt-0">
              {locale === "th" ? `[หมวดหมู่ทั้งหมด: ${db.categories.length}]` : `[TOTAL CATEGORIES: ${db.categories.length}]`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {db.categories.map((category) => {
              const localizedCat = tCategory(category.id, category.name, category.description);
              const style = CATEGORY_STYLES[category.id] || {
                iconClass: "bg-slate-50 text-slate-655 dark:bg-zinc-900 dark:text-slate-400",
                hoverClass: "hover:border-blue-500 hover:shadow-md hover:-translate-y-1",
                badgeClass: "bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-slate-305",
                textClass: "group-hover:text-blue-500"
              };

              return (
                <Link
                  key={category.id}
                  href={`/${locale}/${category.id}`}
                  onClick={() => trackEvent("click_category", "homepage", category.id)}
                  className={`group flex flex-col justify-between p-6 bg-white dark:bg-zinc-950 border border-slate-200/70 dark:border-zinc-800/75 rounded-2xl transition-all duration-200 shadow-2xs hover:shadow-md hover:shadow-sky-500/3% hover:-translate-y-1.5 ${style.hoverClass}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-3xl p-3 rounded-xl flex items-center justify-center font-bold group-hover:scale-105 transition-transform duration-200 shadow-2xs ${style.iconClass}`} role="img" aria-label={localizedCat.name}>
                        {category.icon}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${style.badgeClass}`}>
                          {category.units.length} UNITS
                        </span>
                      </div>
                    </div>
                    <h3 className={`text-base font-bold text-gray-900 dark:text-gray-100 transition-colors ${style.textClass}`}>
                      {localizedCat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-semibold">
                      {localizedCat.description}
                    </p>
                  </div>

                  {/* WCAG Compliant Unit Badges with Soft Colors */}
                  <div className="border-t border-slate-100 dark:border-zinc-900/60 pt-3.5 mt-5 flex flex-wrap gap-1">
                    {category.units.slice(0, 5).map((unit) => (
                      <span
                        key={unit.id}
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm uppercase border border-slate-200/5 dark:border-zinc-850/5 ${style.badgeClass}`}
                      >
                        {unit.symbol}
                      </span>
                    ))}
                    {category.units.length > 5 && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 text-slate-400 dark:text-slate-500">
                        +{category.units.length - 5}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION (Soft Blue blueprint alternating rhythm) */}
      <section className="relative z-10 bg-blue-50/15 dark:bg-blue-950/5 border-b border-slate-100 dark:border-zinc-900/40 py-16 bg-blueprint overflow-hidden">
        <div className="absolute inset-0 radial-glow pointer-events-none z-0" />
        
        {/* Blueprint guidelines */}
        <div className="absolute bottom-2 left-6 right-6 hidden sm:flex justify-between pointer-events-none opacity-20 dark:opacity-10 text-sky-600 dark:text-sky-400 font-mono text-[6.5px] tracking-widest">
          <span>[UC-STATS: OK]</span>
          <span>| | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |</span>
          <span>[SYS-VER: 16.2]</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1 relative py-4 group">
              <div className="absolute top-0 bottom-0 right-0 w-px bg-dashed bg-slate-200/60 dark:bg-zinc-800/40 hidden md:block" />
              <div className="text-4xl font-mono font-black text-sky-600 dark:text-sky-400 tracking-tight">{t("statUnitsVal")}</div>
              <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide pt-1">{t("statUnitsLbl")}</div>
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[5.5px] font-mono text-sky-600/40 dark:text-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity">[REF: UNITS_DB]</span>
            </div>

            <div className="space-y-1 relative py-4 group">
              <div className="absolute top-0 bottom-0 right-0 w-px bg-dashed bg-slate-200/65 dark:bg-zinc-800/40 hidden md:block" />
              <div className="text-4xl font-mono font-black text-sky-600 dark:text-sky-400 tracking-tight">{t("statCatsVal")}</div>
              <div className="text-xs font-mono font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide pt-1">{t("statCatsLbl")}</div>
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[5.5px] font-mono text-sky-600/40 dark:text-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity">[REF: CAT_DB]</span>
            </div>

            <div className="space-y-1 relative py-4 group">
              <div className="absolute top-0 bottom-0 right-0 w-px bg-dashed bg-slate-200/65 dark:bg-zinc-800/40 hidden md:block" />
              <div className="text-4xl font-mono font-black text-sky-600 dark:text-sky-400 tracking-tight">{t("statSpeedVal")}</div>
              <div className="text-xs font-mono font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wide pt-1">{t("statSpeedLbl")}</div>
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[5.5px] font-mono text-sky-600/40 dark:text-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity">[REF: OP_LAT]</span>
            </div>

            <div className="space-y-1 py-4 group">
              <div className="text-4xl font-mono font-black text-sky-600 dark:text-sky-400 tracking-tight">{t("statPriceVal")}</div>
              <div className="text-xs font-mono font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wide pt-1">{t("statPriceLbl")}</div>
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[5.5px] font-mono text-sky-600/40 dark:text-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity">[REF: PRIV_LOC]</span>
            </div>

          </div>
        </div>
      </section>

      {/* 5. POPULAR CONVERSIONS SECTION (White background) */}
      <section className="bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900/40 py-14 md:py-20" aria-labelledby="shortcuts-heading">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-900 pb-2">
            <h2 id="shortcuts-heading" className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              {t("popularTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {db.categories.flatMap((cat) => cat.popularConversions || []).slice(0, 12).map((conv) => {
              const fromLabel = tUnit(conv.from, conv.from);
              const toLabel = tUnit(conv.to, conv.to);
              return (
                <Link
                  key={conv.slug}
                  href={`/${locale}/${conv.slug}`}
                  onClick={() => trackEvent("click_popular_conversion", "homepage", conv.slug)}
                  className="group flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-950 border border-slate-200/70 dark:border-zinc-800/85 hover:border-sky-500 dark:hover:border-sky-500 text-center rounded-xl transition-all duration-200 shadow-2xs hover:shadow-md hover:shadow-sky-500/2% hover:-translate-y-1 cursor-pointer"
                >
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-450 transition-colors">
                    {fromLabel} ➔ {toLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FEATURES GRID SECTION (Soft Slate alternating rhythm) */}
      <section className="bg-slate-50/45 dark:bg-zinc-900/10 py-14 md:py-20" aria-labelledby="why-choose-heading">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 id="why-choose-heading" className="text-2xl md:text-3xl font-black text-gray-955 dark:text-gray-55 tracking-tight">
              {t("aboutTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Instant Conversion */}
            <div className="p-6 bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-900/70 rounded-xl space-y-3 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative group">
              <div className="absolute top-3 right-3 text-[7px] font-mono text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">[REF: INST_SYS]</div>
              <span className="text-2xl" role="img" aria-label="lightning">⚡</span>
              <h3 className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">{t("featInstantTitle")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{t("featInstantDesc")}</p>
            </div>

            {/* Card 2: 200+ Units */}
            <div className="p-6 bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-900/70 rounded-xl space-y-3 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative group">
              <div className="absolute top-3 right-3 text-[7px] font-mono text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">[REF: MASS_DB]</div>
              <span className="text-2xl" role="img" aria-label="globe">🌍</span>
              <h3 className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">{t("featUnitsTitle")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{t("featUnitsDesc")}</p>
            </div>

            {/* Card 3: Mobile Friendly */}
            <div className="p-6 bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-900/70 rounded-xl space-y-3 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative group">
              <div className="absolute top-3 right-3 text-[7px] font-mono text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">[REF: MOB_RND]</div>
              <span className="text-2xl" role="img" aria-label="mobile phone">📱</span>
              <h3 className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">{t("featMobileTitle")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{t("featMobileDesc")}</p>
            </div>

            {/* Card 4: High Precision */}
            <div className="p-6 bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-900/70 rounded-xl space-y-3 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative group">
              <div className="absolute top-3 right-3 text-[7px] font-mono text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">[REF: PRE_ARITH]</div>
              <span className="text-2xl" role="img" aria-label="bullseye">🎯</span>
              <h3 className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">{t("featPrecisionTitle")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{t("featPrecisionDesc")}</p>
            </div>

            {/* Card 5: Privacy Friendly */}
            <div className="p-6 bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-900/70 rounded-xl space-y-3 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative group">
              <div className="absolute top-3 right-3 text-[7px] font-mono text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">[REF: PRIV_LOC]</div>
              <span className="text-2xl" role="img" aria-label="shield">🔒</span>
              <h3 className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">{t("featPrivacyTitle")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{t("featPrivacyDesc")}</p>
            </div>

            {/* Card 6: Real-time Calculation */}
            <div className="p-6 bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-900/70 rounded-xl space-y-3 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative group">
              <div className="absolute top-3 right-3 text-[7px] font-mono text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">[REF: RT_LOOP]</div>
              <span className="text-2xl" role="img" aria-label="gear">⚙️</span>
              <h3 className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">{t("featRealtimeTitle")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{t("featRealtimeDesc")}</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
