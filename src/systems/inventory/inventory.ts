import { type ItemId, itemData } from "../../data/items";

export interface InventorySlot {
  count: number;
  itemId: ItemId;
}

export interface InventoryState {
  capacity: number;
  slots: Array<InventorySlot | null>;
}

export interface InventoryResult {
  ok: boolean;
  remainder: number;
}

export function createInventory(capacity: number): InventoryState {
  return {
    capacity,
    slots: Array.from({ length: capacity }, () => null),
  };
}

export function addItem(
  inventory: InventoryState,
  itemId: ItemId,
  count: number,
): InventoryResult {
  let remainder = count;
  const maxStack = itemData[itemId].maxStack;

  for (const slot of inventory.slots) {
    if (!slot || slot.itemId !== itemId || slot.count >= maxStack) {
      continue;
    }

    const availableSpace = maxStack - slot.count;
    const toMove = Math.min(availableSpace, remainder);
    slot.count += toMove;
    remainder -= toMove;

    if (remainder === 0) {
      return { ok: true, remainder: 0 };
    }
  }

  for (let index = 0; index < inventory.capacity; index += 1) {
    if (inventory.slots[index]) {
      continue;
    }

    const toMove = Math.min(maxStack, remainder);
    inventory.slots[index] = { count: toMove, itemId };
    remainder -= toMove;

    if (remainder === 0) {
      return { ok: true, remainder: 0 };
    }
  }

  return {
    ok: remainder === 0,
    remainder,
  };
}

export function removeItem(
  inventory: InventoryState,
  itemId: ItemId,
  count: number,
): InventoryResult {
  let remainder = count;

  for (let index = inventory.slots.length - 1; index >= 0; index -= 1) {
    const slot = inventory.slots[index];
    if (!slot || slot.itemId !== itemId) {
      continue;
    }

    const toRemove = Math.min(slot.count, remainder);
    slot.count -= toRemove;
    remainder -= toRemove;

    if (slot.count === 0) {
      inventory.slots[index] = null;
    }

    if (remainder === 0) {
      return { ok: true, remainder: 0 };
    }
  }

  return {
    ok: false,
    remainder,
  };
}
