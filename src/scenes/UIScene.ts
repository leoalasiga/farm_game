import Phaser from "phaser";

export class UIScene extends Phaser.Scene {
  private dayText?: Phaser.GameObjects.Text;
  private goldText?: Phaser.GameObjects.Text;
  private inventoryText?: Phaser.GameObjects.Text;
  private questText?: Phaser.GameObjects.Text;
  private saveStatusText?: Phaser.GameObjects.Text;
  private staminaText?: Phaser.GameObjects.Text;
  private toolStatusText?: Phaser.GameObjects.Text;
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

    this.dayText = this.add.text(16, 16, "第 1 天", textStyle).setScrollFactor(0);
    this.timeText = this.add.text(16, 40, "时间 06:00", textStyle).setScrollFactor(0);
    this.staminaText = this.add
      .text(16, 64, "体力 100/100", textStyle)
      .setScrollFactor(0);
    this.goldText = this.add.text(16, 88, "金币 0g", textStyle).setScrollFactor(0);
    this.inventoryText = this.add.text(16, 112, "背包为空", {
      ...textStyle,
      fontSize: "14px",
    });
    this.inventoryText.setScrollFactor(0);
    this.questText = this.add.text(16, 136, "任务：在农场收获你的第一批作物", {
      ...textStyle,
      fontSize: "14px",
    });
    this.questText.setScrollFactor(0);
    this.toolStatusText = this.add.text(16, 160, "斧头 Lv1 | 镐子 Lv1", {
      ...textStyle,
      fontSize: "14px",
    });
    this.toolStatusText.setScrollFactor(0);
    this.saveStatusText = this.add.text(16, 184, "还没有存档", {
      ...textStyle,
      fontSize: "14px",
    });
    this.saveStatusText.setScrollFactor(0);

    this.refreshHud();
    this.registry.events.on("changedata", this.refreshHud, this);
  }

  shutdown(): void {
    this.registry.events.off("changedata", this.refreshHud, this);
  }

  private refreshHud(): void {
    this.dayText?.setText(`第 ${this.registry.get("day") ?? 1} 天`);
    this.timeText?.setText(`时间 ${this.registry.get("time") ?? "06:00"}`);
    this.staminaText?.setText(`体力 ${this.registry.get("stamina") ?? "100/100"}`);
    this.goldText?.setText(`金币 ${this.registry.get("gold") ?? 0}g`);
    this.inventoryText?.setText(this.registry.get("inventory") ?? "背包为空");
    this.questText?.setText(
      `任务：${this.registry.get("questText") ?? "在农场收获你的第一批作物"}`,
    );
    this.toolStatusText?.setText(this.registry.get("toolStatus") ?? "斧头 Lv1 | 镐子 Lv1");
    this.saveStatusText?.setText(this.registry.get("saveStatus") ?? "还没有存档");
  }
}
