import { type ItemId } from "./items";

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
    buyPrice: 6,
    itemId: "potato_seed",
    sellPrice: 2,
  },
  {
    buyPrice: 12,
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
    sellPrice: 8,
  },
  {
    buyPrice: 0,
    itemId: "blueberry",
    sellPrice: 12,
  },
];
