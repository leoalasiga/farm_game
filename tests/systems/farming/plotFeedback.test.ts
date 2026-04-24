import { describe, expect, it } from "vitest";
import { getPlotActionLabel } from "../../../src/systems/farming/plotFeedback";
import { type FarmPlot } from "../../../src/systems/farming/farmPlots";

function makePlot(overrides: Partial<FarmPlot>): FarmPlot {
  return {
    cropId: null,
    growthDays: 0,
    stage: "empty",
    watered: false,
    x: 0,
    y: 0,
    ...overrides,
  };
}

describe("plot feedback", () => {
  it("describes the next action for each plot stage", () => {
    expect(
      getPlotActionLabel(makePlot({ stage: "empty" }), {
        hasSelectedSeed: true,
        selectedCropName: "萝卜",
      }),
    ).toBe("点击翻地");

    expect(
      getPlotActionLabel(makePlot({ stage: "tilled" }), {
        hasSelectedSeed: true,
        selectedCropName: "土豆",
      }),
    ).toBe("点击种下土豆");

    expect(
      getPlotActionLabel(makePlot({ stage: "tilled" }), {
        hasSelectedSeed: false,
        selectedCropName: "蓝莓",
      }),
    ).toBe("蓝莓种子不足");

    expect(
      getPlotActionLabel(makePlot({ stage: "growing", cropId: "radish", watered: false }), {
        hasSelectedSeed: true,
        selectedCropName: "萝卜",
      }),
    ).toBe("点击浇水");

    expect(
      getPlotActionLabel(makePlot({ stage: "growing", cropId: "radish", watered: true }), {
        hasSelectedSeed: true,
        selectedCropName: "萝卜",
      }),
    ).toBe("今天已经浇过水");

    expect(
      getPlotActionLabel(makePlot({ stage: "ready", cropId: "blueberry" }), {
        hasSelectedSeed: true,
        selectedCropName: "蓝莓",
      }),
    ).toBe("点击收获蓝莓");
  });
});
