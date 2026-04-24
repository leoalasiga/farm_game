import { describe, expect, it } from "vitest";
import {
  advanceFarmDay,
  createFarmPlots,
  plantCrop,
  tillPlot,
  waterPlot,
} from "../../../src/systems/farming/farmPlots";

describe("farm plots", () => {
  it("grows a watered crop across days", () => {
    const farm = createFarmPlots(1, 1);
    tillPlot(farm, 0, 0);
    plantCrop(farm, 0, 0, "radish");
    waterPlot(farm, 0, 0);
    advanceFarmDay(farm);
    waterPlot(farm, 0, 0);
    advanceFarmDay(farm);
    expect(farm.plots[0].stage).toBe("ready");
  });
});
