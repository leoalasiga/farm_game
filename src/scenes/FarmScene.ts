import Phaser from "phaser";
import { cropData, type CropId } from "../data/crops";
import { itemData } from "../data/items";
import { PLAYER_SPEED, createPlayerModel } from "../entities/Player";
import farmMap from "../maps/farm.json";
import {
  advanceFarmDay,
  createFarmPlots,
  type FarmPlot,
  getPlot,
  harvestPlot,
  plantCrop,
  tillPlot,
  waterPlot,
  type FarmPlotsState,
} from "../systems/farming/farmPlots";
import { getPlotActionLabel } from "../systems/farming/plotFeedback";
import { getCropPixels, getPlotPalette } from "../systems/farming/pixelCrops";
import {
  createSeedSelection,
  getSelectedSeedItemId,
  selectCropBySlot,
  type SeedSelectionState,
} from "../systems/farming/seedSelection";
import { addItem, createInventory, removeItem, type InventoryState } from "../systems/inventory/inventory";
import { createWallet, type WalletState } from "../systems/economy/economy";
import { completeObjective, createQuestState, type QuestState } from "../systems/quests/quests";
import { loadFromStorage, saveToStorage, type GameSaveData } from "../systems/save/save";
import { createStamina, spendStamina } from "../systems/stamina/stamina";
import { advanceClock, createClock, formatClock, startNextDay } from "../systems/time/time";
import { createToolState, type ToolState } from "../systems/upgrades/upgrades";
import { getTransition } from "../systems/world/transitions";
import { FARM_LAYOUT } from "./farmLayout";

const FARM_GRID_COLUMNS = FARM_LAYOUT.plot.columns;
const FARM_GRID_ROWS = FARM_LAYOUT.plot.rows;
const FARM_PLOT_SIZE = FARM_LAYOUT.plot.size;
const FARM_PLOT_ORIGIN_X = FARM_LAYOUT.plot.originX;
const FARM_PLOT_ORIGIN_Y = FARM_LAYOUT.plot.originY;
const CROP_PIXEL_SIZE = 3;
const MAX_CROP_PIXELS = 12;
const HOVER_TEXT_OFFSET_Y = 28;

interface PlotVisual {
  cropPixels: Phaser.GameObjects.Rectangle[];
  moisture: Phaser.GameObjects.Rectangle;
  soil: Phaser.GameObjects.Rectangle;
}

