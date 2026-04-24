import { resourceNodeData, type ResourceNodeId } from "../../data/resources";

export interface GatherDrop {
  count: number;
  itemId: (typeof resourceNodeData)[ResourceNodeId]["dropItemId"];
}

export interface GatherResult {
  drops: GatherDrop[];
  staminaCost: number;
}

export function gatherNode(nodeId: ResourceNodeId, toolEfficiency = 1): GatherResult {
  const definition = resourceNodeData[nodeId];
  const staminaReduction = Math.max(0, toolEfficiency - 1);

  return {
    drops: [
      {
        count: definition.dropQuantity,
        itemId: definition.dropItemId,
      },
    ],
    staminaCost: Math.max(1, definition.staminaCost - staminaReduction),
  };
}
