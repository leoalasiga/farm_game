import { type ItemId } from "./items";

export const resourceNodeIds = ["tree", "bush", "stone", "copper_vein"] as const;

export type ResourceNodeId = (typeof resourceNodeIds)[number];

export interface ResourceNodeDefinition {
  color: number;
  dropItemId: ItemId;
  dropQuantity: number;
  id: ResourceNodeId;
  label: string;
  staminaCost: number;
}

export const resourceNodeData: Record<ResourceNodeId, ResourceNodeDefinition> = {
  bush: {
    color: 0xa94f7a,
    dropItemId: "berries",
    dropQuantity: 2,
    id: "bush",
    label: "Berry Bush",
    staminaCost: 4,
  },
  copper_vein: {
    color: 0xc77d42,
    dropItemId: "copper_ore",
    dropQuantity: 1,
    id: "copper_vein",
    label: "Copper Vein",
    staminaCost: 8,
  },
  stone: {
    color: 0x9ea3a8,
    dropItemId: "stone",
    dropQuantity: 2,
    id: "stone",
    label: "Stone",
    staminaCost: 6,
  },
  tree: {
    color: 0x2e6f40,
    dropItemId: "wood",
    dropQuantity: 2,
    id: "tree",
    label: "Tree",
    staminaCost: 5,
  },
};
