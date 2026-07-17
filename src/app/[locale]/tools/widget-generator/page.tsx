"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import unitsDataRaw from "@/data/units.json";
import { ConversionDatabase } from "@/types/converter";

const db = unitsDataRaw as unknown as ConversionDatabase;

// Popular color suggestions for quick tuning
const PRESETS = [
  { name: "Ocean Navy", primary: "0f4c81", bg: "ffffff" },
  { name: "Sky Blue", primary: "0ea5e9", bg: "ffffff" },
  { name: "Teal Green", primary: "0f766e", bg: "ffffff" },
  { name: "Deep Charcoal", primary: "1f2937", bg: "f9fafb" },
  { name: "Clean Dark", primary: "38bdf8", bg: "0b1224" }
];

export default function WidgetGeneratorPage() {
  const { locale } = useParams() as { locale: string };

  // 1. Selector States
  const [selectedCatId, setSelectedCatId] = useState<string>("length");
  const [fromUnitId, setFromUnitId] = useState<string>("meter");
  const [toUnitId, setToUnitId] = useState<string>("foot");

  // 2. Custom Color States (Hex strings without #)
  const [primaryColor, setPrimaryColor] = useState<string>("0f4c81");
  const [bgColor, setBgColor] = useState<string>("ffffff");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Sync from/to selectors when category change
  const currentCategory = db.categories.find(c => c.id === selectedCatId) || db.categories[0];
  
  useEffect(() => {
    if (currentCategory) {
      setFromUnitId(currentCategory.units[0].id);
      setToUnitId(currentCategory.units[1]?.id || currentCategory.units[0].id);
    }
  }, [selectedCatId, currentCategory]);

  const slug = `${fromUnitId}-to-${toUnitId}`.toLowerCase().replace(/\s+/g, "-");
  
  // Construct widget dynamic URL
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://unittogo.com";
  const widgetUrl = `${baseUrl}/${locale}/widget/${slug}?primary=${primaryColor}&bg=${bgColor}`;
  const embedCode = `<iframe src="${widgetUrl}" width="100%" height="280" style="border:1px solid #e2e8f0; border-radius:16px;"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Localized texts
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      th: {
        title: "เครื่องมือสร้างกล่องคำนวณฝังเว็บฟรี (Free Widget Generator)",
        desc: "ปรับแต่ง ปรับสี และสร้างโค้ด iframe สำหรับนำเครื่องมือแปลงหน่วยวัดของเราไปวางบนเว็บไซต์หรือบล็อกของคุณฟรี เพื่อความสะดวกของผู้อ่าน",
        back: "กลับหน้าแรก",
        panelTitle: "⚙️ ปรับแต่งรูปแบบวิดเจ็ต",
        catLabel: "หมวดหมู่การแปลง",
        fromLabel: "หน่วยต้นทาง",
        toLabel: "หน่วยปลายทาง",
        themeLabel: "เลือกสีพรีเซ็ตสำเร็จรูป",
        customColor: "🎨 กำหนดโทนสีเอง",
        primaryColorLabel: "สีปุ่มและจุดเน้นหลัก (Primary Color)",
        bgColorLabel: "สีพื้นหลังกล่อง (Background)",
        previewTitle: "👁️ ตัวอย่างการแสดงผลจริง",
        codeTitle: "📋 โค้ดฝังวิดเจ็ต (Embed Code HTML)",
        copy: "คัดลอกโค้ดฝังเว็บ",
        copied: "คัดลอกสำเร็จแล้ว! ⚡",
        instruction: "ก็อปปี้โค้ดนี้ไปวางในส่วน HTML ของเว็บไซต์คุณได้ทันที"
      },
      en: {
        title: "Free Embeddable Widget Generator",
        desc: "Customize, style, and generate iframe embed codes to add our unit conversion calculators to your website or blog for free.",
        back: "Back to Home",
        panelTitle: "⚙️ Widget Customization",
        catLabel: "Conversion Category",
        fromLabel: "From Unit",
        toLabel: "To Unit",
        themeLabel: "Select Preset Color Theme",
        customColor: "🎨 Customize Colors",
        primaryColorLabel: "Primary Button / Accent Color",
        bgColorLabel: "Card Background Color",
        previewTitle: "👁️ Live Widget Preview",
        codeTitle: "📋 HTML Embed Code",
        copy: "Copy Embed Code",
        copied: "Copied! ⚡",
        instruction: "Copy this code snippet and paste it into your site's HTML editor."
      }
    };
    return translations[locale]?.[key] || translations["en"][key];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-gray-900 dark:text-gray-150">
      
      {/* Navigation Breadcrumb */}
      <div className="mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          ← {t("back")}
        </Link>
      </div>

      {/* Header Description */}
      <header className="mb-8 text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-sky-500 dark:from-sky-300 dark:to-blue-500 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          {t("desc")}
        </p>
      </header>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Customize Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/85 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
            {t("panelTitle")}
          </h2>

          {/* 1. Category Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t("catLabel")}
            </label>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4.5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
            >
              {db.categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {locale === "th" ? cat.translations?.th || cat.name : cat.translations?.en || cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Units Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t("fromLabel")}
              </label>
              <select
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4.5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
              >
                {currentCategory.units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.symbol} ({locale === "th" ? unit.translations?.th || unit.name : unit.translations?.en || unit.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t("toLabel")}
              </label>
              <select
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4.5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
              >
                {currentCategory.units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.symbol} ({locale === "th" ? unit.translations?.th || unit.name : unit.translations?.en || unit.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Preset color theme selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t("themeLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrimaryColor(p.primary);
                    setBgColor(p.bg);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200/60 dark:border-zinc-800 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 cursor-pointer flex items-center space-x-1.5 transition-all"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-200" style={{ backgroundColor: `#${p.primary}` }} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Custom colors sliders */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center">
              {t("customColor")}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500">
                  {t("primaryColorLabel")}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={`#${primaryColor}`}
                    onChange={(e) => setPrimaryColor(e.target.value.replace("#", ""))}
                    className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer outline-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value.replace("#", "").slice(0, 6))}
                    className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500">
                  {t("bgColorLabel")}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={`#${bgColor}`}
                    onChange={(e) => setBgColor(e.target.value.replace("#", ""))}
                    className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer outline-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value.replace("#", "").slice(0, 6))}
                    className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Live Preview & HTML Embed code */}
        <div className="space-y-6">
          
          {/* Live Preview Display Box */}
          <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/85 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center">
              {t("previewTitle")}
            </h2>
            
            {/* Real iframe container frame simulation */}
            <div className="border border-slate-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
              <iframe
                key={`${widgetUrl}`}
                src={widgetUrl}
                width="100%"
                height="280"
                style={{ border: "none" }}
              />
            </div>
          </div>

          {/* HTML Embed Code Display Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/85 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center">
              {t("codeTitle")}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
              {t("instruction")}
            </p>

            <textarea
              readOnly
              value={embedCode}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              className="w-full h-24 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-3 font-mono text-[10px] text-slate-655 dark:text-slate-350 outline-none resize-none select-all"
            />

            <button
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer ${
                isCopied ? "bg-green-500" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 shadow-sm hover:shadow"
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
