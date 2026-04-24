import { describe, expect, it } from "vitest";
import { gatherNode } from "../../src/systems/gathering/gathering";

describe("gatherNode", () => {
  it("returns a wood drop from a tree node", () => {
    const result = gatherNode("tree");
    expect(result.drops[0].itemId).toBe("wood");
    expect(result.staminaCost).toBeGreaterThan(0);
  });
});
