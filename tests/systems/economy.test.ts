import { describe, expect, it } from "vitest";
import { cropData } from "../../src/data/crops";
import { createWallet, getSellPrice, sellItem } from "../../src/systems/economy/economy";

describe("economy", () => {
  it("adds money when a crop is sold", () => {
    const wallet = createWallet();
    sellItem(wallet, "radish", 2);
    expect(wallet.gold).toBeGreaterThan(0);
  });

  it("uses the updated crop prices and localized crop definitions", () => {
    expect(getSellPrice("radish")).toBe(5);
    expect(getSellPrice("potato")).toBe(9);
    expect(getSellPrice("blueberry")).toBe(14);

    expect(cropData.radish.name).toBe("萝卜");
    expect(cropData.potato.seedItemId).toBe("potato_seed");
    expect(cropData.blueberry.seedItemId).toBe("blueberry_seed");
  });
});
