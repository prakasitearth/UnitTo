import { 
  ConversionDatabase, 
  Category, 
  Unit, 
  ConversionResult, 
  SearchResult, 
  ExampleConversion 
} from "@/types/converter";

export class UnitConverter {
  private unitsData: ConversionDatabase;
  private categoriesMap: Map<string, Category>;
  private unitsMap: Map<string, { category: Category; unit: Unit }>;

  constructor(unitsData: ConversionDatabase) {
    this.unitsData = unitsData;
    this.categoriesMap = new Map();
    this.unitsMap = new Map();
    this.initializeMaps();
  }

  /**
   * สร้าง Map สำหรับการค้นหาข้อมูลหมวดและหน่วยอย่างรวดเร็ว
   */
  private initializeMaps(): void {
    this.unitsData.categories.forEach((category) => {
      this.categoriesMap.set(category.id, category);
      category.units.forEach((unit) => {
        const key = `${category.id}:${unit.id}`;
        this.unitsMap.set(key, { category, unit });
      });
    });
  }

  /**
   * แก้ไขปัญหาความแม่นยำของเลขทศนิยมใน JavaScript (IEEE 754 floating point inaccuracies)
   * โดยปัดให้มีความถูกต้องในระดับเลขนัยสำคัญ 12 หลัก
   */
  private sanitizeFloat(num: number): number {
    if (isNaN(num) || !isFinite(num)) {
      return num;
    }
    // ใช้ toPrecision(12) และแปลงกลับด้วย parseFloat เพื่อล้างเศษทศนิยมล้นเกิน
    return parseFloat(num.toPrecision(12));
  }

  /**
   * ปลอดภัยในการประเมินสูตรคณิตศาสตร์ (แทน eval)
   */
  private evaluateFormula(formula: string, value: number): number {
    // แทนค่า "value" ด้วยตัวเลขจริง
    const expression = formula.replace(/value/g, value.toString());
    
    // ตรวจสอบความปลอดภัย: อนุญาตเฉพาะตัวเลข, ทศนิยม, ช่องว่าง, วงเล็บ และเครื่องหมายทางคณิตศาสตร์พื้นฐาน
    if (!/^[\d\s.+\-*/()]+$/.test(expression)) {
      throw new Error(`Formula contains unsafe characters: ${formula}`);
    }

    try {
      // ใช้ Function constructor ในโหมด "use strict" แทน eval ทั่วไปเพื่อประสิทธิภาพและความปลอดภัย
      const evaluated = Function(`"use strict"; return (${expression})`)();
      return this.sanitizeFloat(evaluated);
    } catch (error) {
      throw new Error(`Failed to evaluate formula: ${formula}. Error: ${error}`);
    }
  }

  /**
   * แปลงค่าจากหน่วยหนึ่งไปยังหน่วยอื่น
   */
  public convert(value: number, fromUnitId: string, toUnitId: string, categoryId: string): number {
    if (isNaN(value)) {
      return NaN;
    }

    // ค้นหาข้อมูล
    const fromData = this.unitsMap.get(`${categoryId}:${fromUnitId}`);
    const toData = this.unitsMap.get(`${categoryId}:${toUnitId}`);

    if (!fromData || !toData) {
      throw new Error(`ไม่พบหน่วย: ${fromUnitId} หรือ ${toUnitId} ในหมวด ${categoryId}`);
    }

    const fromUnit = fromData.unit;
    const toUnit = toData.unit;

    // ตรวจสอบหมวด Temperature (ใช้สูตรคำนวณสูตรพิเศษ)
    if (categoryId === "temperature") {
      return this.sanitizeFloat(this.convertTemperature(value, fromUnit, toUnit));
    }

    // ตรวจสอบหน่วยที่ใช้สูตรคำนวณ (formula-based units เช่น L/100km ในหมวด fuel_consumption)
    const fromHasFormula = fromUnit.formula !== undefined && fromUnit.factor === undefined;
    const toHasFormula = toUnit.formula !== undefined && toUnit.factor === undefined;

    if (fromHasFormula || toHasFormula) {
      return this.sanitizeFloat(this.convertWithFormula(value, fromUnit, toUnit, categoryId));
    }

    if (fromUnit.factor === undefined || toUnit.factor === undefined) {
      throw new Error(`หน่วย ${fromUnitId} หรือ ${toUnitId} ไม่มี conversion factor`);
    }

    // การแปลงแบบปกติ (Linear conversion)
    // ขั้น 1: แปลงเป็น Base Unit พร้อมควบคุมความแม่นยำ
    const valueInBase = this.sanitizeFloat(value * fromUnit.factor);

    // ขั้น 2: แปลง Base Unit ไปยังหน่วยเป้าหมาย พร้อมควบคุมความแม่นยำ
    const result = this.sanitizeFloat(valueInBase / toUnit.factor);

    return result;
  }

