# Bright Farm Crops Design

**Date:** 2026-04-24
**Theme:** Bright cozy pixel farm

---

## Goal

Upgrade the farm from a single-crop prototype into a brighter, more expressive planting loop with light decision-making.

This round should make the farm feel more alive the moment the player loads in, and make crop choice matter without adding heavy menus or complex tools.

## Visual Direction

The target mood is `clear morning light`, `gentle greens`, and `warm wood`.

- Brighten the farm grass palette so the scene feels more open and less muddy
- Keep pixel readability, but shift crops and soil toward softer, sunnier colors
- Preserve the simple geometric style, but add a little more texture and charm
- Keep the HUD on the right so the farm remains the visual center

### Farm Scene Upgrades

- Use a lighter green checkerboard with softer contrast
- Keep the farm plots framed and readable
- Make wet soil clearer with a brighter cool overlay
- Add a few tiny flower clusters or decorative accents so the farm reads as a place, not only a test map

### Crop Identity

Each crop should be recognizable at a glance:

- `萝卜`: quick pink-white bloom, friendly starter crop
- `土豆`: broader leaves with warm earthy mature tones
- `蓝莓`: greener bush shape with cool blue fruit clusters

The player should be able to tell whether a crop is just planted, growing, or ready without reading text.

## Farming Depth

The game should move from “click to always plant radish” to “pick the crop that matches your plan.”

### Crop Roles

- `萝卜`: 2 days, cheap seeds, quick cash
- `土豆`: 3 days, better steady value
- `蓝莓`: 4 days, pricier seed, stronger payoff

### Seed Selection

- `1 / 2 / 3` switch the selected crop seed
- The selected crop persists in the HUD and should be used both for planting and village trading actions
- Planting a tilled plot consumes the currently selected seed only
- If the selected seed count is 0, the player gets a clear message instead of silently planting something else

## Village Flow

The village should become the place where the player prepares the next farm cycle.

- `B` buys one seed of the currently selected crop
- `S` sells one harvested crop of the currently selected crop
- Village instructions should list all three crop prices so the economy is legible

Recommended prices:

- `萝卜种子 3g`, `萝卜 5g`
- `土豆种子 5g`, `土豆 9g`
- `蓝莓种子 8g`, `蓝莓 14g`

## HUD Changes

Add a new farm log line:

- `当前种子：萝卜种子 x3`

This line should update when the player:

- switches crop selection
- buys seeds
- plants seeds
- loads a save

## Scope Guardrails

This round should not add:

- a full inventory window
- seasonal rules
- fertilizer
- crop death
- multi-harvest plants
- drag selection or batch planting

The goal is a cleaner, brighter, more strategic farm loop, not a full farming sim rewrite.
