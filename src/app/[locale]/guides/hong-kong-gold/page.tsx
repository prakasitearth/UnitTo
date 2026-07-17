import React from "react";
import Link from "next/link";

export default async function HongKongGoldGuidePage(props: { params: Promise<{ locale: string }> }) {
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
              ? "คู่มือซื้อทองคำต่างประเทศ: แปลงหน่วยตำลึงทอง (Tael) ฮ่องกง ไต้หวัน จีน และทองบาทไทย" 
              : "Buying Gold Abroad: Understanding Tael (Hong Kong, China, Taiwan) vs. Thai Baht Gold"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            {locale === "th"
              ? "เรียนรู้วิธีเปรียบเทียบน้ำหนักทองคำเมื่อเดินทางไปซื้อทองคำในฮ่องกง ไต้หวัน หรือสิงคโปร์ แปลงจากตำลึงเป็นกรัม และความแตกต่างจากทองบาทไทย"
              : "Learn how to compare gold weights when traveling to Hong Kong, Taiwan, or Singapore. Convert Taels to grams and understand how they differ from Thai Baht Gold."}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "ตำลึงทอง (Tael) ในแต่ละประเทศหนักเท่ากันหรือไม่?" : "What is a Tael of Gold?"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {locale === "th"
              ? "คำว่า 'ตำลึง' หรือ 'Tael (两)' เป็นหน่วยน้ำหนักแบบโบราณของจีนที่ยังนิยมใช้อย่างกว้างขวางในตลาดทองคำเอเชียตะวันออกเฉียงใต้ อย่างไรก็ตาม น้ำหนักตำลึงในแต่ละภูมิภาคอาจมีความคลาดเคลื่อนกันเล็กน้อยดังนี้:"
              : "The 'Tael' (两) is a traditional Chinese unit of weight that remains the absolute standard in major Asian gold hubs. However, the exact weight in grams varies by country:"}
          </p>
          
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2 font-semibold">
            <li>
              <strong>{locale === "th" ? "ตำลึงฮ่องกง (Hong Kong Tael):" : "Hong Kong Tael:"}</strong> 1 Tael = 37.429 กรัม (grams)
            </li>
            <li>
              <strong>{locale === "th" ? "ตำลึงไต้หวัน (Taiwan Tael):" : "Taiwan Tael:"}</strong> 1 Tael = 37.5 กรัม (grams)
            </li>
            <li>
              <strong>{locale === "th" ? "ตำลึงจีนแผ่นดินใหญ่ (China Tael):" : "China Tael:"}</strong> 1 Tael = 50 กรัม (grams) (ปรับตามระบบเมตริกใหม่ของรัฐบาลจีน)
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            {locale === "th" ? "เปรียบเทียบกับหน่วยทองคำของไทย (ทอง 1 บาท)" : "Comparing with Thai Baht Gold Weight"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {locale === "th"
              ? "ในประเทศไทย เราจะซื้อขายทองคำในหน่วย 'บาท' ซึ่งมีน้ำหนักอ้างอิงมาตรฐานเป็นกรัมดังนี้:"
              : "In Thailand, gold is exclusively transacted in 'Baht'. The standard conversion values are:"}
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2 font-semibold">
            <li>
              <strong>{locale === "th" ? "ทองคำแท่ง 1 บาท:" : "Gold Bar 1 Baht:"}</strong> = 15.244 กรัม (grams)
            </li>
            <li>
              <strong>{locale === "th" ? "ทองรูปพรรณ 1 บาท:" : "Gold Jewelry 1 Baht:"}</strong> = 15.16 กรัม (grams)
            </li>
          </ul>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {locale === "th"
              ? "เมื่อเปรียบเทียบกัน จะเห็นว่าทองคำ 1 ตำลึงของฮ่องกงหรือไต้หวัน (ประมาณ 37.4 กรัม) จะหนักกว่าทองคำ 1 บาทของไทย (15.2 กรัม) เกือบสองเท่าครึ่งเลยทีเดียว!"
              : "When compared, 1 Hong Kong Tael (approx. 37.4g) is nearly 2.5 times heavier than 1 Thai Baht of gold (15.244g)."}
          </p>
        </section>

        <section className="p-5 bg-blue-50/30 dark:bg-zinc-900 border border-blue-100/50 dark:border-zinc-800 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400">
            {locale === "th" ? "🔗 เครื่องมือคำนวณแปลงหน่วยแนะนำ" : "🔗 Try Our Quick Converters"}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link 
              href={`/${locale}/baht-gold-to-grams`}
              className="px-3.5 py-2 bg-white dark:bg-zinc-950 border border-blue-100 hover:border-blue-500 rounded-xl text-blue-650 hover:underline font-bold"
            >
              ทองบาท ➔ กรัม (Baht to Grams)
            </Link>
            <Link 
              href={`/${locale}/tola-to-grams`}
              className="px-3.5 py-2 bg-white dark:bg-zinc-950 border border-blue-100 hover:border-blue-500 rounded-xl text-blue-650 hover:underline font-bold"
            >
              โทลาอินเดีย ➔ กรัม (Tola to Grams)
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
