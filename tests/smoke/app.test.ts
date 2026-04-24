import { describe, expect, it, vi } from "vitest";

vi.mock("phaser", () => {
  class Scene {
    scale = { width: 960, height: 540 };
    add = {
      rectangle: () => undefined,
      text: () => ({
        setOrigin: () => undefined,
        setScrollFactor: () => undefined,
      }),
    };
    scene = {
      launch: () => undefined,
      start: () => undefined,
    };

    constructor(_: string) {}
  }

  return {
    default: {
      AUTO: "AUTO",
      Scale: {
        CENTER_BOTH: "CENTER_BOTH",
        FIT: "FIT",
      },
      Scene,
    },
  };
});

import { gameConfig } from "../../src/game/config";

describe("gameConfig", () => {
  it("defines the base game canvas", () => {
    const sceneConfig = Array.isArray(gameConfig.scene) ? gameConfig.scene : [gameConfig.scene];
    expect(gameConfig.width).toBeGreaterThan(0);
    expect(gameConfig.height).toBeGreaterThan(0);
    expect(sceneConfig.length).toBeGreaterThan(0);
  });
});
