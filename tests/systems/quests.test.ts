import { describe, expect, it } from "vitest";
import { completeObjective, createQuestState } from "../../src/systems/quests/quests";

describe("starter quests", () => {
  it("unlocks the forest after the required objective chain", () => {
    const state = createQuestState();
    completeObjective(state, "harvest_first_crop");
    completeObjective(state, "sell_first_crop");
    completeObjective(state, "meet_shopkeeper");
    expect(state.unlockedZones).toContain("forest");
  });
});
