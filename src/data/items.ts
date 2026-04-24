export const itemIds = [
  "radish",
  "radish_seed",
  "potato",
  "potato_seed",
  "blueberry",
  "blueberry_seed",
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
  berries: { id: "berries", name: "浆果", maxStack: 99 },
  blueberry: { id: "blueberry", name: "蓝莓", maxStack: 99 },
  blueberry_seed: { id: "blueberry_seed", name: "蓝莓种子", maxStack: 99 },
  coal: { id: "coal", name: "煤块", maxStack: 99 },
  copper_ore: { id: "copper_ore", name: "铜矿石", maxStack: 99 },
  fiber: { id: "fiber", name: "纤维", maxStack: 99 },
  potato: { id: "potato", name: "土豆", maxStack: 99 },
  potato_seed: { id: "potato_seed", name: "土豆种子", maxStack: 99 },
  radish: { id: "radish", name: "萝卜", maxStack: 99 },
  radish_seed: { id: "radish_seed", name: "萝卜种子", maxStack: 99 },
  stone: { id: "stone", name: "石头", maxStack: 99 },
  wood: { id: "wood", name: "木头", maxStack: 99 },
};
