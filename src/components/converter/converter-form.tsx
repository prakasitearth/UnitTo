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
}

export const ConverterForm: React.FC<ConverterFormProps> = ({
  category,
  initialFromUnit,
  initialToUnit,
}) => {
  const { addConversion } = useRecentConversions();
  const { toggleFavorite, isFavorite } = useFavoriteConversions();
  const { t, tUnit } = useLocale();

  // State Management
  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<Unit>(initialFromUnit);
  const [toUnit, setToUnit] = useState<Unit>(initialToUnit);

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
      const customEvent = e as CustomEvent<{ unitId: string; value: string }>;
      const { unitId, value } = customEvent.detail;
      
      if (unitId === fromUnit.id && value === fromValue) return;

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
          detail: { unitId: fromUnit.id, value: val }
        }));
      }
    }
  }, []);
  
  const [copied, setCopied] = useState<boolean>(false);
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
        detail: { unitId: toUnit.id, value: toValue }
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
    <div className="bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-lg transition-colors duration-200 relative blueprint-border tick-x tick-y text-sky-500/35 dark:text-sky-400/20">
      
      {/* Favorite Toggle Button */}
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
              pattern="[0-9]*"
              value={fromValue}
              onChange={(e) => {
                const val = e.target.value;
                setFromValue(val);
                window.dispatchEvent(new CustomEvent("unit-value-updated", {
                  detail: { unitId: fromUnit.id, value: val }
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
                    detail: { unitId: matched.id, value: fromValue }
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
    </div>
  );
};
