import React from "react";
import Link from "next/link";

export function generateStaticParams() {
  return [
    { locale: "th" },
    { locale: "en" },
    { locale: "es" },
    { locale: "zh" },
    { locale: "hi" },
    { locale: "fr" },
    { locale: "pt" },
    { locale: "ru" },
    { locale: "ar" },
    { locale: "bn" },
    { locale: "ja" }
  ];
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const isTh = locale === "th";

  return (
    <div className="relative animate-fadeIn text-gray-900 dark:text-gray-100 max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-8 font-sans">
      <div className="space-y-3 border-b border-slate-200/80 dark:border-zinc-850 pb-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-50">
          {isTh ? "นโยบายความเป็นส่วนตัว (Privacy Policy)" : "Privacy Policy"}
        </h1>
        <p className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
          [SYS-DOC: PRIVACY_v1.0] [LAST_UPDATED: 2026-07-12]
        </p>
      </div>

      <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
        {isTh ? (
          <>
            <p>
              เว็บไซต์ <strong>UnitTo</strong> ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งานเป็นอันดับแรก เราขอเรียนให้ทราบถึงนโยบายความเป็นส่วนตัวดังนี้:
            </p>
            <div className="p-5 bg-sky-500/5 border border-sky-500/10 rounded-2xl space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 font-mono text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400">
                [DATA-CORE: 100% LOCAL & OFFLINE]
              </h3>
              <p className="text-xs leading-relaxed font-semibold">
                การแปลงหน่วยวัดและสูตรคำนวณทั้งหมดบน UnitTo ทำงานแบบออฟไลน์และประมวลผลโดยตรงในเบราว์เซอร์ของคุณ 100% โดยไม่มีการส่งข้อมูลตัวเลขหรือคำค้นหาใดๆ ไปยังเซิร์ฟเวอร์ของเราภายนอกเลย
              </p>
            </div>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">1. การจัดเก็บข้อมูลประวัติการคำนวณ</h2>
              <p>
                เรามีฟีเจอร์ประวัติการแปลงล่าสุด (Recent Conversions) และการปักหมุดหน่วยโปรด (Favorites) เพื่ออำนวยความสะดวก ข้อมูลเหล่านี้จะถูกจัดเก็บอยู่ภายในเครื่องของคุณผ่านทาง <strong>localStorage</strong> ของเบราว์เซอร์โดยตรงเท่านั้น คุณสามารถล้างข้อมูลประวัติการทำงานทั้งหมดได้ทุกเมื่อผ่านหน้าเว็บไซต์
              </p>
            </section>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">2. คุกกี้และการวิเคราะห์</h2>
              <p>
                เราใช้เฉพาะคุกกี้ที่จำเป็นสำหรับการตั้งค่าระบบ เช่น การจดจำภาษาที่คุณเลือกล่าสุด (locale) และอาจมีการเก็บสถิติผู้เข้าชมแบบนิรนามเพื่อนำไปใช้ในการปรับปรุงประสิทธิภาพของเว็บไซต์ โดยไม่มีการระบุตัวตนบุคคล
              </p>
            </section>
          </>
        ) : (
          <>
            <p>
              At <strong>UnitTo</strong>, we prioritize user privacy. This policy outlines how we handle information on our platform:
            </p>
            <div className="p-5 bg-sky-500/5 border border-sky-500/10 rounded-2xl space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 font-mono text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400">
                [DATA-CORE: 100% LOCAL & OFFLINE]
              </h3>
              <p className="text-xs leading-relaxed font-semibold">
                All unit conversions and calculation processes on UnitTo run fully offline and execute locally in your browser. We never transmit your conversion inputs or query parameters to any remote servers.
              </p>
            </div>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">1. Storage of Local History</h2>
              <p>
                To provide convenient access to your recent computations and pinned units, we store history data inside your browser's <strong>localStorage</strong>. This data remains on your machine and can be cleared instantly at any time by clicking the clear buttons.
              </p>
            </section>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">2. Cookies & Privacy Logs</h2>
              <p>
                We only use essential functional cookies (such as remembering your selected locale). We do not deploy advertising tracking cookies. We may analyze aggregate, non-personally identifiable traffic metrics for optimization purposes.
              </p>
            </section>
          </>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-between">
        <Link href={`/${locale}`} className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline">
          ➔ {isTh ? "กลับสู่หน้าหลัก" : "Return to Home"}
        </Link>
      </div>
    </div>
  );
}
