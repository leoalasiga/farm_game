# Pixel Farm Adventure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a browser-based pixel farming adventure prototype where the player can farm on a home map, progress time across days, sell crops, and unlock the first exploration zones.

**Architecture:** Start from a Vite + TypeScript + Phaser 3 project. Keep game data in plain TypeScript configuration files, use Phaser scenes for maps and UI, and isolate gameplay rules into small systems for inventory, farming, time, stamina, quests, and saves. Build the farm gameplay loop first, then layer in the village, forest, mine, and onboarding quests.

**Tech Stack:** TypeScript, Vite, Phaser 3, Tiled JSON maps, Vitest, localStorage

---

### Task 1: Scaffold the web game project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/game/config.ts`
- Create: `src/scenes/BootScene.ts`
- Create: `src/scenes/FarmScene.ts`
- Create: `src/scenes/UIScene.ts`
- Create: `src/styles.css`
- Create: `tests/smoke/app.test.ts`

**Step 1: Write the failing test**

Create `tests/smoke/app.test.ts` with a smoke assertion that imports the game config and checks width, height, and scene registration inputs.

```ts
import { describe, expect, it } from "vitest";
import { gameConfig } from "../../src/game/config";

describe("gameConfig", () => {
  it("defines the base game canvas", () => {
    expect(gameConfig.width).toBeGreaterThan(0);
    expect(gameConfig.height).toBeGreaterThan(0);
    expect(gameConfig.scene.length).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/smoke/app.test.ts`
Expected: FAIL because the project files do not exist yet.

**Step 3: Write minimal implementation**

- Add Vite and Phaser dependencies.
- Add Vitest test setup.
- Implement `src/game/config.ts` exporting a Phaser config object with `BootScene`, `FarmScene`, and `UIScene`.
- Implement `src/main.ts` to create the Phaser game.
- Add placeholder scenes that load and start without assets.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/smoke/app.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts index.html src tests
git commit -m "feat: scaffold phaser farming game"
```

### Task 2: Add the player entity and farm map movement

**Files:**
- Create: `src/entities/Player.ts`
- Create: `src/maps/farm.json`
- Modify: `src/scenes/FarmScene.ts`
- Modify: `src/game/config.ts`
- Test: `tests/entities/player.test.ts`

**Step 1: Write the failing test**

Create `tests/entities/player.test.ts` with a test for player spawn defaults and movement speed.

```ts
import { describe, expect, it } from "vitest";
import { createPlayerModel } from "../../src/entities/Player";

