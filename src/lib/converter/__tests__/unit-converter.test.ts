import { describe, it, expect, beforeEach } from "vitest";
import { UnitConverter } from "../unit-converter";
import unitsDataRaw from "../../../data/units.json";
import { ConversionDatabase } from "../../../types/converter";

const unitsData = unitsDataRaw as unknown as ConversionDatabase;

describe("UnitConverter Core Engine", () => {
  let converter: UnitConverter;

  beforeEach(() => {
    converter = new UnitConverter(unitsData);
  });

  describe("Metadata & Categories", () => {
    it("should load categories correctly", () => {
      const categories = converter.getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories.find(c => c.id === "length")).toBeDefined();
    });

    it("should fetch a specific category", () => {
      const lengthCategory = converter.getCategory("length");
      expect(lengthCategory).not.toBeNull();
      expect(lengthCategory?.name).toBe("Length");
    });

    it("should return null for non-existent category", () => {
      const invalidCategory = converter.getCategory("non_existent");
      expect(invalidCategory).toBeNull();
    });
  });

  describe("Linear Conversions", () => {
    it("should convert within length category correctly", () => {
      // 5 km = 5000 m
      const result = converter.convert(5, "kilometer", "meter", "length");
      expect(result).toBe(5000);

      // 1 foot = 12 inches
      const inches = converter.convert(1, "foot", "inch", "length");
      expect(inches).toBe(12);

      // 100 centimeter = 1 meter
      const meters = converter.convert(100, "centimeter", "meter", "length");
      expect(meters).toBe(1);
    });

    it("should convert within weight category correctly", () => {
      // 2.5 kg = 2500 g
      const grams = converter.convert(2.5, "kilogram", "gram", "weight");
      expect(grams).toBe(2500);

      // 1 kg = ~2.20462 lbs
      const lbs = converter.convert(1, "kilogram", "pound", "weight");
      expect(converter.round(lbs, 5)).toBe(2.20462);
    });

    it("should handle floating point precision flawlessly", () => {
      // JS anomaly: 0.1 * 0.2 = 0.020000000000000004
      // Let's verify our engine handles high precision correctly
      // 0.1 meter to centimeter (factor 0.01) -> 0.1 * (1/0.01) = 10
      const cm = converter.convert(0.1, "meter", "centimeter", "length");
      expect(cm).toBe(10);

      // Let's verify float operations are sanitized up to 12 digits
      const complexResult = converter.convert(0.1, "centimeter", "meter", "length"); // 0.1 * 0.01 = 0.001
      expect(complexResult).toBe(0.001);
    });
  });

  describe("Temperature Conversions (Non-Linear)", () => {
    it("should convert Celsius to Fahrenheit", () => {
      // 0 C = 32 F
      expect(converter.convert(0, "celsius", "fahrenheit", "temperature")).toBe(32);
      // 100 C = 212 F
      expect(converter.convert(100, "celsius", "fahrenheit", "temperature")).toBe(212);
      // -40 C = -40 F
      expect(converter.convert(-40, "celsius", "fahrenheit", "temperature")).toBe(-40);
    });

    it("should convert Fahrenheit to Celsius", () => {
      // 32 F = 0 C
      expect(converter.convert(32, "fahrenheit", "celsius", "temperature")).toBe(0);
      // 212 F = 100 C
      expect(converter.convert(212, "fahrenheit", "celsius", "temperature")).toBe(100);
    });

    it("should convert Celsius to Kelvin", () => {
      // 0 C = 273.15 K
      expect(converter.convert(0, "celsius", "kelvin", "temperature")).toBe(273.15);
      // -273.15 C = 0 K
      expect(converter.convert(-273.15, "celsius", "kelvin", "temperature")).toBe(0);
    });
  });

  describe("Search & Auto-complete with Aliases/Translations", () => {
    it("should match by English name or symbol", () => {
      const results = converter.searchUnits("meter");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.unitId === "meter")).toBe(true);

      const symbolResults = converter.searchUnits("km");
      expect(symbolResults.some(r => r.unitId === "kilometer")).toBe(true);
    });

    it("should match by Thai native aliases", () => {
      // "กิโลเมตร" is an alias/translation for kilometer
      const results = converter.searchUnits("กิโลเมตร");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.unitId === "kilometer")).toBe(true);
    });

    it("should match units by category name / category translation", () => {
      // Searching "องศา" should match temperature category translation, returning temperature units
      const results = converter.searchUnits("องศา");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.categoryId === "temperature")).toBe(true);
    });
  });

  describe("New Categories (Time, Pressure, Fuel Consumption, Currency, etc.)", () => {
    it("should convert time correctly", () => {
      // 1 hour = 60 minutes
      expect(converter.convert(1, "hour", "minute", "time")).toBe(60);
      // 1 day = 24 hours
      expect(converter.convert(1, "day", "hour", "time")).toBe(24);
      // 1 minute = 60 seconds
      expect(converter.convert(1, "minute", "second", "time")).toBe(60);
    });

    it("should convert pressure correctly", () => {
      // 1 bar = 100,000 Pa
      expect(converter.convert(1, "bar", "pascal", "pressure")).toBe(100000);
    });

    it("should convert fuel consumption (formula-based inverse) correctly", () => {
      // 10 L/100km to km/L: formula is 100 / value -> 100 / 10 = 10 km/L
      expect(converter.convert(10, "liter_per_100km", "kilometer_per_liter", "fuel_consumption")).toBe(10);
      
      // 20 L/100km to km/L -> 100 / 20 = 5 km/L
      expect(converter.convert(20, "liter_per_100km", "kilometer_per_liter", "fuel_consumption")).toBe(5);

      // 8 km/L to L/100km -> inverseFormula is 100 / value -> 100 / 8 = 12.5 L/100km
      expect(converter.convert(8, "kilometer_per_liter", "liter_per_100km", "fuel_consumption")).toBe(12.5);
    });

    it("should convert pressure correctly based on factors", () => {
      // 1 bar = 100,000 pascal
      expect(converter.convert(1, "bar", "pascal", "pressure")).toBe(100000);
      expect(converter.convert(100000, "pascal", "bar", "pressure")).toBe(1);
    });
  });

  describe("Error Boundaries", () => {
    it("should throw error for non-existent units", () => {
      expect(() => {
        converter.convert(10, "invalid_unit", "meter", "length");
      }).toThrow();
    });

    it("should throw error for mismatching categories", () => {
      expect(() => {
        // meter is in length, kilogram is in weight
        converter.convert(10, "meter", "kilogram", "length");
      }).toThrow();
    });
  });
});
