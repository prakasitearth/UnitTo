import type { NextConfig } from "next";

// ===== Environment Variable Validation =====
// Warn at startup if required variables are missing
const REQUIRED_ENV_VARS = ["NEXT_PUBLIC_SITE_URL"];
if (process.env.NODE_ENV === "production") {
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      console.warn(`⚠️  [UnitTo] Missing env variable: ${envVar}. Set it in .env.local or your deployment provider.`);
    }
  }
}

// ===== Content Security Policy Directives =====
const baseCspDirectives = [
  "default-src 'self'",
  // Allow inline scripts (needed by Next.js) and Google Analytics
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  // Allow inline styles (required by Tailwind + Next.js font injection)
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Allow Google Fonts
  "font-src 'self' https://fonts.gstatic.com data:",
  // Allow images from self + data URIs + HTTPS sources
  "img-src 'self' data: https:",
  // Allow GA connections
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net",
  // Restrict form submissions
  "form-action 'self'",
  // Restrict base URI
  "base-uri 'self'",
  // Upgrade HTTP → HTTPS
  "upgrade-insecure-requests",
];

const generalCsp = [
  ...baseCspDirectives,
  "frame-ancestors 'none'",
  "frame-src 'none'",
].join("; ");

const widgetCsp = [
  ...baseCspDirectives,
  "frame-ancestors *",
  "frame-src 'self'",
].join("; ");

// ===== Security Headers Config Builder =====
const getSecurityHeaders = (isWidget: boolean) => {
  const headers = [
    // Enable DNS prefetch
    { key: "X-DNS-Prefetch-Control", value: "on" },
    // Force HTTPS for 2 years (only in production)
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    // Prevent MIME type sniffing
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Disable legacy XSS filter (use CSP instead)
    { key: "X-XSS-Protection", value: "0" },
    // Control referrer information
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Restrict browser features
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
    },
    // Content Security Policy
    { 
      key: "Content-Security-Policy", 
      value: isWidget ? widgetCsp : generalCsp 
    },
  ];

  if (!isWidget) {
    headers.push({ key: "X-Frame-Options", value: "DENY" });
  }

  return headers;
};

const nextConfig: NextConfig = {
  // Apply security headers selectively
  async headers() {
    return [
      // 1. Headers for normal pages (blocking all iframe embedding)
      {
        source: "/((?!.*widget).*)",
        headers: getSecurityHeaders(false),
      },
      // 2. Headers for widget pages with locale path (allowing framing)
      {
        source: "/:locale/widget/:slug*",
        headers: getSecurityHeaders(true),
      },
      // 3. Headers for widget pages without locale path (allowing framing)
      {
        source: "/widget/:slug*",
        headers: getSecurityHeaders(true),
      },
    ];
  },
};

export default nextConfig;
