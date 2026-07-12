import React from "react";
import { getDashboardData } from "@/lib/admin/admin-data";
import { DashboardView } from "@/components/admin/dashboard-view";

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

export default async function AdminDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  const dashboardData = getDashboardData();

  return <DashboardView data={dashboardData} locale={locale} />;
}
