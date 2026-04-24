# Pixel Farm UI Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the unreadable farm HUD by moving text into pixel-style panels and replace flat crop color blocks with small pixel-art crop visuals.

**Architecture:** Keep gameplay logic unchanged. Add small, testable UI/render-spec helpers for panel sizing, wrapped copy, and crop pixel definitions, then consume those helpers from `UIScene` and `FarmScene`.

**Tech Stack:** TypeScript, Phaser 3, Vitest, Vite

---

### Task 1: Lock the layout and crop render rules with tests

**Files:**
- Create: `src/ui/pixelHud.ts`
- Create: `src/systems/farming/pixelCrops.ts`
- Create: `tests/ui/pixelHud.test.ts`
- Create: `tests/systems/farming/pixelCrops.test.ts`

**Step 1: Write the failing tests**

- Assert the HUD exposes separate `status` and `controls` panel bounds that fit inside the `960x540` canvas.
- Assert wrapped text config uses constrained widths for long strings.
- Assert farm crop specs return visible pixel clusters for `growing` and `ready` radish states.

**Step 2: Run tests to verify they fail**

Run: `npm test -- tests/ui/pixelHud.test.ts tests/systems/farming/pixelCrops.test.ts`
Expected: FAIL because the helper modules do not exist yet.

**Step 3: Write minimal implementation**

- Export panel metadata and text style helpers from `src/ui/pixelHud.ts`
- Export crop pixel specs and soil colors from `src/systems/farming/pixelCrops.ts`

**Step 4: Run tests to verify they pass**

Run: `npm test -- tests/ui/pixelHud.test.ts tests/systems/farming/pixelCrops.test.ts`
Expected: PASS.

### Task 2: Apply the pixel HUD layout

**Files:**
- Modify: `src/scenes/UIScene.ts`
- Modify: `src/styles.css`
- Test: `tests/ui/pixelHud.test.ts`

**Step 1: Wire the helper into the scene**

- Draw framed background cards for `status` and `controls`
- Use smaller wrapped text for inventory, quest, and save status
- Add a compact controls panel instead of scene-local text overlays

**Step 2: Verify in tests/build**

Run: `npm test -- tests/ui/pixelHud.test.ts`
Expected: PASS.

### Task 3: Replace flat crop blocks with pixel-art crops

**Files:**
- Modify: `src/scenes/FarmScene.ts`
- Modify: `src/data/crops.ts`
- Test: `tests/systems/farming/pixelCrops.test.ts`

**Step 1: Wire pixel crop specs into farm plot rendering**

- Replace single-color plot state rendering with layered soil, moisture, and crop pixels
- Remove farm-scene instructional text that duplicates the HUD
- Keep village sign and plot border visuals aligned with the pixel palette

**Step 2: Verify**

Run: `npm test -- tests/systems/farming/pixelCrops.test.ts`
Expected: PASS.

### Task 4: Final verification

**Files:**
- No additional code changes required

**Step 1: Run targeted tests**

Run: `npm test -- tests/ui/pixelHud.test.ts tests/systems/farming/pixelCrops.test.ts tests/smoke/app.test.ts`
Expected: PASS.

**Step 2: Run production build**

Run: `npm run build`
Expected: PASS with a generated `dist/` bundle.