  /**
   * การแปลงที่มีหน่วยใช้สูตร (เช่น L/100km) ผสมกับหน่วยที่ใช้ factor ปกติ
   */
  private convertWithFormula(value: number, fromUnit: Unit, toUnit: Unit, categoryId: string): number {
    // ขั้น 1: แปลงจาก fromUnit ไปยัง Base Unit
    let baseValue: number;
    if (fromUnit.formula && fromUnit.factor === undefined) {
      // ใช้สูตรเพื่อแปลงไปยัง Base Unit
      baseValue = this.evaluateFormula(fromUnit.formula, value);
    } else if (fromUnit.factor !== undefined) {
      baseValue = value * fromUnit.factor;
    } else {
      // fromUnit is the base unit
      const category = this.getCategory(categoryId);
      if (category && fromUnit.id === category.baseUnit) {
        baseValue = value;
      } else {
        throw new Error(`ไม่สามารถแปลงจาก ${fromUnit.name} ได้`);
      }
    }

    // ขั้น 2: แปลงจาก Base Unit ไปยัง toUnit
    if (toUnit.inverseFormula && toUnit.factor === undefined) {
      return this.evaluateFormula(toUnit.inverseFormula, baseValue);
    } else if (toUnit.factor !== undefined) {
      return baseValue / toUnit.factor;
    } else {
      const category = this.getCategory(categoryId);
      if (category && toUnit.id === category.baseUnit) {
        return baseValue;
      }
      throw new Error(`ไม่สามารถแปลงไปยัง ${toUnit.name} ได้`);
    }
  }

  /**
   * การแปลงอุณหภูมิ (ใช้สูตรคำนวณ)
   */
  private convertTemperature(value: number, fromUnit: Unit, toUnit: Unit): number {
    // แปลงจาก fromUnit ไปยัง Celsius (Base Unit)
    let celsius: number;
    if (fromUnit.id === "celsius") {
      celsius = value;
    } else if (fromUnit.formula) {
      celsius = this.evaluateFormula(fromUnit.formula, value);
    } else {
      throw new Error(`ไม่สามารถแปลงจาก ${fromUnit.name} ได้`);
    }

    // แปลง Celsius ไปยัง toUnit
    if (toUnit.id === "celsius") {
      return celsius;
    } else if (toUnit.inverseFormula) {
      return this.evaluateFormula(toUnit.inverseFormula, celsius);
    } else {
      throw new Error(`ไม่สามารถแปลงไปยัง ${toUnit.name} ได้`);
    }
  }

  /**
   * ได้รับข้อมูลหมวดทั้งหมด
   */
  public getCategories(): Category[] {
    return this.unitsData.categories;
  }

  /**
   * ได้รับข้อมูลหมวดตามรหัส
   */
  public getCategory(categoryId: string): Category | null {
    return this.categoriesMap.get(categoryId) || null;
  }

  /**
   * ได้รับทั้งหมดหน่วยในหมวด
   */
  public getUnits(categoryId: string): Unit[] {
    const category = this.getCategory(categoryId);
    return category ? category.units : [];
  }

  /**
   * ได้รับข้อมูลหน่วยตามรหัส
   */
  public getUnit(categoryId: string, unitId: string): Unit | null {
    const data = this.unitsMap.get(`${categoryId}:${unitId}`);
    return data ? data.unit : null;
  }

