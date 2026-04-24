import { describe, expect, it } from "vitest";
import { createPlayerModel } from "../../src/entities/Player";

describe("createPlayerModel", () => {
  it("starts with a valid position and speed", () => {
    const player = createPlayerModel({ x: 32, y: 32 });
    expect(player.x).toBe(32);
    expect(player.y).toBe(32);
    expect(player.speed).toBeGreaterThan(0);
  });
});
