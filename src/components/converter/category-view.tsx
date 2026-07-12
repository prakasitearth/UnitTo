"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/types/converter";
import { getBreadcrumbSchema } from "@/lib/seo/metadata";
import { useLocale } from "@/hooks/use-locale";
import { trackEvent } from "@/lib/analytics/track";
import { MultiUnitConverter } from "./multi-unit-converter";

interface CategoryViewProps {
  category: Category;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category }) => {
  const { locale, t, tUnit, tCategory } = useLocale();
  const breadcrumbSchema = getBreadcrumbSchema(category);
  const localizedCat = tCategory(category.id, category.name, category.description);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* breadcrumb schema tag injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Back to Home & Breadcrumbs navigation trail */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <Link 
          href={`/${locale}`}
          onClick={() => trackEvent("click_back_to_home", "navigation", category.id)}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors cursor-pointer outline-none focus:underline"
        >
          {t("backToHome")}
        </Link>
        <nav className="text-xs text-gray-400 dark:text-gray-500" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-1 font-semibold">
            <li className="flex items-center">
              <Link href={`/${locale}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <span className="mx-1" aria-hidden="true">/</span>
            </li>
            <li className="text-gray-600 dark:text-gray-400 font-bold" aria-current="page">
              {localizedCat.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Category Header */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-4xl" role="img" aria-label={localizedCat.name}>
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {localizedCat.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {localizedCat.description}
            </p>
          </div>
        </div>
      </div>

      {/* Popular Conversions List Section */}
      {category.popularConversions && category.popularConversions.length > 0 && (
        <section className="mb-8" aria-labelledby="popular-conversions-heading">
          <h2 id="popular-conversions-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("popularTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.popularConversions.map((conv) => {
              const fromLabel = tUnit(conv.from, conv.from);
              const toLabel = tUnit(conv.to, conv.to);
              
              const getPopularDesc = (catName: string) => {
                if (locale === "th") return `เครื่องมือคำนวณ${catName}อย่างรวดเร็ว`;
                if (locale === "es") return `Calculadora rápida de ${catName.toLowerCase()}`;
                if (locale === "fr") return `Calculatrice rapide de ${catName.toLowerCase()}`;
                if (locale === "ja") return `便利な${catName}変換ツール`;
                return `Quick ${catName.toLowerCase()} calculator`;
              };

              return (
                <Link
                  key={conv.slug}
                  href={`/${locale}/${conv.slug}`}
                  className="block p-4 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all shadow-xs hover:shadow-sm"
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {fromLabel} ➔ {toLabel}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getPopularDesc(localizedCat.name)}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ★ Multi-Unit Simultaneous Converter (Digital Dutch style) */}
      <section className="mb-8" aria-labelledby="multi-converter-heading">
        <h2 id="multi-converter-heading" className="sr-only">
          {t("multiConverterTitle")}
        </h2>
        <MultiUnitConverter category={category} />
      </section>

      {/* Grid of all supported units in category */}
      <section aria-labelledby="supported-units-heading">
        <h2 id="supported-units-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {"Supported Units of " + localizedCat.name}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {category.units.map((unit) => (
            <div
              key={unit.id}
              className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800"
            >
              <div className="font-bold text-gray-800 dark:text-gray-200">{unit.symbol}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{tUnit(unit.id, unit.name)}</div>
              <div className="text-xs text-gray-400 mt-1 truncate">{unit.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