  /**
   * แปลงค่าไปเป็นหน่วยฐาน (Base Unit)
   */
  public toBaseUnit(value: number, fromUnitId: string, categoryId: string): number {
    const fromData = this.unitsMap.get(`${categoryId}:${fromUnitId}`);
    if (!fromData) {
      throw new Error(`ไม่พบหน่วย: ${fromUnitId}`);
    }

    const fromUnit = fromData.unit;

    // สำหรับ Temperature ต้องใช้สูตรคำนวณ
    if (categoryId === "temperature") {
      if (fromUnit.id === "celsius") {
        return value;
      }
      if (fromUnit.formula) {
        return this.evaluateFormula(fromUnit.formula, value);
      }
      return value;
    }

    if (fromUnit.factor === undefined) {
      throw new Error(`หน่วย ${fromUnitId} ไม่มี conversion factor`);
    }

    return this.sanitizeFloat(value * fromUnit.factor);
  }

  /**
   * แปลงจากหน่วยฐาน (Base Unit)
   */
  public fromBaseUnit(baseValue: number, toUnitId: string, categoryId: string): number {
    const toData = this.unitsMap.get(`${categoryId}:${toUnitId}`);
    if (!toData) {
      throw new Error(`ไม่พบหน่วย: ${toUnitId}`);
    }

    const toUnit = toData.unit;

    // สำหรับ Temperature ต้องใช้สูตรคำนวณ
    if (categoryId === "temperature") {
      if (toUnit.id === "celsius") {
        return baseValue;
      }
      if (toUnit.inverseFormula) {
        return this.evaluateFormula(toUnit.inverseFormula, baseValue);
      }
      return baseValue;
    }

    if (toUnit.factor === undefined) {
      throw new Error(`หน่วย ${toUnitId} ไม่มี conversion factor`);
    }

    return this.sanitizeFloat(baseValue / toUnit.factor);
  }

  /**
   * แปลงค่าหลายรายการพร้อมกัน
   */
  public convertBatch(
    conversions: Array<{ value: number; from: string; to: string; category: string }>
  ): ConversionResult[] {
    return conversions.map((conv) => {
      try {
        const result = this.convert(conv.value, conv.from, conv.to, conv.category);
        return {
          ...conv,
          result,
          success: true,
        };
      } catch (error: unknown) {
        return {
          ...conv,
          result: NaN,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });
  }

  /**
   * ค้นหาหน่วยตามชื่อ (รองรับ fuzzy search และ aliases/translations หลายภาษา)
   */
  public searchUnits(searchTerm: string): SearchResult[] {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return [];
    
    const results: SearchResult[] = [];

    for (const [, data] of this.unitsMap) {
      const unit = data.unit;
      const category = data.category;

      // ตรวจสอบชื่อหลัก สัญลักษณ์ และพหูพจน์
      const matchesName = unit.name.toLowerCase().includes(term);
      const matchesSymbol = unit.symbol.toLowerCase().includes(term);
      const matchesPlural = !!(unit.plural && unit.plural.toLowerCase().includes(term));

      // ตรวจสอบคำพ้องรูป/ชื่อย่อ (Aliases)
      const matchesAlias = !!(unit.aliases && unit.aliases.some((alias) => alias.toLowerCase().includes(term)));

      // ตรวจสอบข้อมูลแปลภาษา (Translations)
      const matchesTranslation = !!(unit.translations && Object.values(unit.translations).some((trans) =>
        trans.toLowerCase().includes(term)
      ));

      // ตรวจสอบหมวดหมู่ (Category Name / Category Translations)
      const matchesCategoryName = category.name.toLowerCase().includes(term);
      const matchesCategoryTranslation = !!(category.translations && Object.values(category.translations).some((trans) =>
        trans.toLowerCase().includes(term)
      ));

      if (
        matchesName ||
        matchesSymbol ||
        matchesPlural ||
        matchesAlias ||
        matchesTranslation ||
        matchesCategoryName ||
        matchesCategoryTranslation
      ) {
        results.push({
          category: category.name,
          categoryId: category.id,
          unit: unit.name,
          unitId: unit.id,
          symbol: unit.symbol,
        });
      }
    }

    return results;
  }

  /**
   * ได้รับรายการการแปลงตัวอย่าง
   */
  public getExampleConversions(): ExampleConversion[] {
    return this.unitsData.exampleConversions || [];
  }

  /**
   * ปัดเศษให้เรียบร้อยเพื่อความสะดวกในการแสดงผล
   */
  public round(value: number, decimals: number = 4): number {
    if (isNaN(value) || !isFinite(value)) {
      return value;
    }
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}
