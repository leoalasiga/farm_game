import { describe, expect, it } from "vitest";
import { getCropPixels, getPlotPalette } from "../../../src/systems/farming/pixelCrops";

describe("pixel crop specs", () => {
  it("returns a visible green sprout cluster for a growing radish", () => {
    const pixels = getCropPixels("radish", "growing");

    expect(pixels.length).toBeGreaterThanOrEqual(4);
    expect(new Set(pixels.map((pixel) => pixel.color))).toContain("#6dc067");
  });

  it("returns a taller blossom cluster for a ready radish", () => {
    const pixels = getCropPixels("radish", "ready");
    const colors = new Set(pixels.map((pixel) => pixel.color));
    const topmostY = Math.min(...pixels.map((pixel) => pixel.y));

    expect(pixels.length).toBeGreaterThan(6);
    expect(colors).toContain("#f3c6de");
    expect(colors).toContain("#f7e7a1");
    expect(topmostY).toBeLessThanOrEqual(1);
  });

  it("keeps watered soil darker than dry soil", () => {
    const dry = getPlotPalette("growing", false);
    const watered = getPlotPalette("growing", true);

    expect(dry.soil).not.toBe(watered.soil);
    expect(watered.moisture).toBe("#447a67");
  });
});
