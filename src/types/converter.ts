export interface Unit {
  id: string;
  name: string;
  symbol: string;
  factor?: number; // Optional for temperature, required for linear units
  plural: string;
  description?: string;
  formula?: string; // Used for temperature conversions (e.g. celsius to fahrenheit)
  inverseFormula?: string; // Used for temperature conversions (e.g. fahrenheit to celsius)
  note?: string;
  aliases?: string[]; // Synonyms, abbreviations, and native translation names for flexible search matching
  translations?: Record<string, string>; // Localized names (e.g. {"th": "เมตร"})
}

export interface PopularConversion {
  from: string;
  to: string;
  slug: string;
  title?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  baseUnit: string;
  baseUnitSymbol: string;
  icon: string;
  units: Unit[];
  translations?: Record<string, string>; // Localized category names
  popularConversions?: PopularConversion[]; // Prescribed URL paths for static route generation (SSG)
}

export interface ExampleConversionSource {
  value: number;
  unit: string;
  category: string;
}

export interface ExampleConversionTarget {
  unit: string;
  category: string;
}

export interface ExampleConversion {
  description: string;
  source: ExampleConversionSource;
  target: ExampleConversionTarget;
  calculation?: string;
  formula?: string;
  result: number;
}

export interface ConversionDatabase {
  metadata: {
    title: string;
    description: string;
    version: string;
    lastUpdated: string;
    baseSystem: string;
  };
  categories: Category[];
  conversionRules: {
    basic: string;
    between_units: string;
    temperature: string;
  };
  exampleConversions: ExampleConversion[];
}

export interface ConversionResult {
  value: number;
  from: string;
  to: string;
  category: string;
  result: number;
  success: boolean;
  error?: string;
}

export interface SearchResult {
  category: string;
  categoryId: string;
  unit: string;
  unitId: string;
  symbol: string;
  customPath?: string;
  isPairResult?: boolean;
  fromUnitId?: string;
  toUnitId?: string;
  val?: string;
}
