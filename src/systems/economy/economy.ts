import { type ItemId } from "../../data/items";
import { shopInventory } from "../../data/shop";
import { addItem, removeItem, type InventoryState } from "../inventory/inventory";

export interface WalletState {
  gold: number;
}

export interface EconomyResult {
  ok: boolean;
}

export function createWallet(startingGold = 12): WalletState {
  return {
    gold: startingGold,
  };
}

export function getBuyPrice(itemId: ItemId): number {
  return shopInventory.find((item) => item.itemId === itemId)?.buyPrice ?? 0;
}

export function getSellPrice(itemId: ItemId): number {
  return shopInventory.find((item) => item.itemId === itemId)?.sellPrice ?? 0;
}

export function sellItem(wallet: WalletState, itemId: ItemId, count: number): EconomyResult {
  const sellPrice = getSellPrice(itemId);
  if (sellPrice <= 0 || count <= 0) {
    return { ok: false };
  }

  wallet.gold += sellPrice * count;
  return { ok: true };
}

export function sellItemFromInventory(
  wallet: WalletState,
  inventory: InventoryState,
  itemId: ItemId,
  count: number,
): EconomyResult {
  const removed = removeItem(inventory, itemId, count);
  if (!removed.ok) {
    return { ok: false };
  }

  return sellItem(wallet, itemId, count);
}

export function buyItem(
  wallet: WalletState,
  inventory: InventoryState,
  itemId: ItemId,
  count: number,
): EconomyResult {
  const buyPrice = getBuyPrice(itemId);
  const totalPrice = buyPrice * count;
  if (buyPrice <= 0 || count <= 0 || wallet.gold < totalPrice) {
    return { ok: false };
  }

  const added = addItem(inventory, itemId, count);
  if (!added.ok) {
    return { ok: false };
  }

  wallet.gold -= totalPrice;
  return { ok: true };
}
