import Phaser from "phaser";
import { buyItem, createWallet, sellItemFromInventory, type WalletState } from "../systems/economy/economy";
import { createInventory, type InventoryState } from "../systems/inventory/inventory";
import { PLAYER_SPEED, createPlayerModel } from "../entities/Player";
import { saveToStorage, type GameSaveData } from "../systems/save/save";
import { getTransition } from "../systems/world/transitions";

export class VillageScene extends Phaser.Scene {
  private buyKey?: Phaser.Input.Keyboard.Key;
  private inventory!: InventoryState;
  private interactKey?: Phaser.Input.Keyboard.Key;
  private player?: Phaser.GameObjects.Rectangle;
  private saveKey?: Phaser.Input.Keyboard.Key;
  private sellKey?: Phaser.Input.Keyboard.Key;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wallet!: WalletState;
  private wasd?: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private farmGate?: Phaser.GameObjects.Rectangle;

  constructor() {
    super("VillageScene");
  }

  create(): void {
    const sceneData = this.scene.settings.data as { transitionId?: string } | undefined;
    const entryTransitionId = sceneData?.transitionId ?? "farm_gate";
    const spawn = getTransition(entryTransitionId).spawn;
    const playerModel = createPlayerModel({ x: spawn.x, y: spawn.y });

    this.cameras.main.setBackgroundColor("#4d5d76");
    this.physics.world.setBounds(0, 0, 960, 540);
    this.cameras.main.setBounds(0, 0, 960, 540);

    this.inventory = (this.registry.get("inventoryState") as InventoryState | undefined) ?? createInventory(8);
    this.wallet = (this.registry.get("walletState") as WalletState | undefined) ?? createWallet();
    this.registry.set("inventoryState", this.inventory);
    this.registry.set("walletState", this.wallet);

    this.buyKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.interactKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.saveKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.sellKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys("W,A,S,D") as Record<
      "W" | "A" | "S" | "D",
      Phaser.Input.Keyboard.Key
    >;

    this.player = this.add.rectangle(playerModel.x, playerModel.y, 14, 14, 0xf7f3c8);
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.add.text(48, 48, "Village Shop", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "24px",
    });
    this.add.text(48, 88, "Press B to buy 1 radish seed (3g)", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 112, "Press S to sell 1 radish (5g)", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 136, "Stand by the gate and press E for farm", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 160, "Press K to save", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });

    this.farmGate = this.add.rectangle(248, 320, 28, 44, 0xc89b5b, 0.9);
    this.farmGate.setStrokeStyle(2, 0x5e3b1f);
    this.add.text(222, 348, "Farm", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    });

    this.syncHud();
  }

  update(): void {
    if (this.player && this.cursors && this.wasd) {
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

    if (this.buyKey && Phaser.Input.Keyboard.JustDown(this.buyKey)) {
      buyItem(this.wallet, this.inventory, "radish_seed", 1);
      this.syncHud();
    }

    if (this.sellKey && Phaser.Input.Keyboard.JustDown(this.sellKey)) {
      sellItemFromInventory(this.wallet, this.inventory, "radish", 1);
      this.syncHud();
    }

    if (this.saveKey && Phaser.Input.Keyboard.JustDown(this.saveKey)) {
      this.saveCurrentState("Saved in village");
    }

    if (
      this.interactKey &&
      Phaser.Input.Keyboard.JustDown(this.interactKey) &&
      this.player &&
      this.farmGate
    ) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.farmGate.x,
        this.farmGate.y,
      );
      if (distance < 40) {
        const transition = getTransition("village_gate");
        this.scene.start(transition.targetScene, {
          transitionId: transition.targetTransitionId,
        });
      }
    }
  }

  private syncHud(): void {
    const summary = this.inventory.slots
      .filter((slot): slot is NonNullable<(typeof this.inventory.slots)[number]> => slot !== null)
      .map((slot) => `${slot.itemId} x${slot.count}`)
      .join(", ");

    this.registry.set("gold", this.wallet.gold);
    this.registry.set("inventory", summary ? `Inventory ${summary}` : "Inventory empty");
  }

  private saveCurrentState(status: string): void {
    const farmPlots = this.registry.get("farmPlotsState") as GameSaveData["farmPlots"] | undefined;
    const farmPlayerPosition = this.registry.get("farmPlayerPosition") as
      | GameSaveData["playerPosition"]
      | undefined;
    const saveData: GameSaveData = {
      day: this.registry.get("day") ?? 1,
      farmPlots: farmPlots
        ? {
            height: farmPlots.height,
            plots: farmPlots.plots.map((plot) => ({ ...plot })),
            width: farmPlots.width,
          }
        : undefined,
      gold: this.wallet.gold,
      inventory: this.inventory.slots.map((slot) => (slot ? { ...slot } : null)),
      playerPosition: farmPlayerPosition,
      timeMinutes: 0,
    };

    saveToStorage(saveData);
    this.registry.set("saveData", saveData);
    this.registry.set("saveStatus", status);
  }
}
