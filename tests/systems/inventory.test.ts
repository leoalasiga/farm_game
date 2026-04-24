import { describe, expect, it } from "vitest";
import { addItem, createInventory } from "../../src/systems/inventory/inventory";

describe("inventory", () => {
  it("stacks identical items", () => {
    const inventory = createInventory(8);
    addItem(inventory, "radish", 1);
    addItem(inventory, "radish", 2);
    expect(inventory.slots[0]?.count).toBe(3);
  });
});
