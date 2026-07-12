import { describe, it, expect } from "vitest";
import { resolveSlug } from "../slug-resolver";
import unitsDataRaw from "../../../data/units.json";
import { ConversionDatabase } from "@/types/converter";

const db = unitsDataRaw as unknown as ConversionDatabase;

describe("Dynamic Routing Slug Resolver", () => {
  it("should resolve valid categories", () => {
    const route = resolveSlug(db, "length");
    expect(route.type).toBe("category");
    expect(route.categoryId).toBe("length");

    const tempRoute = resolveSlug(db, "temperature");
    expect(tempRoute.type).toBe("category");
    expect(tempRoute.categoryId).toBe("temperature");
  });

  it("should resolve whitelisted popular conversions", () => {
    const route = resolveSlug(db, "meters-to-feet");
    expect(route.type).toBe("converter");
    expect(route.categoryId).toBe("length");
    expect(route.fromUnitId).toBe("meter");
    expect(route.toUnitId).toBe("foot");
  });

  it("should resolve reverse popular conversions", () => {
    const route = resolveSlug(db, "feet-to-meters");
    expect(route.type).toBe("converter");
    expect(route.categoryId).toBe("length");
    expect(route.fromUnitId).toBe("foot");
    expect(route.toUnitId).toBe("meter");
  });

  it("should resolve dynamic long-tail conversions using aliases", () => {
    // "inches" maps to "inch" and "millimeters" maps to "millimeter"
    const route = resolveSlug(db, "inches-to-millimeters");
    expect(route.type).toBe("converter");
    expect(route.categoryId).toBe("length");
    expect(route.fromUnitId).toBe("inch");
    expect(route.toUnitId).toBe("millimeter");
  });

  it("should handle case insensitivity", () => {
    const route = resolveSlug(db, "METERS-to-FEET");
    expect(route.type).toBe("converter");
    expect(route.categoryId).toBe("length");
    expect(route.fromUnitId).toBe("meter");
    expect(route.toUnitId).toBe("foot");
  });

  it("should reject mismatching categories", () => {
    // meters (length) to kilograms (weight) should be rejected
    const route = resolveSlug(db, "meters-to-kilograms");
    expect(route.type).toBe("invalid");
  });

  it("should resolve fuel, density, volume, and area shorthand popular conversions", () => {
    // Fuel: mpg-us-to-liter-per-100km
    const fuelRoute = resolveSlug(db, "mpg-us-to-liter-per-100km");
    expect(fuelRoute.type).toBe("converter");
    expect(fuelRoute.categoryId).toBe("fuel_consumption");
    expect(fuelRoute.fromUnitId).toBe("miles_per_gallon_us");
    expect(fuelRoute.toUnitId).toBe("liter_per_100km");

    // Density: kg-per-m3-to-g-per-cm3
    const densityRoute = resolveSlug(db, "kg-per-m3-to-g-per-cm3");
    expect(densityRoute.type).toBe("converter");
    expect(densityRoute.categoryId).toBe("density");
    expect(densityRoute.fromUnitId).toBe("kilogram_per_cubic_meter");
    expect(densityRoute.toUnitId).toBe("gram_per_cubic_centimeter");

    // Volume: ml-to-oz
    const volumeRoute = resolveSlug(db, "ml-to-oz");
    expect(volumeRoute.type).toBe("converter");
    expect(volumeRoute.categoryId).toBe("volume");
    expect(volumeRoute.fromUnitId).toBe("milliliter");
    expect(volumeRoute.toUnitId).toBe("fluid_ounce_us");

    // Area: sq-meters-to-sq-feet
    const areaRoute = resolveSlug(db, "sq-meters-to-sq-feet");
    expect(areaRoute.type).toBe("converter");
    expect(areaRoute.categoryId).toBe("area");
    expect(areaRoute.fromUnitId).toBe("square_meter");
    expect(areaRoute.toUnitId).toBe("square_foot");
  });

  it("should reject completely invalid slugs", () => {
    const route = resolveSlug(db, "some-random-slug-string");
    expect(route.type).toBe("invalid");

    const emptyRoute = resolveSlug(db, "");
    expect(emptyRoute.type).toBe("invalid");
  });
});
