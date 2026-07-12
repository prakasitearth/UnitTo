import React from "react";
import { LoginView } from "@/components/admin/login-view";

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

export default async function AdminLoginPage({ params }: PageProps) {
  const { locale } = await params;
  return <LoginView locale={locale} />;
}
