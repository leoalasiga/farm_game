import { describe, expect, it } from "vitest";
import { createWallet, sellItem } from "../../src/systems/economy/economy";

describe("economy", () => {
  it("adds money when a crop is sold", () => {
    const wallet = createWallet();
    sellItem(wallet, "radish", 2);
    expect(wallet.gold).toBeGreaterThan(0);
  });
});
