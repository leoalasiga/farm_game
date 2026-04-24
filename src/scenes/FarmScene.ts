import Phaser from "phaser";
import farmMap from "../maps/farm.json";
import { PLAYER_SPEED, createPlayerModel } from "../entities/Player";

export class FarmScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private player?: Phaser.GameObjects.Rectangle;

  constructor() {
    super("FarmScene");
  }

  create(): void {
    const mapWidth = farmMap.width * farmMap.tilewidth;
    const mapHeight = farmMap.height * farmMap.tileheight;
    const playerModel = createPlayerModel({ x: 64, y: 64 });

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

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.add.text(16, 16, "Farm Prototype", {
      color: "#f7f3c8",
      fontFamily: "monospace",
      fontSize: "18px",
    });
  }

  update(): void {
    if (!this.player || !this.cursors || !this.wasd) {
      return;
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
}
