import { notFound } from "next/navigation";
import { resolveSlug, getAllConversionRoutes } from "@/lib/converter/slug-resolver";
import { ConverterForm } from "@/components/converter/converter-form";
import unitsDataRaw from "@/data/units.json";
import { ConversionDatabase } from "@/types/converter";

const db = unitsDataRaw as unknown as ConversionDatabase;
const locales = ["th", "en", "es", "zh", "hi", "fr", "pt", "ru", "ar", "bn", "ja"];

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const paths: Array<{ locale: string; slug: string }> = [];
  const allConversions = getAllConversionRoutes(db);

  locales.forEach((locale) => {
    allConversions.forEach((conv) => {
      paths.push({ locale, slug: conv.slug });
    });
  });

  return paths;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const route = resolveSlug(db, slug);

  if (route.type !== "converter" || !route.categoryId || !route.fromUnitId || !route.toUnitId) {
    notFound();
  }

  const category = db.categories.find((c) => c.id === route.categoryId);
  if (!category) {
    notFound();
  }

  const fromUnit = category.units.find((u) => u.id === route.fromUnitId);
  const toUnit = category.units.find((u) => u.id === route.toUnitId);

  if (!fromUnit || !toUnit) {
    notFound();
  }

  return (
    <div className="w-full max-w-lg mx-auto p-1 animate-fadeIn">
      <div className="flex items-center space-x-2 mb-3 px-2">
        <span className="text-xl" role="img" aria-label={category.name}>{category.icon}</span>
        <span className="text-xs font-black text-gray-500 dark:text-gray-400 font-sans tracking-wide uppercase">
          UnittoGo Widget
        </span>
      </div>
      <ConverterForm
        category={category}
        initialFromUnit={fromUnit}
        initialToUnit={toUnit}
        isWidget={true}
      />
    </div>
  );
}
