"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/use-locale";
import { trackEvent } from "@/lib/analytics/track";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { locale, t, tUnit } = useLocale();

  // Whitelisted popular links with from/to unit IDs to fetch localized translation strings dynamically
  const popularLinks = [
    { slug: "meters-to-feet", from: "meter", to: "foot" },
    { slug: "cm-to-inches", from: "centimeter", to: "inch" },
    { slug: "kg-to-lbs", from: "kilogram", to: "pound" },
    { slug: "celsius-to-fahrenheit", from: "celsius", to: "fahrenheit" },
    { slug: "rai-to-square-meters", from: "rai", to: "square_meter" },
    { slug: "tsubo-pyeong-to-square-meters", from: "tsubo_pyeong", to: "square_meter" },
  ];

  // Whitelisted latest links with from/to unit IDs to fetch localized translation strings dynamically
  const latestLinks = [
    { slug: "km-to-miles", from: "kilometer", to: "mile" },
    { slug: "lbs-to-kg", from: "pound", to: "kilogram" },
    { slug: "grams-to-oz", from: "gram", to: "ounce" },
    { slug: "baht-gold-to-grams", from: "baht_gold", to: "gram" },
    { slug: "tola-to-grams", from: "tola", to: "gram" },
    { slug: "jin-china-to-grams", from: "jin_china", to: "gram" },
    { slug: "catty-taiwan-to-grams", from: "jin_taiwan", to: "gram" },
  ];

  return (
    <footer className="w-full border-t border-gray-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        
        {/* Expanded 4-Column Structured Footer */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Column 1: Brand details */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="text-xl font-black tracking-tight text-blue-600 dark:text-blue-500">
              Unitto<span className="text-gray-900 dark:text-gray-100">Go</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-semibold max-w-xs">
              {t("brandDesc")}
            </p>
          </div>

          {/* Column 2: Top Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs tracking-wider uppercase">
              {t("categoriesTitle").split(" ")[0]}
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link 
                  href={`/${locale}/length`} 
                  onClick={() => trackEvent("click_footer_link", "footer", "length")}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  📏 Length
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/weight`} 
                  onClick={() => trackEvent("click_footer_link", "footer", "weight")}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  ⚖️ Weight
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/temperature`} 
                  onClick={() => trackEvent("click_footer_link", "footer", "temperature")}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  🌡️ Temperature
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/area`} 
                  onClick={() => trackEvent("click_footer_link", "footer", "area")}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  🗺️ Area
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Converters */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs tracking-wider uppercase">
              {t("popularTools").split(" ")[0]}
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              {popularLinks.map((link) => {
                const fromLabel = tUnit(link.from, link.from);
                const toLabel = tUnit(link.to, link.to);
                return (
                  <li key={link.slug}>
                    <Link
                      href={`/${locale}/${link.slug}`}
                      onClick={() => trackEvent("click_footer_link", "footer", link.slug)}
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {fromLabel} ➔ {toLabel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Latest Converters */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs tracking-wider uppercase">
              {t("latestConverters")}
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              {latestLinks.map((link) => {
                const fromLabel = tUnit(link.from, link.from);
                const toLabel = tUnit(link.to, link.to);
                return (
                  <li key={link.slug}>
                    <Link
                      href={`/${locale}/${link.slug}`}
                      onClick={() => trackEvent("click_footer_link", "footer", link.slug)}
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {fromLabel} ➔ {toLabel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 5: Tools & Extension */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs tracking-wider uppercase">
              {locale === "th" ? "เครื่องมือเพิ่มเติม" : "Tools & Extension"}
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link 
                  href={`/${locale}/tools/widget-generator`} 
                  onClick={() => trackEvent("click_footer_link", "footer", "widget-generator")}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  ⚙️ Widget Generator
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/tools/recipe-scaler`} 
                  onClick={() => trackEvent("click_footer_link", "footer", "recipe-scaler")}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  🍳 Recipe Scaler
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/tools/maps-area`} 
                  onClick={() => trackEvent("click_footer_link", "footer", "maps-area")}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  🗺️ Global Maps Area
                </Link>
              </li>
              <li>
                <a 
                  href="/unittogo-extension.zip" 
                  download
                  onClick={() => trackEvent("click_footer_link", "footer", "download-extension")}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  🔌 Chrome Extension (.zip)
                </a>
              </li>
              <li>
                <Link 
                  href={`/${locale}/guides`} 
                  onClick={() => trackEvent("click_footer_link", "footer", "guides")}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  📚 Measurement Guides
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Legal Rules & Copyright */}
        <div className="border-t border-gray-200 dark:border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 dark:text-gray-500 font-medium space-y-4 sm:space-y-0">
          <div>
            © {currentYear} UnittoGo.com. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link 
              href={`/${locale}/privacy`} 
              onClick={() => trackEvent("click_footer_link", "footer", "privacy")}
              className="hover:underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {t("privacyPolicy")}
            </Link>
            <span>•</span>
            <Link 
              href={`/${locale}/terms`} 
              onClick={() => trackEvent("click_footer_link", "footer", "terms")}
              className="hover:underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {t("termsOfService")}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
