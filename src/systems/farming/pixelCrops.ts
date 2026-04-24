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
      { color: "#6aa96a", x: 2, y: 4 },
      { color: "#90d981", x: 3, y: 3 },
      { color: "#6aa96a", x: 3, y: 4 },
      { color: "#90d981", x: 4, y: 3 },
      { color: "#6aa96a", x: 4, y: 4 },
    ],
    ready: [
      { color: "#6dc067", x: 2, y: 4 },
      { color: "#6dc067", x: 3, y: 3 },
      { color: "#6dc067", x: 4, y: 3 },
      { color: "#9ae083", x: 2, y: 2 },
      { color: "#9ae083", x: 4, y: 2 },
      { color: "#6e89ff", x: 2, y: 1 },
      { color: "#5873ea", x: 3, y: 1 },
      { color: "#6e89ff", x: 4, y: 1 },
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
      { color: "#a0e282", x: 2, y: 2 },
      { color: "#a0e282", x: 4, y: 2 },
      { color: "#c89d61", x: 2, y: 1 },
      { color: "#ddb071", x: 3, y: 1 },
      { color: "#c89d61", x: 4, y: 1 },
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
      { color: "#63b169", x: 3, y: 4 },
      { color: "#6dc067", x: 2, y: 3 },
      { color: "#6dc067", x: 4, y: 3 },
      { color: "#9be28f", x: 3, y: 3 },
      { color: "#9be28f", x: 2, y: 2 },
      { color: "#9be28f", x: 4, y: 2 },
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
      border: "#6c5b36",
      moisture: "#447a67",
      soil: "#b79b6a",
    };
  }

  if (stage === "tilled") {
    return {
      border: "#684123",
      moisture: "#447a67",
      soil: watered ? "#8d6d48" : "#a97d45",
    };
  }

  if (stage === "ready") {
    return {
      border: "#61492e",
      moisture: "#447a67",
      soil: watered ? "#84694a" : "#957553",
    };
  }

  return {
    border: "#61492e",
    moisture: "#447a67",
    soil: watered ? "#86694b" : "#9a7b57",
  };
}
