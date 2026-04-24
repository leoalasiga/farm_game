import { type ItemId } from "../../data/items";

export type ToolId = "axe" | "pickaxe";

export interface ToolLevelState {
  efficiency: number;
  level: number;
}

export interface ToolState {
  axe: ToolLevelState;
  pickaxe: ToolLevelState;
}

export type MaterialCost = Partial<Record<ItemId, number>>;

export const toolUpgradeCosts: Record<ToolId, MaterialCost> = {
  axe: {
    copper_ore: 5,
    wood: 10,
  },
  pickaxe: {
    copper_ore: 4,
    stone: 10,
  },
};

export function createToolState(): ToolState {
  return {
    axe: { efficiency: 1, level: 1 },
    pickaxe: { efficiency: 1, level: 1 },
  };
}

export function canAffordMaterialCost(
  payment: MaterialCost,
  requiredCost: MaterialCost,
): boolean {
  return Object.entries(requiredCost).every(([itemId, requiredAmount]) => {
    const availableAmount = payment[itemId as ItemId] ?? 0;
    return availableAmount >= (requiredAmount ?? 0);
  });
}

export function getToolEfficiency(toolState: ToolState, toolId: ToolId): number {
  return toolState[toolId].efficiency;
}

export function upgradeTool(
  toolState: ToolState,
  toolId: ToolId,
  payment: MaterialCost,
): boolean {
  const requiredCost = toolUpgradeCosts[toolId];
  if (!canAffordMaterialCost(payment, requiredCost)) {
    return false;
  }

  toolState[toolId].level += 1;
  toolState[toolId].efficiency += 1;
  return true;
}
