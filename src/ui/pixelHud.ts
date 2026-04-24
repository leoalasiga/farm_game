export interface PanelBounds {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface HudTextStyle {
  color: string;
  fontFamily: string;
  fontSize: string;
  lineSpacing?: number;
  wordWrap?: {
    useAdvancedWrap: boolean;
    width: number;
  };
}

export const PIXEL_HUD_LAYOUT = {
  canvas: {
    height: 540,
    width: 960,
  },
  controlsPanel: {
    height: 124,
    width: 254,
    x: 688,
    y: 280,
  } satisfies PanelBounds,
  statusPanel: {
    height: 244,
    width: 254,
    x: 688,
    y: 18,
  } satisfies PanelBounds,
  textInset: 14,
};

export const HUD_PANEL_COLORS = {
  border: 0x19311f,
  fill: 0x24492d,
  highlight: 0x4f8f5a,
  inner: 0x1a3421,
  shadow: 0x0c160f,
  title: 0xc9b26d,
};

export const HUD_CONTROL_LINES = [
  "WASD / 方向键：移动",
  "E：互动     K：存档",
  "点击对象：执行场景操作",
  "N：在农场睡觉推进新一天",
];

export function createHudTextStyle(kind: "body" | "label" | "title"): HudTextStyle {
  if (kind === "title") {
    return {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    };
  }

  if (kind === "label") {
    return {
      color: "#d7f0c4",
      fontFamily: "monospace",
      fontSize: "12px",
    };
  }

  return {
    color: "#f7f3c8",
    fontFamily: "monospace",
    fontSize: "12px",
    lineSpacing: 6,
    wordWrap: {
      useAdvancedWrap: true,
      width: 192,
    },
  };
}
