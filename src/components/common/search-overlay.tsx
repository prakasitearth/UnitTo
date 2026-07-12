"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UnitConverter } from "@/lib/converter/unit-converter";
import { SearchResult } from "@/types/converter";
import { useLocale } from "@/hooks/use-locale";
import { trackEvent } from "@/lib/analytics/track";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  converterInstance: UnitConverter;
}

interface ParsedQuery {
  value: string | null;
  from: string;
  to: string;
}

function parseSearchQuery(query: string): ParsedQuery | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  // Pattern 1: [value] [from] [separator] [to] (e.g., "100 c to f", "1.5 kg to lbs", "50 usd to thb")
  const patternWithVal = /^([\d.,]+)\s*(.+?)\s+(?:to|➔|ไปยัง|เป็น|in|-)\s+(.+)$/i;
  let match = clean.match(patternWithVal);
  if (match) {
    return {
      value: match[1],
      from: match[2].trim(),
      to: match[3].trim()
    };
  }

  // Pattern 2: [from] [separator] [to] (e.g., "c to f", "cm to inches")
  const patternNoVal = /^(.+?)\s+(?:to|➔|ไปยัง|เป็น|in|-)\s+(.+)$/i;
  match = clean.match(patternNoVal);
  if (match) {
    return {
      value: null,
      from: match[1].trim(),
      to: match[2].trim()
    };
  }

  // Pattern 3: [value] [from] [to] (e.g., "100 c f", "100 cm inch")
  const patternWithValNoSep = /^([\d.,]+)\s+([a-zA-Z\u0e00-\u0e7f_]+)\s+([a-zA-Z\u0e00-\u0e7f_]+)$/i;
  match = clean.match(patternWithValNoSep);
  if (match) {
    return {
      value: match[1],
      from: match[2].trim(),
      to: match[3].trim()
    };
  }

  // Pattern 4: [from] [to] (e.g., "c f", "cm inch")
  const patternNoValNoSep = /^([a-zA-Z\u0e00-\u0e7f_]+)\s+([a-zA-Z\u0e00-\u0e7f_]+)$/i;
  match = clean.match(patternNoValNoSep);
  if (match) {
    return {
      value: null,
      from: match[1].trim(),
      to: match[2].trim()
    };
  }

  return null;
}

