import { MetadataRoute } from "next";
import unitsDataRaw from "@/data/units.json";
import { ConversionDatabase } from "@/types/converter";
import { getAllConversionRoutes } from "@/lib/converter/slug-resolver";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unittogo.com";
const db = unitsDataRaw as unknown as ConversionDatabase;
const locales = ["th", "en", "es", "zh", "hi", "fr", "pt", "ru", "ar", "bn", "ja"];

/**
 * สร้างไฟล์ XML Sitemap สำหรับทุกภาษาและทุกคู่แปลงหน่วยบนเว็บไซต์ เพื่อประสิทธิภาพสูงสุดในการทำ SEO
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  const currentDate = new Date();

  // วนลูปสร้างหน้าสำหรับทุกรหัสภาษา
  locales.forEach((locale) => {
    // 1. เพิ่มหน้าแรก (Localized Homepage)
    routes.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    });

    // 2. เพิ่มหน้าหมวดหมู่ (Localized Category Pages)
    db.categories.forEach((category) => {
      routes.push({
        url: `${BASE_URL}/${locale}/${category.id}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    // 3. ดึงคู่คำนวณทั้งหมดแบบ Programmatic และจัดทำ Sitemap
    const allConversions = getAllConversionRoutes(db);
    allConversions.forEach((conv) => {
      routes.push({
        url: `${BASE_URL}/${locale}/${conv.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  });

  return routes;
}
