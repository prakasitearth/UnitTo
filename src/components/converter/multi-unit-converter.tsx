"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Category, Unit, ConversionDatabase } from "@/types/converter";
import { UnitConverter } from "@/lib/converter/unit-converter";
import { useLocale } from "@/hooks/use-locale";
import { trackEvent } from "@/lib/analytics/track";
import unitsDataRaw from "@/data/units.json";

const converter = new UnitConverter(unitsDataRaw as unknown as ConversionDatabase);

interface MultiUnitConverterProps {
  category: Category;
}

/**
 * Multi-Unit Simultaneous Converter
 * Like Digital Dutch - enter a value in ANY unit field, and ALL other fields update in real-time.
 */
export const MultiUnitConverter: React.FC<MultiUnitConverterProps> = ({ category }) => {
  const { t, tUnit } = useLocale();

  // Track which unit is the active "source" and the raw input string
  const [activeUnitId, setActiveUnitId] = useState<string>(category.units[0]?.id || "");
  const [inputValue, setInputValue] = useState<string>("1");
  const [copiedUnitId, setCopiedUnitId] = useState<string | null>(null);

  // Listen for sync event from ConverterForm
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ unitId: string; value: string }>;
      const { unitId, value } = customEvent.detail;
      
      if (unitId === activeUnitId && value === inputValue) return;

      setActiveUnitId(unitId);
      setInputValue(value);
    };

    window.addEventListener("unit-value-updated", handleSync);
    return () => {
      window.removeEventListener("unit-value-updated", handleSync);
    };
  }, [activeUnitId, inputValue]);

  // Compute all conversion results from the active unit's value
  const computeResults = useCallback((): Map<string, string> => {
    const results = new Map<string, string>();
    const numValue = parseFloat(inputValue);

    if (inputValue.trim() === "" || isNaN(numValue)) {
      // Show empty for all units when input is invalid
      category.units.forEach((unit) => {
        results.set(unit.id, unit.id === activeUnitId ? inputValue : "");
      });
      return results;
    }

    category.units.forEach((unit) => {
      if (unit.id === activeUnitId) {
        results.set(unit.id, inputValue);
      } else {
        try {
          const converted = converter.convert(numValue, activeUnitId, unit.id, category.id);
          const rounded = converter.round(converted, 8);
          results.set(unit.id, formatNumber(rounded));
        } catch {
          results.set(unit.id, "—");
        }
      }
    });

    return results;
  }, [inputValue, activeUnitId, category]);

  const results = computeResults();

  // Handle typing in any unit field
  const handleUnitInput = (unit: Unit, value: string) => {
    setActiveUnitId(unit.id);
    setInputValue(value);
    trackEvent("multi_convert_input", "multi_converter", unit.id);
    window.dispatchEvent(new CustomEvent("unit-value-updated", {
      detail: { unitId: unit.id, value: value }
    }));
  };

  // Copy a specific unit's value
  const handleCopy = async (unit: Unit) => {
    const val = results.get(unit.id) || "";
    if (!val || val === "—") return;
    try {
      await navigator.clipboard.writeText(val);
      setCopiedUnitId(unit.id);
      trackEvent("multi_convert_copy", "multi_converter", unit.id);
      setTimeout(() => setCopiedUnitId(null), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle input focus: select all text and set as active
  const handleFocus = (unit: Unit, e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
    if (unit.id !== activeUnitId) {
      const currentVal = results.get(unit.id) || "";
      if (currentVal && currentVal !== "—") {
        setActiveUnitId(unit.id);
        setInputValue(currentVal);
      }
    }
  };

  // Reset all to default
  const handleReset = () => {
    const firstUnitId = category.units[0]?.id || "";
    setActiveUnitId(firstUnitId);
    setInputValue("1");
    trackEvent("multi_convert_reset", "multi_converter", category.id);
    window.dispatchEvent(new CustomEvent("unit-value-updated", {
      detail: { unitId: firstUnitId, value: "1" }
    }));
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center space-x-2.5">
          <span className="text-2xl" role="img" aria-label={category.name}>{category.icon}</span>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {t("multiConverterTitle")}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              {t("multiConverterDesc")}
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
        >
          {t("resetAll")}
        </button>
      </div>

      {/* Unit Rows - All units listed with editable input fields */}
      <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
        {category.units.map((unit) => {
          const isActive = unit.id === activeUnitId;
          const value = results.get(unit.id) || "";
          const isCopied = copiedUnitId === unit.id;
          const localizedName = tUnit(unit.id, unit.name);

          return (
            <div
              key={unit.id}
              className={`flex items-center px-4 py-3 transition-all duration-150 group ${
                isActive
                  ? "bg-blue-50/60 dark:bg-blue-950/15 border-l-[3px] border-l-blue-500"
                  : "hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 border-l-[3px] border-l-transparent"
              }`}
            >
              {/* Unit Info (Label + Symbol) */}
              <div className="flex-shrink-0 w-[140px] sm:w-[180px]">
                <div className={`text-sm font-bold truncate transition-colors ${
                  isActive ? "text-blue-700 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"
                }`}>
                  {localizedName}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold font-mono">
                  {unit.symbol}
                </div>
              </div>

              {/* Editable Input Field */}
              <div className="flex-1 mx-3">
                <input
                  type="text"
                  inputMode="decimal"
                  value={value}
                  onChange={(e) => handleUnitInput(unit, e.target.value)}
                  onFocus={(e) => handleFocus(unit, e)}
                  className={`w-full bg-transparent outline-none text-right font-mono text-base font-bold px-3 py-1.5 rounded-xl border transition-all ${
                    isActive
                      ? "border-blue-300 dark:border-blue-700 bg-white dark:bg-zinc-900 shadow-sm ring-2 ring-blue-500/10 dark:ring-blue-500/20 text-blue-700 dark:text-blue-300"
                      : "border-transparent hover:border-slate-200 dark:hover:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-900"
                  }`}
                  placeholder="0"
                  aria-label={`Value in ${localizedName}`}
                />
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(unit)}
                disabled={!value || value === "—"}
                className={`flex-shrink-0 p-2 rounded-lg transition-all cursor-pointer ${
                  isCopied
                    ? "text-green-500 bg-green-50 dark:bg-green-950/20"
                    : "text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 opacity-0 group-hover:opacity-100"
                } ${(!value || value === "—") ? "invisible" : ""}`}
                aria-label={`Copy ${localizedName} value`}
                title={isCopied ? t("copied") : t("copy")}
              >
                {isCopied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800/60 bg-slate-50/30 dark:bg-zinc-900/30">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold text-center">
          💡 {t("multiConverterHint")}
        </p>
      </div>
    </div>
  );
};

/**
 * Format number for display - removes trailing zeros and uses locale-aware formatting
 */
function formatNumber(num: number): string {
  if (isNaN(num) || !isFinite(num)) return "—";

  // For very large or very small numbers, use scientific notation
  if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-8 && num !== 0)) {
    return num.toExponential(6);
  }

  // Otherwise, format with up to 8 decimal places, trimming trailing zeros
  const str = num.toFixed(8);
  // Remove trailing zeros after decimal point
  return str.replace(/\.?0+$/, "");
}
