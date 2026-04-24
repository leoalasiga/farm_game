import { cropData } from "../../data/crops";
import { type FarmPlot } from "./farmPlots";

export interface PlotFeedbackContext {
  hasSelectedSeed: boolean;
  selectedCropName: string;
}

export function getPlotActionLabel(plot: FarmPlot, context: PlotFeedbackContext): string {
  if (plot.stage === "empty") {
    return "点击翻地";
  }

  if (plot.stage === "tilled") {
    return context.hasSelectedSeed ? `点击种下${context.selectedCropName}` : `${context.selectedCropName}种子不足`;
  }

  if (plot.stage === "growing") {
    return plot.watered ? "今天已经浇过水" : "点击浇水";
  }

  if (plot.stage === "ready" && plot.cropId) {
    return `点击收获${cropData[plot.cropId].name}`;
  }

  return "点击互动";
}
