import { type ItemId } from "./items";

export const cropIds = ["radish", "potato", "blueberry"] as const;

export type CropId = (typeof cropIds)[number];

export interface CropDefinition {
  daysToGrow: number;
  id: CropId;
  name: string;
  seedItemId: ItemId;
}

export const cropData: Record<CropId, CropDefinition> = {
  blueberry: {
    daysToGrow: 4,
    id: "blueberry",
    name: "蓝莓",
    seedItemId: "blueberry_seed",
  },
  potato: {
    daysToGrow: 3,
    id: "potato",
    name: "土豆",
    seedItemId: "potato_seed",
  },
  radish: {
    daysToGrow: 2,
    id: "radish",
    name: "萝卜",
    seedItemId: "radish_seed",
  },
};
