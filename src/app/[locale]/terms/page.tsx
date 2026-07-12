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

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  const isTh = locale === "th";

  return (
    <div className="relative animate-fadeIn text-gray-900 dark:text-gray-100 max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-8 font-sans">
      <div className="space-y-3 border-b border-slate-200/80 dark:border-zinc-850 pb-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-50">
          {isTh ? "ข้อตกลงการใช้งาน (Terms of Service)" : "Terms of Service"}
        </h1>
        <p className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
          [SYS-DOC: TERMS_v1.0] [LAST_UPDATED: 2026-07-12]
        </p>
      </div>

      <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
        {isTh ? (
          <>
            <p>
              ยินดีต้อนรับสู่ <strong>UnitTo</strong>. การเข้าใช้งานเว็บไซต์นี้ถือว่าคุณยอมรับข้อตกลงและเงื่อนไขการใช้งานดังต่อไปนี้:
            </p>
            <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-2">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 font-mono text-xs uppercase tracking-wider">
                [DISCLAIMER: REFERENCE ONLY]
              </h3>
              <p className="text-xs leading-relaxed font-semibold">
                ข้อมูลการแปลงหน่วยวัด ค่าอัตราส่วน และการคำนวณทั้งหมดบนเว็บไซต์นี้จัดทำขึ้นเพื่อวัตถุประสงค์ในการอ้างอิงและประกอบการศึกษาค้นคว้าเท่านั้น ไม่รับประกันความรับผิดชอบต่อความสูญเสียหรือความเสียหายใดๆ จากการนำข้อมูลไปตัดสินใจในเชิงพาณิชย์ วิศวกรรม หรืออุตสาหกรรม
              </p>
            </div>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">1. ความถูกต้องแม่นยำของข้อมูล</h2>
              <p>
                แม้ว่าเราจะใช้อัตราแปลงตามมาตรฐานหน่วยวัดสากล (SI Standards) และอัปเดตระบบคำนวณอยู่เสมอ แต่ทาง UnitTo ไม่รับประกันความถูกต้องแม่นยำ 100% หรือความทันสมัยของอัตราการแลกเปลี่ยนทางการเงิน (Currency) ซึ่งมีการเคลื่อนไหวตลอดเวลา
              </p>
            </section>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">2. ขอบเขตความรับผิดชอบ</h2>
              <p>
                UnitTo และผู้พัฒนาเว็บไซต์จะไม่รับผิดชอบต่อความเสียหาย ทางตรง ทางอ้อม หรือความเสียหายสืบเนื่องใดๆ ที่เกิดขึ้นจากการใช้หรือการไม่สามารถใช้งานเครื่องมือแปลงหน่วยนี้ได้
              </p>
            </section>
          </>
        ) : (
          <>
            <p>
              Welcome to <strong>UnitTo</strong>. By accessing our services, you agree to comply with and be bound by the following terms of use:
            </p>
            <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-2">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 font-mono text-xs uppercase tracking-wider">
                [DISCLAIMER: REFERENCE ONLY]
              </h3>
              <p className="text-xs leading-relaxed font-semibold">
                All conversion data, mathematical formulas, and ratios on UnitTo are provided for general informational and educational purposes only. We offer no warranties regarding suitability, and accept no liability for damages arising from commercial, engineering, or research applications.
              </p>
            </div>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">1. Accuracy of Computations</h2>
              <p>
                While we employ standard scientific coefficients (SI standards) and static currency exchange estimates, UnitTo does not warrant that calculations are error-free or represent current real-time financial market currency values.
              </p>
            </section>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">2. Limitation of Liability</h2>
              <p>
                In no event shall UnitTo or its maintainers be liable for any direct, indirect, incidental, or consequential losses resulting from the use of, or inability to use, this website tool.
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
