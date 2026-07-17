import React from "react";
import Link from "next/link";

export default async function ThaiLandUnitsGuidePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeIn text-gray-900 dark:text-gray-150">
      {/* Navigation */}
      <div className="mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          ← {locale === "th" ? "กลับหน้าแรก" : "Back to Home"}
        </Link>
      </div>

      <article className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
            {locale === "th" 
              ? "ทำความเข้าใจหน่วยวัดที่ดินไทย: ไร่ งาน ตารางวา แปลงเป็นตารางเมตรอย่างไร?" 
              : "Understanding Thai Land Measures: Convert Rai, Ngan, Tarang Wa to Square Meters"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            {locale === "th"
              ? "คู่มืออธิบายโครงสร้างหน่วยวัดพื้นที่ที่ดินแบบไทยโบราณที่ยังใช้อย่างเป็นทางการในโฉนดที่ดินปัจจุบัน พร้อมแจกสูตรคำนวณพื้นที่ดิน"
              : "A comprehensive guide explaining traditional Thai land measurement units used in official title deeds (Chanote), and how to calculate area conversions."}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "สัดส่วนหน่วยที่ดินไทย ไร่ งาน ตารางวา" : "Thai Land Measurement System Hierarchy"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {locale === "th"
              ? "ประเทศไทยใช้ระบบการรังวัดที่ดินแบบเฉพาะตัวซึ่งปรากฏอยู่ในเอกสารสิทธิ์โฉนดที่ดินทั่วไป โดยสามารถคำนวณเปรียบเทียบตามอัตราส่วนคงที่ดังนี้:"
              : "Thailand uses a unique localized land measurement system for legal properties, which translates directly to square meters via fixed ratios:"}
          </p>
          
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2 font-semibold">
            <li>
              <strong>1 ไร่ (Rai)</strong> = 4 งาน (Ngan) = 400 ตารางวา (Tarang Wa) = 1,600 ตารางเมตร (sq m)
            </li>
            <li>
              <strong>1 งาน (Ngan)</strong> = 100 ตารางวา (Tarang Wa) = 400 ตารางเมตร (sq m)
            </li>
            <li>
              <strong>1 ตารางวา (Tarang Wa)</strong> = 4 ตารางเมตร (sq m)
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "วิธีการคำนวณที่ดินเพื่อคำนวณภาษีและซื้อขาย" : "Calculating Land Area for Construction and Sales"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {locale === "th"
              ? "หากคุณมีพื้นที่ 2 ไร่ 3 งาน 50 ตารางวา และต้องการแปลงเป็นตารางเมตรทั้งหมดเพื่อการออกแบบก่อสร้าง สามารถคำนวณแยกส่วนได้ดังนี้:"
              : "If you have a plot measuring 2 Rai, 3 Ngan, and 50 Tarang Wa, and want to build a house, here is how you compute the total area in square meters:"}
          </p>
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-mono text-xs space-y-1 font-bold text-slate-700 dark:text-slate-300">
            <div>2 ไร่ = 2 × 1,600 = 3,200 ตร.ม.</div>
            <div>3 งาน = 3 × 400 = 1,200 ตร.ม.</div>
            <div>50 ตารางวา = 50 × 4 = 200 ตร.ม.</div>
            <div className="border-t border-slate-200 dark:border-zinc-800 pt-1 mt-1 font-extrabold text-blue-600">รวมทั้งหมด = 3,200 + 1,200 + 200 = 4,600 ตารางเมตร</div>
          </div>
        </section>

        <section className="p-5 bg-emerald-50/30 dark:bg-zinc-900 border border-emerald-100/50 dark:border-zinc-800 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {locale === "th" ? "🔗 เครื่องมือวัดและแปลงที่ดินแนะนำ" : "🔗 Land Measurement Utility Tools"}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link 
              href={`/${locale}/tools/maps-area`}
              className="px-3.5 py-2 bg-white dark:bg-zinc-950 border border-emerald-200 hover:border-emerald-500 rounded-xl text-emerald-750 hover:underline font-bold"
            >
              แผนที่จิ้มวาดคำนวณที่ดิน (Maps Area Calculator)
            </Link>
            <Link 
              href={`/${locale}/rai-to-square-meters`}
              className="px-3.5 py-2 bg-white dark:bg-zinc-950 border border-emerald-200 hover:border-emerald-500 rounded-xl text-emerald-750 hover:underline font-bold"
            >
              แปลงไร่ ➔ ตารางเมตร (Rai to Sq Meters)
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
