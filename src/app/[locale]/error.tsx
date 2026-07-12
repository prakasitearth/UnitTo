"use client";

import React from "react";
import Link from "next/link";

/**
 * Branded 500 / Server Error page.
 *
 * Displayed when an unexpected runtime error occurs in a Server Component
 * or during page rendering. Follows the same Blueprint design language as
 * the rest of the site.
 *
 * This is a Next.js App Router error boundary – it MUST be a Client Component
 * that accepts `error` and `reset` props.
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center min-h-[50vh] py-16 px-6 text-center overflow-hidden font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-950">
      {/* Blueprint grid backdrop */}
      <div className="absolute inset-0 bg-blueprint bg-blueprint-fade pointer-events-none opacity-40" />

      {/* Blueprint crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 text-sky-500 font-mono text-2xl font-light" aria-hidden="true">
        +
      </div>

      <div className="relative z-10 space-y-6 max-w-md">
        {/* Error badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
          <span>[SYS-ERR: 500_INTERNAL_ERROR]</span>
        </div>

        {/* Error code */}
        <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 tracking-tight leading-none font-mono">
          500
        </h1>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Something went wrong / เกิดข้อผิดพลาด
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            An unexpected error occurred on our systems. Please try again — if the problem persists, the team has been notified.
          </p>
          {/* Show digest in dev for easier debugging */}
          {process.env.NODE_ENV === "development" && error?.digest && (
            <p className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5 mt-2">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
          {/* Retry */}
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            ↺ TRY AGAIN / ลองอีกครั้ง
          </button>
          {/* Home */}
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            ➔ HOME / หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
