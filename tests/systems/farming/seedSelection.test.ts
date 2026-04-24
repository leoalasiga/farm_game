import { describe, expect, it } from "vitest";
import {
  createSeedSelection,
  getSelectedSeedItemId,
  selectCropBySlot,
} from "../../../src/systems/farming/seedSelection";

describe("seed selection", () => {
  it("defaults to radish and maps slots to crop seeds", () => {
    const selection = createSeedSelection();

    expect(selection.selectedCropId).toBe("radish");
    expect(getSelectedSeedItemId(selection)).toBe("radish_seed");

    expect(selectCropBySlot(selection, 2)).toBe(true);
    expect(selection.selectedCropId).toBe("potato");
    expect(getSelectedSeedItemId(selection)).toBe("potato_seed");
  });
});
