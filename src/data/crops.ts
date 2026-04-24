export const cropIds = ["radish", "potato", "blueberry"] as const;

export type CropId = (typeof cropIds)[number];

export interface CropDefinition {
  daysToGrow: number;
  id: CropId;
  name: string;
}

export const cropData: Record<CropId, CropDefinition> = {
  blueberry: {
    daysToGrow: 4,
    id: "blueberry",
    name: "Blueberry",
  },
  potato: {
    daysToGrow: 3,
    id: "potato",
    name: "Potato",
  },
  radish: {
    daysToGrow: 2,
    id: "radish",
    name: "Radish",
  },
};
