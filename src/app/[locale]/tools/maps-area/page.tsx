"use client";

import dynamic from "next/dynamic";

// Dynamically import the Leaflet map client component to prevent Next.js SSR build crashes
const MapsAreaClient = dynamic(
  () => import("@/components/tools/maps-area-client"),
  { ssr: false }
);

export default function MapsAreaPage() {
  return <MapsAreaClient />;
}
