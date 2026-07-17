import React from "react";
import Link from "next/link";

export default async function BakingGuidePage(props: { params: Promise<{ locale: string }> }) {
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
              ? "คู่มือครัว: แปลงหน่วยอบขนม ถ้วยตวง ช้อนโต๊ะ เป็นน้ำหนักกรัม (g) อย่างละเอียด" 
              : "Baking Conversion Guide: Convert Cups, Tablespoons to Grams (g)"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            {locale === "th"
              ? "ทำไมการอบเบเกอรี่ถึงต้องแปลงถ้วยตวงเป็นกรัม? ตารางแจกสูตรส่วนผสมแป้ง น้ำตาล เนย นม ยีสต์ ครบจบในที่เดียว"
              : "Why is measuring in grams critical for baking success? Volume-to-weight translation cheatsheet for cake flour, sugar, butter, and liquids."}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "ทำไมถ้วยตวงถึงคลาดเคลื่อนกว่าตาชั่งกรัม?" : "Why Weight beats Volume in Baking"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {locale === "th"
              ? "การอบขนมปังหรือเค้กต้องการความแม่นยำสูงมาก (เป็นเรื่องของเคมีวิทยา!) การใช้ถ้วยตวงมีโอกาสตวงแน่นเกินไปหรือหลวมเกินไปขึ้นอยู่กับวิธีการตัก ทำให้ได้แป้งเยอะกว่าสูตรกำหนดถึง 20% การชั่งหน่วยกรัม (grams) จึงให้ความเสถียรที่สุด"
              : "Baking is chemical science. A cup of flour scooped directly from a bag can weigh up to 20% more than flour sifted and spooned into a cup. Measuring in grams eliminates these variances."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "ตารางเทียบถ้วยตวงเป็นกรัมของส่วนผสมยอดนิยม" : "Common Volume-to-Weight Conversions (1 Cup)"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-850">
                  <th className="py-2.5 font-bold">{locale === "th" ? "วัตถุดิบ (Ingredient)" : "Ingredient"}</th>
                  <th className="py-2.5 font-bold">1 {locale === "th" ? "ถ้วยตวง" : "Cup"}</th>
                  <th className="py-2.5 font-bold">1 {locale === "th" ? "ช้อนโต๊ะ" : "Tbsp"}</th>
                  <th className="py-2.5 font-bold">1 {locale === "th" ? "ช้อนชา" : "Tsp"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 font-semibold">
                <tr>
                  <td className="py-2.5">แป้งอเนกประสงค์ (Flour)</td>
                  <td className="py-2.5">120g</td>
                  <td className="py-2.5">7.5g</td>
                  <td className="py-2.5">2.5g</td>
                </tr>
                <tr>
                  <td className="py-2.5">น้ำตาลทราย (Sugar)</td>
                  <td className="py-2.5">200g</td>
                  <td className="py-2.5">12.5g</td>
                  <td className="py-2.5">4.2g</td>
                </tr>
                <tr>
                  <td className="py-2.5">เนยจืด (Butter)</td>
                  <td className="py-2.5">227g</td>
                  <td className="py-2.5">14.2g</td>
                  <td className="py-2.5">4.7g</td>
                </tr>
                <tr>
                  <td className="py-2.5">นมสด / น้ำ (Liquids)</td>
                  <td className="py-2.5">240g</td>
                  <td className="py-2.5">15g</td>
                  <td className="py-2.5">5g</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="p-5 bg-orange-50/30 dark:bg-zinc-900 border border-orange-100/50 dark:border-zinc-800 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-orange-700 dark:text-orange-400">
            {locale === "th" ? "🔗 ตัวช่วยขยายสเกลและแปลงวัตถุดิบอัตโนมัติ" : "🔗 Try Our Baking Tools"}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link 
              href={`/${locale}/tools/recipe-scaler`}
              className="px-3.5 py-2 bg-white dark:bg-zinc-950 border border-orange-200 hover:border-orange-500 rounded-xl text-orange-750 hover:underline font-bold"
            >
              เครื่องสเกลสูตรอาหารและแปลงถ้วยเป็นกรัม (Recipe Scaler)
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
