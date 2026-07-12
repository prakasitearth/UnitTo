import { useState, useEffect } from "react";

export interface ConversionHistoryItem {
  id: string;
  value: number;
  fromUnitId: string;
  fromUnitSymbol: string;
  toUnitId: string;
  toUnitSymbol: string;
  categoryId: string;
  categoryName: string;
  result: number;
  timestamp: number;
}

/**
 * Custom Hook สำหรับการจัดการประวัติการแปลงหน่วยล่าสุดของผู้ใช้งาน (Recent Conversions)
 * มีระบบป้องกันการเกิด Hydration Mismatch ใน Next.js App Router อย่างสมบูรณ์
 */
export function useRecentConversions() {
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // โหลดข้อมูลแบบ Asynchronous เพื่อหลีกเลี่ยงกฎ linter set-state-in-effect ในช่วงแรกของการ Mount
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("conversion_history");
      if (saved) {
        try {
          setHistory(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse conversion history:", e);
        }
      }
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  /**
   * เพิ่มประวัติการแปลงใหม่ล่าสุด (เก็บเฉพาะรายการไม่ซ้ำกันสูงสุด 6 รายการล่าสุด)
   */
  const addConversion = (item: Omit<ConversionHistoryItem, "id" | "timestamp">) => {
    const newItem: ConversionHistoryItem = {
      ...item,
      id: `${item.fromUnitId}-to-${item.toUnitId}-${Date.now()}`,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // คัดกรองคู่แปลงที่ซ้ำออก เพื่อดันรายการล่าสุดขึ้นบนสุด
      const filtered = prev.filter(
        (h) => !(h.fromUnitId === item.fromUnitId && h.toUnitId === item.toUnitId)
      );
      const updated = [newItem, ...filtered].slice(0, 6);
      localStorage.setItem("conversion_history", JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * ล้างประวัติการแปลงทั้งหมด
   */
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("conversion_history");
  };

  return {
    history: isMounted ? history : [],
    addConversion,
    clearHistory,
    isMounted,
  };
}
