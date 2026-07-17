"use client";

import React, { useState, useEffect } from "react";
import { Category, Unit, ConversionDatabase } from "@/types/converter";
import { UnitConverter } from "@/lib/converter/unit-converter";
import { useRecentConversions } from "@/hooks/use-recent-conversions";
import { useFavoriteConversions } from "@/hooks/use-favorite-conversions";
import { useLocale } from "@/hooks/use-locale";
import { trackEvent } from "@/lib/analytics/track";
import unitsDataRaw from "@/data/units.json";

// Initialize local UnitConverter instance for calculations
const converter = new UnitConverter(unitsDataRaw as unknown as ConversionDatabase);

interface ConverterFormProps {
  category: Category;
  initialFromUnit: Unit;
  initialToUnit: Unit;
  isWidget?: boolean;
}

export const ConverterForm: React.FC<ConverterFormProps> = ({
  category,
  initialFromUnit,
  initialToUnit,
  isWidget = false,
}) => {
  const { addConversion } = useRecentConversions();
  const { toggleFavorite, isFavorite } = useFavoriteConversions();
  const { locale, t, tUnit } = useLocale();

  // State Management
  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<Unit>(initialFromUnit);
  const [toUnit, setToUnit] = useState<Unit>(initialToUnit);

  // Support custom widget settings from query parameters
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>("1");
  const [customBgColor, setCustomBgColor] = useState<string>("1");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const primaryColor = params.get("primary");
      const bgColor = params.get("bg");
      
      const hexRegex = /^[0-9A-F]{6}$/i;
      if (primaryColor && hexRegex.test(primaryColor)) {
        setCustomPrimaryColor(`#${primaryColor}`);
      }
      if (bgColor && hexRegex.test(bgColor)) {
        setCustomBgColor(`#${bgColor}`);
      }
    }
  }, []);

  const widgetStyles: any = {};
  if (customPrimaryColor && customPrimaryColor !== "1") {
    widgetStyles["--primary"] = customPrimaryColor;
    widgetStyles["--primary-hover"] = customPrimaryColor;
    widgetStyles["--secondary"] = customPrimaryColor;
  }
  if (customBgColor && customBgColor !== "1") {
    widgetStyles["--background"] = customBgColor;
    widgetStyles["--card-bg"] = customBgColor;
  }

  const isFav = isFavorite(fromUnit.id, toUnit.id);
  const handleToggleFavorite = () => {
    const slug = `${fromUnit.plural || fromUnit.id}-to-${toUnit.plural || toUnit.id}`.toLowerCase().replace(/\s+/g, "-");
    toggleFavorite({
      fromUnitId: fromUnit.id,
      fromUnitSymbol: fromUnit.symbol,
      toUnitId: toUnit.id,
      toUnitSymbol: toUnit.symbol,
      categoryId: category.id,
      categoryName: category.name,
      slug: slug
    });
  };

  // Listen for sync event from MultiUnitConverter
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ unitId: string; value: string; source?: string }>;
      const { unitId, value, source } = customEvent.detail;
      
      if (source === "converter-form") return;
      if (unitId === fromUnit.id && value === fromValue) return;

      // If the event is for the same unit, sync the value exactly as is (preserving dots/commas/zeros)
      if (unitId === fromUnit.id) {
        setFromValue(value);
        return;
      }

      const numVal = parseFloat(value);
      if (value.trim() === "" || isNaN(numVal)) {
        setFromValue(value);
        return;
      }

      try {
        const converted = converter.convert(numVal, unitId, fromUnit.id, category.id);
        const rounded = converter.round(converted, 6);
        setFromValue(rounded.toString());
      } catch {
        // Ignore conversion errors
      }
    };

    window.addEventListener("unit-value-updated", handleSync);
    return () => {
      window.removeEventListener("unit-value-updated", handleSync);
    };
  }, [fromUnit, category, fromValue]);

  // Read value parameter from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const val = params.get("val") || params.get("value");
      if (val) {
        setFromValue(val);
        // Dispatch event so the bottom MultiUnitConverter syncs up
        window.dispatchEvent(new CustomEvent("unit-value-updated", {
          detail: { unitId: fromUnit.id, value: val, source: "converter-form" }
        }));
      }
    }
  }, []);
  
  const [copied, setCopied] = useState<boolean>(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);
  const [isEmbedCopied, setIsEmbedCopied] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Derived State (Real-time Instant Calculation) computed during render to avoid cascading renders
  let toValue = "";
  let error: string | null = null;
  const numValue = parseFloat(fromValue);

  if (fromValue.trim() !== "") {
    if (isNaN(numValue)) {
      toValue = "";
      error = "กรุณากรอกตัวเลขที่ถูกต้อง / Please enter a valid number";
    } else {
      try {
        const converted = converter.convert(numValue, fromUnit.id, toUnit.id, category.id);
        toValue = converter.round(converted, 6).toString();
      } catch (err: unknown) {
        toValue = "";
        error = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการแปลงหน่วย";
      }
    }
  }

  // Save to recent conversions history with debouncing (no state changes in effect body)
  useEffect(() => {
    const parsedNumValue = parseFloat(fromValue);
    if (!isNaN(parsedNumValue) && fromValue.trim() !== "") {
      try {
        const converted = converter.convert(parsedNumValue, fromUnit.id, toUnit.id, category.id);
        const rounded = converter.round(converted, 6);

        const debounceTimeout = setTimeout(() => {
          addConversion({
            value: parsedNumValue,
            fromUnitId: fromUnit.id,
            fromUnitSymbol: fromUnit.symbol,
            toUnitId: toUnit.id,
            toUnitSymbol: toUnit.symbol,
            categoryId: category.id,
            categoryName: category.name,
            result: rounded,
          });
        }, 800);

        return () => clearTimeout(debounceTimeout);
      } catch {
        // Ignore math conversion path errors for history mapping
      }
    }
  }, [fromValue, fromUnit, toUnit, category, addConversion]);

  // Swap Units Logic
  const handleSwap = () => {
    setIsSwapping(true);
    trackEvent("swap_units", "converter", `${fromUnit.id}_to_${toUnit.id}`);
    setTimeout(() => {
      setIsSwapping(false);
    }, 300);

    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    
    // Swap values if output exists
    if (toValue && !error) {
      setFromValue(toValue);
      window.dispatchEvent(new CustomEvent("unit-value-updated", {
        detail: { unitId: toUnit.id, value: toValue, source: "converter-form" }
      }));
    }
  };

  // Copy Result Utility
  const handleCopy = async () => {
    if (!toValue || error) return;
    
    try {
      await navigator.clipboard.writeText(toValue);
      trackEvent("copy_result", "converter", `${fromUnit.id}_to_${toUnit.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Auto focus and select input text on focus
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div 
      style={widgetStyles}
      className={`bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-lg transition-colors duration-200 relative ${
        isWidget ? "" : "blueprint-border tick-x tick-y text-sky-500/35 dark:text-sky-400/20"
      }`}
    >
      
      {/* Favorite Toggle Button */}
      {!isWidget && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 hover:scale-105 duration-200 ${
              isFav
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-300 text-amber-500 hover:bg-amber-100 dark:border-amber-900/30"
                : "bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/85 dark:hover:bg-zinc-850 border-slate-200 dark:border-zinc-700/60 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
            }`}
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
            aria-label="Toggle favorite conversion"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Dynamic Error Status Banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Main Grid: Input Form vs Output Form */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        
        {/* Source Unit Input Group */}
        <div className="md:col-span-5 space-y-2">
          <label htmlFor="from-value" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {t("from")}
          </label>
          <div className="relative flex items-center bg-slate-50 dark:bg-zinc-950/40 rounded-2xl border border-slate-200/80 dark:border-zinc-800/85 p-1 focus-within:ring-3 focus-within:ring-primary-brand/10 dark:focus-within:ring-primary-brand/20 focus-within:border-primary-brand transition-all">
            <input
              id="from-value"
              type="text"
              inputMode="decimal"
              value={fromValue}
              onChange={(e) => {
                // Normalize commas to dots for keyboards outputting commas as decimals
                const val = e.target.value.replace(/,/g, ".");
                setFromValue(val);
                window.dispatchEvent(new CustomEvent("unit-value-updated", {
                  detail: { unitId: fromUnit.id, value: val, source: "converter-form" }
                }));
              }}
              onFocus={handleInputFocus}
              className="w-full bg-transparent outline-none px-3 py-2 text-xl font-bold text-gray-800 dark:text-gray-100 font-mono"
              placeholder="..."
              aria-label="Source value input"
              autoFocus
            />
            <select
              value={fromUnit.id}
              onChange={(e) => {
                const matched = category.units.find(u => u.id === e.target.value);
                if (matched) {
                  setFromUnit(matched);
                  trackEvent("change_source_unit", "converter", matched.id);
                  window.dispatchEvent(new CustomEvent("unit-value-updated", {
                    detail: { unitId: matched.id, value: fromValue, source: "converter-form" }
                  }));
                }
              }}
              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-2xs outline-none cursor-pointer max-w-[130px] truncate focus:border-primary-brand transition-all"
              aria-label="Source unit select"
            >
              {category.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol} ({tUnit(unit.id, unit.name)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Interactive Swap Button */}
        <div className="md:col-span-1 flex justify-center py-2 md:py-0">
          <button
            onClick={handleSwap}
            className={`p-3 rounded-full bg-slate-50 hover:bg-primary-brand dark:bg-zinc-900 dark:hover:bg-primary-brand text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white border border-slate-200/60 dark:border-zinc-800/80 shadow-2xs hover:shadow-xs active:scale-95 hover:scale-105 transition-all duration-300 ${
              isSwapping ? "rotate-180" : ""
            }`}
            aria-label="Swap Units"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </button>
        </div>

        {/* Target Unit Output Group */}
        <div className="md:col-span-5 space-y-2">
          <label htmlFor="to-value" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {t("to")}
          </label>
          <div className="relative flex items-center bg-slate-50 dark:bg-zinc-950/40 rounded-2xl border border-slate-200/80 dark:border-zinc-800/85 p-1 focus-within:ring-3 focus-within:ring-primary-brand/10 dark:focus-within:ring-primary-brand/20 focus-within:border-primary-brand transition-all">
            <input
              id="to-value"
              type="text"
              readOnly
              value={toValue}
              className="w-full bg-transparent outline-none px-3 py-2 text-xl font-bold text-primary-brand font-mono select-all cursor-default"
              placeholder="..."
              aria-label="Target conversion output"
            />
            <select
              value={toUnit.id}
              onChange={(e) => {
                const matched = category.units.find(u => u.id === e.target.value);
                if (matched) {
                  setToUnit(matched);
                  trackEvent("change_target_unit", "converter", matched.id);
                }
              }}
              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-2xs outline-none cursor-pointer max-w-[130px] truncate focus:border-primary-brand transition-all"
              aria-label="Target unit select"
            >
              {category.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol} ({tUnit(unit.id, unit.name)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Copy Result Actions Bar */}
      <div className="mt-6 flex justify-end space-x-2">
        {!isWidget && (
          <button
            onClick={() => setIsEmbedOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer active:scale-98 shadow-sm"
            aria-label="Embed this converter tool"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>{t("embedBtn")}</span>
          </button>
        )}
        <button
          onClick={handleCopy}
          disabled={!toValue || !!error}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer ${
            !toValue || error
              ? "bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 cursor-not-allowed border border-slate-200/40 dark:border-zinc-800/40"
              : copied
              ? "bg-green-500 text-white shadow-xs"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow active:scale-98"
          }`}
          aria-label="Copy conversion result to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t("copied")}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{t("copy")}</span>
            </>
          )}
        </button>
      </div>

      {/* Embed Modal Dialog */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-150 flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>{t("embedTitle")}</span>
              </h3>
              <button 
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              {t("embedDesc")}
            </p>

            <div className="relative">
              <textarea
                readOnly
                value={`<iframe src="${typeof window !== 'undefined' ? window.location.origin : 'https://unittogo.com'}/${locale}/widget/${fromUnit.id}-to-${toUnit.id}" width="100%" height="280" style="border:1px solid #e2e8f0; border-radius:16px;"></iframe>`}
                className="w-full h-24 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-3 font-mono text-[10px] text-slate-500 dark:text-slate-300 outline-none resize-none select-all"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>

            <div className="flex justify-end space-x-2.5 pt-2">
              <button
                onClick={async () => {
                  const embedCode = `<iframe src="${window.location.origin}/${locale}/widget/${fromUnit.id}-to-${toUnit.id}" width="100%" height="280" style="border:1px solid #e2e8f0; border-radius:16px;"></iframe>`;
                  try {
                    await navigator.clipboard.writeText(embedCode);
                    setIsEmbedCopied(true);
                    setTimeout(() => setIsEmbedCopied(false), 2000);
                  } catch (err) {
                    console.error("Embed copy failed:", err);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                  isEmbedCopied ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }`}
              >
                {isEmbedCopied ? t("embedCopied") : t("copy")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Widget Footer & Backlink */}
      {isWidget && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
          <span>{category.name} Converter</span>
          <a
            href={`https://unittogo.com/${locale}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 hover:underline flex items-center space-x-1"
          >
            <span>Powered by UnitToGo</span>
            <span>⚡</span>
          </a>
        </div>
      )}
    </div>
  );
};
