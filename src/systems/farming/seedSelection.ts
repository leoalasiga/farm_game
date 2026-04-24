import { cropData, cropIds, type CropId } from "../../data/crops";
import { type ItemId } from "../../data/items";

export interface SeedSelectionState {
  selectedCropId: CropId;
}

export function createSeedSelection(selectedCropId: CropId = "radish"): SeedSelectionState {
  return { selectedCropId };
}

export function selectCropBySlot(state: SeedSelectionState, slot: number): boolean {
  const cropId = cropIds[slot - 1];
  if (!cropId) {
    return false;
  }

  state.selectedCropId = cropId;
  return true;
}

export function getSelectedSeedItemId(state: SeedSelectionState): ItemId {
  return cropData[state.selectedCropId].seedItemId;
}
