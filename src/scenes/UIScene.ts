import Phaser from "phaser";
import {
  createHudTextStyle,
  HUD_CONTROL_LINES,
  HUD_PANEL_COLORS,
  PIXEL_HUD_LAYOUT,
  type PanelBounds,
} from "../ui/pixelHud";

export class UIScene extends Phaser.Scene {
  private currentSeedText?: Phaser.GameObjects.Text;
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
    const { controlsPanel, statusPanel, textInset } = PIXEL_HUD_LAYOUT;
    const statusX = statusPanel.x + textInset;
    const controlsX = controlsPanel.x + textInset;

    this.drawPanel(statusPanel, "农场日志");
    this.drawPanel(controlsPanel, "操作");

    this.dayText = this.pinToHud(this.add.text(statusX, statusPanel.y + 34, "第 1 天", createHudTextStyle("title")));
    this.timeText = this.pinToHud(
      this.add.text(statusX + 126, statusPanel.y + 34, "时间 06:00", createHudTextStyle("label")),
    );
    this.staminaText = this.pinToHud(
      this.add.text(statusX, statusPanel.y + 58, "体力 100/100", createHudTextStyle("label")),
    );
    this.goldText = this.pinToHud(
      this.add.text(statusX + 126, statusPanel.y + 58, "金币 0g", createHudTextStyle("label")),
    );
    this.currentSeedText = this.pinToHud(
      this.add.text(statusX, statusPanel.y + 86, "当前种子：萝卜种子 x0", createHudTextStyle("body")),
    );
    this.inventoryText = this.pinToHud(
      this.add.text(statusX, statusPanel.y + 118, "背包：空", createHudTextStyle("body")),
    );
    this.questText = this.pinToHud(
      this.add.text(statusX, statusPanel.y + 158, "任务：在农场收获你的第一批作物", createHudTextStyle("body")),
    );
    this.toolStatusText = this.pinToHud(
      this.add.text(statusX, statusPanel.y + 214, "工具：斧头 Lv1 | 镐子 Lv1", createHudTextStyle("body")),
    );
    this.saveStatusText = this.pinToHud(
      this.add.text(statusX, statusPanel.y + 246, "存档：还没有存档", createHudTextStyle("body")),
    );

    this.pinToHud(
      this.add.text(
        controlsX,
        controlsPanel.y + 34,
        HUD_CONTROL_LINES.join("\n"),
        createHudTextStyle("body"),
      ),
    );

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
    this.currentSeedText?.setText(this.registry.get("selectedSeed") ?? "当前种子：萝卜种子 x0");
    this.inventoryText?.setText(this.registry.get("inventory") ?? "背包：空");
    this.questText?.setText(
      `任务：${this.registry.get("questText") ?? "在农场收获你的第一批作物"}`,
    );
    this.toolStatusText?.setText(`工具：${this.registry.get("toolStatus") ?? "斧头 Lv1 | 镐子 Lv1"}`);
    this.saveStatusText?.setText(`存档：${this.registry.get("saveStatus") ?? "还没有存档"}`);
  }

  private drawPanel(bounds: PanelBounds, title: string): void {
    this.pinToHud(
      this.add.rectangle(bounds.x + 4, bounds.y + 4, bounds.width, bounds.height, HUD_PANEL_COLORS.shadow, 0.85).setOrigin(0),
    );
    this.pinToHud(
      this.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, HUD_PANEL_COLORS.fill).setOrigin(0),
    ).setStrokeStyle(3, HUD_PANEL_COLORS.border);
    this.pinToHud(
      this.add.rectangle(bounds.x + 4, bounds.y + 4, bounds.width - 8, bounds.height - 8, HUD_PANEL_COLORS.inner).setOrigin(0),
    );
    this.pinToHud(
      this.add.rectangle(bounds.x + 6, bounds.y + 6, bounds.width - 12, 18, HUD_PANEL_COLORS.highlight).setOrigin(0),
    );
    this.pinToHud(this.add.text(bounds.x + 12, bounds.y + 8, title, createHudTextStyle("title")));
    this.pinToHud(
      this.add.rectangle(bounds.x + 6, bounds.y + 28, bounds.width - 12, 2, HUD_PANEL_COLORS.title).setOrigin(0),
    );
  }

  private pinToHud<T extends Phaser.GameObjects.GameObject>(gameObject: T): T {
    if ("setScrollFactor" in gameObject && typeof gameObject.setScrollFactor === "function") {
      gameObject.setScrollFactor(0);
    }

    if ("setDepth" in gameObject && typeof gameObject.setDepth === "function") {
      gameObject.setDepth(1000);
    }

    return gameObject;
  }
}