export class FarmScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private clock = createClock();
  private farmPlots = createFarmPlots(FARM_GRID_COLUMNS, FARM_GRID_ROWS);
  private interactKey?: Phaser.Input.Keyboard.Key;
  private inventory!: ReturnType<typeof createInventory>;
  private nextDayKey?: Phaser.Input.Keyboard.Key;
  private player?: Phaser.GameObjects.Rectangle;
  private plotSprites: PlotVisual[] = [];
  private plotHoverFrame?: Phaser.GameObjects.Rectangle;
  private plotHoverText?: Phaser.GameObjects.Text;
  private questState!: QuestState;
  private saveKey?: Phaser.Input.Keyboard.Key;
  private seedHotkeys?: Phaser.Input.Keyboard.Key[];
  private seedSelection: SeedSelectionState = createSeedSelection();
  private stamina = createStamina(100);
  private toolState!: ToolState;
  private villageGate?: Phaser.GameObjects.Rectangle;
  private wallet!: WalletState;
  private wasd?: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;

  constructor() {
    super("FarmScene");
  }

  create(): void {
    const mapWidth = farmMap.width * farmMap.tilewidth;
    const mapHeight = farmMap.height * farmMap.tileheight;
    this.hydrateFromStorageIfNeeded();

    const saveData = this.registry.get("saveData") as GameSaveData | undefined;
    const sceneData = this.scene.settings.data as { transitionId?: string } | undefined;
    const entryTransitionId = sceneData?.transitionId ?? "village_gate";
    const spawn =
      sceneData?.transitionId === undefined && saveData?.playerPosition
        ? saveData.playerPosition
        : getTransition(entryTransitionId).spawn;
    const playerModel = createPlayerModel({ x: spawn.x, y: spawn.y });

    this.inventory =
      (this.registry.get("inventoryState") as InventoryState | undefined) ??
      createInventory(Math.max(8, saveData?.inventory.length ?? 8));
    this.wallet = (this.registry.get("walletState") as WalletState | undefined) ?? createWallet(12);
    this.stamina = (this.registry.get("staminaState") as typeof this.stamina | undefined) ?? createStamina(100);
    this.questState = (this.registry.get("questState") as QuestState | undefined) ?? createQuestState();
    this.toolState = (this.registry.get("toolState") as ToolState | undefined) ?? createToolState();
    this.farmPlots =
      (this.registry.get("farmPlotsState") as FarmPlotsState | undefined) ??
      createFarmPlots(FARM_GRID_COLUMNS, FARM_GRID_ROWS);
    this.seedSelection = createSeedSelection(
      (this.registry.get("selectedCropId") as CropId | undefined) ?? saveData?.selectedCropId ?? "radish",
    );

    if (saveData) {
      this.clock.day = saveData.day;
      this.clock.currentMinutes = saveData.timeMinutes ?? 0;
      this.clock.isNight = false;
      this.inventory.slots = Array.from({ length: this.inventory.capacity }, (_, index) => {
        const slot = saveData.inventory[index];
        return slot ? { ...slot } : null;
      });
      this.wallet.gold = saveData.gold;

      if (saveData.questState) {
        this.questState = {
          completedObjectives: [...saveData.questState.completedObjectives],
          currentObjectiveText: saveData.questState.currentObjectiveText,
          unlockedZones: [...saveData.questState.unlockedZones],
        };
      }

      if (saveData.toolState) {
        this.toolState = {
          axe: { ...saveData.toolState.axe },
          pickaxe: { ...saveData.toolState.pickaxe },
        };
      }

      if (saveData.farmPlots) {
        this.farmPlots = {
          height: saveData.farmPlots.height,
          plots: saveData.farmPlots.plots.map((plot) => ({ ...plot })),
          width: saveData.farmPlots.width,
        };
      }
    }

    if (!saveData && this.inventory.slots.every((slot) => slot === null)) {
      addItem(this.inventory, "radish_seed", 3);
    }

    this.registry.set("inventoryState", this.inventory);
    this.registry.set("walletState", this.wallet);
    this.registry.set("farmPlotsState", this.farmPlots);
    this.registry.set("questState", this.questState);
    this.registry.set("selectedCropId", this.seedSelection.selectedCropId);
    this.registry.set("staminaState", this.stamina);
    this.registry.set("toolState", this.toolState);

    this.cameras.main.setBackgroundColor("#8dc07a");
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    for (let y = 0; y < farmMap.height; y += 1) {
      for (let x = 0; x < farmMap.width; x += 1) {
        const color = (x + y) % 2 === 0 ? 0x96cc84 : 0x88c275;
        this.add.rectangle(
          x * farmMap.tilewidth + farmMap.tilewidth / 2,
          y * farmMap.tileheight + farmMap.tileheight / 2,
          farmMap.tilewidth,
          farmMap.tileheight,
          color,
        );
      }
    }

    this.createFarmDecorations();
    this.createFarmGrid();
    this.createVillageGate();
    this.createPlotHoverFeedback();

    this.player = this.add.rectangle(playerModel.x, playerModel.y, 14, 14, 0xf7f3c8);
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys("W,A,S,D") as Record<
      "W" | "A" | "S" | "D",
      Phaser.Input.Keyboard.Key
    >;
    this.interactKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.nextDayKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    this.saveKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.seedHotkeys = [
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
    ].filter((key): key is Phaser.Input.Keyboard.Key => Boolean(key));

    this.registry.set("day", this.clock.day);
    this.registry.set("gold", this.wallet.gold);
    this.registry.set("inventory", "背包：空");
    this.registry.set("questText", this.questState.currentObjectiveText);
    this.registry.set("saveStatus", this.registry.get("saveStatus") ?? "还没有存档");
    this.registry.set("stamina", `${this.stamina.current}/${this.stamina.max}`);
    this.registry.set("time", formatClock(this.clock));
    this.registry.set("toolStatus", `斧头 Lv${this.toolState.axe.level} | 镐子 Lv${this.toolState.pickaxe.level}`);

    this.input.on("pointerdown", this.handleFarmPointerDown, this);
    this.input.on("pointermove", this.handleFarmPointerMove, this);
    this.input.on("pointerout", this.clearPlotHoverFeedback, this);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.syncInventoryHud();
  }

  update(): void {
    if (!this.player || !this.cursors || !this.wasd) {
      return;
    }

    this.handleSeedHotkeys();

    advanceClock(this.clock, 0.05);
    this.registry.set("day", this.clock.day);
    this.registry.set("time", formatClock(this.clock));
    this.registry.set("stamina", `${this.stamina.current}/${this.stamina.max}`);
    this.registry.set("farmPlayerPosition", {
      x: this.player.x,
      y: this.player.y,
    });

    if (this.nextDayKey && Phaser.Input.Keyboard.JustDown(this.nextDayKey)) {
      advanceFarmDay(this.farmPlots);
      startNextDay(this.clock);
      this.refreshFarmGrid();
      this.registry.set("day", this.clock.day);
      this.registry.set("time", formatClock(this.clock));
      this.saveCurrentState("睡觉后已自动保存");
    }

    if (this.saveKey && Phaser.Input.Keyboard.JustDown(this.saveKey)) {
      this.saveCurrentState("已在农场保存");
    }

    if (
      this.interactKey &&
      Phaser.Input.Keyboard.JustDown(this.interactKey) &&
      this.player &&
      this.villageGate
    ) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.villageGate.x,
        this.villageGate.y,
      );
      if (distance < 40) {
        const transition = getTransition("farm_gate");
        this.scene.start(transition.targetScene, {
          transitionId: transition.targetTransitionId,
        });
        return;
      }
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    if (left) {
      body.setVelocityX(-PLAYER_SPEED);
    } else if (right) {
      body.setVelocityX(PLAYER_SPEED);
    }

    if (up) {
      body.setVelocityY(-PLAYER_SPEED);
    } else if (down) {
      body.setVelocityY(PLAYER_SPEED);
    }

    body.velocity.normalize().scale(PLAYER_SPEED);
  }

  private createFarmDecorations(): void {
    const flowerClusters = [
      { x: 128, y: 112, petal: 0xf3d4df },
      { x: 176, y: 96, petal: 0xf7eb9b },
      { x: 520, y: 132, petal: 0xf3d4df },
      { x: 584, y: 348, petal: 0xf7eb9b },
      { x: 264, y: 356, petal: 0xd7f0ff },
      { x: 680, y: 180, petal: 0xf3d4df },
    ];

    for (const cluster of flowerClusters) {
      this.add.rectangle(cluster.x, cluster.y, 4, 4, cluster.petal);
      this.add.rectangle(cluster.x + 4, cluster.y + 2, 4, 4, cluster.petal);
      this.add.rectangle(cluster.x + 2, cluster.y + 6, 4, 4, 0x5da55f);
    }
  }

  private createFarmGrid(): void {
    for (let y = 0; y < FARM_GRID_ROWS; y += 1) {
      for (let x = 0; x < FARM_GRID_COLUMNS; x += 1) {
        const plotX = FARM_PLOT_ORIGIN_X + x * FARM_PLOT_SIZE;
        const plotY = FARM_PLOT_ORIGIN_Y + y * FARM_PLOT_SIZE;

        const soil = this.add.rectangle(plotX, plotY, FARM_PLOT_SIZE - 2, FARM_PLOT_SIZE - 2, 0xb79b6a);
        soil.setStrokeStyle(2, 0x6c5b36);

        const moisture = this.add.rectangle(
          plotX,
          plotY + 2,
          FARM_PLOT_SIZE - 10,
          FARM_PLOT_SIZE - 12,
          0x447a67,
          0.75,
        );
        moisture.setVisible(false);

        const cropPixels = Array.from({ length: MAX_CROP_PIXELS }, () =>
          this.add.rectangle(plotX, plotY, CROP_PIXEL_SIZE, CROP_PIXEL_SIZE, 0x6dc067).setVisible(false),
        );

        this.plotSprites.push({ cropPixels, moisture, soil });
      }
    }

    this.refreshFarmGrid();
    this.registry.set("farmPlotsState", this.farmPlots);
  }

  private createPlotHoverFeedback(): void {
    this.plotHoverFrame = this.add
      .rectangle(FARM_PLOT_ORIGIN_X, FARM_PLOT_ORIGIN_Y, FARM_PLOT_SIZE, FARM_PLOT_SIZE, 0xffffff, 0)
      .setStrokeStyle(2, 0xf9efb2)
      .setVisible(false);
    this.plotHoverText = this.add
      .text(FARM_PLOT_ORIGIN_X, FARM_PLOT_ORIGIN_Y - HOVER_TEXT_OFFSET_Y, "", {
        color: "#f7f3c8",
        fontFamily: "monospace",
        fontSize: "11px",
        padding: {
          left: 6,
          right: 6,
          top: 4,
          bottom: 4,
        },
      })
      .setOrigin(0.5, 1)
      .setBackgroundColor("#21482bcc")
      .setVisible(false);
  }

  private createVillageGate(): void {
    this.villageGate = this.add.rectangle(168, 320, 32, 44, 0x000000, 0);
    this.add.rectangle(168, 326, 10, 42, 0x6d4727).setStrokeStyle(2, 0x2c1a0f);
    this.add.rectangle(168, 300, 42, 24, 0xe1b975).setStrokeStyle(2, 0x7d5225);
    this.add.rectangle(168, 295, 30, 4, 0xf9dea1);
    this.add.text(152, 294, "村庄", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "12px",
    });
  }

  private handleSeedHotkeys(): void {
    if (!this.seedHotkeys) {
      return;
    }

    this.seedHotkeys.forEach((key, index) => {
      if (!Phaser.Input.Keyboard.JustDown(key)) {
        return;
      }

      if (selectCropBySlot(this.seedSelection, index + 1)) {
        this.registry.set("selectedCropId", this.seedSelection.selectedCropId);
        this.registry.set("saveStatus", `已切换到${cropData[this.seedSelection.selectedCropId].name}种子`);
        this.syncInventoryHud();
      }
    });
  }

  private handleFarmPointerDown(pointer: Phaser.Input.Pointer): void {
    const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const gridX = Math.floor((worldPoint.x - (FARM_PLOT_ORIGIN_X - FARM_PLOT_SIZE / 2)) / FARM_PLOT_SIZE);
    const gridY = Math.floor((worldPoint.y - (FARM_PLOT_ORIGIN_Y - FARM_PLOT_SIZE / 2)) / FARM_PLOT_SIZE);
    const plot = getPlot(this.farmPlots, gridX, gridY);

    if (!plot) {
      return;
    }

    if (plot.stage === "empty") {
      if (!spendStamina(this.stamina, 2)) {
        this.registry.set("saveStatus", "体力不足，无法翻地");
        return;
      }

      tillPlot(this.farmPlots, gridX, gridY);
      this.registry.set("saveStatus", "已经翻好土地");
    } else if (plot.stage === "tilled") {
      if (!spendStamina(this.stamina, 1)) {
        this.registry.set("saveStatus", "体力不足，无法播种");
        return;
      }

      const selectedCrop = this.seedSelection.selectedCropId;
      const selectedSeedItemId = getSelectedSeedItemId(this.seedSelection);
      const removedSeed = removeItem(this.inventory, selectedSeedItemId, 1);
      if (!removedSeed.ok) {
        this.registry.set("saveStatus", `没有${cropData[selectedCrop].name}种子了`);
        return;
      }

      plantCrop(this.farmPlots, gridX, gridY, selectedCrop);
      this.registry.set("saveStatus", `种下了${cropData[selectedCrop].name}种子`);
      this.syncInventoryHud();
    } else if (plot.stage === "growing") {
      if (!spendStamina(this.stamina, 1)) {
        this.registry.set("saveStatus", "体力不足，无法浇水");
        return;
      }

      waterPlot(this.farmPlots, gridX, gridY);
      this.registry.set("saveStatus", "已经给作物浇水");
    } else if (plot.stage === "ready") {
      if (!spendStamina(this.stamina, 1)) {
        this.registry.set("saveStatus", "体力不足，无法收获");
        return;
      }

      const harvestedCropId = plot.cropId;
      const result = harvestPlot(this.farmPlots, this.inventory, gridX, gridY);
      if (result.ok && harvestedCropId) {
        completeObjective(this.questState, "harvest_first_crop");
        this.registry.set("questState", this.questState);
        this.registry.set("questText", this.questState.currentObjectiveText);
        this.registry.set("saveStatus", `收获了${cropData[harvestedCropId].name}`);
      }
      this.syncInventoryHud();
    }

    this.refreshFarmGrid();
    this.registry.set("farmPlotsState", this.farmPlots);
    this.registry.set("stamina", `${this.stamina.current}/${this.stamina.max}`);
    this.updatePlotHoverFeedback(plot);
  }

  private handleFarmPointerMove(pointer: Phaser.Input.Pointer): void {
    const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const gridX = Math.floor((worldPoint.x - (FARM_PLOT_ORIGIN_X - FARM_PLOT_SIZE / 2)) / FARM_PLOT_SIZE);
    const gridY = Math.floor((worldPoint.y - (FARM_PLOT_ORIGIN_Y - FARM_PLOT_SIZE / 2)) / FARM_PLOT_SIZE);
    const plot = getPlot(this.farmPlots, gridX, gridY);

    this.updatePlotHoverFeedback(plot);
  }

  private updatePlotHoverFeedback(plot?: FarmPlot): void {
    if (!plot || !this.plotHoverFrame || !this.plotHoverText) {
      this.clearPlotHoverFeedback();
      return;
    }

    const worldX = FARM_PLOT_ORIGIN_X + plot.x * FARM_PLOT_SIZE;
    const worldY = FARM_PLOT_ORIGIN_Y + plot.y * FARM_PLOT_SIZE;
    const selectedSeedItemId = getSelectedSeedItemId(this.seedSelection);
    const hasSelectedSeed = this.inventory.slots.some(
      (slot) => slot?.itemId === selectedSeedItemId && slot.count > 0,
    );

    this.plotHoverFrame.setPosition(worldX, worldY).setVisible(true);
    this.plotHoverText
      .setPosition(worldX, worldY - HOVER_TEXT_OFFSET_Y)
      .setText(
        getPlotActionLabel(plot, {
          hasSelectedSeed,
          selectedCropName: cropData[this.seedSelection.selectedCropId].name,
        }),
      )
      .setVisible(true);
  }

  private clearPlotHoverFeedback(): void {
    this.plotHoverFrame?.setVisible(false);
    this.plotHoverText?.setVisible(false);
  }

  private refreshFarmGrid(): void {
    for (const plot of this.farmPlots.plots) {
      const visual = this.plotSprites[plot.y * FARM_GRID_COLUMNS + plot.x];
      if (!visual) {
        continue;
      }

      const palette = getPlotPalette(plot.stage, plot.watered);
      visual.soil.setFillStyle(this.hexToColorNumber(palette.soil));
      visual.soil.setStrokeStyle(
        plot.stage === "ready" ? 3 : 2,
        this.hexToColorNumber(plot.stage === "ready" ? "#f0e18b" : palette.border),
      );
      visual.moisture.setFillStyle(this.hexToColorNumber(palette.moisture), 0.78);
      visual.moisture.setVisible(plot.watered);

      const cropPixels =
        plot.cropId && (plot.stage === "growing" || plot.stage === "ready")
          ? getCropPixels(plot.cropId, plot.stage)
          : [];

      visual.cropPixels.forEach((pixelRect, index) => {
        const cropPixel = cropPixels[index];
        if (!cropPixel) {
          pixelRect.setVisible(false);
          return;
        }

        pixelRect.setVisible(true);
        pixelRect.setFillStyle(this.hexToColorNumber(cropPixel.color));
        pixelRect.setPosition(
          visual.soil.x + (cropPixel.x - 3) * CROP_PIXEL_SIZE,
          visual.soil.y + (cropPixel.y - 3) * CROP_PIXEL_SIZE,
        );
      });
    }
  }

  private hexToColorNumber(color: string): number {
    return Phaser.Display.Color.HexStringToColor(color).color;
  }

  private syncInventoryHud(): void {
    const summary = this.inventory.slots
      .filter((slot): slot is NonNullable<(typeof this.inventory.slots)[number]> => slot !== null)
      .map((slot) => `${itemData[slot.itemId].name} x${slot.count}`)
      .join(", ");
    const selectedSeedItemId = getSelectedSeedItemId(this.seedSelection);
    const selectedSeedCount =
      this.inventory.slots
        .filter((slot): slot is NonNullable<(typeof this.inventory.slots)[number]> => slot !== null)
        .find((slot) => slot.itemId === selectedSeedItemId)?.count ?? 0;

    this.registry.set("gold", this.wallet.gold);
    this.registry.set("inventory", summary ? `背包：${summary}` : "背包：空");
    this.registry.set(
      "selectedSeed",
      `当前种子：${itemData[selectedSeedItemId].name} x${selectedSeedCount}`,
    );
  }

  private hydrateFromStorageIfNeeded(): void {
    if (this.registry.get("saveHydrated")) {
      return;
    }

    const storedSave = loadFromStorage();
    if (storedSave) {
      this.registry.set("saveData", storedSave);
      this.registry.set("saveStatus", `已读取第 ${storedSave.day} 天的存档`);
    }

    this.registry.set("saveHydrated", true);
  }

  private saveCurrentState(status: string): void {
    const saveData: GameSaveData = {
      day: this.clock.day,
      farmPlots: {
        height: this.farmPlots.height,
        plots: this.farmPlots.plots.map((plot) => ({ ...plot })),
        width: this.farmPlots.width,
      },
      gold: this.wallet.gold,
      inventory: this.inventory.slots.map((slot) => (slot ? { ...slot } : null)),
      playerPosition: this.player
        ? {
            x: this.player.x,
            y: this.player.y,
          }
        : undefined,
      questState: {
        completedObjectives: [...this.questState.completedObjectives],
        currentObjectiveText: this.questState.currentObjectiveText,
        unlockedZones: [...this.questState.unlockedZones],
      },
      selectedCropId: this.seedSelection.selectedCropId,
      timeMinutes: this.clock.currentMinutes,
      toolState: {
        axe: { ...this.toolState.axe },
        pickaxe: { ...this.toolState.pickaxe },
      },
    };

    saveToStorage(saveData);
    this.registry.set("saveData", saveData);
    this.registry.set("saveStatus", status);
  }
}
