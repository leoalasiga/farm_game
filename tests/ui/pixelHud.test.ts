import { describe, expect, it } from "vitest";
import { PIXEL_HUD_LAYOUT, createHudTextStyle } from "../../src/ui/pixelHud";

describe("pixel HUD layout", () => {
  it("keeps the status and controls panels inside the game canvas", () => {
    const { canvas, controlsPanel, statusPanel } = PIXEL_HUD_LAYOUT;

    expect(statusPanel.x).toBeGreaterThanOrEqual(0);
    expect(statusPanel.y).toBeGreaterThanOrEqual(0);
    expect(statusPanel.x + statusPanel.width).toBeLessThanOrEqual(canvas.width);
    expect(statusPanel.y + statusPanel.height).toBeLessThanOrEqual(canvas.height);

    expect(controlsPanel.x).toBeGreaterThan(statusPanel.x + statusPanel.width);
    expect(controlsPanel.x + controlsPanel.width).toBeLessThanOrEqual(canvas.width);
    expect(controlsPanel.y + controlsPanel.height).toBeLessThanOrEqual(canvas.height);
  });

  it("constrains long body copy so quest and inventory text can wrap", () => {
    const bodyTextStyle = createHudTextStyle("body");

    expect(bodyTextStyle.wordWrap?.width).toBeGreaterThanOrEqual(180);
    expect(bodyTextStyle.wordWrap?.width).toBeLessThan(PIXEL_HUD_LAYOUT.statusPanel.width);
    expect(bodyTextStyle.fontSize).toBe("12px");
  });
});