describe("createPlayerModel", () => {
  it("starts with a valid position and speed", () => {
    const player = createPlayerModel({ x: 32, y: 32 });
    expect(player.x).toBe(32);
    expect(player.y).toBe(32);
    expect(player.speed).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/entities/player.test.ts`
Expected: FAIL because `createPlayerModel` does not exist.

**Step 3: Write minimal implementation**

- Add a plain player model factory in `src/entities/Player.ts`.
- In `FarmScene`, render a placeholder player sprite or rectangle.
- Add keyboard input and camera follow.
- Load a small placeholder map area with collision bounds.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/entities/player.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/entities/Player.ts src/scenes/FarmScene.ts src/maps/farm.json tests/entities/player.test.ts
git commit -m "feat: add player movement on farm map"
```

### Task 3: Build the inventory model

**Files:**
- Create: `src/systems/inventory/inventory.ts`
- Create: `src/data/items.ts`
- Test: `tests/systems/inventory.test.ts`

**Step 1: Write the failing test**

Write tests for adding items, stacking counts, and rejecting overflow.

```ts
import { describe, expect, it } from "vitest";
import { createInventory, addItem } from "../../src/systems/inventory/inventory";

describe("inventory", () => {
  it("stacks identical items", () => {
    const inventory = createInventory(8);
    addItem(inventory, "radish", 1);
    addItem(inventory, "radish", 2);
    expect(inventory.slots[0]?.count).toBe(3);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/inventory.test.ts`
Expected: FAIL because the inventory system does not exist.

**Step 3: Write minimal implementation**

- Define item ids in `src/data/items.ts`.
- Implement inventory creation, item stacking, capacity checks, and remove item helpers.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/inventory.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/data/items.ts src/systems/inventory/inventory.ts tests/systems/inventory.test.ts
git commit -m "feat: add inventory system"
```

### Task 4: Build the time and stamina systems

**Files:**
- Create: `src/systems/time/time.ts`
- Create: `src/systems/stamina/stamina.ts`
- Modify: `src/scenes/UIScene.ts`
- Test: `tests/systems/time.test.ts`
- Test: `tests/systems/stamina.test.ts`

**Step 1: Write the failing test**

Add tests for advancing the day clock, ending the day at night, and spending/restoring stamina.

```ts
import { describe, expect, it } from "vitest";
import { createClock, advanceClock } from "../../src/systems/time/time";

describe("clock", () => {
  it("advances time until day end", () => {
    const clock = createClock();
    advanceClock(clock, clock.dayLengthMinutes);
    expect(clock.isNight).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/time.test.ts tests/systems/stamina.test.ts`
Expected: FAIL because the modules do not exist.

**Step 3: Write minimal implementation**

- Implement a plain clock model with day progression.
- Implement a stamina model with spend and restore helpers.
- Display both values in `UIScene`.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/time.test.ts tests/systems/stamina.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/systems/time/time.ts src/systems/stamina/stamina.ts src/scenes/UIScene.ts tests/systems
git commit -m "feat: add day clock and stamina systems"
```

### Task 5: Implement farm plots and crop growth

**Files:**
- Create: `src/data/crops.ts`
- Create: `src/systems/farming/farmPlots.ts`
- Modify: `src/scenes/FarmScene.ts`
- Modify: `src/systems/time/time.ts`
- Test: `tests/systems/farming/farmPlots.test.ts`

**Step 1: Write the failing test**

Test tilling, planting, watering, and advancing growth to harvest state.

```ts
import { describe, expect, it } from "vitest";
import {
  createFarmPlots,
  tillPlot,
  plantCrop,
  waterPlot,
  advanceFarmDay,
} from "../../src/systems/farming/farmPlots";

describe("farm plots", () => {
  it("grows a watered crop across days", () => {
    const farm = createFarmPlots(1, 1);
    tillPlot(farm, 0, 0);
    plantCrop(farm, 0, 0, "radish");
    waterPlot(farm, 0, 0);
    advanceFarmDay(farm);
    advanceFarmDay(farm);
    expect(farm.plots[0].stage).toBe("ready");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/farming/farmPlots.test.ts`
Expected: FAIL because the farming module does not exist.

**Step 3: Write minimal implementation**

- Define starter crop data.
- Implement farm plot state transitions.
- Connect the farm scene so the player can till and water a visible grid.
- Advance crop growth when the day changes.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/farming/farmPlots.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/data/crops.ts src/systems/farming/farmPlots.ts src/scenes/FarmScene.ts tests/systems/farming/farmPlots.test.ts
git commit -m "feat: add farm plots and crop growth"
```

### Task 6: Harvest crops and connect them to inventory

**Files:**
- Modify: `src/systems/farming/farmPlots.ts`
- Modify: `src/systems/inventory/inventory.ts`
- Modify: `src/scenes/FarmScene.ts`
- Test: `tests/systems/farming/harvest.test.ts`

**Step 1: Write the failing test**

Test that a ready crop harvest adds produce to inventory and clears the plot.

```ts
import { describe, expect, it } from "vitest";
import { createInventory } from "../../src/systems/inventory/inventory";
import {
  createFarmPlots,
  forceReadyCrop,
  harvestPlot,
} from "../../src/systems/farming/farmPlots";

describe("harvestPlot", () => {
  it("moves produce into the inventory", () => {
    const inventory = createInventory(8);
    const farm = createFarmPlots(1, 1);
    forceReadyCrop(farm, 0, 0, "radish");
    const result = harvestPlot(farm, inventory, 0, 0);
    expect(result.ok).toBe(true);
    expect(inventory.slots[0]?.itemId).toBe("radish");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/farming/harvest.test.ts`
Expected: FAIL because harvest integration does not exist.

**Step 3: Write minimal implementation**

- Add harvest helpers that consume a ready crop.
- Deposit produce into inventory.
- Update the farm scene to allow harvesting with the active tool or interact action.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/farming/harvest.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/systems/farming/farmPlots.ts src/systems/inventory/inventory.ts src/scenes/FarmScene.ts tests/systems/farming/harvest.test.ts
git commit -m "feat: connect crop harvest to inventory"
```

### Task 7: Add the village shop and selling flow

**Files:**
- Create: `src/scenes/VillageScene.ts`
- Create: `src/systems/economy/economy.ts`
- Create: `src/data/shop.ts`
- Modify: `src/game/config.ts`
- Modify: `src/scenes/UIScene.ts`
- Test: `tests/systems/economy.test.ts`

**Step 1: Write the failing test**

Test buying seeds, selling harvested crops, and updating player money.

```ts
import { describe, expect, it } from "vitest";
import { createWallet, sellItem } from "../../src/systems/economy/economy";

describe("economy", () => {
  it("adds money when a crop is sold", () => {
    const wallet = createWallet();
    sellItem(wallet, "radish", 2);
    expect(wallet.gold).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/economy.test.ts`
Expected: FAIL because the economy system does not exist.

**Step 3: Write minimal implementation**

- Implement wallet and price lookup helpers.
- Add shop inventory data for seeds.
- Create a simple village scene with one vendor interaction.
- Show current money in the UI.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/economy.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/scenes/VillageScene.ts src/systems/economy/economy.ts src/data/shop.ts src/game/config.ts tests/systems/economy.test.ts
git commit -m "feat: add village shop economy loop"
```

### Task 8: Add scene transitions between farm and village

**Files:**
- Modify: `src/scenes/FarmScene.ts`
- Modify: `src/scenes/VillageScene.ts`
- Create: `src/systems/world/transitions.ts`
- Test: `tests/systems/world/transitions.test.ts`

**Step 1: Write the failing test**

Write tests for transition metadata and spawn targets.

```ts
import { describe, expect, it } from "vitest";
import { getTransition } from "../../src/systems/world/transitions";

describe("world transitions", () => {
  it("returns the farm-to-village transition target", () => {
    const transition = getTransition("farm_gate");
    expect(transition.targetScene).toBe("VillageScene");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/world/transitions.test.ts`
Expected: FAIL because the transition registry does not exist.

**Step 3: Write minimal implementation**

- Define named transition points.
- Add farm and village exit zones.
- Spawn the player at the correct entrance after scene change.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/world/transitions.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/scenes/FarmScene.ts src/scenes/VillageScene.ts src/systems/world/transitions.ts tests/systems/world/transitions.test.ts
git commit -m "feat: add farm and village transitions"
```

### Task 9: Add the save system

**Files:**
- Create: `src/systems/save/save.ts`
- Modify: `src/scenes/FarmScene.ts`
- Modify: `src/scenes/VillageScene.ts`
- Modify: `src/scenes/UIScene.ts`
- Test: `tests/systems/save.test.ts`

**Step 1: Write the failing test**

Test save serialization and restore for day, inventory, wallet, and farm state.

```ts
import { describe, expect, it } from "vitest";
import { serializeSave, deserializeSave } from "../../src/systems/save/save";

describe("save system", () => {
  it("round-trips the game state", () => {
    const source = {
      day: 2,
      gold: 10,
      inventory: [{ itemId: "radish", count: 3 }],
    };
    const encoded = serializeSave(source);
    const restored = deserializeSave(encoded);
    expect(restored.day).toBe(2);
    expect(restored.inventory[0].count).toBe(3);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/save.test.ts`
Expected: FAIL because the save system does not exist.

**Step 3: Write minimal implementation**

- Implement JSON save helpers on top of localStorage.
- Save on sleep and on explicit interaction.
- Restore the player into the farm with the last known core state.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/save.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/systems/save/save.ts src/scenes/FarmScene.ts src/scenes/VillageScene.ts src/scenes/UIScene.ts tests/systems/save.test.ts
git commit -m "feat: add local save system"
```

### Task 10: Add the forest gathering loop

**Files:**
- Create: `src/scenes/ForestScene.ts`
- Create: `src/data/resources.ts`
- Create: `src/systems/gathering/gathering.ts`
- Modify: `src/game/config.ts`
- Modify: `src/systems/stamina/stamina.ts`
- Test: `tests/systems/gathering.test.ts`

**Step 1: Write the failing test**

Test that gathering consumes stamina and returns expected resources.

```ts
import { describe, expect, it } from "vitest";
import { gatherNode } from "../../src/systems/gathering/gathering";

describe("gatherNode", () => {
  it("returns a wood drop from a tree node", () => {
    const result = gatherNode("tree");
    expect(result.drops[0].itemId).toBe("wood");
    expect(result.staminaCost).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/gathering.test.ts`
Expected: FAIL because gathering does not exist.

**Step 3: Write minimal implementation**

- Define resource node and drop table data.
- Implement a simple gather action that spends stamina.
- Create a forest scene with gatherable tree, bush, and stone nodes.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/gathering.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/scenes/ForestScene.ts src/data/resources.ts src/systems/gathering/gathering.ts src/game/config.ts tests/systems/gathering.test.ts
git commit -m "feat: add forest gathering loop"
```

### Task 11: Unlock the forest through starter quests

**Files:**
- Create: `src/data/quests.ts`
- Create: `src/systems/quests/quests.ts`
- Modify: `src/scenes/VillageScene.ts`
- Modify: `src/scenes/UIScene.ts`
- Test: `tests/systems/quests.test.ts`

**Step 1: Write the failing test**

Test that completing onboarding goals unlocks the forest.

```ts
import { describe, expect, it } from "vitest";
import { createQuestState, completeObjective } from "../../src/systems/quests/quests";

describe("starter quests", () => {
  it("unlocks the forest after the required objective chain", () => {
    const state = createQuestState();
    completeObjective(state, "harvest_first_crop");
    completeObjective(state, "sell_first_crop");
    completeObjective(state, "meet_shopkeeper");
    expect(state.unlockedZones).toContain("forest");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/quests.test.ts`
Expected: FAIL because the quest system does not exist.

**Step 3: Write minimal implementation**

- Define a short onboarding quest chain.
- Track completed objectives.
- Gate the forest entrance until quest completion.
- Show current objective text in the UI.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/quests.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/data/quests.ts src/systems/quests/quests.ts src/scenes/VillageScene.ts src/scenes/UIScene.ts tests/systems/quests.test.ts
git commit -m "feat: add onboarding quest flow"
```

### Task 12: Add the mine, ore gathering, and tool upgrades

**Files:**
- Create: `src/scenes/MineScene.ts`
- Create: `src/systems/upgrades/upgrades.ts`
- Modify: `src/data/resources.ts`
- Modify: `src/data/shop.ts`
- Modify: `src/game/config.ts`
- Test: `tests/systems/upgrades.test.ts`

**Step 1: Write the failing test**

Test that submitting upgrade materials improves tool efficiency values.

```ts
import { describe, expect, it } from "vitest";
import { createToolState, upgradeTool } from "../../src/systems/upgrades/upgrades";

describe("upgradeTool", () => {
  it("improves the axe level after paying costs", () => {
    const tools = createToolState();
    upgradeTool(tools, "axe", { wood: 10, copper_ore: 5 });
    expect(tools.axe.level).toBe(2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/upgrades.test.ts`
Expected: FAIL because the upgrade system does not exist.

**Step 3: Write minimal implementation**

- Add mine scene with stone and copper nodes.
- Implement basic tool upgrade rules and costs.
- Unlock the mine after turning in the required forest resources.
- Apply upgrade effects to gather speed or stamina cost.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/upgrades.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/scenes/MineScene.ts src/systems/upgrades/upgrades.ts src/data/resources.ts src/data/shop.ts src/game/config.ts tests/systems/upgrades.test.ts
git commit -m "feat: add mine progression and tool upgrades"
```

### Task 13: Polish the first playable and verify the main loop

**Files:**
- Modify: `src/scenes/*.ts`
- Modify: `src/systems/**/*.ts`
- Modify: `src/data/**/*.ts`
- Create: `docs/testing/manual-smoke-checklist.md`

**Step 1: Write the failing test**

Write down the manual checks that the build must satisfy before calling the prototype playable.

```md
- Start a new game
- Plant and water one radish
- Sleep to the next day
- Harvest and sell the crop
- Unlock the forest
- Gather wood and berries
- Unlock the mine
- Upgrade one tool
```

**Step 2: Run test to verify it fails**

Run: `npm run dev`
Expected: At least one checklist item fails before polish work is complete.

**Step 3: Write minimal implementation**

- Improve UI text clarity.
- Fix scene spawn rough edges.
- Tune stamina costs and crop timing.
- Add simple placeholder audio or feedback flashes if time allows.

**Step 4: Run test to verify it passes**

Run: `npm run dev`
Expected: All checklist items can be completed in one session.

**Step 5: Commit**

```bash
git add src docs/testing/manual-smoke-checklist.md
git commit -m "feat: polish first playable farming adventure prototype"
```

## Notes for Execution

- Keep art placeholders simple until the full loop works.
- Favor plain data objects and pure helper functions for testable game rules.
- Avoid adding systems outside the approved design doc.
- Prefer one short commit per task.
- If this repository is still not initialized with Git, run `git init` before the first commit command or skip commit steps until version control is enabled.
