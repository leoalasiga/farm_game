# Bright Farm Crops Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add bright cozy farm visuals, selectable seeds, and three meaningful crop loops without introducing heavy UI or complex tool systems.

**Architecture:** Keep the current Phaser scene structure and plain TypeScript data modules. Introduce one small farming selection module for the current crop, enrich crop/shop data so village and farm share the same choices, and wire the registry/save system so HUD, farm, and village all stay in sync.

**Tech Stack:** TypeScript, Phaser 3, Vitest, Vite

---

### Task 1: Add testable crop-selection rules

**Files:**
- Create: `src/systems/farming/seedSelection.ts`
- Create: `tests/systems/farming/seedSelection.test.ts`

**Step 1: Write the failing test**

- Verify the default selected crop is `radish`
- Verify selecting slot `2` changes the crop to `potato`
- Verify the selected crop maps to the expected seed item id

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/farming/seedSelection.test.ts`
Expected: FAIL because the selection module does not exist yet.

**Step 3: Write minimal implementation**

- Add a small state object for the currently selected crop
- Export helpers for slot-based selection and crop-to-seed mapping

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/farming/seedSelection.test.ts`
Expected: PASS.

### Task 2: Lock crop pricing and progression data

**Files:**
- Modify: `src/data/crops.ts`
- Modify: `src/data/shop.ts`
- Modify: `tests/systems/economy.test.ts`

**Step 1: Write the failing test**

- Assert sell prices for radish, potato, and blueberry
- Assert crop definitions expose the expected Chinese display names and seed ids

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/economy.test.ts`
Expected: FAIL because the data shape or prices do not match the new design.

**Step 3: Write minimal implementation**

- Add seed item ids and localized crop names to crop data
- Update shop pricing to the approved values

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/economy.test.ts`
Expected: PASS.

### Task 3: Wire seed selection into farm play

**Files:**
- Modify: `src/scenes/FarmScene.ts`
- Modify: `src/scenes/UIScene.ts`
- Modify: `src/ui/pixelHud.ts`
- Modify: `src/systems/save/save.ts`

**Step 1: Write the failing test**

- Add a test that selected crop state can be serialized and restored

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/systems/save.test.ts`
Expected: FAIL because selected crop state is not yet saved.

**Step 3: Write minimal implementation**

- Add `1 / 2 / 3` crop switching in the farm
- Plant with the selected seed only
- Update save/load and HUD registry strings for the selected seed line

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/systems/save.test.ts`
Expected: PASS.

### Task 4: Update village economy and bright farm visuals

**Files:**
- Modify: `src/scenes/VillageScene.ts`
- Modify: `src/scenes/FarmScene.ts`
- Modify: `src/systems/farming/pixelCrops.ts`
- Modify: `src/styles.css`

**Step 1: Use the shared crop selection in the village**

- `B` buys the selected crop seed
- `S` sells the selected harvested crop
- Rewrite village text so all three price points are visible

**Step 2: Brighten the farm presentation**

- Lighten grass and wet-soil tones
- Add light decorative accents
- Keep crop silhouettes distinct per species

**Step 3: Verify**

Run: `npm test -- tests/ui/pixelHud.test.ts tests/systems/farming/pixelCrops.test.ts tests/smoke/app.test.ts`
Expected: PASS.

### Task 5: Final verification

**Files:**
- No additional code changes required

**Step 1: Run targeted tests**

Run: `npm test -- tests/systems/farming/seedSelection.test.ts tests/systems/economy.test.ts tests/systems/save.test.ts tests/systems/farming/farmPlots.test.ts tests/ui/pixelHud.test.ts tests/systems/farming/pixelCrops.test.ts tests/smoke/app.test.ts`
Expected: PASS.

**Step 2: Run production build**

Run: `npm run build`
Expected: PASS with a generated `dist/` bundle.
