import Phaser from "phaser";
import farmMap from "../maps/farm.json";
import { PLAYER_SPEED, createPlayerModel } from "../entities/Player";
import {
  advanceFarmDay,
  createFarmPlots,
  getPlot,
  harvestPlot,
  plantCrop,
  tillPlot,
  waterPlot,
} from "../systems/farming/farmPlots";
import { createInventory } from "../systems/inventory/inventory";
import { createWallet, type WalletState } from "../systems/economy/economy";
import { createStamina } from "../systems/stamina/stamina";
import { advanceClock, createClock, formatClock, startNextDay } from "../systems/time/time";
import { getTransition } from "../systems/world/transitions";

const FARM_GRID_COLUMNS = 6;
const FARM_GRID_ROWS = 4;
const FARM_PLOT_SIZE = 24;
const FARM_PLOT_ORIGIN_X = 96;
const FARM_PLOT_ORIGIN_Y = 160;

export class FarmScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private clock = createClock();
  private farmPlots = createFarmPlots(FARM_GRID_COLUMNS, FARM_GRID_ROWS);
  private inventory!: ReturnType<typeof createInventory>;
  private nextDayKey?: Phaser.Input.Keyboard.Key;
  private plotSprites: Phaser.GameObjects.Rectangle[] = [];
  private interactKey?: Phaser.Input.Keyboard.Key;
  private wasd?: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private wallet!: WalletState;
  private player?: Phaser.GameObjects.Rectangle;
  private stamina = createStamina(100);
  private villageGate?: Phaser.GameObjects.Rectangle;

  constructor() {
    super("FarmScene");
  }

  create(): void {
    const mapWidth = farmMap.width * farmMap.tilewidth;
    const mapHeight = farmMap.height * farmMap.tileheight;
    const entryTransitionId =
      (this.scene.settings.data?.transitionId as string | undefined) ?? "village_gate";
    const spawn = getTransition(entryTransitionId).spawn;
    const playerModel = createPlayerModel({ x: spawn.x, y: spawn.y });
    this.inventory =
      (this.registry.get("inventoryState") as ReturnType<typeof createInventory> | undefined) ??
      createInventory(8);
    this.wallet = (this.registry.get("walletState") as WalletState | undefined) ?? createWallet();
    this.registry.set("inventoryState", this.inventory);
    this.registry.set("walletState", this.wallet);

    this.cameras.main.setBackgroundColor("#355e3b");
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    for (let y = 0; y < farmMap.height; y += 1) {
      for (let x = 0; x < farmMap.width; x += 1) {
        const color = (x + y) % 2 === 0 ? 0x416d45 : 0x4a7a4f;
        this.add.rectangle(
          x * farmMap.tilewidth + farmMap.tilewidth / 2,
          y * farmMap.tileheight + farmMap.tileheight / 2,
          farmMap.tilewidth,
          farmMap.tileheight,
          color,
        );
      }
    }

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

    this.registry.set("day", this.clock.day);
    this.registry.set("gold", this.wallet.gold);
    this.registry.set("time", formatClock(this.clock));
    this.registry.set("inventory", "Inventory empty");
    this.registry.set("stamina", `${this.stamina.current}/${this.stamina.max}`);

    this.createFarmGrid();
    this.createVillageGate();
    this.input.on("pointerdown", this.handleFarmPointerDown, this);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.add.text(16, 16, "Farm Prototype", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "18px",
    });
    this.add.text(16, 40, "Click plots to till, plant, and water", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    });
    this.add.text(16, 58, "Press N to sleep and grow crops", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    });
    this.add.text(16, 76, "Stand by the gate and press E for village", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    });
    this.syncInventoryHud();
  }

  update(): void {
    if (!this.player || !this.cursors || !this.wasd) {
      return;
    }

    advanceClock(this.clock, 0.05);
    this.registry.set("day", this.clock.day);
    this.registry.set("time", formatClock(this.clock));
    this.registry.set("stamina", `${this.stamina.current}/${this.stamina.max}`);

    if (this.nextDayKey && Phaser.Input.Keyboard.JustDown(this.nextDayKey)) {
      advanceFarmDay(this.farmPlots);
      startNextDay(this.clock);
      this.refreshFarmGrid();
      this.registry.set("day", this.clock.day);
      this.registry.set("time", formatClock(this.clock));
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

  private createFarmGrid(): void {
    for (let y = 0; y < FARM_GRID_ROWS; y += 1) {
      for (let x = 0; x < FARM_GRID_COLUMNS; x += 1) {
        const plot = this.add.rectangle(
          FARM_PLOT_ORIGIN_X + x * FARM_PLOT_SIZE,
          FARM_PLOT_ORIGIN_Y + y * FARM_PLOT_SIZE,
          FARM_PLOT_SIZE - 2,
          FARM_PLOT_SIZE - 2,
          0x6c5b3b,
        );

        plot.setStrokeStyle(1, 0x2d2216);
        this.plotSprites.push(plot);
      }
    }

    this.refreshFarmGrid();
  }

  private createVillageGate(): void {
    this.villageGate = this.add.rectangle(168, 320, 28, 44, 0xc89b5b, 0.9);
    this.villageGate.setStrokeStyle(2, 0x5e3b1f);
    this.add.text(140, 348, "Village", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
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
      tillPlot(this.farmPlots, gridX, gridY);
    } else if (plot.stage === "tilled") {
      plantCrop(this.farmPlots, gridX, gridY, "radish");
    } else if (plot.stage === "growing") {
      waterPlot(this.farmPlots, gridX, gridY);
    } else if (plot.stage === "ready") {
      harvestPlot(this.farmPlots, this.inventory, gridX, gridY);
      this.syncInventoryHud();
    }

    this.refreshFarmGrid();
  }

  private refreshFarmGrid(): void {
    for (const plot of this.farmPlots.plots) {
      const sprite = this.plotSprites[plot.y * FARM_GRID_COLUMNS + plot.x];
      if (!sprite) {
        continue;
      }

      const fillColor =
        plot.stage === "ready"
          ? 0x86c06c
          : plot.stage === "growing"
            ? plot.watered
              ? 0x3f8f66
              : 0x5f9a4d
            : plot.stage === "tilled"
              ? 0x8b6b3f
              : 0x6c5b3b;

      sprite.setFillStyle(fillColor);
    }
  }

  private syncInventoryHud(): void {
    const summary = this.inventory.slots
      .filter((slot): slot is NonNullable<(typeof this.inventory.slots)[number]> => slot !== null)
      .map((slot) => `${slot.itemId} x${slot.count}`)
      .join(", ");

    this.registry.set("gold", this.wallet.gold);
    this.registry.set("inventory", summary ? `Inventory ${summary}` : "Inventory empty");
  }
}
