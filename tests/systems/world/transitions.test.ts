import { describe, expect, it } from "vitest";
import { getTransition } from "../../../src/systems/world/transitions";

describe("world transitions", () => {
  it("returns the farm-to-village transition target", () => {
    const transition = getTransition("farm_gate");
    expect(transition.targetScene).toBe("VillageScene");
  });
});
