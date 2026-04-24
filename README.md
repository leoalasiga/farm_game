# Pixel Farm Adventure

A browser-based pixel farming adventure prototype built with `Phaser 3`, `TypeScript`, and `Vite`.

The farm is your home base. You plant crops, sleep to grow them, sell produce in the village, unlock the forest and mine, then use gathered materials to upgrade tools.

## Current Prototype Loop

- Farm: till soil, plant radish seeds, water crops, sleep to advance the day, harvest
- Village: buy seeds, sell crops, unlock the forest, unlock the mine, upgrade the axe
- Forest: gather wood, berries, and stone
- Mine: gather stone and copper ore
- Save: store progress locally with `K`

## Controls

- `WASD` or arrow keys: move
- Mouse click on farm plots: till, plant, water, harvest
- `E`: interact with gates and gather nodes in forest/mine
- `N`: sleep on the farm and advance to the next day
- `B`: buy one radish seed in the village shop
- `S`: sell one radish in the village shop
- `U`: use the village forge to unlock the mine or upgrade the axe
- `K`: save the game

## Getting Started

### Requirements

- Node.js 20+ recommended
- npm 11+ recommended

### Install

```bash
npm install
```

### Run the game

```bash
npm run dev
```

Then open the local Vite URL in your browser.

### Run tests

```bash
npm test
```

### Type check

```bash
node ./node_modules/typescript/bin/tsc --noEmit
```

### Production build

```bash
npm run build
```

## Manual Smoke Test

Use [manual-smoke-checklist.md](/home/leoal/project/games/docs/testing/manual-smoke-checklist.md) to verify the full playable loop.

High-level path:

1. Harvest your first crop on the farm.
2. Sell it in the village.
3. Unlock the forest and gather wood and stone.
4. Unlock the mine at the forge.
5. Gather copper ore and upgrade the axe.
6. Save progress.

## Project Structure

```text
src/
  data/        Static crop, item, quest, resource, and shop definitions
  entities/    Player model
  game/        Phaser game config
  maps/        Basic farm map sizing data
  scenes/      Farm, village, forest, mine, boot, and UI scenes
  systems/     Farming, economy, gathering, inventory, quests, save, stamina, time, upgrades, world transitions
  styles.css   App shell styling
```

## What Is Implemented

- Farm crop state machine with day-based growth
- Shared inventory, gold, stamina, quest, and tool state across scenes
- Local save/load through `localStorage`
- Guided onboarding that unlocks the forest
- Forest and mine gathering loops
- Basic forge progression for mine unlock and axe upgrade

## Known Limits

- Prototype visuals use placeholder rectangles and text, not final pixel art assets
- Economy and crop variety are intentionally small
- Save data is local-only
- Current production bundle is large because Phaser is shipped in one main chunk

## Tech Stack

- `Phaser 3`
- `TypeScript`
- `Vite`
- `Vitest`

## Planning Docs

- [2026-04-24-pixel-farm-adventure-design.md](/home/leoal/project/games/docs/plans/2026-04-24-pixel-farm-adventure-design.md)
- [2026-04-24-pixel-farm-adventure.md](/home/leoal/project/games/docs/plans/2026-04-24-pixel-farm-adventure.md)
