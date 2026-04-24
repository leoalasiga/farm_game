import Phaser from "phaser";
import { buyItem, createWallet, sellItemFromInventory, type WalletState } from "../systems/economy/economy";
import { createInventory, type InventoryState } from "../systems/inventory/inventory";

export class VillageScene extends Phaser.Scene {
  private buyKey?: Phaser.Input.Keyboard.Key;
  private inventory!: InventoryState;
  private sellKey?: Phaser.Input.Keyboard.Key;
  private wallet!: WalletState;

  constructor() {
    super("VillageScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#4d5d76");

    this.inventory = (this.registry.get("inventoryState") as InventoryState | undefined) ?? createInventory(8);
    this.wallet = (this.registry.get("walletState") as WalletState | undefined) ?? createWallet();
    this.registry.set("inventoryState", this.inventory);
    this.registry.set("walletState", this.wallet);

    this.buyKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.sellKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);

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

    this.syncHud();
  }

  update(): void {
    if (this.buyKey && Phaser.Input.Keyboard.JustDown(this.buyKey)) {
      buyItem(this.wallet, this.inventory, "radish_seed", 1);
      this.syncHud();
    }

    if (this.sellKey && Phaser.Input.Keyboard.JustDown(this.sellKey)) {
      sellItemFromInventory(this.wallet, this.inventory, "radish", 1);
      this.syncHud();
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
}
