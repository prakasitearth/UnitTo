import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";
import { 
  SUPPORTED_LANGUAGES, 
  UI_TRANSLATIONS, 
  UNIT_TRANSLATIONS, 
  CATEGORY_TRANSLATIONS 
} from "@/lib/i18n/translations";
import unitsDataRaw from "@/data/units.json";
import { ConversionDatabase } from "@/types/converter";

const db = unitsDataRaw as unknown as ConversionDatabase;

// Build a dynamic lookup map for all units translation data in units.json
const DYNAMIC_UNIT_TRANSLATIONS: Record<string, Record<string, string>> = {};
db.categories.forEach((category) => {
  category.units.forEach((unit) => {
    if (unit.translations) {
      DYNAMIC_UNIT_TRANSLATIONS[unit.id] = unit.translations;
    }
  });
});

export type LocaleCode = string;

/**
 * Hook สำหรับบริหารจัดการภาษาภายในเว็บไซต์ (i18n)
 * ซิงค์ข้อมูลกับ Next.js App Router (locale segment) และบันทึกคุกกี้โดยตรงฝั่ง Client
 */
export function useLocale() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // ดึงค่าภาษาปัจจุบันจากพารามิเตอร์เส้นทางของ URL (เช่น /[locale]/page.tsx)
  const locale = (params?.locale as string) || "en";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  /**
   * เปลี่ยนการแสดงผลเป็นภาษาอื่น โดยทำการย้ายเส้นทาง URL ไปยังรหัสภาษาใหม่ เช่น /th/length -> /en/length
   */
  const changeLocale = useCallback((newLocale: LocaleCode) => {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === newLocale)) return;

    // ติดตามข้อมูลการสลับภาษาด่วนฝั่ง Analytics
    trackEvent("change_language", "i18n", newLocale);

    // บันทึกความสนใจล่าสุดของผู้ใช้ลงในคุกกี้เพื่อให้ Middleware จดจำได้ถาวร
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    // ทำการเปลี่ยนพาร์ทภาษาใน URL ล่าสุด
    if (pathname) {
      const segments = pathname.split("/");
      // segments[0] เป็นค่าว่าง, segments[1] เป็นภาษาปัจจุบัน
      if (segments.length >= 2 && SUPPORTED_LANGUAGES.some(l => l.code === segments[1])) {
        segments[1] = newLocale;
        const newPath = segments.join("/");
        router.push(newPath + window.location.search);
      } else {
        router.push(`/${newLocale}`);
      }
    }
  }, [pathname, router]);

  /**
   * แปลข้อความ UI ทั่วไป
   */
  const t = useCallback((key: string): string => {
    const activeLocale = isMounted ? locale : "en";
    const dict = UI_TRANSLATIONS[activeLocale] || UI_TRANSLATIONS["en"];
    return dict[key] || UI_TRANSLATIONS["en"][key] || key;
  }, [locale, isMounted]);

  /**
   * แปลชื่อหน่วยการวัด
   */
  const tUnit = useCallback((unitId: string, fallbackName: string): string => {
    const activeLocale = isMounted ? locale : "en";
    
    // 1. Try translations.ts dictionary
    const record = UNIT_TRANSLATIONS[unitId];
    if (record && record[activeLocale]) {
      return record[activeLocale];
    }
    
    // 2. Try dynamically loaded unit.translations from units.json
    const dynamicRecord = DYNAMIC_UNIT_TRANSLATIONS[unitId];
    if (dynamicRecord && dynamicRecord[activeLocale]) {
      return dynamicRecord[activeLocale];
    }
    
    return fallbackName;
  }, [locale, isMounted]);

  /**
   * แปลข้อมูลหมวดหมู่
   */
  const tCategory = useCallback((categoryId: string, fallbackName: string, fallbackDesc: string) => {
    const activeLocale = isMounted ? locale : "en";
    const record = CATEGORY_TRANSLATIONS[categoryId];
    if (record && record[activeLocale]) {
      return {
        name: record[activeLocale].name,
        description: record[activeLocale].description,
      };
    }
    return { name: fallbackName, description: fallbackDesc };
  }, [locale, isMounted]);

  return {
    locale,
    setLocale: changeLocale,
    t,
    tUnit,
    tCategory,
    isMounted,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
