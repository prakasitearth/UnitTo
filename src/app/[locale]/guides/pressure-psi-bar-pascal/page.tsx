import React from "react";
import Link from "next/link";

export default async function PressureGuidePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeIn text-gray-900 dark:text-gray-150">
      {/* Navigation */}
      <div className="mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <Link 
          href={`/${locale}/guides`}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          ← {locale === "th" ? "กลับหน้าคู่มือทั้งหมด" : "Back to All Guides"}
        </Link>
      </div>

      <article className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
            {locale === "th" 
              ? "คู่มือหน่วยแรงดัน: แปลงค่า PSI, Bar, Pascal และการเติมลมยางรถยนต์" 
              : "Pressure Units Guide: Convert PSI, Bar, Pascal & Tire Inflation"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            {locale === "th"
              ? "ทำความเข้าใจหน่วยวัดความดัน PSI, Bar, KPa, Atmosphere ที่ใช้ในชีวิตประจำวัน งานช่าง เครื่องอัดอากาศ และการเติมลมยางรถยนต์"
              : "Comprehensive reference guide explaining pressure measurement units including PSI, Bar, KPa, and Standard Atmosphere for tire inflation and engineering."}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "1. อัตราส่วนและสูตรคำนวณหน่วยแรงดันที่พบบ่อย" : "1. Common Pressure Unit Conversion Formulas"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {locale === "th"
              ? "แรงดันหรือความดันเป็นปริมาณทางฟิสิกส์ที่ใช้วัดแรงกระทำต่อหนึ่งหน่วยพื้นที่ โดยหน่วยสากล (SI) คือ ปาสกาล (Pascal) แต่ในชีวิตประจำวันเรามักพบ PSI และ Bar เป็นหลัก:"
              : "Pressure measures force applied perpendicular to a surface area. While the SI base unit is Pascal (Pa), everyday applications rely heavily on PSI and Bar:"}
          </p>
          
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2 font-semibold">
            <li>
              <strong>1 Bar (บาร์)</strong> = 14.5038 PSI (ปอนด์ต่อตารางนิ้ว) = 100,000 Pascal (Pa) = 100 kPa
            </li>
            <li>
              <strong>1 PSI (Pound per Square Inch)</strong> = 0.0689476 Bar = 6,894.76 Pascal (Pa)
            </li>
            <li>
              <strong>1 atm (Standard Atmosphere)</strong> = 1.01325 Bar = 14.6959 PSI = 101.325 kPa
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "2. ตารางเปรียบเทียบค่าแรงดันเติมลมยางรถยนต์มาตรฐาน (PSI ↔ Bar)" : "2. Standard Tire Inflation Reference Table (PSI ↔ Bar)"}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-slate-200 font-extrabold">
                <tr>
                  <th className="p-3 border border-slate-200 dark:border-zinc-800">PSI (ปอนด์/ตร.นิ้ว)</th>
                  <th className="p-3 border border-slate-200 dark:border-zinc-800">Bar (บาร์)</th>
                  <th className="p-3 border border-slate-200 dark:border-zinc-800">kPa (กิโลปาสกาล)</th>
                  <th className="p-3 border border-slate-200 dark:border-zinc-800">{locale === "th" ? "ประเภทการใช้งานทั่วไป" : "Typical Usage"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-slate-600 dark:text-slate-400 font-medium">
                <tr>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">30 PSI</td>
                  <td className="p-3">2.07 Bar</td>
                  <td className="p-3">206.8 kPa</td>
                  <td className="p-3">{locale === "th" ? "รถยนต์ขนาดเล็ก (Eco Car)" : "Compact Sedan"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">32 PSI</td>
                  <td className="p-3">2.21 Bar</td>
                  <td className="p-3">220.6 kPa</td>
                  <td className="p-3">{locale === "th" ? "รถยนต์ซีดานมาตรฐาน / SUV" : "Standard Sedan / Crossover"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">35 PSI</td>
                  <td className="p-3">2.41 Bar</td>
                  <td className="p-3">241.3 kPa</td>
                  <td className="p-3">{locale === "th" ? "รถกระบะบรรทุกเบา / รถตู้" : "Light Truck / Van"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">40 PSI</td>
                  <td className="p-3">2.76 Bar</td>
                  <td className="p-3">275.8 kPa</td>
                  <td className="p-3">{locale === "th" ? "รถกระบะบรรทุกหนัก" : "Heavy Load Pickup"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "เครื่องมือคำนวณที่เกี่ยวข้อง" : "Related Tools"}
          </h2>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/${locale}/pressure`}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-650 dark:text-blue-400 rounded-xl font-extrabold text-xs transition-colors"
            >
              ⚡ {locale === "th" ? "เครื่องแปลงหน่วยแรงดันทั้งหมด" : "All Pressure Converter"} ➔
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
