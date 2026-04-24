export interface WorldTransition {
  id: string;
  spawn: {
    x: number;
    y: number;
  };
  targetScene: "FarmScene" | "VillageScene";
  targetTransitionId: string;
}

const transitions: Record<string, WorldTransition> = {
  farm_gate: {
    id: "farm_gate",
    spawn: {
      x: 140,
      y: 300,
    },
    targetScene: "VillageScene",
    targetTransitionId: "village_gate",
  },
  village_gate: {
    id: "village_gate",
    spawn: {
      x: 240,
      y: 320,
    },
    targetScene: "FarmScene",
    targetTransitionId: "farm_gate",
  },
};

export function getTransition(id: keyof typeof transitions | string): WorldTransition {
  const transition = transitions[id];
  if (!transition) {
    throw new Error(`Unknown transition: ${id}`);
  }

  return transition;
}
