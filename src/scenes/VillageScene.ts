import Phaser from "phaser";
import { type ItemId } from "../data/items";
import { mineUnlockCost } from "../data/shop";
import { buyItem, createWallet, sellItemFromInventory, type WalletState } from "../systems/economy/economy";
import { createInventory, removeItem, type InventoryState } from "../systems/inventory/inventory";
import { PLAYER_SPEED, createPlayerModel } from "../entities/Player";
import { completeObjective, createQuestState, type QuestState } from "../systems/quests/quests";
import { saveToStorage, type GameSaveData } from "../systems/save/save";
import {
  canAffordMaterialCost,
  createToolState,
  toolUpgradeCosts,
  upgradeTool,
  type ToolState,
} from "../systems/upgrades/upgrades";
import { getTransition } from "../systems/world/transitions";

export class VillageScene extends Phaser.Scene {
  private buyKey?: Phaser.Input.Keyboard.Key;
  private inventory!: InventoryState;
  private interactKey?: Phaser.Input.Keyboard.Key;
  private forestGate?: Phaser.GameObjects.Rectangle;
  private forgeKey?: Phaser.Input.Keyboard.Key;
  private forgeStation?: Phaser.GameObjects.Rectangle;
  private mineGate?: Phaser.GameObjects.Rectangle;
  private player?: Phaser.GameObjects.Rectangle;
  private questState!: QuestState;
  private saveKey?: Phaser.Input.Keyboard.Key;
  private sellKey?: Phaser.Input.Keyboard.Key;
  private toolState!: ToolState;
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
    this.questState = (this.registry.get("questState") as QuestState | undefined) ?? createQuestState();
    this.toolState = (this.registry.get("toolState") as ToolState | undefined) ?? createToolState();
    this.wallet = (this.registry.get("walletState") as WalletState | undefined) ?? createWallet();
    this.registry.set("inventoryState", this.inventory);
    this.registry.set("questState", this.questState);
    this.registry.set("toolState", this.toolState);
    this.registry.set("walletState", this.wallet);
    completeObjective(this.questState, "meet_shopkeeper");
    this.registry.set("questText", this.questState.currentObjectiveText);

    this.buyKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.forgeKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.U);
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
    this.add.text(48, 184, "Forest gate opens after tutorial tasks", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 208, "Stand by the forge and press U to unlock mine or upgrade axe", {
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
    this.forestGate = this.add.rectangle(440, 320, 32, 52, 0x4c8c4a, 0.95);
    this.forestGate.setStrokeStyle(2, 0x17311b);
    this.add.text(412, 352, "Forest", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    });
    this.mineGate = this.add.rectangle(620, 320, 32, 52, 0x6c5f76, 0.95);
    this.mineGate.setStrokeStyle(2, 0x1d1822);
    this.add.text(596, 352, "Mine", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    });
    this.forgeStation = this.add.rectangle(710, 220, 48, 36, 0xa0602d, 0.95);
    this.forgeStation.setStrokeStyle(2, 0x44220d);
    this.add.text(682, 252, "Forge", {
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
      const result = sellItemFromInventory(this.wallet, this.inventory, "radish", 1);
      if (result.ok) {
        completeObjective(this.questState, "sell_first_crop");
        this.registry.set("questState", this.questState);
        this.registry.set("questText", this.questState.currentObjectiveText);
      }
      this.syncHud();
    }

    if (this.saveKey && Phaser.Input.Keyboard.JustDown(this.saveKey)) {
      this.saveCurrentState("Saved in village");
    }

    if (
      this.forgeKey &&
      Phaser.Input.Keyboard.JustDown(this.forgeKey) &&
      this.player &&
      this.forgeStation
    ) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.forgeStation.x,
        this.forgeStation.y,
      );
      if (distance < 52) {
        this.tryForgeAction();
      }
    }

    if (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey) && this.player) {
      if (this.farmGate) {
        const farmDistance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.farmGate.x,
          this.farmGate.y,
        );
        if (farmDistance < 40) {
          const transition = getTransition("village_gate");
          this.scene.start(transition.targetScene, {
            transitionId: transition.targetTransitionId,
          });
          return;
        }
      }

      if (this.forestGate) {
        const forestDistance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.forestGate.x,
          this.forestGate.y,
        );
        if (forestDistance < 44) {
          if (this.questState.unlockedZones.includes("forest")) {
            this.scene.start("ForestScene");
          } else {
            this.registry.set("saveStatus", "Forest gate is still locked");
          }
        }
      }

      if (this.mineGate) {
        const mineDistance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.mineGate.x,
          this.mineGate.y,
        );
        if (mineDistance < 44) {
          if (this.questState.unlockedZones.includes("mine")) {
            this.scene.start("MineScene");
          } else {
            this.registry.set("saveStatus", "Mine is still sealed");
          }
        }
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
    this.registry.set("questText", this.questState.currentObjectiveText);
    this.registry.set(
      "toolStatus",
      `Axe Lv${this.toolState.axe.level} | Pickaxe Lv${this.toolState.pickaxe.level}`,
    );
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
      questState: {
        completedObjectives: [...this.questState.completedObjectives],
        currentObjectiveText: this.questState.currentObjectiveText,
        unlockedZones: [...this.questState.unlockedZones],
      },
      timeMinutes: 0,
      toolState: {
        axe: { ...this.toolState.axe },
        pickaxe: { ...this.toolState.pickaxe },
      },
    };

    saveToStorage(saveData);
    this.registry.set("saveData", saveData);
    this.registry.set("saveStatus", status);
  }

  private tryForgeAction(): void {
    if (!this.questState.unlockedZones.includes("mine")) {
      if (this.tryPayMaterialCost(mineUnlockCost)) {
        this.questState.unlockedZones.push("mine");
        this.registry.set("saveStatus", "Mine unlocked");
      } else {
        this.registry.set("saveStatus", "Need 12 wood and 8 stone to unlock mine");
      }
      this.registry.set("questState", this.questState);
      this.syncHud();
      return;
    }

    if (this.toolState.axe.level === 1) {
      const axeUpgradeCost = toolUpgradeCosts.axe;
      if (this.tryPayMaterialCost(axeUpgradeCost) && upgradeTool(this.toolState, "axe", axeUpgradeCost)) {
        this.registry.set("saveStatus", "Axe upgraded to level 2");
      } else {
        this.registry.set("saveStatus", "Need 10 wood and 5 copper ore to upgrade axe");
      }
      this.registry.set("toolState", this.toolState);
      this.syncHud();
      return;
    }

    this.registry.set("saveStatus", "Forge has nothing new yet");
  }

  private tryPayMaterialCost(cost: Partial<Record<keyof typeof mineUnlockCost | "copper_ore", number>>): boolean {
    const payment = Object.fromEntries(
      this.inventory.slots
        .filter((slot): slot is NonNullable<(typeof this.inventory.slots)[number]> => slot !== null)
        .map((slot) => [slot.itemId, slot.count]),
    );

    if (!canAffordMaterialCost(payment, cost)) {
      return false;
    }

    for (const [itemId, amount] of Object.entries(cost)) {
      removeItem(this.inventory, itemId as ItemId, amount ?? 0);
    }

    return true;
  }
}
