export const itemIds = [
  "radish",
  "potato",
  "blueberry",
  "wood",
  "stone",
  "copper_ore",
  "coal",
  "berries",
  "fiber",
] as const;

export type ItemId = (typeof itemIds)[number];

export interface ItemDefinition {
  id: ItemId;
  name: string;
  maxStack: number;
}

export const itemData: Record<ItemId, ItemDefinition> = {
  berries: { id: "berries", name: "Berries", maxStack: 99 },
  blueberry: { id: "blueberry", name: "Blueberry", maxStack: 99 },
  coal: { id: "coal", name: "Coal", maxStack: 99 },
  copper_ore: { id: "copper_ore", name: "Copper Ore", maxStack: 99 },
  fiber: { id: "fiber", name: "Fiber", maxStack: 99 },
  potato: { id: "potato", name: "Potato", maxStack: 99 },
  radish: { id: "radish", name: "Radish", maxStack: 99 },
  stone: { id: "stone", name: "Stone", maxStack: 99 },
  wood: { id: "wood", name: "Wood", maxStack: 99 },
};
