import { describe, expect, it } from "vitest";
import { createInventory } from "../../../src/systems/inventory/inventory";
import {
  createFarmPlots,
  forceReadyCrop,
  harvestPlot,
} from "../../../src/systems/farming/farmPlots";

describe("harvestPlot", () => {
  it("moves produce into the inventory", () => {
    const inventory = createInventory(8);
    const farm = createFarmPlots(1, 1);
    forceReadyCrop(farm, 0, 0, "radish");
    const result = harvestPlot(farm, inventory, 0, 0);
    expect(result.ok).toBe(true);
    expect(inventory.slots[0]?.itemId).toBe("radish");
  });
});
