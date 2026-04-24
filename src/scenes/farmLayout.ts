const FARM_GRID_COLUMNS = 6;
const FARM_GRID_ROWS = 4;
const FARM_PLOT_SIZE = 24;
const FARM_PLOT_ORIGIN_X = 408;
const FARM_PLOT_ORIGIN_Y = 212;

export const FARM_LAYOUT = {
  gridBounds: {
    height: FARM_GRID_ROWS * FARM_PLOT_SIZE,
    width: FARM_GRID_COLUMNS * FARM_PLOT_SIZE,
    x: FARM_PLOT_ORIGIN_X - FARM_PLOT_SIZE / 2,
    y: FARM_PLOT_ORIGIN_Y - FARM_PLOT_SIZE / 2,
  },
  plot: {
    columns: FARM_GRID_COLUMNS,
    originX: FARM_PLOT_ORIGIN_X,
    originY: FARM_PLOT_ORIGIN_Y,
    rows: FARM_GRID_ROWS,
    size: FARM_PLOT_SIZE,
  },
};
