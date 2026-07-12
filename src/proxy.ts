import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

const locales = ["th", "en", "es", "zh", "hi", "fr", "pt", "ru", "ar", "bn", "ja"];
const defaultLocale = "en";

// Simple and secure session check based on hash of the password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Keysersoz3";
const expectedSessionToken = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest("hex");


interface DeviceInfo {
  type: "mobile" | "tablet" | "smarttv" | "bot" | "desktop";
  os: "ios" | "android" | "windows" | "macos" | "linux" | "unknown";
  browser: "chrome" | "safari" | "edge" | "firefox" | "opera" | "unknown";
  isBot: boolean;
}

/**
 * วิเคราะห์และแยกแยะข้อมูลอุปกรณ์ ระบบปฏิบัติการ และเว็บเบราว์เซอร์ จาก User-Agent
 */
function parseUserAgent(uaString: string | null): DeviceInfo {
  const ua = uaString || "";
  const info: DeviceInfo = {
    type: "desktop",
    os: "unknown",
    browser: "unknown",
    isBot: false,
  };

  // 1. ตรวจสอบบอทค้นหา (Search Engine Bots)
  const botRegex = /googlebot|bingbot|yandexbot|slurp|duckduckbot|baiduspider|sogou|exabot|facebot|facebookexternalhit|ia_archiver/i;
  if (botRegex.test(ua)) {
    info.type = "bot";
    info.isBot = true;
  }

  // 2. ตรวจสอบระบบปฏิบัติการ (OS)
  if (/ipad|iphone|ipod/i.test(ua)) {
    info.os = "ios";
  } else if (/android/i.test(ua)) {
    info.os = "android";
  } else if (/windows/i.test(ua)) {
    info.os = "windows";
  } else if (/macintosh/i.test(ua)) {
    info.os = "macos";
  } else if (/linux/i.test(ua)) {
    info.os = "linux";
  }

  // 3. ตรวจสอบประเภทอุปกรณ์ (Device Type)
  if (info.type !== "bot") {
    if (/smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv|webos|viera|roku|tizen/i.test(ua)) {
      info.type = "smarttv";
    } else if (/ipad|tablet|playbook|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) {
      info.type = "tablet";
    } else if (/iphone|ipod|blackberry|opera mini|iemobile|mobile|phone/i.test(ua)) {
      info.type = "mobile";
    } else {
      info.type = "desktop";
    }
  }

  // 4. ตรวจสอบโปรแกรมเล่นอินเทอร์เน็ต (Web Browser)
  if (/opera|opr/i.test(ua)) {
    info.browser = "opera";
  } else if (/edg/i.test(ua)) {
    info.browser = "edge";
  } else if (/chrome|crios/i.test(ua)) {
    info.browser = "chrome";
  } else if (/safari/i.test(ua) && !/chrome|crios|edg/i.test(ua)) {
    info.browser = "safari";
  } else if (/firefox|fxios/i.test(ua)) {
    info.browser = "firefox";
  }

  return info;
}

/**
 * วิเคราะห์และแยกส่วนหัวภาษา (Accept-Language) ของบราวเซอร์ผู้ใช้ เพื่อหาภาษาที่ดีที่สุดที่ระบบรองรับ
 */
function getBrowserLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("Accept-Language");
  if (!acceptLang) return defaultLocale;

  try {
    const parsedLangs = acceptLang
      .split(",")
      .map((lang) => {
        const parts = lang.trim().split(";");
        const code = parts[0].split("-")[0].toLowerCase();
        const qVal = parts[1] ? parseFloat(parts[1].split("=")[1]) : 1.0;
        return { code, q: qVal };
      })
      .sort((a, b) => b.q - a.q);

    for (const lang of parsedLangs) {
      if (locales.includes(lang.code)) {
        return lang.code;
      }
    }
  } catch (e) {
    console.error("Failed to parse Accept-Language:", e);
  }

  return defaultLocale;
}

/**
 * Next.js 16 Proxy Convention - Handles request interception, redirects, and preference cookies.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("User-Agent");
  const device = parseUserAgent(ua);

  // ตั้งค่าหัวข้อสตรีมข้อมูลอุปกรณ์สำหรับส่งต่อไปยัง Layout / Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-device-type", device.type);
  requestHeaders.set("x-device-os", device.os);
  requestHeaders.set("x-device-browser", device.browser);
  requestHeaders.set("x-is-bot", device.isBot ? "true" : "false");

  // 1. Bypass all check for API routes except API Admin endpoints
  if (pathname.startsWith("/api/")) {
    if (pathname.startsWith("/api/admin/") && pathname !== "/api/admin/login") {
      const adminSession = request.cookies.get("admin_session")?.value;
      if (adminSession !== expectedSessionToken) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });
  }

  // ตรวจสอบว่ามีรหัสภาษาใน Pathname หรือไม่ (เช่น /en/..., /th/..., /th)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 2. กรณีเส้นทางมีรหัสภาษาแล้ว
  if (pathnameHasLocale) {
    const segments = pathname.split("/");
    const currentLocale = segments[1];
    
    // Check if accessing admin dashboard
    const isAdminPath = pathname === `/${currentLocale}/admin` || pathname.startsWith(`/${currentLocale}/admin/`);
    const isLoginPath = pathname === `/${currentLocale}/admin/login`;

    if (isAdminPath && !isLoginPath) {
      const adminSession = request.cookies.get("admin_session")?.value;
      if (adminSession !== expectedSessionToken) {
        const loginUrl = new URL(`/${currentLocale}/admin/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

    if (cookieLocale !== currentLocale) {
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      });
      response.cookies.set("NEXT_LOCALE", currentLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      return response;
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });
  }

  // 3. กรณีเส้นทางยังไม่มีรหัสภาษา
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const detectedLocale = (cookieLocale && locales.includes(cookieLocale))
    ? cookieLocale
    : getBrowserLocale(request);

  const redirectUrl = new URL(
    `/${detectedLocale}${pathname}${request.nextUrl.search}`,
    request.url
  );
  
  const response = NextResponse.redirect(redirectUrl, { status: 307 });
  
  response.cookies.set("NEXT_LOCALE", detectedLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

// กำหนดขอบเขตเส้นทางที่จะตรวจสอบ (ข้าม Assets และไฟล์ระบบที่มีเครื่องหมายจุดทั้งหมด)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
