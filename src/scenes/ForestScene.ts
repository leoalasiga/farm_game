import Phaser from "phaser";
import { PLAYER_SPEED, createPlayerModel } from "../entities/Player";
import { resourceNodeData, type ResourceNodeId } from "../data/resources";
import { gatherNode } from "../systems/gathering/gathering";
import { createInventory, type InventoryState, addItem } from "../systems/inventory/inventory";
import { createStamina, spendStamina, type StaminaState } from "../systems/stamina/stamina";

interface ForestNodeSprite {
  id: ResourceNodeId;
  sprite: Phaser.GameObjects.Rectangle;
}

export class ForestScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private gatherKey?: Phaser.Input.Keyboard.Key;
  private inventory!: InventoryState;
  private nodes: ForestNodeSprite[] = [];
  private player?: Phaser.GameObjects.Rectangle;
  private stamina!: StaminaState;
  private wasd?: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;

  constructor() {
    super("ForestScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#24462c");
    this.physics.world.setBounds(0, 0, 960, 540);
    this.cameras.main.setBounds(0, 0, 960, 540);

    this.inventory = (this.registry.get("inventoryState") as InventoryState | undefined) ?? createInventory(8);
    this.stamina = (this.registry.get("staminaState") as StaminaState | undefined) ?? createStamina(100);
    this.registry.set("inventoryState", this.inventory);
    this.registry.set("staminaState", this.stamina);

    const playerModel = createPlayerModel({ x: 140, y: 300 });
    this.player = this.add.rectangle(playerModel.x, playerModel.y, 14, 14, 0xf7f3c8);
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.gatherKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.wasd = this.input.keyboard?.addKeys("W,A,S,D") as Record<
      "W" | "A" | "S" | "D",
      Phaser.Input.Keyboard.Key
    >;

    this.add.text(48, 48, "Forest", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "24px",
    });
    this.add.text(48, 80, "Walk to a node and press E to gather", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "16px",
    });

    this.createNode("tree", 280, 220, 32, 56);
    this.createNode("bush", 420, 300, 28, 28);
    this.createNode("stone", 600, 240, 30, 30);
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

    if (this.gatherKey && Phaser.Input.Keyboard.JustDown(this.gatherKey)) {
      this.tryGatherNearestNode();
    }
  }

  private createNode(
    id: ResourceNodeId,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    const definition = resourceNodeData[id];
    const sprite = this.add.rectangle(x, y, width, height, definition.color, 0.95);
    sprite.setStrokeStyle(2, 0x18201a);
    this.add.text(x - width / 2, y + height / 2 + 8, definition.label, {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "12px",
    });
    this.nodes.push({ id, sprite });
  }

  private syncHud(): void {
    const summary = this.inventory.slots
      .filter((slot): slot is NonNullable<(typeof this.inventory.slots)[number]> => slot !== null)
      .map((slot) => `${slot.itemId} x${slot.count}`)
      .join(", ");

    this.registry.set("inventory", summary ? `Inventory ${summary}` : "Inventory empty");
    this.registry.set("stamina", `${this.stamina.current}/${this.stamina.max}`);
  }

  private tryGatherNearestNode(): void {
    if (!this.player) {
      return;
    }

    const nearestNode = this.nodes.find(({ sprite }) => {
      const distance = Phaser.Math.Distance.Between(this.player!.x, this.player!.y, sprite.x, sprite.y);
      return distance < 60;
    });

    if (!nearestNode) {
      return;
    }

    const result = gatherNode(nearestNode.id);
    if (!spendStamina(this.stamina, result.staminaCost)) {
      this.registry.set("saveStatus", "Too tired to gather");
      return;
    }

    for (const drop of result.drops) {
      addItem(this.inventory, drop.itemId, drop.count);
    }

    this.registry.set("saveStatus", `Gathered ${result.drops.map((drop) => `${drop.itemId} x${drop.count}`).join(", ")}`);
    this.syncHud();
  }
}
