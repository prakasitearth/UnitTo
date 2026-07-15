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

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const isTh = locale === "th";

  return (
    <div className="relative animate-fadeIn text-gray-900 dark:text-gray-100 max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-8 font-sans">
      <div className="space-y-3 border-b border-slate-200/80 dark:border-zinc-850 pb-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-50">
          {isTh ? "เกี่ยวกับเรา / ติดต่อเรา (About Us & Contact)" : "About Us & Contact"}
        </h1>
        <p className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
          [SYS-DOC: ABOUT_v1.0]
        </p>
      </div>

      <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
        {isTh ? (
          <>
            <p>
              <strong>UnittoGo</strong> เป็นแพลตฟอร์มเครื่องมือแปลงหน่วยวัดสากลที่ออกแบบมาเพื่อความเร็ว ความแม่นยำสูงสุด และประสบการณ์การใช้งานที่ไร้รอยต่อ โดยรันงานออฟไลน์แบบ Local 100% ในเบราว์เซอร์ของผู้ใช้งานโดยตรง
            </p>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">การพัฒนาและการออกแบบ</h2>
              <p>
                เราพัฒนาด้วยระบบ Next.js และจัดแต่งดีไซน์ด้วยสถาปัตยกรรม Precision Blueprint เพื่อสะท้อนถึงความแม่นยำด้านวิศวกรรมและการออกแบบเชิงเทคโนโลยี
              </p>
            </section>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">ติดต่อสอบถามข้อมูล</h2>
              <p>
                หากพบปัญหาเกี่ยวกับสูตรการแปลงหน่วย ค้นหาคู่แปลงไม่เจอ หรือมีคำแนะนำในการปรับปรุงหน้าตาและการใช้งาน สามารถส่งข้อเสนอแนะหรือติดต่อนักพัฒนาได้โดยตรงที่อีเมล:
              </p>
              <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-xl font-mono text-center font-bold text-sky-600 dark:text-sky-400">
                support@unittogo.com
              </div>
            </section>
          </>
        ) : (
          <>
            <p>
              <strong>UnittoGo</strong> is a state-of-the-art multi-category unit converter engineered for extreme speed, precision, and modern usability. All conversion algorithms execute locally inside your client browser.
            </p>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">Technology & Architecture</h2>
              <p>
                Built on modern Next.js and styled using a unified Precision Blueprint system to reflect engineering accuracy and semantic layout flow.
              </p>
            </section>
            <section className="space-y-2.5">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 font-sans">Contact Us</h2>
              <p>
                If you encounter calculation bugs, missing standard unit specifications, or want to suggest UI improvements, please reach out to our team at:
              </p>
              <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-xl font-mono text-center font-bold text-sky-600 dark:text-sky-400">
                support@unittogo.com
              </div>
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
