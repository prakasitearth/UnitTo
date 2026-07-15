import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainLayout } from "@/components/layout/main-layout";
import "../globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unittogo.com";

// ===== Font Loading (font-display: swap prevents FOIT) =====
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ===== Supported Locales =====
const LOCALES = ["th", "en", "es", "zh", "hi", "fr", "pt", "ru", "ar", "bn", "ja"];

// RTL locales
const RTL_LOCALES = new Set(["ar"]);

// ===== Default Metadata (overridden per page via generateMetadata) =====
export const metadata: Metadata = {
  title: {
    default: "UnittoGo | Fast, Accurate, and Free Unit Converter",
    template: "%s | UnittoGo",
  },
  description:
    "Convert any unit instantly. Free online converter for Length, Weight, Area, Temperature, Speed, Volume, Energy, and more. Fast, accurate, and 100% private.",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  // ===== Open Graph =====
  openGraph: {
    title: "UnittoGo | Fast, Accurate, and Free Unit Converter",
    description:
      "Convert any unit instantly. Free online converter for Length, Weight, Area, Temperature, Speed, Volume, Energy, and more.",
    url: BASE_URL,
    siteName: "UnittoGo",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "UnittoGo – Fast Unit Converter",
      },
    ],
  },
  // ===== Twitter Card =====
  twitter: {
    card: "summary_large_image",
    title: "UnittoGo | Fast, Accurate, and Free Unit Converter",
    description:
      "Convert any unit instantly. Free online converter for Length, Weight, Area, Temperature, Speed, Volume, Energy, and more.",
    images: [`${BASE_URL}/og-image.png`],
  },
  // ===== Favicon / Icons =====
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  // ===== Robots =====
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Generate static params for all supported locales
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const safeLocale = LOCALES.includes(locale) ? locale : "en";
  const dir = RTL_LOCALES.has(safeLocale) ? "rtl" : "ltr";

  return (
    <html
      lang={safeLocale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          Inline theme script – runs BEFORE first paint to prevent Flash Of
          Incorrect Theme (FOIT). Reads the stored preference from localStorage
          and applies the correct class to <html> synchronously.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;var apply=t==='dark'||(t==='system'&&d)||(!t&&d);document.documentElement.classList.toggle('dark',apply);document.documentElement.classList.toggle('light',!apply);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
