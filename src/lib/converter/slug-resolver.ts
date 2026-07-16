import { ConversionDatabase, Category, Unit } from "@/types/converter";

export interface ResolvedRoute {
  type: "category" | "converter" | "invalid";
  categoryId?: string;
  fromUnitId?: string;
  toUnitId?: string;
}

/**
   * ค้นหาหน่วยวัดจากคำค้นหา (เช่น id, name, symbol, plural, หรือ aliases)
   */
function findUnitByTerm(db: ConversionDatabase, term: string): { category: Category; unit: Unit } | null {
  const cleanTerm = term.toLowerCase().trim();
  if (!cleanTerm) return null;

  for (const category of db.categories) {
    for (const unit of category.units) {
      const matchesId = unit.id.toLowerCase() === cleanTerm;
      const matchesName = unit.name.toLowerCase() === cleanTerm;
      const matchesSymbol = unit.symbol.toLowerCase() === cleanTerm;
      const matchesPlural = !!(unit.plural && unit.plural.toLowerCase() === cleanTerm);
      const matchesAlias = !!(unit.aliases && unit.aliases.some(alias => alias.toLowerCase() === cleanTerm));

      if (matchesId || matchesName || matchesSymbol || matchesPlural || matchesAlias) {
        return { category, unit };
      }
    }
  }

  return null;
}

/**
 * วิเคราะห์และจับคู่ Slug ของ URL เข้ากับ Routing System
 * รองรับทั้ง Category (เช่น "length") และ Conversion Pair (เช่น "meters-to-feet")
 */
export function resolveSlug(db: ConversionDatabase, slug: string): ResolvedRoute {
  const cleanSlug = slug.toLowerCase().trim();
  if (!cleanSlug) {
    return { type: "invalid" };
  }

  // 1. ตรวจสอบว่าเป็น Category หรือไม่
  const categoryMatch = db.categories.find(c => c.id.toLowerCase() === cleanSlug);
  if (categoryMatch) {
    return {
      type: "category",
      categoryId: categoryMatch.id,
    };
  }

  // 2. ตรวจสอบว่าเป็นหน่วยแปลงคู่ (เช่น "meters-to-feet")
  const parts = cleanSlug.split("-to-");
  if (parts.length === 2) {
    const fromTerm = parts[0];
    const toTerm = parts[1];

    // ค้นหาหมวดหมู่ที่เหมาะสมโดยที่ทั้งสองหน่วยอยู่ในหมวดหมู่เดียวกัน
    for (const category of db.categories) {
      let fromUnit: Unit | null = null;
      let toUnit: Unit | null = null;

      for (const unit of category.units) {
        const matchesId = unit.id.toLowerCase() === fromTerm;
        const matchesName = unit.name.toLowerCase() === fromTerm;
        const matchesSymbol = unit.symbol.toLowerCase() === fromTerm;
        const matchesPlural = !!(unit.plural && unit.plural.toLowerCase() === fromTerm);
        const matchesAlias = !!(unit.aliases && unit.aliases.some(alias => alias.toLowerCase() === fromTerm));

        if (matchesId || matchesName || matchesSymbol || matchesPlural || matchesAlias) {
          fromUnit = unit;
          break;
        }
      }

      if (fromUnit) {
        for (const unit of category.units) {
          const matchesId = unit.id.toLowerCase() === toTerm;
          const matchesName = unit.name.toLowerCase() === toTerm;
          const matchesSymbol = unit.symbol.toLowerCase() === toTerm;
          const matchesPlural = !!(unit.plural && unit.plural.toLowerCase() === toTerm);
          const matchesAlias = !!(unit.aliases && unit.aliases.some(alias => alias.toLowerCase() === toTerm));

          if (matchesId || matchesName || matchesSymbol || matchesPlural || matchesAlias) {
            toUnit = unit;
            break;
          }
        }
      }

      if (fromUnit && toUnit) {
        return {
          type: "converter",
          categoryId: category.id,
          fromUnitId: fromUnit.id,
          toUnitId: toUnit.id,
        };
      }
    }
  }

  return { type: "invalid" };
}

/**
 * สร้าง Slug มาตรฐานสำหรับหน้าคู่แปลงหน่วย
 */
export function getSlugForConversion(fromUnit: Unit, toUnit: Unit): string {
  // หากมี plural ให้ใช้ plural เพื่อความสวยงามทาง SEO เช่น "meters-to-feet"
  // หากไม่มีให้ใช้ id แทน
  const fromName = (fromUnit.plural || fromUnit.id).replace(/\s+/g, "-");
  const toName = (toUnit.plural || toUnit.id).replace(/\s+/g, "-");
  return `${fromName}-to-${toName}`.toLowerCase();
}

/**
 * ดึงข้อมูลเส้นทางคู่คำนวณทั้งหมดในระบบ (Programmatic SEO)
 * รวมคู่ยอดนิยมและคู่คำนวณเข้าออกคู่กับ Base Unit ของทุกหน่วยที่มี
 */
export function getAllConversionRoutes(db: ConversionDatabase): Array<{ slug: string }> {
  const routes: Array<{ slug: string }> = [];
  const seenSlugs = new Set<string>();

  db.categories.forEach((category) => {
    const baseUnitId = category.baseUnit;
    const baseUnit = category.units.find((u) => {
      const uIdNormalized = u.id.replace(/_/g, " ").toLowerCase();
      const baseNormalized = baseUnitId.replace(/_/g, " ").toLowerCase();
      return uIdNormalized === baseNormalized;
    });

    // 1. เพิ่มคู่แปลงหน่วยยอดนิยม (Popular conversions)
    if (category.popularConversions) {
      category.popularConversions.forEach((conv) => {
        if (!seenSlugs.has(conv.slug)) {
          seenSlugs.add(conv.slug);
          routes.push({ slug: conv.slug });
        }
      });
    }

    // 2. เพิ่มคู่แปลงของทุกหน่วยเข้าออกกับ Base Unit ของแต่ละหมวดหมู่
    if (baseUnit) {
      category.units.forEach((unit) => {
        if (unit.id !== baseUnit.id) {
          // From unit to base unit
          const forwardSlug = getSlugForConversion(unit, baseUnit);
          if (!seenSlugs.has(forwardSlug)) {
            seenSlugs.add(forwardSlug);
            routes.push({ slug: forwardSlug });
          }

          // From base unit to unit
          const backwardSlug = getSlugForConversion(baseUnit, unit);
          if (!seenSlugs.has(backwardSlug)) {
            seenSlugs.add(backwardSlug);
            routes.push({ slug: backwardSlug });
          }
        }
      });
    }
  });

  return routes;
}
