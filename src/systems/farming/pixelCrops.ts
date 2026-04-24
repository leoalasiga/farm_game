import { type CropId } from "../../data/crops";
import { type FarmPlotStage } from "./farmPlots";

export interface CropPixel {
  color: string;
  x: number;
  y: number;
}

export interface PlotPalette {
  border: string;
  moisture: string;
  soil: string;
}

type CropDisplayStage = Extract<FarmPlotStage, "growing" | "ready">;

const cropPixelsByStage: Record<CropId, Record<CropDisplayStage, CropPixel[]>> = {
  blueberry: {
    growing: [
      { color: "#5aa05a", x: 2, y: 4 },
      { color: "#7ccc66", x: 3, y: 3 },
      { color: "#5aa05a", x: 3, y: 4 },
      { color: "#7ccc66", x: 4, y: 3 },
      { color: "#5aa05a", x: 4, y: 4 },
    ],
    ready: [
      { color: "#6dc067", x: 2, y: 4 },
      { color: "#6dc067", x: 3, y: 3 },
      { color: "#6dc067", x: 4, y: 3 },
      { color: "#87d06f", x: 2, y: 2 },
      { color: "#87d06f", x: 4, y: 2 },
      { color: "#5f7dff", x: 2, y: 1 },
      { color: "#4f65da", x: 3, y: 1 },
      { color: "#5f7dff", x: 4, y: 1 },
    ],
  },
  potato: {
    growing: [
      { color: "#6dc067", x: 2, y: 4 },
      { color: "#8ed673", x: 3, y: 3 },
      { color: "#6dc067", x: 3, y: 4 },
      { color: "#8ed673", x: 4, y: 3 },
      { color: "#6dc067", x: 4, y: 4 },
    ],
    ready: [
      { color: "#6dc067", x: 2, y: 4 },
      { color: "#6dc067", x: 3, y: 3 },
      { color: "#6dc067", x: 4, y: 3 },
      { color: "#8ed673", x: 2, y: 2 },
      { color: "#8ed673", x: 4, y: 2 },
      { color: "#b88f57", x: 2, y: 1 },
      { color: "#cfa066", x: 3, y: 1 },
      { color: "#b88f57", x: 4, y: 1 },
    ],
  },
  radish: {
    growing: [
      { color: "#6dc067", x: 2, y: 4 },
      { color: "#8ed673", x: 2, y: 3 },
      { color: "#6dc067", x: 3, y: 3 },
      { color: "#8ed673", x: 4, y: 3 },
      { color: "#6dc067", x: 4, y: 4 },
    ],
    ready: [
      { color: "#58a15d", x: 3, y: 4 },
      { color: "#6dc067", x: 2, y: 3 },
      { color: "#6dc067", x: 4, y: 3 },
      { color: "#7fd27a", x: 3, y: 3 },
      { color: "#7fd27a", x: 2, y: 2 },
      { color: "#7fd27a", x: 4, y: 2 },
      { color: "#f3c6de", x: 2, y: 1 },
      { color: "#f7e7a1", x: 3, y: 1 },
      { color: "#f3c6de", x: 4, y: 1 },
      { color: "#f3c6de", x: 3, y: 0 },
    ],
  },
};

export function getCropPixels(cropId: CropId, stage: CropDisplayStage): CropPixel[] {
  return cropPixelsByStage[cropId][stage];
}

export function getPlotPalette(stage: FarmPlotStage, watered: boolean): PlotPalette {
  if (stage === "empty") {
    return {
      border: "#2f2417",
      moisture: "#447a67",
      soil: "#7a6845",
    };
  }

  if (stage === "tilled") {
    return {
      border: "#322113",
      moisture: "#447a67",
      soil: watered ? "#705532" : "#8a6738",
    };
  }

  if (stage === "ready") {
    return {
      border: "#2a2416",
      moisture: "#447a67",
      soil: watered ? "#5c4a2f" : "#6a5538",
    };
  }

  return {
    border: "#2a2416",
    moisture: "#447a67",
    soil: watered ? "#5f4b31" : "#725a38",
  };
}
