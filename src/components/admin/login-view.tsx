"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginViewProps {
  locale: string;
}

export const LoginView: React.FC<LoginViewProps> = ({ locale }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to dashboard page
        router.push(`/${locale}/admin`);
        router.refresh();
      } else {
        setError(data.error || "Incorrect password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center min-h-[70vh] py-16 px-6 overflow-hidden font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-955">
      {/* Blueprint grid backdrops */}
      <div className="absolute inset-0 bg-blueprint bg-blueprint-fade pointer-events-none opacity-40" />

      {/* Blueprint axes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 text-sky-500 font-mono text-2xl font-light">
        +
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span>[SYS-SECURITY: ADMIN_AUTH]</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-50 font-mono">
            UnitTo Owner Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Unauthorised access to this directory is prohibited. Please authenticate using the master key.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Master Access Key
            </label>
            <div className="relative flex items-center bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus-ring">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none placeholder-slate-400 dark:placeholder-zinc-600 font-mono"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? "AUTHENTICATING..." : "➔ UNLOCK BOARD / เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
};
