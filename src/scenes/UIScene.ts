import Phaser from "phaser";

export class UIScene extends Phaser.Scene {
  private dayText?: Phaser.GameObjects.Text;
  private goldText?: Phaser.GameObjects.Text;
  private inventoryText?: Phaser.GameObjects.Text;
  private staminaText?: Phaser.GameObjects.Text;
  private timeText?: Phaser.GameObjects.Text;

  constructor() {
    super("UIScene");
  }

  create(): void {
    const textStyle = {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "18px",
    };

    this.dayText = this.add.text(16, 16, "Day 1", textStyle).setScrollFactor(0);
    this.timeText = this.add.text(16, 40, "Time 06:00", textStyle).setScrollFactor(0);
    this.staminaText = this.add
      .text(16, 64, "Stamina 100/100", textStyle)
      .setScrollFactor(0);
    this.goldText = this.add.text(16, 88, "Gold 0g", textStyle).setScrollFactor(0);
    this.inventoryText = this.add.text(16, 112, "Inventory empty", {
      ...textStyle,
      fontSize: "14px",
    });
    this.inventoryText.setScrollFactor(0);

    this.refreshHud();
    this.registry.events.on("changedata", this.refreshHud, this);
  }

  shutdown(): void {
    this.registry.events.off("changedata", this.refreshHud, this);
  }

  private refreshHud(): void {
    this.dayText?.setText(`Day ${this.registry.get("day") ?? 1}`);
    this.timeText?.setText(`Time ${this.registry.get("time") ?? "06:00"}`);
    this.staminaText?.setText(`Stamina ${this.registry.get("stamina") ?? "100/100"}`);
    this.goldText?.setText(`Gold ${this.registry.get("gold") ?? 0}g`);
    this.inventoryText?.setText(this.registry.get("inventory") ?? "Inventory empty");
  }
}
