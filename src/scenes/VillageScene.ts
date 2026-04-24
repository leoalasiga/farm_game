import Phaser from "phaser";
import { cropData, type CropId } from "../data/crops";
import { type ItemId } from "../data/items";
import { itemData } from "../data/items";
import { mineUnlockCost } from "../data/shop";
import { PLAYER_SPEED, createPlayerModel } from "../entities/Player";
import {
  buyItem,
  createWallet,
  sellItemFromInventory,
  type WalletState,
} from "../systems/economy/economy";
import {
  createSeedSelection,
  getSelectedSeedItemId,
  selectCropBySlot,
  type SeedSelectionState,
} from "../systems/farming/seedSelection";
import { createInventory, removeItem, type InventoryState } from "../systems/inventory/inventory";
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
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private farmGate?: Phaser.GameObjects.Rectangle;
  private forestGate?: Phaser.GameObjects.Rectangle;
  private forgeKey?: Phaser.Input.Keyboard.Key;
  private forgeStation?: Phaser.GameObjects.Rectangle;
  private interactKey?: Phaser.Input.Keyboard.Key;
  private inventory!: InventoryState;
  private mineGate?: Phaser.GameObjects.Rectangle;
  private player?: Phaser.GameObjects.Rectangle;
  private questState!: QuestState;
  private saveKey?: Phaser.Input.Keyboard.Key;
  private seedHotkeys?: Phaser.Input.Keyboard.Key[];
  private seedSelection: SeedSelectionState = createSeedSelection();
  private sellKey?: Phaser.Input.Keyboard.Key;
  private toolState!: ToolState;
  private wallet!: WalletState;
  private wasd?: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;

  constructor() {
    super("VillageScene");
  }

  create(): void {
    const sceneData = this.scene.settings.data as { transitionId?: string } | undefined;
    const entryTransitionId = sceneData?.transitionId ?? "farm_gate";
    const spawn = getTransition(entryTransitionId).spawn;
    const playerModel = createPlayerModel({ x: spawn.x, y: spawn.y });

    this.cameras.main.setBackgroundColor("#6d7f96");
    this.physics.world.setBounds(0, 0, 960, 540);
    this.cameras.main.setBounds(0, 0, 960, 540);

    this.inventory = (this.registry.get("inventoryState") as InventoryState | undefined) ?? createInventory(8);
    this.questState = (this.registry.get("questState") as QuestState | undefined) ?? createQuestState();
    this.toolState = (this.registry.get("toolState") as ToolState | undefined) ?? createToolState();
    this.wallet = (this.registry.get("walletState") as WalletState | undefined) ?? createWallet();
    this.seedSelection = createSeedSelection(
      (this.registry.get("selectedCropId") as CropId | undefined) ?? "radish",
    );

    this.registry.set("inventoryState", this.inventory);
    this.registry.set("questState", this.questState);
    this.registry.set("selectedCropId", this.seedSelection.selectedCropId);
    this.registry.set("toolState", this.toolState);
    this.registry.set("walletState", this.wallet);

    completeObjective(this.questState, "meet_shopkeeper");
    this.registry.set("questText", this.questState.currentObjectiveText);

    this.buyKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.forgeKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    this.interactKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.saveKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.sellKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.seedHotkeys = [
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
    ].filter((key): key is Phaser.Input.Keyboard.Key => Boolean(key));
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

    this.add.text(48, 48, "村庄商店", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "24px",
    });
    this.add.text(48, 88, "1 萝卜：种子 3g / 卖出 5g", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 112, "2 土豆：种子 5g / 卖出 9g", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 136, "3 蓝莓：种子 8g / 卖出 14g", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 160, "按 B 买当前种子，按 S 卖当前作物", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 184, "走到门边按 E 返回农场，按 K 保存游戏", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 208, "完成新手任务后，森林大门会打开", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });
    this.add.text(48, 232, "走到锻造台边按 U，可以解锁矿洞或升级斧头", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });

    this.farmGate = this.add.rectangle(248, 320, 28, 44, 0xe1b975, 0.95);
    this.farmGate.setStrokeStyle(2, 0x7d5225);
    this.add.text(222, 348, "农场", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    });
    this.forestGate = this.add.rectangle(440, 320, 32, 52, 0x76b971, 0.95);
    this.forestGate.setStrokeStyle(2, 0x27562c);
    this.add.text(412, 352, "森林", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    });
    this.mineGate = this.add.rectangle(620, 320, 32, 52, 0x8f82a1, 0.95);
    this.mineGate.setStrokeStyle(2, 0x2d2636);
    this.add.text(596, 352, "矿洞", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "14px",
    });
    this.forgeStation = this.add.rectangle(710, 220, 48, 36, 0xb6783d, 0.95);
    this.forgeStation.setStrokeStyle(2, 0x5a2f11);
    this.add.text(682, 252, "锻造台", {
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

    this.handleSeedHotkeys();

    if (this.buyKey && Phaser.Input.Keyboard.JustDown(this.buyKey)) {
      const selectedSeedItemId = getSelectedSeedItemId(this.seedSelection);
      const selectedCrop = this.seedSelection.selectedCropId;
      const result = buyItem(this.wallet, this.inventory, selectedSeedItemId, 1);
      this.registry.set(
        "saveStatus",
        result.ok
          ? `买下了1个${itemData[selectedSeedItemId].name}`
          : `金币不够，买不起${cropData[selectedCrop].name}种子`,
      );
      this.syncHud();
    }

    if (this.sellKey && Phaser.Input.Keyboard.JustDown(this.sellKey)) {
      const selectedCrop = this.seedSelection.selectedCropId;
      const result = sellItemFromInventory(this.wallet, this.inventory, selectedCrop, 1);
      if (result.ok) {
        completeObjective(this.questState, "sell_first_crop");
        this.registry.set("questState", this.questState);
        this.registry.set("questText", this.questState.currentObjectiveText);
        this.registry.set("saveStatus", `卖出了1个${cropData[selectedCrop].name}`);
      } else {
        this.registry.set("saveStatus", `背包里没有可卖的${cropData[selectedCrop].name}`);
      }
      this.syncHud();
    }

    if (this.saveKey && Phaser.Input.Keyboard.JustDown(this.saveKey)) {
      this.saveCurrentState("已在村庄保存");
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
            this.registry.set("saveStatus", "森林大门还没有打开");
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
            this.registry.set("saveStatus", "矿洞还没有开启");
          }
        }
      }
    }
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
        this.registry.set("saveStatus", `当前交易作物切换为${cropData[this.seedSelection.selectedCropId].name}`);
        this.syncHud();
      }
    });
  }

  private syncHud(): void {
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
    this.registry.set("questText", this.questState.currentObjectiveText);
    this.registry.set(
      "selectedSeed",
      `当前种子：${itemData[selectedSeedItemId].name} x${selectedSeedCount}`,
    );
    this.registry.set(
      "toolStatus",
      `斧头 Lv${this.toolState.axe.level} | 镐子 Lv${this.toolState.pickaxe.level}`,
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
      selectedCropId: this.seedSelection.selectedCropId,
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
        this.registry.set("saveStatus", "矿洞已经解锁");
      } else {
        this.registry.set("saveStatus", "需要 12 个木头和 8 个石头才能解锁矿洞");
      }
      this.registry.set("questState", this.questState);
      this.syncHud();
      return;
    }

    if (this.toolState.axe.level === 1) {
      const axeUpgradeCost = toolUpgradeCosts.axe;
      if (this.tryPayMaterialCost(axeUpgradeCost) && upgradeTool(this.toolState, "axe", axeUpgradeCost)) {
        this.registry.set("saveStatus", "斧头已经升级到 2 级");
      } else {
        this.registry.set("saveStatus", "需要 10 个木头和 5 个铜矿石才能升级斧头");
      }
      this.registry.set("toolState", this.toolState);
      this.syncHud();
      return;
    }

    this.registry.set("saveStatus", "锻造台暂时没有新的内容");
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
