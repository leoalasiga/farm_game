import Phaser from "phaser";
import { BootScene } from "../scenes/BootScene";
import { FarmScene } from "../scenes/FarmScene";
import { UIScene } from "../scenes/UIScene";
import { VillageScene } from "../scenes/VillageScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 960,
  height: 540,
  backgroundColor: "#1a3923",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, FarmScene, VillageScene, UIScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
