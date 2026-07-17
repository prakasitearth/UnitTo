"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Coordinate {
  lat: number;
  lng: number;
}

// Flat-earth shoelace area projection (accurate for local land plots)
function calculatePolygonAreaSqM(coords: Coordinate[]): number {
  if (coords.length < 3) return 0;
  
  let avgLat = 0;
  coords.forEach(c => avgLat += c.lat);
  avgLat = avgLat / coords.length;
  
  const latToMeters = 111132.92;
  const lngToMeters = 111132.92 * Math.cos(avgLat * Math.PI / 180);
  
  let area = 0;
  const n = coords.length;
  for (let i = 0; i < n; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % n];
    
    const x1 = p1.lng * lngToMeters;
    const y1 = p1.lat * latToMeters;
    const x2 = p2.lng * lngToMeters;
    const y2 = p2.lat * latToMeters;
    
    area += (x1 * y2) - (x2 * y1);
  }
  
  return Math.abs(area) * 0.5;
}

export default function MapsAreaClient() {
  const { locale } = useParams() as { locale: string };
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [areaSqM, setAreaSqM] = useState<number>(0);

  const mapRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const mapContainerId = "leaflet-map-root";

  // 1. Dynamic CDN script loading for Leaflet.js
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setLeafletLoaded(true);
      document.head.appendChild(script);
    } else {
      if ((window as any).L) {
        setLeafletLoaded(true);
      }
    }
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!leafletLoaded || typeof window === "undefined") return;
    const L = (window as any).L;
    if (!L) return;

    // Detect if dark mode is enabled on DOM
    const isDark = document.documentElement.classList.contains("dark");
    
    // Premium minimal Map Tiles: CartoDB Positron (Light) or Dark Matter (Dark)
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    // Set center: Bangkok as fallback or default
    const map = L.map(mapContainerId).setView([13.7563, 100.5018], 12);
    mapRef.current = map;

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);

    // Map Click Listener to add coordinates
    map.on("click", (e: any) => {
      const newPoint: Coordinate = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPoints(prev => [...prev, newPoint]);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [leafletLoaded]);

  // 3. Update Polygon & Markers overlay on point addition
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    const L = (window as any).L;
    const map = mapRef.current;

    // Remove existing markers & polygons
    if (polygonRef.current) {
      map.removeLayer(polygonRef.current);
    }
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Calculate Area
    const calculatedArea = calculatePolygonAreaSqM(points);
    setAreaSqM(calculatedArea);

    if (points.length === 0) return;

    // Draw markers
    points.forEach((pt, idx) => {
      const marker = L.circleMarker([pt.lat, pt.lng], {
        radius: 6,
        fillColor: "#0ea5e9",
        color: "#ffffff",
        weight: 2,
        fillOpacity: 1
      }).addTo(map);

      // Add popup text
      marker.bindPopup(`Point ${idx + 1}`);
      markersRef.current.push(marker);
    });

    // Draw Polygon/Polyline
    if (points.length >= 3) {
      polygonRef.current = L.polygon(points.map(p => [p.lat, p.lng]), {
        color: "#0ea5e9",
        fillColor: "#0ea5e9",
        fillOpacity: 0.2,
        weight: 3
      }).addTo(map);
    } else if (points.length === 2) {
      // Draw line if only 2 points
      polygonRef.current = L.polyline(points.map(p => [p.lat, p.lng]), {
        color: "#0ea5e9",
        weight: 3
      }).addTo(map);
    }

  }, [points, leafletLoaded]);

  const handleClear = () => {
    setPoints([]);
    setAreaSqM(0);
  };

  // Convert Sq M to Rai-Ngan-Wah
  const getThaiUnits = (area: number) => {
    const rai = Math.floor(area / 1600);
    const rem1 = area % 1600;
    const ngan = Math.floor(rem1 / 400);
    const rem2 = rem1 % 400;
    const wah = parseFloat((rem2 / 4).toFixed(1));
    return { rai, ngan, wah };
  };

  const thaiUnits = getThaiUnits(areaSqM);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      th: {
        title: "แผนที่คำนวณพื้นที่ดินทั่วโลก (Global Land Area Calculator Map)",
        desc: "วัดขนาดที่ดินได้จากทุกที่ทั่วโลก! เพียงคลิกจุดล้อมรอบแปลงที่ดินบนแผนที่เพื่อคำนวณพื้นที่เป็นตารางเมตร เอเคอร์ เฮกตาร์ หรือหน่วยที่ดินของไทย ไร่-งาน-ตารางวา ได้ทันที",
        back: "กลับหน้าแรก",
        panelTitle: "📐 สรุปผลการวัดพื้นที่",
        clear: "ล้างจุดวาดทั้งหมด",
        sqm: "ตารางเมตร (sq m)",
        sqft: "ตารางฟุต (sq ft)",
        acres: "เอเคอร์ (Acres)",
        hectares: "เฮกตาร์ (Hectares)",
        tsubo: "สึโบะ / 坪 (ญี่ปุ่น)",
        pyeong: "พยอง / 평 (เกาหลี)",
        thaiTitle: "หน่วยที่ดินไทย",
        rai: "ไร่",
        ngan: "งาน",
        wah: "ตารางวา",
        instruction: "💡 วิธีใช้งาน: ซูม/ค้นหาตำแหน่งที่ดินของคุณ แล้วกดคลิกจิ้มบนแผนที่อย่างน้อย 3 จุดเพื่อล้อมรอบแปลงที่ดิน ระบบจะคำนวณพื้นที่ให้แบบเรียลไทม์"
      },
      en: {
        title: "Global Land Area Calculator Map",
        desc: "Measure land area anywhere on Earth. Click points to outline a property or plot of land on the map and calculate the area instantly in Sq Meters, Acres, Hectares, or local units.",
        back: "Back to Home",
        panelTitle: "📐 Measured Land Area",
        clear: "Clear All Points",
        sqm: "Square Meters (sq m)",
        sqft: "Square Feet (sq ft)",
        acres: "Acres",
        hectares: "Hectares",
        tsubo: "Tsubo / 坪 (Japan)",
        pyeong: "Pyeong / 평 (Korea)",
        thaiTitle: "Thai Land Units",
        rai: "Rai",
        ngan: "Ngan",
        wah: "Tarang Wa",
        instruction: "💡 How to use: Find your land plot, then click on the map to place at least 3 markers outline. The calculated area will update in real-time."
      }
    };
    return translations[locale]?.[key] || translations["en"][key];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-gray-900 dark:text-gray-150">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          ← {t("back")}
        </Link>
      </div>

      {/* Page Header */}
      <header className="mb-8 text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-500 dark:from-sky-300 dark:to-emerald-400 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          {t("desc")}
        </p>
      </header>

      {/* Guide Instruction */}
      <div className="mb-6 p-4 bg-blue-50/50 dark:bg-zinc-900 border border-blue-100/50 dark:border-zinc-800 rounded-2xl text-xs font-bold text-sky-700 dark:text-sky-400">
        {t("instruction")}
      </div>

      {/* Map & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Leaflet Map Container */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/85 rounded-3xl overflow-hidden shadow-sm h-[500px] relative">
          {!leafletLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-zinc-950 z-20">
              <span className="text-xs font-bold text-slate-400 animate-pulse">Loading Leaflet Map...</span>
            </div>
          )}
          <div id={mapContainerId} className="w-full h-full z-10" />
        </div>

        {/* Right Side: Area Calculation Metrics Output */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/85 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center">
              {t("panelTitle")}
            </h2>

            {/* Calculations metrics list */}
            <div className="space-y-3.5">
              {/* Metric sqm */}
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t("sqm")}</span>
                <span className="font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {parseFloat(areaSqM.toFixed(1)).toLocaleString()}
                </span>
              </div>

              {/* Metric sqft */}
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t("sqft")}</span>
                <span className="font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {parseFloat((areaSqM * 10.7639).toFixed(1)).toLocaleString()}
                </span>
              </div>

              {/* Metric Hectares */}
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t("hectares")}</span>
                <span className="font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {parseFloat((areaSqM / 10000).toFixed(4))}
                </span>
              </div>

              {/* Metric Acres */}
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t("acres")}</span>
                <span className="font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {parseFloat((areaSqM / 4046.856).toFixed(4))}
                </span>
              </div>

              {/* Metric Tsubo (JP) */}
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t("tsubo")}</span>
                <span className="font-extrabold font-mono text-slate-800 dark:text-slate-100">
                  {parseFloat((areaSqM / 3.30578).toFixed(2))}
                </span>
              </div>

              {/* Traditional Thai Units Box */}
              <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl space-y-2">
                <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  🇹🇭 {t("thaiTitle")}
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl border border-emerald-100/40">
                    <div className="text-[10px] text-slate-400 font-bold">{t("rai")}</div>
                    <div className="text-lg font-black font-mono text-emerald-650">{thaiUnits.rai}</div>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl border border-emerald-100/40">
                    <div className="text-[10px] text-slate-400 font-bold">{t("ngan")}</div>
                    <div className="text-lg font-black font-mono text-emerald-650">{thaiUnits.ngan}</div>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl border border-emerald-100/40">
                    <div className="text-[10px] text-slate-400 font-bold">{t("wah")}</div>
                    <div className="text-lg font-black font-mono text-emerald-650">{thaiUnits.wah}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div>
            <button
              onClick={handleClear}
              disabled={points.length === 0}
              className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer ${
                points.length === 0
                  ? "bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 cursor-not-allowed border border-slate-200/40 dark:border-zinc-800/40"
                  : "bg-red-500 hover:bg-red-600 active:scale-98 shadow-sm hover:shadow"
              }`}
            >
              🗑️ {t("clear")}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
