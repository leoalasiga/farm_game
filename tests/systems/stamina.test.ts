import { describe, expect, it } from "vitest";
import {
  createStamina,
  restoreStamina,
  spendStamina,
} from "../../src/systems/stamina/stamina";

describe("stamina", () => {
  it("spends and restores stamina within bounds", () => {
    const stamina = createStamina(100);
    expect(spendStamina(stamina, 30)).toBe(true);
    expect(stamina.current).toBe(70);
    restoreStamina(stamina, 50);
    expect(stamina.current).toBe(100);
  });
});