function findUnitByQueryTerm(converter: UnitConverter, term: string) {
  const cleanTerm = term.toLowerCase().trim();
  if (!cleanTerm) return null;

  const categories = converter.getCategories();

  // Try exact matches first
  for (const category of categories) {
    for (const unit of category.units) {
      const matchesId = unit.id.toLowerCase() === cleanTerm;
      const matchesName = unit.name.toLowerCase() === cleanTerm;
      const matchesSymbol = unit.symbol.toLowerCase() === cleanTerm;
      const matchesPlural = !!(unit.plural && unit.plural.toLowerCase() === cleanTerm);
      const matchesAlias = !!(unit.aliases && unit.aliases.some(alias => alias.toLowerCase() === cleanTerm));
      const matchesTranslation = !!(unit.translations && Object.values(unit.translations).some(trans => trans.toLowerCase() === cleanTerm));

      if (matchesId || matchesName || matchesSymbol || matchesPlural || matchesAlias || matchesTranslation) {
        return { category, unit };
      }
    }
  }

  // Try partial matches (includes)
  for (const category of categories) {
    for (const unit of category.units) {
      const matchesId = unit.id.toLowerCase().includes(cleanTerm);
      const matchesName = unit.name.toLowerCase().includes(cleanTerm);
      const matchesSymbol = unit.symbol.toLowerCase().includes(cleanTerm);
      const matchesPlural = !!(unit.plural && unit.plural.toLowerCase().includes(cleanTerm));
      const matchesAlias = !!(unit.aliases && unit.aliases.some(alias => alias.toLowerCase().includes(cleanTerm)));
      const matchesTranslation = !!(unit.translations && Object.values(unit.translations).some(trans => trans.toLowerCase().includes(cleanTerm)));

      if (matchesId || matchesName || matchesSymbol || matchesPlural || matchesAlias || matchesTranslation) {
        return { category, unit };
      }
    }
  }

  return null;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, converterInstance }) => {
  const router = useRouter();
  const { locale, t, tUnit, tCategory } = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSuggestions = React.useMemo(() => {
    const list: Array<{
      categoryId: string;
      slug: string;
      fromUnitId: string;
      toUnitId: string;
      icon: string;
    }> = [];
    
    const targetSlugs = [
      "usd-to-thb",
      "meters-to-feet",
      "kg-to-lbs",
      "celsius-to-fahrenheit",
      "hours-to-minutes",
      "kmh-to-mph",
      "sq-meters-to-sq-feet",
      "liters-to-gallons",
      "bar-to-psi",
      "gigabytes-to-megabytes",
      "degrees-to-radians",
      "mpg-us-to-liter-per-100km"
    ];

    const categories = converterInstance.getCategories();
    
    targetSlugs.forEach((slug) => {
      for (const cat of categories) {
        if (cat.popularConversions) {
          const match = cat.popularConversions.find((c) => c.slug === slug);
          if (match) {
            list.push({
              categoryId: cat.id,
              slug: match.slug,
              fromUnitId: match.from,
              toUnitId: match.to,
              icon: cat.icon
            });
            break;
          }
        }
      }
    });

    if (list.length < 12) {
      for (const cat of categories) {
        if (cat.popularConversions) {
          for (const pop of cat.popularConversions) {
            if (!list.some((item) => item.slug === pop.slug)) {
              list.push({
                categoryId: cat.id,
                slug: pop.slug,
                fromUnitId: pop.from,
                toUnitId: pop.to,
                icon: cat.icon
              });
            }
            if (list.length >= 12) break;
          }
        }
        if (list.length >= 12) break;
      }
    }

    return list.slice(0, 12);
  }, [converterInstance]);

  // Close helper that resets internal search state to avoid layout flashing
  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    onClose();
  }, [onClose]);

  const handleItemSelect = useCallback((path: string, unitId: string) => {
    trackEvent("select_search_result", "search", unitId);
    router.push(`/${locale}${path}`);
    handleClose();
  }, [locale, router, handleClose]);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard navigation control (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowDown" && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp" && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
        const selected = results[activeIndex];
        if (selected) {
          const category = converterInstance.getCategory(selected.categoryId);
          let path = selected.customPath || `/${selected.categoryId}`;
          if (!selected.customPath && category?.popularConversions) {
            const match = category.popularConversions.find(
              (c) => c.from === selected.unitId || c.to === selected.unitId
            );
            if (match) {
              path = `/${match.slug}`;
            }
          }
          handleItemSelect(path, selected.unitId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, results, selectedIndex, converterInstance, handleItemSelect, handleClose]);

  // Process search queries
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1); // Reset selection index immediately on typing
    if (val.trim()) {
      // 1. Check if the query is a pair conversion query (e.g. "100 c to f" or "c to f")
      const parsed = parseSearchQuery(val);
      if (parsed) {
        const fromMatch = findUnitByQueryTerm(converterInstance, parsed.from);
        const toMatch = findUnitByQueryTerm(converterInstance, parsed.to);

        if (fromMatch && toMatch && fromMatch.category.id === toMatch.category.id) {
          const fromUnit = fromMatch.unit;
          const toUnit = toMatch.unit;
          const category = fromMatch.category;
          
          let slug = `${fromUnit.plural || fromUnit.id}-to-${toUnit.plural || toUnit.id}`.toLowerCase().replace(/\s+/g, "-");
          if (category.popularConversions) {
            const popularMatch = category.popularConversions.find(
              (c) => (c.from === fromUnit.id && c.to === toUnit.id) || (c.from === toUnit.id && c.to === fromUnit.id)
            );
            if (popularMatch) {
              slug = popularMatch.slug;
            }
          }

          const path = `/${slug}${parsed.value ? `?val=${parsed.value}` : ""}`;
          
          setResults([{
            category: category.name,
            categoryId: category.id,
            unit: `${parsed.value ? `${parsed.value} ` : ""}${fromUnit.name} to ${toUnit.name}`,
            unitId: fromUnit.id,
            symbol: category.icon,
            customPath: path,
            isPairResult: true,
            fromUnitId: fromUnit.id,
            toUnitId: toUnit.id,
            val: parsed.value || undefined
          }]);
          trackEvent("type_search_query", "search_pair", val);
          return;
        }
      }

      // 2. Default search for single term
      const searchRes = converterInstance.searchUnits(val);
      const expandedResults: SearchResult[] = [];
      const addedKeys = new Set<string>();

      searchRes.forEach((res) => {
        const category = converterInstance.getCategory(res.categoryId);
        if (category && category.popularConversions) {
          const matchingPopulars = category.popularConversions.filter(
            (c) => c.from === res.unitId || c.to === res.unitId
          );
          
          matchingPopulars.forEach((pop) => {
            const key = `${res.categoryId}:${pop.slug}`;
            if (!addedKeys.has(key)) {
              addedKeys.add(key);
              const fromUnit = category.units.find((u) => u.id === pop.from);
              const toUnit = category.units.find((u) => u.id === pop.to);
              
              if (fromUnit && toUnit) {
                expandedResults.push({
                  category: category.name,
                  categoryId: category.id,
                  unit: `${fromUnit.name} to ${toUnit.name}`,
                  unitId: res.unitId,
                  symbol: category.icon,
                  customPath: `/${pop.slug}`,
                  isPairResult: true,
                  fromUnitId: fromUnit.id,
                  toUnitId: toUnit.id
                });
              }
            }
          });
        }

        const singleKey = `${res.categoryId}:${res.unitId}`;
        if (!addedKeys.has(singleKey)) {
          addedKeys.add(singleKey);
          expandedResults.push({
            ...res,
            symbol: category?.icon || res.symbol
          });
        }
      });

      setResults(expandedResults.slice(0, 8));
      trackEvent("type_search_query", "search", val);
    } else {
      setResults([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-zinc-950/50 dark:bg-black/75 backdrop-blur-xs flex justify-center pt-24 px-4 transition-all duration-200"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[550px] shadow-2xl flex flex-col overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search Units"
      >
        {/* Search Header Input */}
        <div className="flex items-center border-b border-gray-100 dark:border-zinc-800 p-4">
          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={handleInputChange}
            className="flex-1 outline-none text-base text-gray-800 dark:text-gray-100 bg-transparent font-medium"
            aria-label="Search input"
          />
          <button 
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results Suggestion Box */}
        <div className="flex-1 overflow-y-auto p-2" aria-label="Search suggestions">
          {query.trim() === "" ? (
            <div className="p-3">
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
                {locale === "th" ? "ตัวแปลงที่นิยมใช้งาน (Popular Conversions)" : "Popular Conversions"}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popularSuggestions.map((item) => {
                  const fromName = tUnit(item.fromUnitId, "");
                  const toName = tUnit(item.toUnitId, "");
                  const category = converterInstance.getCategory(item.categoryId);
                  const localizedCatName = category ? tCategory(category.id, category.name, "").name : "";

                  return (
                    <button
                      key={item.slug}
                      onClick={() => handleItemSelect(`/${item.slug}`, item.fromUnitId)}
                      className="flex items-center space-x-3 p-3 rounded-xl border border-gray-100 dark:border-zinc-800/80 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-zinc-800/60 transition-all text-left outline-none group"
                    >
                      <span className="text-lg bg-gray-50 dark:bg-zinc-800 p-2 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors">
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">
                          {fromName} ➔ {toName}
                        </div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                          {localizedCatName}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500 font-medium">
              {t("searchNoResult") + " \"" + query + "\""}
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((res, index) => {
                const category = converterInstance.getCategory(res.categoryId);
                let path = res.customPath || `/${res.categoryId}`;
                
                if (!res.customPath && category?.popularConversions) {
                  const match = category.popularConversions.find(
                    (c) => c.from === res.unitId || c.to === res.unitId
                  );
                  if (match) {
                    path = `/${match.slug}`;
                  }
                }

                const localizedCatName = tCategory(res.categoryId, res.category, "").name;
                
                let localizedUnitName = "";
                if (res.isPairResult && res.fromUnitId && res.toUnitId) {
                  const fromName = tUnit(res.fromUnitId, "");
                  const toName = tUnit(res.toUnitId, "");
                  const valText = res.val ? `${res.val} ` : "";
                  localizedUnitName = `${valText}${fromName} ➔ ${toName}`;
                } else {
                  localizedUnitName = tUnit(res.unitId, res.unit);
                }

                const isSelected = index === selectedIndex;

                return (
                  <li key={`${res.categoryId}:${res.unitId}:${res.isPairResult ? res.customPath : ""}`}>
                    <button
                      onClick={() => handleItemSelect(path, res.unitId)}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-colors duration-150 outline-none ${
                        isSelected 
                          ? "bg-blue-50 dark:bg-zinc-800" 
                          : "hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400 dark:text-gray-500 text-sm font-semibold uppercase font-mono w-10 text-center flex items-center justify-center">
                          {res.symbol}
                        </span>
                        <div>
                          <div className="font-bold text-gray-800 dark:text-gray-200 capitalize">
                            {localizedUnitName}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 capitalize font-medium">
                            Category: {localizedCatName}
                          </div>
                        </div>
                      </div>
                      
                      <span className="text-xs font-semibold px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                        {t("calculate")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
