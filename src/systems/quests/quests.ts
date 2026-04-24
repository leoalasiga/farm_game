import { starterObjectives, type StarterObjectiveId } from "../../data/quests";

export interface QuestState {
  completedObjectives: StarterObjectiveId[];
  currentObjectiveText: string;
  unlockedZones: string[];
}

const FOREST_UNLOCK_OBJECTIVES: StarterObjectiveId[] = [
  "harvest_first_crop",
  "meet_shopkeeper",
  "sell_first_crop",
];

export function createQuestState(): QuestState {
  return {
    completedObjectives: [],
    currentObjectiveText: starterObjectives[0].text,
    unlockedZones: ["farm", "village"],
  };
}

export function completeObjective(
  state: QuestState,
  objectiveId: StarterObjectiveId,
): QuestState {
  if (!state.completedObjectives.includes(objectiveId)) {
    state.completedObjectives.push(objectiveId);
  }

  const nextObjective = starterObjectives.find(
    (objective) => !state.completedObjectives.includes(objective.id),
  );
  state.currentObjectiveText = nextObjective?.text ?? "森林已经开放，去村外探索吧。";

  const hasForestUnlock = FOREST_UNLOCK_OBJECTIVES.every((requiredObjective) =>
    state.completedObjectives.includes(requiredObjective),
  );

  if (hasForestUnlock && !state.unlockedZones.includes("forest")) {
    state.unlockedZones.push("forest");
  }

  return state;
}
