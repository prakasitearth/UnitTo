import { Category, Unit } from "@/types/converter";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unittogo.com";

/**
 * สร้างข้อมูล Metadata สำหรับหน้าหลัก (Homepage)
 */
export function getHomeMetadata() {
  return {
    title: "UnittoGo | Fast, Accurate, and Free Unit Converter",
    description: "Convert any unit instantly. Free online converter for Length, Weight, Area, Temperature, Speed, Volume, Energy, and more. Fast, accurate, and 100% private.",
    alternates: {
      canonical: BASE_URL,
    },
    openGraph: {
      title: "UnittoGo | Fast, Accurate, and Free Unit Converter",
      description: "Convert any unit instantly. Free online converter for Length, Weight, Area, Temperature, Speed, Volume, Energy, and more.",
      url: BASE_URL,
      siteName: "UnittoGo",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "UnittoGo | Fast, Accurate, and Free Unit Converter",
      description: "Convert any unit instantly. Free online converter for Length, Weight, Area, Temperature, Speed, Volume, Energy, and more.",
    }
  };
}

/**
 * สร้างข้อมูล Metadata สำหรับหน้าหมวดหมู่ (Category Page)
 */
export function getCategoryMetadata(category: Category) {
  const title = `${category.name} Converter | UnittoGo`;
  const description = `Free online ${category.name.toLowerCase()} converter. Convert between all standard units including ${category.units.map(u => u.name).slice(0, 5).join(", ")}. Quick reference table and formulas included.`;
  const url = `${BASE_URL}/${category.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "UnittoGo",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

/**
 * สร้างข้อมูล Metadata สำหรับหน้าคำนวณคู่หน่วย (Converter Page)
 */
export function getConverterMetadata(category: Category, fromUnit: Unit, toUnit: Unit) {
  const fromName = fromUnit.plural || fromUnit.name;
  const toName = toUnit.plural || toUnit.name;
  const slug = `${fromName}-to-${toName}`.toLowerCase().replace(/\s+/g, "-");
  
  const title = `Convert ${fromUnit.name} to ${toUnit.name} | UnittoGo`;
  const description = `Instant online conversion for ${fromUnit.name} to ${toUnit.name} (${fromUnit.symbol} to ${toUnit.symbol}). Learn how to convert with formula, step-by-step examples, and a quick conversion table.`;
  const url = `${BASE_URL}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "UnittoGo",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

/**
 * สร้าง JSON-LD Structured Data สำหรับ Search Box ของเว็บ (Homepage)
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "UnittoGo",
    "url": BASE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * สร้าง JSON-LD Organization Schema
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "UnittoGo",
    "url": BASE_URL,
    "logo": `${BASE_URL}/icon-192.png`,
    "description": "The fastest, most accurate online unit converter running 100% locally in your browser."
  };
}

/**
 * สร้าง JSON-LD Structured Data สำหรับ Breadcrumbs (Category / Converter Pages)
 */
export function getBreadcrumbSchema(category: Category, toUnit?: Unit) {
  const itemsList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": BASE_URL
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": category.name,
      "item": `${BASE_URL}/${category.id}`
    }
  ];

  if (toUnit) {
    itemsList.push({
      "@type": "ListItem",
      "position": 3,
      "name": `${category.baseUnit} to ${toUnit.name}`,
      "item": `${BASE_URL}/${category.baseUnit}-to-${toUnit.id}`
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemsList
  };
}

/**
 * สร้าง JSON-LD สำหรับเครื่องมือคำนวณ (SoftwareApplication)
 */
export function getSoftwareApplicationSchema(category: Category, fromUnit: Unit, toUnit: Unit) {
  const title = `${fromUnit.name} to ${toUnit.name} Converter`;
  const slug = `${fromUnit.plural || fromUnit.id}-to-${toUnit.plural || toUnit.id}`.toLowerCase().replace(/\s+/g, "-");

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": `${BASE_URL}/${slug}`
  };
}

/**
 * สร้าง JSON-LD FAQ สำหรับหน้าแปลงหน่วยเพื่อเพิ่มอันดับ SEO Rich Snippets
 */
export function getFAQPageSchema(
  category: Category, 
  fromUnit: Unit, 
  toUnit: Unit, 
  factorText: string,
  formulaText: string
) {
  const fromName = fromUnit.plural || fromUnit.name;
  const toName = toUnit.plural || toUnit.name;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How do you convert ${fromName} to ${toName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `To convert ${fromName} to ${toName}, use the standard formula. ${formulaText}. For example, 1 ${fromUnit.name} = ${factorText} ${toUnit.plural || toUnit.name}.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the formula to convert ${fromUnit.name} to ${toUnit.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The conversion formula is: ${formulaText}.`
        }
      }
    ]
  };
}
