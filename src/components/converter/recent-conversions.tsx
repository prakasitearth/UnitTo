"use client";

import React from "react";
import Link from "next/link";
import { useRecentConversions } from "@/hooks/use-recent-conversions";
import { useLocale } from "@/hooks/use-locale";

export const RecentConversions: React.FC = () => {
  const { history, clearHistory, isMounted } = useRecentConversions();
  const { t, tCategory, locale } = useLocale();

  if (!isMounted) {
    return null;
  }

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xs transition-colors duration-200 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base flex items-center">
          <span className="mr-2">⏱️</span> {t("recentHistory")}
        </h3>
        <button
          onClick={clearHistory}
          className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline cursor-pointer"
        >
          {t("clearHistory")}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => {
          // แปลงหน่วยสัญลักษณ์ที่ซับซ้อนให้ไม่มีเครื่องหมายพิเศษใน slug เช่น m² -> square-meters
          const slugFrom = item.fromUnitId.replace(/\s+/g, "-");
          const slugTo = item.toUnitId.replace(/\s+/g, "-");
          const slugPath = `/${slugFrom}-to-${slugTo}`.toLowerCase();
          const localizedCat = tCategory(item.categoryId, item.categoryName, "");

          return (
            <Link
              key={item.id}
              href={slugPath}
              className="group block p-3.5 bg-gray-50 hover:bg-blue-50/50 dark:bg-zinc-800/40 dark:hover:bg-blue-950/20 border border-gray-100 dark:border-zinc-800/60 hover:border-blue-500 rounded-2xl transition-all shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
                <span className="font-bold uppercase tracking-wider">{localizedCat.name}</span>
                <span>{(() => {
                  const d = new Date(item.timestamp);
                  const timeStr = d.toLocaleTimeString(locale === "th" ? "th-TH" : "en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  });
                  return locale === "th" ? `เมื่อ ${timeStr} น.` : `at ${timeStr}`;
                })()}</span>
              </div>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="font-bold text-gray-800 dark:text-gray-200 font-mono text-sm">
                  {item.value} <span className="text-xs text-gray-400 font-normal">{item.fromUnitSymbol}</span>
                </span>
                <span className="text-gray-400 dark:text-gray-600 font-bold">➔</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono text-sm">
                  {item.result} <span className="text-xs font-normal text-gray-400">{item.toUnitSymbol}</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
