import { type ItemId } from "./items";
import { type MaterialCost } from "../systems/upgrades/upgrades";

export interface ShopItem {
  buyPrice: number;
  itemId: ItemId;
  sellPrice: number;
}

export const shopInventory: ShopItem[] = [
  {
    buyPrice: 3,
    itemId: "radish_seed",
    sellPrice: 1,
  },
  {
    buyPrice: 5,
    itemId: "potato_seed",
    sellPrice: 2,
  },
  {
    buyPrice: 8,
    itemId: "blueberry_seed",
    sellPrice: 4,
  },
  {
    buyPrice: 0,
    itemId: "radish",
    sellPrice: 5,
  },
  {
    buyPrice: 0,
    itemId: "potato",
    sellPrice: 9,
  },
  {
    buyPrice: 0,
    itemId: "blueberry",
    sellPrice: 14,
  },
];

export const mineUnlockCost: MaterialCost = {
  stone: 8,
  wood: 12,
};
