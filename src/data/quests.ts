export const starterObjectiveIds = [
  "harvest_first_crop",
  "meet_shopkeeper",
  "sell_first_crop",
] as const;

export type StarterObjectiveId = (typeof starterObjectiveIds)[number];

export interface StarterObjectiveDefinition {
  id: StarterObjectiveId;
  text: string;
}

export const starterObjectives: StarterObjectiveDefinition[] = [
  {
    id: "harvest_first_crop",
    text: "Harvest your first crop on the farm",
  },
  {
    id: "meet_shopkeeper",
    text: "Visit the village shopkeeper",
  },
  {
    id: "sell_first_crop",
    text: "Sell your first radish in the village",
  },
];
