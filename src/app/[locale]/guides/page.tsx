import React from "react";
import Link from "next/link";

export default async function GuidesListPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      th: {
        title: "คู่มือความรู้และเทคนิคการแปลงหน่วยวัด (Guides)",
        desc: "บทความให้ความรู้เจาะลึกเกี่ยวกับการเปรียบเทียบขนาดที่ดินไทย, ทองคำกะรัต/ตำลึงจีน, สัดส่วนสูตรขนมปังอบเบเกอรี่ และมาตรฐานการแปลงหน่วยสากล",
        back: "กลับหน้าแรก",
        read: "อ่านคู่มือฉบับเต็ม ➔"
      },
      en: {
        title: "Measurement Guides & Conversion Reference Docs",
        desc: "Explore detailed guides comparing Thai land measurements, gold purity standards, baking recipes volume-to-weight calibrations, and global conversion structures.",
        back: "Back to Home",
        read: "Read Guide ➔"
      }
    };
    return translations[locale]?.[key] || translations["en"][key];
  };

  const guidesList = [
    {
      slug: "thai-land-units",
      title: locale === "th" ? "ทำความเข้าใจหน่วยที่ดินไทย: ไร่ งาน ตารางวา" : "Thai Land Units: Rai, Ngan, Tarang Wa",
      desc: locale === "th" ? "เจาะลึกหน่วยวัดพื้นที่แบบไทยดั้งเดิมที่มีอยู่ในโฉนด วิธีคำนวณภาษีและการวัดพื้นที่" : "Detailed explanation of traditional land measurements in Thai title deeds.",
      icon: "🗺️"
    },
    {
      slug: "hong-kong-gold",
      title: locale === "th" ? "คู่มือซื้อทองคำต่างประเทศ: แปลงหน่วยตำลึงทอง (Tael)" : "Understanding gold weights: Tael vs. Baht Gold",
      desc: locale === "th" ? "เปรียบเทียบน้ำหนักทองคำเมื่อไปซื้อทองที่ฮ่องกง ไต้หวัน สิงคโปร์ แปลงตำลึงเป็นกรัม" : "Compare gold weight systems across Asian financial hubs.",
      icon: "🏆"
    },
    {
      slug: "baking-volume-to-weight",
      title: locale === "th" ? "คู่มือครัว: แปลงหน่วยอบขนม ถ้วยตวง ช้อนโต๊ะ เป็นน้ำหนักกรัม" : "Baking: Convert Cups & Tablespoons to Grams",
      desc: locale === "th" ? "ตารางเปรียบเทียบส่วนผสมแป้ง น้ำตาล เนย นม ยีสต์ แบบกรัมเพื่อความแม่นยำสูง" : "Cheatsheet of flour, sugar, and butter volume to weight conversions.",
      icon: "🧁"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fadeIn text-gray-900 dark:text-gray-150">
      
      {/* Breadcrumbs */}
      <div className="mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          ← {t("back")}
        </Link>
      </div>

      {/* Page Header */}
      <header className="mb-12 text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-650 dark:from-sky-300 dark:to-blue-500 tracking-tight leading-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          {t("desc")}
        </p>
      </header>

      {/* Guides Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guidesList.map((g) => (
          <div
            key={g.slug}
            className="bg-white dark:bg-zinc-950 border border-slate-205/60 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/80 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-3xl block">{g.icon}</span>
              <h2 className="text-base font-extrabold text-gray-950 dark:text-gray-100 leading-snug">
                {g.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {g.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-900/60">
              <Link
                href={`/${locale}/guides/${g.slug}`}
                className="text-xs font-bold text-blue-650 dark:text-blue-400 hover:underline inline-flex items-center"
              >
                {t("read")}
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
