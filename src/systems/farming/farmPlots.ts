import { cropData, type CropId } from "../../data/crops";
import { addItem, type InventoryResult, type InventoryState } from "../inventory/inventory";

export type FarmPlotStage = "empty" | "tilled" | "growing" | "ready";

export interface FarmPlot {
  cropId: CropId | null;
  growthDays: number;
  stage: FarmPlotStage;
  watered: boolean;
  x: number;
  y: number;
}

export interface FarmPlotsState {
  height: number;
  plots: FarmPlot[];
  width: number;
}

export function createFarmPlots(width: number, height: number): FarmPlotsState {
  const plots: FarmPlot[] = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      plots.push({
        cropId: null,
        growthDays: 0,
        stage: "empty",
        watered: false,
        x,
        y,
      });
    }
  }

  return { height, plots, width };
}

export function getPlot(state: FarmPlotsState, x: number, y: number): FarmPlot | undefined {
  if (x < 0 || y < 0 || x >= state.width || y >= state.height) {
    return undefined;
  }

  return state.plots[y * state.width + x];
}

export function tillPlot(state: FarmPlotsState, x: number, y: number): boolean {
  const plot = getPlot(state, x, y);
  if (!plot || plot.stage !== "empty") {
    return false;
  }

  plot.stage = "tilled";
  return true;
}

export function plantCrop(
  state: FarmPlotsState,
  x: number,
  y: number,
  cropId: CropId,
): boolean {
  const plot = getPlot(state, x, y);
  if (!plot || plot.stage !== "tilled") {
    return false;
  }

  plot.cropId = cropId;
  plot.growthDays = 0;
  plot.stage = "growing";
  plot.watered = false;
  return true;
}

export function waterPlot(state: FarmPlotsState, x: number, y: number): boolean {
  const plot = getPlot(state, x, y);
  if (!plot || plot.stage !== "growing" || plot.watered) {
    return false;
  }

  plot.watered = true;
  return true;
}

export function advanceFarmDay(state: FarmPlotsState): FarmPlotsState {
  for (const plot of state.plots) {
    if (plot.stage === "growing" && plot.cropId && plot.watered) {
      plot.growthDays += 1;
      if (plot.growthDays >= cropData[plot.cropId].daysToGrow) {
        plot.stage = "ready";
      }
    }

    plot.watered = false;
  }

  return state;
}

export function forceReadyCrop(
  state: FarmPlotsState,
  x: number,
  y: number,
  cropId: CropId,
): FarmPlot | undefined {
  const plot = getPlot(state, x, y);
  if (!plot) {
    return undefined;
  }

  plot.cropId = cropId;
  plot.growthDays = cropData[cropId].daysToGrow;
  plot.stage = "ready";
  plot.watered = false;
  return plot;
}

export function harvestPlot(
  state: FarmPlotsState,
  inventory: InventoryState,
  x: number,
  y: number,
): InventoryResult {
  const plot = getPlot(state, x, y);
  if (!plot || plot.stage !== "ready" || !plot.cropId) {
    return {
      ok: false,
      remainder: 1,
    };
  }

  const result = addItem(inventory, plot.cropId, 1);
  if (!result.ok) {
    return result;
  }

  plot.cropId = null;
  plot.growthDays = 0;
  plot.stage = "tilled";
  plot.watered = false;

  return result;
}
