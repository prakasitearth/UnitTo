import React from "react";
import Link from "next/link";

export default async function FuelEconomyGuidePage(props: { params: Promise<{ locale: string }> }) {
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
              ? "คำนวณอัตราสิ้นเปลืองน้ำมัน: วิธีแปลง km/L เป็น L/100km และ MPG" 
              : "Fuel Economy Guide: Convert km/L to L/100km and MPG"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            {locale === "th"
              ? "คู่มืออธิบายความแตกต่างและการแปลงค่าสเปกรถยนต์ระหว่าง กิโลเมตรต่อลิตร (km/L), ลิตรต่อ 100 กิโลเมตร (L/100km) และ ไมล์ต่อแกลลอน (MPG)"
              : "Master converting fuel efficiency numbers across metric (km/L), European standard (L/100km), and US/UK Imperial systems (MPG)."}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "1. ความแตกต่างระหว่าง km/L และ L/100km" : "1. Understanding km/L vs. L/100km"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {locale === "th"
              ? "ในประเทศไทยและเอเชีย นิยมใช้หน่วย กิโลเมตรต่อลิตร (km/L) ซึ่งยิ่งตัวเลขมาก ยิ่งประหยัดน้ำมัน ในขณะที่ฝั่งยุโรปนิยมใช้ ลิตรต่อ 100 กิโลเมตร (L/100km) ซึ่งยิ่งตัวเลขน้อย ยิ่งประหยัดน้ำมัน:"
              : "Asia and Latin America measure distance per unit volume (km/L - higher is better), whereas Europe measures volume required for 100 kilometers (L/100km - lower is better):"}
          </p>
          
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2 font-semibold">
            <li>
              <strong>สูตรแปลง km/L เป็น L/100km:</strong> L/100km = 100 ÷ (km/L)
            </li>
            <li>
              <strong>สูตรแปลง L/100km เป็น km/L:</strong> km/L = 100 ÷ (L/100km)
            </li>
            <li>
              <strong>สูตรแปลง MPG (US) เป็น km/L:</strong> km/L = MPG ÷ 2.35215
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "2. ตารางเปรียบเทียบอัตราประหยัดน้ำมันสำเร็จรูป" : "2. Quick Fuel Efficiency Conversion Table"}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-slate-200 font-extrabold">
                <tr>
                  <th className="p-3 border border-slate-200 dark:border-zinc-800">km/L (กิโลเมตร/ลิตร)</th>
                  <th className="p-3 border border-slate-200 dark:border-zinc-800">L/100km (ลิตร/100 กม.)</th>
                  <th className="p-3 border border-slate-200 dark:border-zinc-800">MPG (US)</th>
                  <th className="p-3 border border-slate-200 dark:border-zinc-800">{locale === "th" ? "ระดับความประหยัด" : "Efficiency Level"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-slate-650 dark:text-slate-400 font-medium">
                <tr>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">25 km/L</td>
                  <td className="p-3">4.0 L/100km</td>
                  <td className="p-3">58.8 MPG</td>
                  <td className="p-3">{locale === "th" ? "ประหยัดมากพิเศษ (รถไฮบริด / EV)" : "Exceptional (Hybrid)"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">20 km/L</td>
                  <td className="p-3">5.0 L/100km</td>
                  <td className="p-3">47.0 MPG</td>
                  <td className="p-3">{locale === "th" ? "ประหยัดสูง (Eco Car / Diesel)" : "Very High (Eco Car)"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">15 km/L</td>
                  <td className="p-3">6.67 L/100km</td>
                  <td className="p-3">35.3 MPG</td>
                  <td className="p-3">{locale === "th" ? "ประหยัดปานกลาง (ซีดานทั่วไป)" : "Moderate (Sedan)"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-amber-600 dark:text-amber-400">10 km/L</td>
                  <td className="p-3">10.0 L/100km</td>
                  <td className="p-3">23.5 MPG</td>
                  <td className="p-3">{locale === "th" ? "สิ้นเปลือง (SUV ใหญ่ / รถสปอร์ต)" : "Low (Large SUV)"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </div>
  );
}
