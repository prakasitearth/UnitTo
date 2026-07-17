import { notFound } from "next/navigation";
import { resolveSlug, getAllConversionRoutes } from "@/lib/converter/slug-resolver";
import { CategoryView } from "@/components/converter/category-view";
import { ConverterView } from "@/components/converter/converter-view";
import unitsDataRaw from "@/data/units.json";
import { ConversionDatabase } from "@/types/converter";
import { getCategoryMetadata, getConverterMetadata } from "@/lib/seo/metadata";

const db = unitsDataRaw as unknown as ConversionDatabase;
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://unittogo.com";
const locales = ["th", "en", "es", "zh", "hi", "fr", "pt", "ru", "ar", "bn", "ja"];

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = true;

/**
 * กำหนดค่า Static Params สำหรับ SSG (Static Site Generation)
 */
export async function generateStaticParams() {
  const paths: Array<{ locale: string; slug: string }> = [];

  locales.forEach((locale) => {
    // 1. เพิ่มเส้นทางสำหรับหมวดหมู่ (Category Paths)
    db.categories.forEach((category) => {
      paths.push({ locale, slug: category.id });

      // 2. เพิ่มเส้นทางยอดนิยม (Popular Conversion Paths)
      if (category.popularConversions) {
        category.popularConversions.forEach((conv) => {
          paths.push({ locale, slug: conv.slug });
        });
      }
    });
  });

  return paths;
}

/**
 * ดึงข้อมูล SEO Metadata แบบ Dynamic พร้อมระบบ Alt Hreflang Tags สำหรับบราวเซอร์และ Search Engine (SEO)
 */
export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const route = resolveSlug(db, slug);

  // สร้างออบเจกต์ภาษาสำรองสำหรับบราวเซอร์และ Google
  const languagesObj: Record<string, string> = {};
  locales.forEach((l) => {
    languagesObj[l] = `${baseUrl}/${l}/${slug}`;
  });

  let seoMetadata = {};

  if (route.type === "category" && route.categoryId) {
    const category = db.categories.find((c) => c.id === route.categoryId);
    if (category) {
      seoMetadata = getCategoryMetadata(category, locale);
    }
  } else if (route.type === "converter" && route.categoryId && route.fromUnitId && route.toUnitId) {
    const category = db.categories.find((c) => c.id === route.categoryId);
    const fromUnit = category?.units.find((u) => u.id === route.fromUnitId);
    const toUnit = category?.units.find((u) => u.id === route.toUnitId);

    if (category && fromUnit && toUnit) {
      seoMetadata = getConverterMetadata(category, fromUnit, toUnit, locale);
    }
  }

  return {
    ...seoMetadata,
    alternates: {
      canonical: `${baseUrl}/${locale}/${slug}`,
      languages: languagesObj,
    }
  };
}

/**
 * Main Page Component
 */
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const route = resolveSlug(db, slug);

  // หากเป็นเส้นทางที่ไม่ถูกต้อง ให้ส่งกลับหน้า 404 (Not Found)
  if (route.type === "invalid" || !route.categoryId) {
    notFound();
  }

  const category = db.categories.find((c) => c.id === route.categoryId);
  if (!category) {
    notFound();
  }

  // 1. ตรวจสอบว่าเป็นการแสดงผลแบบหน้าหมวดหมู่
  if (route.type === "category") {
    return <CategoryView category={category} />;
  }

  // 2. ตรวจสอบว่าเป็นการแสดงผลแบบหน้าคู่แปลงหน่วยย่อย
  if (route.type === "converter" && route.fromUnitId && route.toUnitId) {
    const fromUnit = category.units.find((u) => u.id === route.fromUnitId);
    const toUnit = category.units.find((u) => u.id === route.toUnitId);

    if (fromUnit && toUnit) {
      return <ConverterView category={category} fromUnit={fromUnit} toUnit={toUnit} />;
    }
  }

  // Fallback 404
  notFound();
}
