import { Category, Unit } from "@/types/converter";
import { UNIT_TRANSLATIONS, CATEGORY_TRANSLATIONS } from "@/lib/i18n/translations";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unittogo.com";

function getLocalizedUnitName(unit: Unit, locale: string): string {
  if (unit.translations && unit.translations[locale]) {
    return unit.translations[locale];
  }
  const record = UNIT_TRANSLATIONS[unit.id];
  if (record && record[locale]) {
    return record[locale];
  }
  return unit.plural || unit.name;
}

function getLocalizedCategoryName(category: Category, locale: string): string {
  if (category.translations && category.translations[locale]) {
    return category.translations[locale];
  }
  const record = CATEGORY_TRANSLATIONS[category.id];
  if (record && record[locale] && record[locale].name) {
    return record[locale].name;
  }
  return category.name;
}

/**
 * สร้างข้อมูล Metadata สำหรับหน้าหลัก (Homepage)
 */
export function getHomeMetadata(locale: string = "en") {
  const titles: Record<string, string> = {
    th: "UnitToGo | โปรแกรมแปลงหน่วยวัดออนไลน์ ฟรี คำนวณสด Real-time",
    en: "UnitToGo | Fast, Accurate, and Free Online Unit Converter",
    es: "UnitToGo | Conversor de Unidades en Línea Rápido y Gratis",
    zh: "UnitToGo | 快速、精确且免费的在线单位转换器",
    hi: "UnitToGo | तेज़, सटीक और मुफ़्त ऑनलाइन यूनिट कनवर्टर",
    fr: "UnitToGo | Convertisseur d'unités en ligne gratuit et rapide",
    pt: "UnitToGo | Conversor de Unidades Online Rápido e Grátis",
    ru: "UnitToGo | Быстрый и бесплатный онлайн конвертер величин",
    ar: "UnitToGo | محول وحدات مجاني سريع والدقيق عبر الإنترنت",
    bn: "UnitToGo | দ্রুত, নির্ভুল এবং বিনামূল্যে ইউনিট পরিবর্তনকারী",
    ja: "UnitToGo | 高速・正確・無料のオンライン単位換算ツール",
  };

  const descriptions: Record<string, string> = {
    th: "โปรแกรมแปลงหน่วยวัดออนไลน์ฟรี แปลงหน่วยความยาว น้ำหนัก พื้นที่ อุณหภูมิ ความเร็ว ปริมาตร คำนวณสดแบบ Real-time รวดเร็วและแม่นยำสูง 100%",
    en: "Convert any unit instantly. Free online converter for Length, Weight, Area, Temperature, Speed, Volume, Energy, and more. Fast, accurate, and 100% private.",
    es: "Convierta cualquier unidad al instante. Conversor en línea gratuito para longitud, peso, área, temperatura, velocidad, volumen y más.",
    zh: "即时转换任何单位。针对长度、重量、面积、温度、速度、体积等免费在线转换器。快速、准确且100%私密。",
    hi: "किसी भी इकाई को तुरंत बदलें। लंबाई, वजन, क्षेत्रफल, तापमान, गति, आयतन आदि के लिए मुफ़्त ऑनलाइन कनवर्टर।",
    fr: "Convertissez n'importe quelle unité instantanément. Convertisseur en ligne gratuit pour longueur, poids, surface, température, vitesse et plus.",
    pt: "Converta qualquer unidade instantaneamente. Conversor online gratuito para comprimento, peso, área, temperatura, velocidade, volume e mais.",
    ru: "Мгновенная конвертация любых единиц измерения. Бесплатный онлайн-конвертер длины, веса, площади, температуры, скорости и объема.",
    ar: "تحويل أي وحدة على الفور. محول مجاني عبر الإنترنت للطول والوزن والمساحة ودرجة الحرارة والسرعة والحجم.",
    bn: "যেকোনো ইউনিট তাৎক্ষণিকভাবে রূপান্তর করুন। দৈর্ঘ্য, ওজন, ক্ষেত্রফল, তাপমাত্রা এবং আরও অনেক কিছুর জন্য বিনামূল্যে অনলাইন রূপান্তরকারী।",
    ja: "あらゆる単位を瞬時に換算。長さ、重量、面積、温度、速度、体積などの無料オンライン換算ツール。",
  };

  const title = titles[locale] || titles["en"];
  const description = descriptions[locale] || descriptions["en"];
  const url = `${BASE_URL}/${locale}`;

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
      siteName: "UnitToGo",
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
 * สร้างข้อมูล Metadata สำหรับหน้าหมวดหมู่ (Category Page)
 */
export function getCategoryMetadata(category: Category, locale: string = "en") {
  const categoryName = getLocalizedCategoryName(category, locale);
  const url = `${BASE_URL}/${locale}/${category.id}`;

  const titles: Record<string, string> = {
    th: `โปรแกรมแปลงหน่วย ${categoryName} ออนไลน์ ฟรี | UnitToGo`,
    en: `Free ${categoryName} Converter & Quick Lookup Table | UnitToGo`,
    es: `Conversor de ${categoryName} en Línea Gratis | UnitToGo`,
    zh: `在线 ${categoryName} 转换器和对照表 | UnitToGo`,
    hi: `मुफ़्त ${categoryName} कनवर्टर और त्वरित तालिका | UnitToGo`,
    fr: `Convertisseur de ${categoryName} en ligne gratuit | UnitToGo`,
    pt: `Conversor de ${categoryName} Online Grátis | UnitToGo`,
    ru: `Онлайн конвертер ${categoryName} и таблица | UnitToGo`,
    ar: `محول ${categoryName} مجاني عبر الإنترنت | UnitToGo`,
    bn: `বিনামূল্যে ${categoryName} রূপান্তরকারী | UnitToGo`,
    ja: `無料の ${categoryName} 換算ツールと一覧表 | UnitToGo`,
  };

  const descriptions: Record<string, string> = {
    th: `เครื่องมือแปลงหน่วย${categoryName}ฟรี คำนวณแบบ Real-time พร้อมตารางเปรียบเทียบและสูตรการคำนวณอย่างละเอียด`,
    en: `Free online ${categoryName.toLowerCase()} converter. Convert between all standard units with formulas and quick reference table.`,
    es: `Conversor de ${categoryName.toLowerCase()} en línea. Convierta entre todas las unidades estándar con fórmulas y tablas rápidas.`,
    zh: `免费在线${categoryName}转换器。使用公式和快速参考表在所有标准单位之间进行转换。`,
    hi: `मुफ़्त ऑनलाइन ${categoryName} कनवर्टर। सूत्रों और त्वरित संदर्भ तालिका के साथ सभी मानक इकाइयों के बीच रूपांतरण करें।`,
    fr: `Convertisseur de ${categoryName.toLowerCase()} gratuit. Convertissez entre toutes les unités standards avec formules et tableau récapitulatif.`,
    pt: `Conversor de ${categoryName.toLowerCase()} online grátis. Converta entre todas as unidades padrão com fórmulas e tabela rápida.`,
    ru: `Бесплатный онлайн-конвертер ${categoryName.toLowerCase()}. Перевод между всеми стандартными единицами с формулами и таблицами.`,
    ar: `محول ${categoryName} مجاني عبر الإنترنت. التحويل بين جميع الوحدات القياسية مع الصيغ والجدول السريع.`,
    bn: `বিনামূল্যে অনলাইন ${categoryName} রূপান্তরকারী। সূত্র এবং দ্রুত সারণী সহ সমস্ত মানক ইউনিটের মধ্যে রূপান্তর করুন।`,
    ja: `無料のオンライン${categoryName}換算ツール。計算式とクイック参照表を使用して、すべての標準単位間で換算します。`,
  };

  const title = titles[locale] || titles["en"];
  const description = descriptions[locale] || descriptions["en"];

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
      siteName: "UnitToGo",
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
export function getConverterMetadata(category: Category, fromUnit: Unit, toUnit: Unit, locale: string = "en") {
  const fromName = getLocalizedUnitName(fromUnit, locale);
  const toName = getLocalizedUnitName(toUnit, locale);
  const fromSym = fromUnit.symbol;
  const toSym = toUnit.symbol;

  const slug = `${fromUnit.plural || fromUnit.id}-to-${toUnit.plural || toUnit.id}`.toLowerCase().replace(/\s+/g, "-");
  const url = `${BASE_URL}/${locale}/${slug}`;

  const titles: Record<string, string> = {
    th: `แปลง ${fromSym} เป็น ${toSym} (${fromName} เป็น ${toName}) - คำนวณสด & ตารางแปลงหน่วย | UnitToGo`,
    en: `Convert ${fromSym} to ${toSym} (${fromName} to ${toName}) - Free Online Calculator | UnitToGo`,
    es: `Convertir ${fromSym} a ${toSym} (${fromName} a ${toName}) - Calculadora Gratis | UnitToGo`,
    zh: `转换 ${fromSym} 到 ${toSym} (${fromName} 到 ${toName}) - 在线计算器 | UnitToGo`,
    hi: `${fromSym} से ${toSym} कनवर्टर (${fromName} से ${toName}) - मुफ़्त कैलकुलेटर | UnitToGo`,
    fr: `Convertir ${fromSym} en ${toSym} (${fromName} en ${toName}) - Calculateur Gratuit | UnitToGo`,
    pt: `Converter ${fromSym} para ${toSym} (${fromName} para ${toName}) - Calculadora Grátis | UnitToGo`,
    ru: `Перевод ${fromSym} в ${toSym} (${fromName} в ${toName}) - Калькулятор онлайн | UnitToGo`,
    ar: `تحويل ${fromSym} إلى ${toSym} (${fromName} إلى ${toName}) - حاسبة مجانية | UnitToGo`,
    bn: `${fromSym} থেকে ${toSym} রূপান্তর (${fromName} থেকে ${toName}) | UnitToGo`,
    ja: `${fromSym} から ${toSym} 換算 (${fromName} から ${toName}) - 無料計算機 | UnitToGo`,
  };

  const descriptions: Record<string, string> = {
    th: `แปลง ${fromSym} เป็น ${toSym} (${fromName} เป็น ${toName}) ได้ทันที คำนวณแบบ Real-time พร้อมสูตรคำนวณ ตัวอย่างวิธีคิด และตารางเปรียบเทียบสำเร็จรูป`,
    en: `Instant online conversion for ${fromSym} to ${toSym} (${fromName} to ${toName}). Learn how to convert with formula, step-by-step examples, and a quick conversion table.`,
    es: `Conversión en línea instantánea de ${fromSym} a ${toSym} (${fromName} a ${toName}). Aprenda a convertir con fórmulas, ejemplos y tablas.`,
    zh: `即时在线转换 ${fromSym} 到 ${toSym} (${fromName} 到 ${toName})。了解带有公式、步骤示例和快速对照表的转换方法。`,
    hi: `${fromSym} से ${toSym} (${fromName} से ${toName}) के लिए त्वरित ऑनलाइन रूपांतरण। सूत्र और उदाहरणों के साथ सीखें।`,
    fr: `Conversion en ligne instantanée de ${fromSym} en ${toSym} (${fromName} en ${toName}). Apprenez à convertir avec formules et tableau récapitulatif.`,
    pt: `Conversão online instantânea de ${fromSym} para ${toSym} (${fromName} para ${toName}). Aprenda a converter com fórmula e tabela de referência.`,
    ru: `Мгновенная онлайн-конвертация ${fromSym} в ${toSym} (${fromName} в ${toName}). Формула, примеры и таблица перевода.`,
    ar: `تحويل مجاني عبر الإنترنت لـ ${fromSym} إلى ${toSym} (${fromName} إلى ${toName}). تعلم كيفية التحويل باستخدام الصيغة والأمثلة.`,
    bn: `${fromSym} থেকে ${toSym} (${fromName} থেকে ${toName}) এর তাৎক্ষণিক অনলাইন রূপান্তর। সূত্র এবং উদাহরণ সহ শিখুন।`,
    ja: `${fromSym} から ${toSym} (${fromName} から ${toName}) への即時オンライン換算。計算式、ステップ別例、対照表で簡単換算。`,
  };

  const title = titles[locale] || titles["en"];
  const description = descriptions[locale] || descriptions["en"];

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
      siteName: "UnitToGo",
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
