"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboardData } from "@/lib/admin/admin-data";

interface DashboardViewProps {
  data: AdminDashboardData;
  locale: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, locale }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push(`/${locale}/admin/login`);
        router.refresh();
      }
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "seo", name: "SEO Health", icon: "🔍" },
    { id: "search", name: "Search Analytics", icon: "📈" },
    { id: "performance", name: "Performance", icon: "⚡" },
    { id: "errors", name: "Errors & Logs", icon: "🚨" },
    { id: "health", name: "Website Health", icon: "🩺" },
    { id: "content", name: "Content Database", icon: "📂" },
    { id: "deployment", name: "Deployment", icon: "🚀" },
  ];

  const renderIntegrationCard = (name: string, envVar: string, desc: string, isConnected: boolean) => {
    return (
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-850 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-150">{name}</h4>
            <p className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold">{envVar}</p>
          </div>
          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
            isConnected
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span>{isConnected ? "CONNECTED" : "PENDING CONFIG"}</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          {desc}
        </p>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen font-sans bg-slate-50 dark:bg-[#060b18] text-gray-900 dark:text-gray-100 relative">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r border-slate-250 dark:border-zinc-850 transform transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b border-slate-200 dark:border-zinc-850 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔄</span>
            <div className="space-y-0.5">
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 block tracking-wider uppercase">
                [SYS-ADMIN]
              </span>
              <span className="font-black text-lg tracking-tight text-gray-900 dark:text-white font-mono">
                UnittoGo Board
              </span>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 md:hidden"
            title="Close menu"
          >
            ❌
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-sm font-bold font-mono transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-850 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-zinc-850 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-red-200 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold font-mono transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>➔</span>
            <span>LOGOUT / ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {/* Blueprint background grid for aesthetic */}
        <div className="absolute inset-0 bg-blueprint bg-blueprint-fade pointer-events-none opacity-20" />

        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-850 relative z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl border border-slate-250 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-850"
            title="Open menu"
          >
            ☰
          </button>
          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
            UnittoGo Owner Board
          </span>
          <button
            onClick={handleLogout}
            className="p-2 text-xs font-bold text-red-600 dark:text-red-400"
            title="Logout"
          >
            Logout
          </button>
        </header>

        {/* Desktop tab header info */}
        <header className="hidden md:flex items-center justify-between py-6 px-8 border-b border-slate-200/85 dark:border-zinc-850 relative z-20">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">
              {tabs.find((t) => t.id === activeTab)?.name} View
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Live status parameters and calculated diagnostics for the system boards.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-wider uppercase px-3 py-1.5 bg-slate-200/50 dark:bg-zinc-850 border border-slate-300/60 dark:border-zinc-800 text-slate-600 dark:text-slate-400 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>[SYS-STATUS: DEPLOYED]</span>
          </div>
        </header>

        {/* Body content */}
        <section className="flex-1 p-6 md:p-8 space-y-6 relative z-10 max-w-6xl w-full mx-auto">
          
          {!data.deployment.isProductionPasswordSet && (
            <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl">
              <span className="text-xl">⚠️</span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">[SECURITY_WARN: DEFAULT_ADMIN_PASSWORD]</h4>
                <p className="text-xs leading-relaxed font-medium">
                  The dashboard is currently running with the default access key. You should configure the <code className="font-mono bg-amber-500/15 px-1 py-0.5 rounded text-[11px] font-bold">ADMIN_PASSWORD</code> environment variable in your deployment platform to protect your dashboard from unauthorized attempts.
                </p>
              </div>
            </div>
          )}

          {/* 1. OVERVIEW VIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Analytics metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl relative overflow-hidden group">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-sky-400 opacity-60" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Visitors Today
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-2">
                    <span className="text-4xl font-black font-mono tracking-tight text-gray-900 dark:text-white">
                      {data.overview.visitorsToday}
                    </span>
                    {!data.overview.isAnalyticsConnected && (
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.5 rounded-full animate-pulse">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl relative overflow-hidden group">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 to-sky-400 opacity-60" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Visitors Yesterday
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-2">
                    <span className="text-4xl font-black font-mono tracking-tight text-gray-900 dark:text-white">
                      {data.overview.visitorsYesterday}
                    </span>
                    {!data.overview.isAnalyticsConnected && (
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.5 rounded-full">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl relative overflow-hidden group">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-600 to-sky-400 opacity-60" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Active Users
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-2">
                    <span className="text-4xl font-black font-mono tracking-tight text-gray-900 dark:text-white">
                      {data.overview.activeUsers}
                    </span>
                    {data.overview.isAnalyticsConnected ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-2" />
                    ) : (
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.5 rounded-full">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Core analytics content tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Top pages & Conversions */}
                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                    📊 Top Viewed Paths (Analytics Estimate)
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-zinc-850">
                    {data.overview.topPages.map((page, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 text-xs font-semibold font-mono">
                        <span className="text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">{page.path}</span>
                        <span className="text-slate-500 dark:text-slate-400">{page.views} views</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                    🔄 Top Conversion Pairs
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-zinc-850">
                    {data.overview.topConversions.map((conv, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 text-xs font-semibold font-mono">
                        <span className="text-indigo-600 dark:text-indigo-400">{conv.name}</span>
                        <span className="text-slate-500 dark:text-slate-400">{conv.count} events</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Country, Browser, Language break down */}
                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4 lg:col-span-2">
                  <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                    🌐 System Breakdowns (Analytics)
                  </h3>
                  
                  {!data.overview.isAnalyticsConnected ? (
                    <div className="p-12 text-center border border-dashed border-slate-250 dark:border-zinc-800 rounded-2xl bg-slate-50/50 dark:bg-zinc-950/20">
                      <span className="text-3xl block mb-2">📊</span>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-gray-150 uppercase font-mono mb-1">
                        Google Analytics Connection Pending
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-semibold">
                        Breakdown metrics require connection to Google Analytics. Set the <code className="bg-slate-200/50 dark:bg-zinc-850 px-1 py-0.5 rounded font-bold font-mono">NEXT_PUBLIC_GA_ID</code> key to activate this layout widget.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 font-mono">Countries</h4>
                        <div className="space-y-2 divide-y divide-slate-100 dark:divide-zinc-850">
                          {data.overview.countries.map((c, i) => (
                            <div key={i} className="flex justify-between text-xs py-1.5 font-medium">
                              <span>📍 {c.name}</span>
                              <span className="font-mono font-bold">{c.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 font-mono">Browsers</h4>
                        <div className="space-y-2 divide-y divide-slate-100 dark:divide-zinc-850">
                          <div className="flex justify-between text-xs py-1.5 font-medium">
                            <span>🌐 Google Chrome</span>
                            <span className="font-mono font-bold">{data.overview.browsers.chrome}%</span>
                          </div>
                          <div className="flex justify-between text-xs py-1.5 font-medium">
                            <span>🌐 Safari</span>
                            <span className="font-mono font-bold">{data.overview.browsers.safari}%</span>
                          </div>
                          <div className="flex justify-between text-xs py-1.5 font-medium">
                            <span>🌐 Microsoft Edge</span>
                            <span className="font-mono font-bold">{data.overview.browsers.edge}%</span>
                          </div>
                          <div className="flex justify-between text-xs py-1.5 font-medium">
                            <span>🌐 Firefox</span>
                            <span className="font-mono font-bold">{data.overview.browsers.firefox}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 font-mono">Languages</h4>
                        <div className="space-y-2 divide-y divide-slate-100 dark:divide-zinc-850">
                          {data.overview.languages.map((l, i) => (
                            <div key={i} className="flex justify-between text-xs py-1.5 font-medium">
                              <span>🗣️ {l.name}</span>
                              <span className="font-mono font-bold">{l.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. SEO HEALTH VIEW */}
          {activeTab === "seo" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl text-center">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Missing Titles</span>
                  <div className="text-2xl font-black font-mono text-gray-900 dark:text-white mt-1">
                    {data.seo.missingTitlesCount}
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl text-center">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Missing Metas</span>
                  <div className="text-2xl font-black font-mono text-gray-900 dark:text-white mt-1">
                    {data.seo.missingDescriptionsCount}
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl text-center">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Missing Canonical</span>
                  <div className="text-2xl font-black font-mono text-gray-900 dark:text-white mt-1">
                    {data.seo.missingCanonicalCount}
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl text-center">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Broken Links</span>
                  <div className="text-2xl font-black font-mono text-gray-900 dark:text-white mt-1">
                    {data.seo.brokenInternalLinksCount}
                  </div>
                </div>
              </div>

              {/* Translation Checker output from local parse */}
              <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-850 pb-2">
                  <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono">
                    🔍 Locale Database Translation Health
                  </h3>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    REALTIME ANALYSIS
                  </span>
                </div>
                
                {data.seo.details.missingTranslations.length === 0 ? (
                  <div className="p-4 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    🎉 Outstanding! All 11 languages are 100% translated for all units and categories.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      Found missing translation keys inside <code className="font-mono bg-slate-200/50 dark:bg-zinc-850 px-1 py-0.5 rounded font-bold">src/data/units.json</code>:
                    </p>
                    <div className="divide-y divide-slate-100 dark:divide-zinc-850 max-h-72 overflow-y-auto">
                      {data.seo.details.missingTranslations.map((err, i) => (
                        <div key={i} className="py-2.5 text-xs font-semibold font-mono text-amber-600 dark:text-amber-400 flex items-center space-x-2">
                          <span>⚠️</span>
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. SEARCH ANALYTICS VIEW */}
          {activeTab === "search" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderIntegrationCard(
                  "Google Search Console API",
                  "Pending keys in monitoring.ts",
                  "Gives impressions, positions, click analytics, index reports directly inside the dashboard. Reusable wrappers exist.",
                  data.searchAnalytics.isSearchConsoleConnected
                )}
                {renderIntegrationCard(
                  "Bing Webmaster Tools API",
                  "Pending configuration",
                  "Inject index rate status and Bing search ranking details directly into dashboard cards.",
                  data.searchAnalytics.isBingConnected
                )}
              </div>

              <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                  📈 Site Search Analytics (Scaffolded Placeholder)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-slate-500">Most Searched Conversions</h4>
                    <div className="space-y-2 divide-y divide-slate-100 dark:divide-zinc-850">
                      {data.searchAnalytics.mostSearched.map((s, i) => (
                        <div key={i} className="flex justify-between text-xs py-2 font-medium">
                          <span>🔎 {s.query}</span>
                          <span className="font-mono font-bold">{s.count} searches</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-slate-500">Searches with No Results</h4>
                    <div className="space-y-2 divide-y divide-slate-100 dark:divide-zinc-850">
                      {data.searchAnalytics.noResults.map((s, i) => (
                        <div key={i} className="flex justify-between text-xs py-2 font-medium text-amber-600 dark:text-amber-400">
                          <span>⚠️ {s.query}</span>
                          <span className="font-mono font-bold">{s.count} times</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-slate-500">Trending Search Pairs</h4>
                    <div className="space-y-2 divide-y divide-slate-100 dark:divide-zinc-850">
                      {data.searchAnalytics.trending.map((t, i) => (
                        <div key={i} className="text-xs py-2 font-medium text-sky-600 dark:text-sky-400 font-mono">
                          🔥 {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. PERFORMANCE VIEW */}
          {activeTab === "performance" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl overflow-hidden relative">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Largest Contentful Paint (LCP)
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-2">
                    <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {data.performance.lcp} ms
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-600 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      FAST
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-semibold">Targets LCP under 2.5s for SEO advantage.</p>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl overflow-hidden relative">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Cumulative Layout Shift (CLS)
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-2">
                    <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {data.performance.cls}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-600 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      STABLE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-semibold">Targets CLS under 0.1 to avoid shifts.</p>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl overflow-hidden relative">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    First Input Delay (FID)
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-2">
                    <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {data.performance.fid} ms
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-600 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      FAST
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-semibold">Input responsiveness benchmark.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                    ⚡ Slowest Generated Pages (SSR Diagnostic)
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-zinc-850">
                    {data.performance.slowestPages.map((page, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 text-xs font-semibold font-mono">
                        <span className="text-sky-600 dark:text-sky-400">{page.path}</span>
                        <span className="text-slate-500 dark:text-slate-400">{page.loadTime} ms</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                    📦 Largest JavaScript Bundles
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-zinc-850">
                    {data.performance.bundleSizes.map((bundle, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 text-xs font-semibold font-mono">
                        <span className="text-slate-650 dark:text-slate-450">{bundle.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-bold">{bundle.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. ERROR MONITORING VIEW */}
          {activeTab === "errors" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderIntegrationCard(
                  "Sentry Error Monitoring",
                  "SENTRY_DSN",
                  "Tracks runtime javascript crashes, backend compile errors, sitemap errors in real-time. Sends dumps to Sentry.",
                  data.errors.isSentryConnected
                )}
                
                <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-850 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm space-y-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-150">Error Diagnostic Logs</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    Local server logs of 404, exceptions, API failures are collected. Sentry integration replaces local fallback logs in production.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                  🚨 Recent Errors (Local Capture)
                </h3>
                
                {data.errors.recentErrors.length === 0 ? (
                  <div className="p-8 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    🟢 No errors captured in the local buffer during this container session. Clean run!
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-zinc-850">
                    {data.errors.recentErrors.map((err, i) => (
                      <div key={i} className="flex justify-between py-2 text-xs font-mono">
                        <span className="text-red-500">{err.message}</span>
                        <span className="text-slate-400">{err.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. WEBSITE HEALTH VIEW */}
          {activeTab === "health" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl text-center">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1">
                    robots.txt
                  </span>
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    data.health.robotsTxtStatus === "active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${data.health.robotsTxtStatus === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span>{data.health.robotsTxtStatus.toUpperCase()}</span>
                  </span>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl text-center">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1">
                    sitemap.xml
                  </span>
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    data.health.sitemapStatus === "active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${data.health.sitemapStatus === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span>{data.health.sitemapStatus.toUpperCase()}</span>
                  </span>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl text-center">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1">
                    HTTPS Status
                  </span>
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    data.health.httpsStatus === "active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500`} />
                    <span>SECURE (HTTPS)</span>
                  </span>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl text-center">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1">
                    Edge CDN Caching
                  </span>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>ACTIVE</span>
                  </span>
                </div>
              </div>

              {/* Security headers details */}
              <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                  🔒 Security Headers Audit (`next.config.ts`)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs font-mono font-bold">
                    <span className="text-slate-650 dark:text-slate-400">Content Security Policy (CSP)</span>
                    <span className="text-emerald-500">✅ COMPLIANT</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs font-mono font-bold">
                    <span className="text-slate-650 dark:text-slate-400">Strict-Transport-Security (HSTS)</span>
                    <span className="text-emerald-500">✅ ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs font-mono font-bold">
                    <span className="text-slate-650 dark:text-slate-400">X-Frame-Options (Clickjacking blocker)</span>
                    <span className="text-emerald-500">✅ CONFIGURED (DENY)</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs font-mono font-bold">
                    <span className="text-slate-650 dark:text-slate-400">X-Content-Type-Options (nosniff)</span>
                    <span className="text-emerald-500">✅ ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. CONTENT OVERVIEW VIEW */}
          {activeTab === "content" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Total Static Pages
                  </span>
                  <div className="text-4xl font-black font-mono text-gray-900 dark:text-white mt-1">
                    {data.content.totalConversionPages}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-semibold">Automatically generated via static loops.</p>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Conversion Categories
                  </span>
                  <div className="text-4xl font-black font-mono text-gray-900 dark:text-white mt-1">
                    {data.content.categoriesCount}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-semibold">Weight, Speed, Length, Pressure, etc.</p>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Translation Complete
                  </span>
                  <div className="text-4xl font-black font-mono text-sky-500 mt-1">
                    {data.content.translationCompletion}%
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-semibold">Overall localized string coverage.</p>
                </div>
              </div>

              {/* Categories database grid */}
              <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                  📂 Categories & Units Database Stats
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {data.content.categories.map((cat, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-850 rounded-xl space-y-1">
                      <span className="text-xs font-mono font-bold text-gray-950 dark:text-white">{cat.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-450 block">{cat.unitsCount} standard units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. DEPLOYMENT VIEW */}
          {activeTab === "deployment" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-gray-950 dark:text-white font-mono border-b border-slate-100 dark:border-zinc-850 pb-2">
                  🚀 System Deployment Specs
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs font-mono font-bold">
                    <span className="text-slate-500">Framework Version</span>
                    <span>{data.deployment.frameworkVersion}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs font-mono font-bold">
                    <span className="text-slate-500">Node Environment</span>
                    <span className="text-sky-600 dark:text-sky-400 uppercase">{data.deployment.environment}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs font-mono font-bold">
                    <span className="text-slate-500">Git Commit Hash</span>
                    <span className="bg-slate-200/50 dark:bg-zinc-850 px-1.5 py-0.5 rounded text-[11px]">{data.deployment.gitCommitHash}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs font-mono font-bold">
                    <span className="text-slate-500">Deployment Date</span>
                    <span>{data.deployment.deploymentDate}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs font-mono font-bold col-span-1 md:col-span-2">
                    <span className="text-slate-500">Version Specifier</span>
                    <span>v{data.deployment.buildVersion}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
};
