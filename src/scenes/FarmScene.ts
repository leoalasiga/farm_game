import Phaser from "phaser";

export class FarmScene extends Phaser.Scene {
  constructor() {
    super("FarmScene");
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.rectangle(width / 2, height / 2, width, height, 0x355e3b);
    this.add
      .text(width / 2, height / 2, "Farm Prototype", {
        color: "#f7f3c8",
        fontFamily: "monospace",
        fontSize: "24px",
      })
      .setOrigin(0.5);
  }
}
