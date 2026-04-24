import { type FarmPlot } from "../farming/farmPlots";
import { type InventorySlot } from "../inventory/inventory";

export const SAVE_STORAGE_KEY = "pixel-farm-adventure-save";

export interface GameSaveData {
  day: number;
  farmPlots?: {
    height: number;
    plots: FarmPlot[];
    width: number;
  };
  gold: number;
  inventory: Array<InventorySlot | null>;
  playerPosition?: {
    x: number;
    y: number;
  };
  timeMinutes?: number;
}

export function serializeSave(source: GameSaveData): string {
  return JSON.stringify(source);
}

export function deserializeSave(encoded: string): GameSaveData {
  return JSON.parse(encoded) as GameSaveData;
}

export function saveToStorage(
  source: GameSaveData,
  storage: Pick<Storage, "setItem"> = globalThis.localStorage,
): string {
  const encoded = serializeSave(source);
  storage.setItem(SAVE_STORAGE_KEY, encoded);
  return encoded;
}

export function loadFromStorage(
  storage: Pick<Storage, "getItem"> = globalThis.localStorage,
): GameSaveData | null {
  const encoded = storage.getItem(SAVE_STORAGE_KEY);
  if (!encoded) {
    return null;
  }

  return deserializeSave(encoded);
}
