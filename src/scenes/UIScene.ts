import Phaser from "phaser";

export class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");
  }

  create(): void {
    this.add
      .text(16, 16, "Day 1", {
        color: "#f7f3c8",
        fontFamily: "monospace",
        fontSize: "18px",
      })
      .setScrollFactor(0);
  }
}
