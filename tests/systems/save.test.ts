import { describe, expect, it } from "vitest";
import { deserializeSave, serializeSave, type GameSaveData } from "../../src/systems/save/save";

describe("save system", () => {
  it("round-trips the game state", () => {
    const source: GameSaveData = {
      day: 2,
      gold: 10,
      inventory: [{ itemId: "radish", count: 3 }],
      selectedCropId: "potato",
    };
    const encoded = serializeSave(source);
    const restored = deserializeSave(encoded);
    expect(restored.day).toBe(2);
    expect(restored.inventory[0]?.count).toBe(3);
    expect(restored.selectedCropId).toBe("potato");
  });
});
