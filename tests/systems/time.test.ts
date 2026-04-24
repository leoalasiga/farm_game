import { describe, expect, it } from "vitest";
import { advanceClock, createClock } from "../../src/systems/time/time";

describe("clock", () => {
  it("advances time until day end", () => {
    const clock = createClock();
    advanceClock(clock, clock.dayLengthMinutes);
    expect(clock.isNight).toBe(true);
  });
});
