import React from "react";
import Link from "next/link";
import { Category, Unit, ConversionDatabase } from "@/types/converter";
import { UnitConverter } from "@/lib/converter/unit-converter";
import { getSlugForConversion, getConversionRoutesForCategory } from "@/lib/converter/slug-resolver";
import unitsDataRaw from "@/data/units.json";

const db = unitsDataRaw as unknown as ConversionDatabase;
const staticConverter = new UnitConverter(db);

interface SeoContentSectionProps {
  category: Category;
  fromUnit: Unit;
  toUnit: Unit;
  locale: string;
  tUnit: (id: string, fallback: string) => string;
  tCategory: (id: string, name: string, fallback: string) => { name: string; description: string };
}

// Translations for section headers across all 11 locales
const HEADINGS: Record<string, Record<string, string>> = {
  th: {
    whatIs: "ทำความรู้จักกับ {from} และ {to}",
    formula: "สูตรการแปลง {from} เป็น {to}",
    examples: "ตัวอย่างการคำนวณจริง (ทีละขั้นตอน)",
    faq: "คำถามที่พบบ่อย (FAQ)",
    common: "ตารางสรุปค่าการแปลงที่พบบ่อย",
    related: "คู่แปลงหน่วยที่เกี่ยวข้อง (ลิงก์ภายใน)",
    internal: "เครื่องคำนวณยอดนิยมอื่นๆ"
  },
  en: {
    whatIs: "What is {from} and {to}?",
    formula: "Formula to Convert {from} to {to}",
    examples: "Step-by-Step Conversion Examples",
    faq: "Frequently Asked Questions (FAQ)",
    common: "Common {from} to {to} Conversions",
    related: "Related Conversions (Internal Links)",
    internal: "Other Popular Conversion Categories"
  },
  es: {
    whatIs: "¿Qué es {from} y {to}?",
    formula: "Fórmula para convertir {from} a {to}",
    examples: "Ejemplos de conversión paso a paso",
    faq: "Preguntas frecuentes (FAQ)",
    common: "Conversiones comunes de {from} a {to}",
    related: "Conversiones relacionadas",
    internal: "Otras categorías populares"
  },
  zh: {
    whatIs: "什么是 {from} 和 {to}？",
    formula: "将 {from} 转换为 {to} 的公式",
    examples: "分步转换示例",
    faq: "常见问题解答 (FAQ)",
    common: "常见的 {from} 到 {to} 转换",
    related: "相关转换",
    internal: "其他热门转换类别"
  },
  hi: {
    whatIs: "{from} और {to} क्या है?",
    formula: "{from} को {to} में बदलने का सूत्र",
    examples: "चरण-दर-चरण रूपांतरण उदाहरण",
    faq: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
    common: "सामान्य {from} से {to} रूपांतरण",
    related: "संबंधित रूपांतरण",
    internal: "अन्य लोकप्रिय कनवर्टर श्रेणियां"
  },
  fr: {
    whatIs: "Qu'est-ce que {from} et {to} ?",
    formula: "Formule pour convertir {from} en {to}",
    examples: "Exemples de conversion étape par étape",
    faq: "Foire aux questions (FAQ)",
    common: "Conversions courantes de {from} en {to}",
    related: "Conversions associées",
    internal: "Autres catégories populaires"
  },
  pt: {
    whatIs: "O que é {from} e {to}?",
    formula: "Fórmula para converter {from} em {to}",
    examples: "Exemplos de conversão passo a passo",
    faq: "Perguntas frequentes (FAQ)",
    common: "Conversões comuns de {from} a {to}",
    related: "Conversões relacionadas",
    internal: "Outras categorias populares"
  },
  ru: {
    whatIs: "Что такое {from} и {to}?",
    formula: "Формула перевода {from} в {to}",
    examples: "Пошаговые примеры перевода",
    faq: "Часто задаваемые вопросы (FAQ)",
    common: "Основные переводы {from} в {to}",
    related: "Связанные переводы",
    internal: "Другие популярные категории"
  },
  ar: {
    whatIs: "ما هو {from} و {to}؟",
    formula: "صيغة التحويل من {from} إلى {to}",
    examples: "أمثلة التحويل خطوة بخطوة",
    faq: "الأسئلة الشائعة (FAQ)",
    common: "تحويلات {from} إلى {to} الشائعة",
    related: "تحويلات ذات صلة",
    internal: "فئات التحويل الشائعة الأخرى"
  },
  bn: {
    whatIs: "{from} এবং {to} কি?",
    formula: "{from} থেকে {to} রূপান্তর করার সূত্র",
    examples: "ধাপে ধাপে রূপান্তর উদাহরণ",
    faq: "সাধারণ জিজ্ঞাসা (FAQ)",
    common: "সাধারণ {from} থেকে {to} রূপান্তর",
    related: "সম্পর্কিত রূপান্তর",
    internal: "অন্যান্য জনপ্রিয় কনভার্টার ক্যাটাগরি"
  },
  ja: {
    whatIs: "{from} と {to} とは？",
    formula: "{from} から {to} への変換公式",
    examples: "ステップバイステップの変換例",
    faq: "よくある質問 (FAQ)",
    common: "一般的な {from} から {to} への変換",
    related: "関連する変換",
    internal: "その他のおすすめ変換カテゴリ"
  }
};

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({
  category,
  fromUnit,
  toUnit,
  locale,
  tUnit,
  tCategory
}) => {
  const localizedFrom = tUnit(fromUnit.id, fromUnit.name);
  const localizedTo = tUnit(toUnit.id, toUnit.name);
  const localizedCat = tCategory(category.id, category.name, category.description);

  const getTranslation = (key: string, replacements: Record<string, string> = {}) => {
    let text = HEADINGS[locale]?.[key] || HEADINGS["en"][key];
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  };

  // 1. Calculate ratios
  let factorRatio = 1;
  let formulaText = "";
  if (category.id === "temperature") {
    if (fromUnit.id === "celsius" && toUnit.id === "fahrenheit") {
      factorRatio = 1.8;
      formulaText = "(Celsius * 9/5) + 32";
    } else if (fromUnit.id === "fahrenheit" && toUnit.id === "celsius") {
      factorRatio = 5/9;
      formulaText = "(Fahrenheit - 32) * 5/9";
    } else {
      formulaText = `celsius = ${fromUnit.formula || "value"}; target = ${toUnit.inverseFormula || "value"}`;
    }
  } else {
    factorRatio = (fromUnit.factor || 1) / (toUnit.factor || 1);
    formulaText = `Value * ${staticConverter.round(factorRatio, 8)}`;
  }

  // 2. Generate dynamic explanations (What is...)
  const getExplanation = () => {
    const fromDesc = fromUnit.description || `standard unit of ${localizedCat.name.toLowerCase()}`;
    const toDesc = toUnit.description || `target scale of ${localizedCat.name.toLowerCase()}`;

    if (locale === "th") {
      return (
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
          <p>
            การเรียนรู้เรื่อง <strong>{localizedFrom}</strong> และ <strong>{localizedTo}</strong> มีความสำคัญอย่างยิ่งในการจัดการค่าตัวเลขในหมวดหมู่ {localizedCat.name}
          </p>
          <p>
            โดย <strong>{localizedFrom} ({fromUnit.symbol})</strong> คือ {fromDesc} ซึ่งนิยมนำไปใช้งานในหลากหลายอุตสาหกรรม 
            ในทางกลับกัน <strong>{localizedTo} ({toUnit.symbol})</strong> คือ {toDesc} ซึ่งมีบทบาทสำคัญเป็นมาตรฐานปรับเทียบค่า
          </p>
          <p>
            การแปลงค่านอกจากจะช่วยปรับจูนตัวเลขให้ตรงตามคู่สัญญาหรือการออกแบบทางเทคนิคแล้ว ยังทำให้เกิดความเข้าใจที่สอดคล้องกันในการแลกเปลี่ยนข้อมูลระดับสากลอีกด้วย
          </p>
        </div>
      );
    }

    // Default Spanish, French, English, etc.
    return (
      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
        <p>
          Understanding the difference between <strong>{localizedFrom}</strong> and <strong>{localizedTo}</strong> is essential for managing metrics in the {localizedCat.name} category.
        </p>
        <p>
          The unit <strong>{localizedFrom} ({fromUnit.symbol})</strong> is defined as a {fromDesc}, which has found widespread application across multiple industries globally.
          Meanwhile, <strong>{localizedTo} ({toUnit.symbol})</strong> represents a {toDesc}, which serves as a vital standard of calibration.
        </p>
        <p>
          Converting between these units ensures precision in technical blueprints, shipping manifests, academic research, and commercial applications.
        </p>
      </div>
    );
  };

  // 3. Dynamic Calculation Examples
  const val1 = 1;
  const val2 = 10;
  const val3 = 50;

  const res1 = category.id === "temperature" 
    ? staticConverter.round(staticConverter.convert(val1, fromUnit.id, toUnit.id, category.id), 4)
    : staticConverter.round(val1 * factorRatio, 6);

  const res2 = category.id === "temperature" 
    ? staticConverter.round(staticConverter.convert(val2, fromUnit.id, toUnit.id, category.id), 4)
    : staticConverter.round(val2 * factorRatio, 6);

  const res3 = category.id === "temperature" 
    ? staticConverter.round(staticConverter.convert(val3, fromUnit.id, toUnit.id, category.id), 4)
    : staticConverter.round(val3 * factorRatio, 6);

  // 4. Generate Silo Internal Links (Related conversions)
  const relatedUnits = category.units.filter(u => u.id !== fromUnit.id).slice(0, 6);

  // 5. Generate Prev / Next conversion routes (Circular linked structure)
  const categoryRoutes = getConversionRoutesForCategory(category);
  const curIndex = categoryRoutes.findIndex(r => r.fromId === fromUnit.id && r.toId === toUnit.id);
  
  let prevRoute = null;
  let nextRoute = null;
  
  if (curIndex !== -1 && categoryRoutes.length > 1) {
    const prevIdx = (curIndex - 1 + categoryRoutes.length) % categoryRoutes.length;
    const nextIdx = (curIndex + 1) % categoryRoutes.length;
    
    prevRoute = categoryRoutes[prevIdx];
    nextRoute = categoryRoutes[nextIdx];
  }

  return (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800/60">
      
      {/* Previous / Next Page Silo Navigation */}
      {prevRoute && nextRoute && (
        <nav className="flex items-center justify-between border border-slate-100/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-800/10 rounded-2xl p-4 shadow-2xs text-xs font-bold font-mono">
          <Link
            href={`/${locale}/${prevRoute.slug}`}
            className="flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ← {locale === "th" ? "ก่อนหน้า" : "Prev"}: {tUnit(prevRoute.fromId, prevRoute.fromId)} ➔ {tUnit(prevRoute.toId, prevRoute.toId)}
          </Link>
          <Link
            href={`/${locale}/${nextRoute.slug}`}
            className="flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            {locale === "th" ? "ถัดไป" : "Next"}: {tUnit(nextRoute.fromId, nextRoute.fromId)} ➔ {tUnit(nextRoute.toId, nextRoute.toId)} →
          </Link>
        </nav>
      )}

      {/* section 1: What is */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs" aria-labelledby="seo-whatis-heading">
        <h2 id="seo-whatis-heading" className="text-lg font-black text-gray-900 dark:text-gray-150 mb-3 flex items-center">
          <span className="mr-2">❓</span> {getTranslation("whatIs", { from: localizedFrom, to: localizedTo })}
        </h2>
        {getExplanation()}
      </section>

      {/* section 2: Formula */}
      <section className="bg-zinc-50 dark:bg-zinc-800/20 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800/60" aria-labelledby="seo-formula-heading">
        <h2 id="seo-formula-heading" className="text-lg font-black text-gray-900 dark:text-gray-150 mb-3 flex items-center">
          <span className="mr-2">📝</span> {getTranslation("formula", { from: localizedFrom, to: localizedTo })}
        </h2>
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
            {locale === "th" ? "สูตรคำนวณสำเร็จรูป" : "Conversion Formula"}
          </p>
          <div className="text-lg font-bold text-sky-600 dark:text-sky-400 font-mono">
            {localizedFrom} ({fromUnit.symbol}) ➔ {localizedTo} ({toUnit.symbol}) = {formulaText}
          </div>
        </div>
      </section>

      {/* section 3: Examples */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs" aria-labelledby="seo-examples-heading">
        <h2 id="seo-examples-heading" className="text-lg font-black text-gray-900 dark:text-gray-150 mb-3 flex items-center">
          <span className="mr-2">📊</span> {getTranslation("examples", { from: localizedFrom, to: localizedTo })}
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50/50 dark:bg-zinc-800/10 rounded-xl">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {locale === "th" ? `ตัวอย่างที่ 1: แปลง ${val1} ${localizedFrom}` : `Example 1: Convert ${val1} ${localizedFrom}`}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
              {locale === "th" 
                ? `แทนค่าลงในสูตรการแปลง: ${val1} × ตัวคูณ = ${res1} ดังนั้น ${val1} ${localizedFrom} จะเท่ากับ ${res1} ${localizedTo}`
                : `Substitute the value into the conversion formula: ${val1} × factor = ${res1}. Therefore, ${val1} ${localizedFrom} is equal to ${res1} ${localizedTo}.`}
            </p>
          </div>
          <div className="p-4 bg-slate-50/50 dark:bg-zinc-800/10 rounded-xl">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {locale === "th" ? `ตัวอย่างที่ 2: แปลง ${val2} ${localizedFrom}` : `Example 2: Convert ${val2} ${localizedFrom}`}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
              {locale === "th" 
                ? `แทนค่าลงในสูตรการแปลง: ${val2} × ตัวคูณ = ${res2} ดังนั้น ${val2} ${localizedFrom} จะเท่ากับ ${res2} ${localizedTo}`
                : `Substitute the value into the conversion formula: ${val2} × factor = ${res2}. Therefore, ${val2} ${localizedFrom} is equal to ${res2} ${localizedTo}.`}
            </p>
          </div>
          <div className="p-4 bg-slate-50/50 dark:bg-zinc-800/10 rounded-xl">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {locale === "th" ? `ตัวอย่างที่ 3: แปลง ${val3} ${localizedFrom}` : `Example 3: Convert ${val3} ${localizedFrom}`}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
              {locale === "th" 
                ? `แทนค่าลงในสูตรการแปลง: ${val3} × ตัวคูณ = ${res3} ดังนั้น ${val3} ${localizedFrom} จะเท่ากับ ${res3} ${localizedTo}`
                : `Substitute the value into the conversion formula: ${val3} × factor = ${res3}. Therefore, ${val3} ${localizedFrom} is equal to ${res3} ${localizedTo}.`}
            </p>
          </div>
        </div>
      </section>

      {/* section 4: FAQ */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs" aria-labelledby="seo-faq-heading-new">
        <h2 id="seo-faq-heading-new" className="text-lg font-black text-gray-900 dark:text-gray-150 mb-4 flex items-center">
          <span className="mr-2">❓</span> {getTranslation("faq")}
        </h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 dark:border-zinc-800/60 pb-4">
            <h3 className="font-extrabold text-gray-800 dark:text-gray-250 text-sm mb-1.5">
              {locale === "th" 
                ? `1. ${localizedFrom} แปลงเป็น ${localizedTo} ได้อย่างไร?`
                : `1. How do you convert ${localizedFrom} to ${localizedTo}?`}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
              {locale === "th" 
                ? `สามารถคำนวณได้โดยการคูณจำนวน ${localizedFrom} ด้วยตัวปรับเทียบค่า (${staticConverter.round(factorRatio, 8)}) ตัวอย่างเช่น 1 ${localizedFrom} = ${res1} ${localizedTo}`
                : `You can compute this by multiplying the value in ${localizedFrom} by the calibration factor (${staticConverter.round(factorRatio, 8)}). For example, 1 ${localizedFrom} = ${res1} ${localizedTo}.`}
            </p>
          </div>
          <div className="border-b border-gray-100 dark:border-zinc-800/60 pb-4">
            <h3 className="font-extrabold text-gray-800 dark:text-gray-250 text-sm mb-1.5">
              {locale === "th" 
                ? `2. สูตรในการแปลง ${localizedFrom} เป็น ${localizedTo} คืออะไร?`
                : `2. What is the conversion formula from ${localizedFrom} to ${localizedTo}?`}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
              {locale === "th" 
                ? `สูตรคำนวณมาตรฐานคือ: ${formulaText}`
                : `The standard formula is: ${formulaText}.`}
            </p>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-800 dark:text-gray-250 text-sm mb-1.5">
              {locale === "th" 
                ? `3. การแปลงหน่วยนี้มีความแม่นยำแค่ไหน?`
                : `3. How accurate is this converter?`}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
              {locale === "th" 
                ? `เครื่องคำนวณของเราอ้างอิงอัตราส่วนจากข้อตกลงมาตรฐานสากล (SI baseline standards) จึงทำให้ผลลัพธ์ที่ได้มีความแม่นยำสูง ทศนิยมสูงสุด 6 ตำแหน่ง`
                : `Our calculations are strictly based on international SI baseline standards, ensuring highly precise and real-time outputs up to 6 decimal places.`}
            </p>
          </div>
        </div>
      </section>

      {/* section 4.5: Popular conversions in this category */}
      {category.popularConversions && category.popularConversions.length > 0 && (
        <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs" aria-labelledby="seo-popular-heading">
          <h2 id="seo-popular-heading" className="text-lg font-black text-gray-900 dark:text-gray-150 mb-3 flex items-center">
            <span className="mr-2">🔥</span> {locale === "th" ? `คู่คำนวณ ${localizedCat.name} ยอดนิยม` : `Popular ${localizedCat.name} Conversions`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {category.popularConversions.map((conv) => (
              <Link
                key={conv.slug}
                href={`/${locale}/${conv.slug}`}
                className="text-xs font-extrabold px-3.5 py-2.5 bg-slate-50/50 hover:bg-blue-50/80 dark:bg-zinc-800/10 dark:hover:bg-zinc-800/20 text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-250/20 dark:border-zinc-800/60 rounded-xl transition-all flex items-center justify-between"
              >
                <span>{tUnit(conv.from, conv.from)} ➔ {tUnit(conv.to, conv.to)}</span>
                <span className="text-[10px] text-slate-400">⚡</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* section 5: Related conversions */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs" aria-labelledby="seo-related-heading">
        <h2 id="seo-related-heading" className="text-lg font-black text-gray-900 dark:text-gray-150 mb-3 flex items-center">
          <span className="mr-2">🔗</span> {getTranslation("related")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {relatedUnits.map((u) => {
            const forwardSlug = getSlugForConversion(fromUnit, u);
            const backwardSlug = getSlugForConversion(u, fromUnit);
            
            const nameForward = `${localizedFrom} ➔ ${tUnit(u.id, u.name)}`;
            const nameBackward = `${tUnit(u.id, u.name)} ➔ ${localizedFrom}`;

            return (
              <React.Fragment key={u.id}>
                <Link
                  href={`/${locale}/${forwardSlug}`}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline p-2 bg-slate-50/50 dark:bg-zinc-800/10 rounded-lg flex items-center"
                >
                  🔄 {nameForward}
                </Link>
                <Link
                  href={`/${locale}/${backwardSlug}`}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline p-2 bg-slate-50/50 dark:bg-zinc-800/10 rounded-lg flex items-center"
                >
                  🔄 {nameBackward}
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* section 6: Internal links to other categories */}
      <section className="bg-zinc-50 dark:bg-zinc-800/20 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800/60" aria-labelledby="seo-internal-heading">
        <h2 id="seo-internal-heading" className="text-base font-black text-gray-800 dark:text-gray-200 mb-3">
          {getTranslation("internal")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {db.categories.map((cat) => {
            const localized = tCategory(cat.id, cat.name, cat.description);
            return (
              <Link
                key={cat.id}
                href={`/${locale}/${cat.id}`}
                className="text-xs font-bold px-3 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-655 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 rounded-xl transition-all"
              >
                {cat.icon} {localized.name}
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
};
