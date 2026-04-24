import { describe, expect, it } from "vitest";
import { PIXEL_HUD_LAYOUT } from "../../src/ui/pixelHud";
import { FARM_LAYOUT } from "../../src/scenes/farmLayout";

function overlaps(
  a: { height: number; width: number; x: number; y: number },
  b: { height: number; width: number; x: number; y: number },
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

describe("farm layout", () => {
  it("keeps the farm grid clear of the fixed HUD panels", () => {
    expect(overlaps(FARM_LAYOUT.gridBounds, PIXEL_HUD_LAYOUT.statusPanel)).toBe(false);
    expect(overlaps(FARM_LAYOUT.gridBounds, PIXEL_HUD_LAYOUT.controlsPanel)).toBe(false);
  });
});
