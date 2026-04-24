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
    text: "在农场收获你的第一批作物",
  },
  {
    id: "meet_shopkeeper",
    text: "去村里见一见店主",
  },
  {
    id: "sell_first_crop",
    text: "在村里卖出第一根萝卜",
  },
];
