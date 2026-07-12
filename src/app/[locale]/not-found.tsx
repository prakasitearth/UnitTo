import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center min-h-[50vh] py-16 px-6 text-center overflow-hidden font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-955">
      {/* Blueprint grid backdrops */}
      <div className="absolute inset-0 bg-blueprint bg-blueprint-fade pointer-events-none opacity-40" />
      
      {/* Blueprint axes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 text-sky-500 font-mono text-2xl font-light">
        +
      </div>
      
      <div className="relative z-10 space-y-6 max-w-md">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>[SYS-ERR: 404_PAGE_NOT_FOUND]</span>
        </div>

        <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-650 to-amber-500 tracking-tight leading-none font-mono">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-150">
            Page Not Found / ไม่พบหน้าเว็บ
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            The URL coordinates you entered do not exist on our map. Return to the home board to begin converting units.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            ➔ RETURN TO BOARD / กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
