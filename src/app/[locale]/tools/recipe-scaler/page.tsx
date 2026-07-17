"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Preset scale factors
const SCALE_FACTORS = [
  { label: "0.5x (Half)", value: 0.5 },
  { label: "1x (Normal)", value: 1.0 },
  { label: "1.5x (One & Half)", value: 1.5 },
  { label: "2x (Double)", value: 2.0 },
  { label: "3x (Triple)", value: 3.0 }
];

// Helper to parse numbers and fractions (e.g. "1/2", "1 1/2", "2.5")
function parseFractionOrDecimal(str: string): number {
  str = str.trim();
  if (str.includes("/")) {
    const parts = str.split(/\s+/);
    if (parts.length === 2) {
      const whole = parseFloat(parts[0]);
      const fracParts = parts[1].split("/");
      return whole + parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    } else {
      const fracParts = parts[0].split("/");
      return parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    }
  }
  return parseFloat(str);
}

function formatDecimal(val: number): string {
  if (Math.abs(val - Math.round(val)) < 0.01) {
    return Math.round(val).toString();
  }
  return parseFloat(val.toFixed(2)).toString();
}

export default function RecipeScalerPage() {
  const { locale } = useParams() as { locale: string };

  const [inputRecipe, setInputRecipe] = useState<string>(
    locale === "th"
      ? "แป้งเค้ก 2 ถ้วยตวง\nน้ำตาลทราย 1/2 ถ้วยตวง\nเนยจืด 1 ถ้วยตวง\nเกลือ 1 ช้อนชา\nไข่ไก่ 3 ฟอง"
      : "2 cups cake flour\n1/2 cup granulated sugar\n1 cup unsalted butter\n1 tsp salt\n3 large eggs"
  );
  const [scaleFactor, setScaleFactor] = useState<number>(2.0);
  const [convertToWeight, setConvertToWeight] = useState<boolean>(true);
  const [scaledRecipe, setScaledRecipe] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Core parser and scaling engine
  useEffect(() => {
    const lines = inputRecipe.split("\n");
    const parsedLines = lines.map((line) => {
      if (!line.trim()) return "";

      // Regex to detect fractions (1/2, 1 1/2) or decimals/integers at the beginning of the line
      const numMatch = line.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s*(.*)$/);
      if (!numMatch) {
        // No quantity found at start, return line unmodified
        return line;
      }

      const numStr = numMatch[1];
      const rest = numMatch[2].trim();
      
      let amount = parseFractionOrDecimal(numStr);
      if (isNaN(amount)) return line;

      // Scale the value
      let scaledAmount = amount * scaleFactor;

      if (convertToWeight) {
        // Attempt to extract unit and ingredient name
        // Matching common volume units: cup, tbsp, tsp, ถ้วยตวง, ช้อนโต๊ะ, ช้อนชา
        const unitMatch = rest.match(/^(cups?|tbsp|teaspoons?|teaspoon|tablespoon|tsp|ถ้วยตวง|ช้อนโต๊ะ|ช้อนชา)\s+(.*)$/i);
        if (unitMatch) {
          const unitStr = unitMatch[1];
          const ingredientStr = unitMatch[2].trim();
          
          const normalizedRest = ingredientStr.toLowerCase();
          const normalizedUnit = unitStr.toLowerCase();
          
          let density = 240; // Default to water density (240g per cup)
          let converted = false;
          
          if (normalizedRest.includes("flour") || normalizedRest.includes("แป้ง")) {
            density = 120; // 1 cup flour = 120g
            converted = true;
          } else if (normalizedRest.includes("sugar") || normalizedRest.includes("น้ำตาล")) {
            density = 200; // 1 cup sugar = 200g
            converted = true;
          } else if (normalizedRest.includes("butter") || normalizedRest.includes("เนย")) {
            density = 227; // 1 cup butter = 227g
            converted = true;
          } else if (normalizedRest.includes("water") || normalizedRest.includes("milk") || normalizedRest.includes("น้ำ") || normalizedRest.includes("นม") || normalizedRest.includes("oil") || normalizedRest.includes("น้ำมัน")) {
            density = 240; // 1 cup liquid = 240g/ml
            converted = true;
          } else if (normalizedRest.includes("salt") || normalizedRest.includes("เกลือ") || normalizedRest.includes("yeast") || normalizedRest.includes("ยีสต์") || normalizedRest.includes("baking") || normalizedRest.includes("ผงฟู")) {
            density = 240; // Heavy powders
            converted = true;
          }

          if (converted) {
            const isCup = /\bcups?\b/i.test(normalizedUnit) || normalizedUnit.includes("ถ้วย");
            const isTbsp = /\b(tablespoons?|tbsp|tbs)\b/i.test(normalizedUnit) || normalizedUnit.includes("ช้อนโต๊ะ");
            const isTsp = /\b(teaspoons?|tsp)\b/i.test(normalizedUnit) || normalizedUnit.includes("ช้อนชา");

            if (isCup) {
              const weightVal = scaledAmount * density;
              return `${formatDecimal(weightVal)}g ${ingredientStr}`;
            } else if (isTbsp) {
              const weightVal = scaledAmount * (density / 16);
              return `${formatDecimal(weightVal)}g ${ingredientStr}`;
            } else if (isTsp) {
              const weightVal = scaledAmount * (density / 48);
              return `${formatDecimal(weightVal)}g ${ingredientStr}`;
            }
          }
        }
      }

      // Default scaling without weight conversion
      return `${formatDecimal(scaledAmount)} ${rest}`;
    });

    setScaledRecipe(parsedLines.join("\n"));
  }, [inputRecipe, scaleFactor, convertToWeight]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scaledRecipe);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      th: {
        title: "เครื่องมือสเกลสูตรอาหารและขนม (Baking Recipe Scaler)",
        desc: "ขยายหรือย่อส่วนผสมสูตรขนมและเบเกอรี่ของคุณอย่างรวดเร็ว พร้อมตัวเลือกแปลงหน่วยวัดปริมาตร (ถ้วย/ช้อน) เป็นหน่วยน้ำหนักกรัม (g) ในคลิกเดียว",
        back: "กลับหน้าแรก",
        inputLabel: "✍️ วางสูตรอาหารของคุณตรงนี้",
        outputLabel: "✨ สูตรอาหารที่คำนวณสเกลใหม่แล้ว",
        scaleFactorLabel: "เลือกอัตราส่วนการขยายสูตร (Scale Factor)",
        convertWeightLabel: "แปลงหน่วยปริมาตร (ถ้วย/ช้อน) เป็นหน่วยน้ำหนักกรัม (g) อัตโนมัติเพื่อความแม่นยำ",
        copy: "คัดลอกสูตรใหม่",
        copied: "คัดลอกสำเร็จแล้ว! 🍰",
        placeholder: "ตัวอย่าง:\n2 ถ้วยตวง แป้งพัดโบก\n1/2 ถ้วยตวง น้ำตาลทราย\n1 ช้อนชา เกลือ"
      },
      en: {
        title: "Baking Recipe Quantity Scaler",
        desc: "Scale your baking recipes up or down in real-time. Automatically convert volume measurements (cups/spoons) to grams (g) for maximum baking precision.",
        back: "Back to Home",
        inputLabel: "✍️ Paste Your Original Recipe Here",
        outputLabel: "✨ Scaled & Converted Recipe",
        scaleFactorLabel: "Choose Scale Factor",
        convertWeightLabel: "Auto-convert cups/spoons to grams (g) for higher baking accuracy",
        copy: "Copy Scaled Recipe",
        copied: "Copied! 🍰",
        placeholder: "Example:\n2 cups all-purpose flour\n1/2 cup sugar\n1 tsp salt"
      }
    };
    return translations[locale]?.[key] || translations["en"][key];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-gray-900 dark:text-gray-150">
      
      {/* Breadcrumb Header */}
      <div className="mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          ← {t("back")}
        </Link>
      </div>

      {/* Main Title */}
      <header className="mb-8 text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 dark:from-amber-400 dark:to-orange-500 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          {t("desc")}
        </p>
      </header>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Input Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/85 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {t("inputLabel")}
            </h2>
          </div>

          <textarea
            value={inputRecipe}
            onChange={(e) => setInputRecipe(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full h-72 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 font-mono text-sm text-slate-700 dark:text-slate-300 outline-none resize-none focus:border-orange-500"
          />

          {/* Config: Scale Factor & Convert Weight */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t("scaleFactorLabel")}
              </label>
              
              <div className="flex flex-wrap gap-2">
                {SCALE_FACTORS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setScaleFactor(f.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      scaleFactor === f.value
                        ? "bg-orange-550 border-orange-500 text-white shadow-xs"
                        : "bg-slate-50 border-slate-200/85 text-slate-655 dark:bg-zinc-800 dark:border-zinc-700/80 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Scale Input Slider */}
            <div className="flex items-center space-x-4 py-2">
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.1"
                value={scaleFactor}
                onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
                className="flex-1 accent-orange-500 h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-black font-mono px-3 py-1.5 bg-orange-50 dark:bg-orange-950/20 text-orange-655 border border-orange-200 rounded-xl">
                {scaleFactor.toFixed(1)}x
              </span>
            </div>

            {/* Convert Weight Switch */}
            <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/85 rounded-2xl select-none">
              <input
                type="checkbox"
                checked={convertToWeight}
                onChange={(e) => setConvertToWeight(e.target.checked)}
                className="mt-1 w-4.5 h-4.5 accent-orange-500 cursor-pointer"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                {t("convertWeightLabel")}
              </span>
            </label>

          </div>
        </div>

        {/* Right Side: Output Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/85 rounded-3xl p-6 shadow-sm flex flex-col h-full justify-between">
          <div className="space-y-5 flex-1 flex flex-col">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {t("outputLabel")}
            </h2>

            <textarea
              readOnly
              value={scaledRecipe}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              className="w-full flex-1 min-h-[280px] bg-amber-50/20 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 font-mono text-sm text-slate-800 dark:text-slate-200 outline-none resize-none select-all"
            />
          </div>

          <div className="mt-6">
            <button
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer ${
                isCopied ? "bg-green-500" : "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 active:scale-98 shadow-sm hover:shadow"
              }`}
            >
              {isCopied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
