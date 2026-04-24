import { describe, expect, it } from "vitest";
import { createToolState, upgradeTool } from "../../src/systems/upgrades/upgrades";

describe("upgradeTool", () => {
  it("improves the axe level after paying costs", () => {
    const tools = createToolState();
    upgradeTool(tools, "axe", { wood: 10, copper_ore: 5 });
    expect(tools.axe.level).toBe(2);
  });
});
