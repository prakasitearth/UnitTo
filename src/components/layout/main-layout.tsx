"use client";

import React, { useState, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { BottomNav } from "./bottom-nav";
import { SearchOverlay } from "../common/search-overlay";
import { CookieConsent } from "../common/cookie-consent";
import { UnitConverter } from "@/lib/converter/unit-converter";
import { ConversionDatabase } from "@/types/converter";
import unitsDataRaw from "@/data/units.json";

// Initialize a shared static converter instance for client-side search overlay usage
const sharedConverter = new UnitConverter(unitsDataRaw as unknown as ConversionDatabase);

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  // Bind custom global event to open search overlay
  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true);
    window.addEventListener("open-search", handleOpenSearch);
    return () => {
      window.removeEventListener("open-search", handleOpenSearch);
    };
  }, []);

  // Extract minimal category info for the header navigation bar
  const categories = sharedConverter.getCategories().map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Global Responsive Navigation Bar */}
      <Header categories={categories} onSearchOpen={() => setSearchOpen(true)} />

      {/* Main Core Visual Area (adds extra bottom padding on mobile/tablet to avoid BottomNav overlap) */}
      <main className="flex-1 w-full pb-20 lg:pb-8">
        {children}
      </main>

      {/* Dynamic Autocomplete Fuzzy Search Overlay */}
      <SearchOverlay 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        converterInstance={sharedConverter}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <BottomNav onSearchOpen={() => setSearchOpen(true)} />

      {/* GDPR/CCPA/PDPA Cookie Consent Banner */}
      <CookieConsent />

      {/* Corporate Policies & Footer */}
      <Footer />
    </div>
  );
};
