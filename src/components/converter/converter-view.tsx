"use client";

import React from "react";
import Link from "next/link";
import { Category, Unit, ConversionDatabase } from "@/types/converter";
import { UnitConverter } from "@/lib/converter/unit-converter";
import { useLocale } from "@/hooks/use-locale";
import { trackEvent } from "@/lib/analytics/track";
import unitsDataRaw from "@/data/units.json";
import { 
  getBreadcrumbSchema, 
  getSoftwareApplicationSchema, 
  getFAQPageSchema 
} from "@/lib/seo/metadata";
import { ConverterForm } from "./converter-form";
import { MultiUnitConverter } from "./multi-unit-converter";
import { SeoContentSection } from "./seo-content-section";

// Initialize a static converter instance for static data calculations (like conversion tables)
const staticConverter = new UnitConverter(unitsDataRaw as unknown as ConversionDatabase);

interface ConverterViewProps {
  category: Category;
  fromUnit: Unit;
  toUnit: Unit;
}

export const ConverterView: React.FC<ConverterViewProps> = ({ category, fromUnit, toUnit }) => {
  const { locale, t, tUnit, tCategory } = useLocale();

  const localizedFrom = tUnit(fromUnit.id, fromUnit.name);
  const localizedTo = tUnit(toUnit.id, toUnit.name);
  const localizedCat = tCategory(category.id, category.name, category.description);

  // Calculate quick conversion values for the table
  const tableValues = [1, 5, 10, 20, 50, 100, 500, 1000];
  const conversions = tableValues.map(val => {
    try {
      const converted = staticConverter.convert(val, fromUnit.id, toUnit.id, category.id);
      return {
        source: val,
        result: staticConverter.round(converted, 6)
      };
    } catch {
      return { source: val, result: NaN };
    }
  });

  // Calculate reverse conversions
  const reverseConversions = tableValues.map(val => {
    try {
      const converted = staticConverter.convert(val, toUnit.id, fromUnit.id, category.id);
      return {
        source: val,
        result: staticConverter.round(converted, 6)
      };
    } catch {
      return { source: val, result: NaN };
    }
  });

  // Generate formula string
  let formulaText = "";
  if (category.id === "temperature") {
    if (fromUnit.id === "celsius" && toUnit.id === "fahrenheit") {
      formulaText = "Multiply by 9/5 and add 32";
    } else if (fromUnit.id === "fahrenheit" && toUnit.id === "celsius") {
      formulaText = "Subtract 32 and multiply by 5/9";
    } else {
      formulaText = `celsius = ${fromUnit.formula || "value"}; target = ${toUnit.inverseFormula || "value"}`;
    }
  } else {
    const factorRatio = (fromUnit.factor || 1) / (toUnit.factor || 1);
    formulaText = `Multiply the value by ${staticConverter.round(factorRatio, 8)}`;
  }

  // Schema structured data
  const breadcrumbSchema = getBreadcrumbSchema(category, toUnit);
  const softwareAppSchema = getSoftwareApplicationSchema(category, fromUnit, toUnit);
  const faqSchema = getFAQPageSchema(
    category, 
    fromUnit, 
    toUnit, 
    staticConverter.round(conversions[0].result, 6).toString(), 
    formulaText
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Dynamic structured data script tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Back to Home & Breadcrumbs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <Link 
          href={`/${locale}`}
          onClick={() => trackEvent("click_back_to_home", "navigation", `${fromUnit.id}_to_${toUnit.id}`)}
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
            <li className="flex items-center">
              <Link href={`/${locale}/${category.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize">
                {localizedCat.name}
              </Link>
              <span className="mx-1" aria-hidden="true">/</span>
            </li>
            <li className="text-gray-600 dark:text-gray-400 font-bold" aria-current="page">
              {localizedFrom} to {localizedTo}
            </li>
          </ol>
        </nav>
      </div>

      {/* Page Header (H1) */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {"Convert " + localizedFrom + " to " + localizedTo + " (" + fromUnit.symbol + " to " + toUnit.symbol + ")"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          {"Accurate and real-time " + localizedCat.name.toLowerCase() + " calculator for " + localizedFrom + " to " + localizedTo + " conversions."}
        </p>
      </header>

      {/* Interactive Converter Form */}
      <div className="mb-8">
        <ConverterForm
          key={`${category.id}:${fromUnit.id}:${toUnit.id}`}
          category={category}
          initialFromUnit={fromUnit}
          initialToUnit={toUnit}
        />
      </div>

      {/* ★ Multi-Unit Simultaneous Converter */}
      <section className="mb-8" aria-labelledby="multi-converter-heading-sub">
        <h2 id="multi-converter-heading-sub" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <span className="mr-2">🔄</span> {t("multiConverterTitle")}
        </h2>
        <MultiUnitConverter category={category} />
      </section>

      {/* Formula Card & Description */}
      <section className="bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800/60 mb-8" aria-labelledby="formula-heading">
        <h2 id="formula-heading" className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
          <span className="mr-2">💡</span> {t("howTo") + " " + localizedFrom + " " + t("to") + " " + localizedTo}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {"To convert " + localizedFrom + " to " + localizedTo + ", we use the conversion values specified under SI baseline standards or linear/formulaic scales."}
        </p>
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-xl">
          <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">{t("formula")}</div>
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-1 font-mono">
            {localizedFrom + " to " + localizedTo + ": " + formulaText}
          </div>
        </div>
      </section>

      {/* Grid of Conversion Tables */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" aria-label="Quick Conversion Reference Tables">
        {/* Forward Conversion Table */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-base capitalize">
            {localizedFrom + " to " + localizedTo + " " + t("table")}
          </h3>
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-400 dark:text-gray-500 uppercase bg-gray-50 dark:bg-zinc-800/30 rounded-lg">
              <tr>
                <th className="px-4 py-2 rounded-l-lg">{fromUnit.symbol}</th>
                <th className="px-4 py-2 rounded-r-lg">{toUnit.symbol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {conversions.map((conv, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20">
                  <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200">
                    {conv.source} {fromUnit.symbol}
                  </td>
                  <td className="px-4 py-2.5 text-gray-950 dark:text-gray-100 font-mono">
                    {conv.result} {toUnit.symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reverse Conversion Table */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-base capitalize">
            {localizedTo + " to " + localizedFrom + " " + t("table")}
          </h3>
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-400 dark:text-gray-500 uppercase bg-gray-50 dark:bg-zinc-800/30 rounded-lg">
              <tr>
                <th className="px-4 py-2 rounded-l-lg">{toUnit.symbol}</th>
                <th className="px-4 py-2 rounded-r-lg">{fromUnit.symbol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {reverseConversions.map((conv, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20">
                  <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200">
                    {conv.source} {toUnit.symbol}
                  </td>
                  <td className="px-4 py-2.5 text-gray-950 dark:text-gray-100 font-mono">
                    {conv.result} {fromUnit.symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rich Programmatic SEO Content Section */}
      <SeoContentSection
        category={category}
        fromUnit={fromUnit}
        toUnit={toUnit}
        locale={locale}
        tUnit={tUnit}
        tCategory={tCategory}
      />
    </div>
  );
};
