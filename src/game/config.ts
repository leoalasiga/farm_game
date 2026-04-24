import Phaser from "phaser";
import { BootScene } from "../scenes/BootScene";
import { FarmScene } from "../scenes/FarmScene";
import { UIScene } from "../scenes/UIScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 960,
  height: 540,
  backgroundColor: "#1a3923",
  pixelArt: true,
  scene: [BootScene, FarmScene, UIScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
