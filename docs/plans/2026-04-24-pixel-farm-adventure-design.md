# Pixel Farm Adventure Design

**Date:** 2026-04-24
**Platform:** Web
**Genre:** Pixel-art farming adventure
**Perspective:** Top-down 2D

---

## Vision

Build a small but complete pixel farming game for the browser. The farm is the player's safe base. The world outside the farm provides resources, risk, and progression. The core loop is:

1. Grow crops and manage the farm.
2. Explore nearby zones for wood, stone, ore, berries, and quest items.
3. Return home before night, sell goods, upgrade tools, and prepare for the next day.

The design goal is not to simulate every farming-life mechanic. The goal is to ship a polished first playable with a satisfying base-to-adventure loop.

## Pillars

- `Farm as base`: farming supports adventure instead of replacing it.
- `Small but complete`: every included system must connect to the main loop.
- `Readable progression`: money, tools, and map unlocks should always give the player a next goal.
- `Low friction`: controls and systems stay light enough for web play.

## Recommended Direction

Chosen direction: `Base farming + outdoor gathering adventure`.

Why this direction:

- It keeps the fantasy of building a home farm.
- It adds stronger momentum than pure farming.
- It is easier to scope for a first browser release than a combat-heavy dungeon crawler or open-world sim.

## Core Gameplay Loop

Each in-game day flows through these phases:

1. `Morning on the farm`
   - Check crops.
   - Till, plant, water, harvest.
   - Review inventory and choose a goal for the day.

2. `Daytime exploration`
   - Visit the forest for wood, berries, and early materials.
   - Visit the mine for stone, copper, and rarer drops after unlock.
   - Use light combat or resource-clearing actions while managing stamina.

3. `Evening return`
   - Go back to the farm.
   - Store materials, sell goods, buy seeds, and plan upgrades.

4. `Nightly reset`
   - End the day automatically.
   - Advance crop growth and restore stamina through sleep.

This loop creates a clear rhythm: farm to prepare, explore to progress, return to upgrade.

## MVP Scope

The first playable should include only these areas and systems.

### World Areas

- `Farm`
- `Village entrance`
- `Forest`
- `Mine`

### Farming Systems

- Tilling soil
- Planting seeds
- Watering crops
- Crop growth across days
- Harvesting

### Exploration Systems

- Resource gathering
- Light hazards or simple enemy pressure
- Zone unlocks through tasks and materials

### Economy and Progression

- Shop for buying seeds
- Selling crops and materials
- Tool upgrades
- Small inventory progression

### Guided Onboarding

- 2 to 3 starter quests
- NPCs that teach planting, selling, and unlocking exploration areas

## Explicit Non-Goals

These are intentionally out of scope for version one:

- Romance systems
- Large NPC schedules
- Deep combat build variety
- Procedural giant overworld
- Multiplayer
- Crafting trees with many stations
- Cloud save or account system

## Controls

Recommended web controls:

- `WASD`: move
- `E`: interact
- `Left click`: use current tool
- `1-4` or mouse wheel: switch tools
- `Tab` or `I`: open inventory

## Tools

Keep the initial tool set very small:

- `Hoe`: till soil
- `Watering can`: water crops
- `Axe`: chop wood and break light props
- `Pickaxe`: mine rocks and ore

This is enough to support both farming and exploration without bloating input complexity.

## Crops and Resources

### Starter Crops

- `Radish`: fast growth, early cash flow
- `Potato`: medium growth, stable return
- `Blueberry`: later unlock, better value

### Gathered Resources

- `Wood`
- `Stone`
- `Copper ore`
- `Coal`
- `Berries`
- `Fiber`
- `Rare crystal` for later progression hooks

Each resource should have a real purpose in the progression loop. No filler drops.

## Time and Stamina

The game should use a light pressure model.

- Movement does not cost stamina.
- Farming and gathering actions cost small amounts of stamina.
- Food or sleep restores stamina.
- Time advances automatically during the day.
- Night ends the day and returns the player home.

This gives the player planning tension without turning the game into a punishment simulator.

## Map and Unlock Structure

Recommended unlock flow:

1. Start with `Farm` and `Village entrance`.
2. Complete beginner quest chain to unlock `Forest`.
3. Deliver required materials to unlock `Mine`.

This keeps the world compact but still gives the player a sense of expansion.

## Progression Model

The first version should have three progression tracks:

- `Economy`: sell goods and buy better seeds
- `Tools`: upgrade efficiency with gathered materials
- `World access`: unlock better gathering zones and higher-value materials

These tracks reinforce each other:

- Crops provide money.
- Exploration provides upgrade materials.
- Upgrades improve farming and exploration speed.

## Technical Direction

Recommended stack:

- `TypeScript`
- `Vite`
- `Phaser 3`
- `Tiled` for tile maps
- `localStorage` for initial save data

### Why

- Phaser 3 is a strong fit for a 2D browser game.
- Vite keeps iteration fast.
- Tiled reduces map hardcoding.
- localStorage is enough for a first local prototype.

## Code Organization

Recommended structure:

- `src/scenes`
- `src/entities`
- `src/systems`
- `src/data`
- `src/assets`

This keeps game logic, data, scenes, and content separate before the project grows messy.

## Asset Direction

First version asset rules:

- Use one tile size, ideally `16x16`
- Use one character size, ideally `16x16` or `32x32`
- Keep animation set minimal: idle, walk, tool use, hurt
- Match UI style to the pixel-art world

Consistency matters more than art volume.

## Save Data

Version one save should store:

- Player position
- Day and time
- Inventory
- Farm plot state
- Crop growth state
- Quest progress
- Zone unlock state

## Delivery Strategy

Build by loop completion, not by content expansion.

### Milestone 1

Farm loop:

- Move on the farm
- Till
- Plant
- Water
- Grow crop across days
- Harvest
- Sell crop

### Milestone 2

Forest loop:

- Enter forest
- Gather wood and berries
- Return resources to farm economy

### Milestone 3

Mine and progression loop:

- Unlock mine
- Gather stone and copper
- Upgrade tools

### Milestone 4

Guidance and polish:

- Add starter quests
- Add onboarding NPC flow
- Improve clarity and feel

## First Week Goal

A successful first week should produce a playable browser prototype where the player can:

- Load into the farm
- Move around
- Till soil
- Plant one crop
- Water it
- Sleep to the next day
- Harvest the crop
- Sell it at the shop

That is the minimum complete proof that the project is real.
