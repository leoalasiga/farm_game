export interface ClockState {
  currentMinutes: number;
  day: number;
  dayLengthMinutes: number;
  isNight: boolean;
  startHour: number;
}

const DEFAULT_DAY_LENGTH_MINUTES = 14 * 60;
const DEFAULT_START_HOUR = 6;

export function createClock(): ClockState {
  return {
    currentMinutes: 0,
    day: 1,
    dayLengthMinutes: DEFAULT_DAY_LENGTH_MINUTES,
    isNight: false,
    startHour: DEFAULT_START_HOUR,
  };
}

export function advanceClock(clock: ClockState, minutes: number): ClockState {
  const nextMinutes = Math.min(
    clock.dayLengthMinutes,
    clock.currentMinutes + Math.max(0, minutes),
  );

  clock.currentMinutes = nextMinutes;
  clock.isNight = clock.currentMinutes >= clock.dayLengthMinutes;
  return clock;
}

export function startNextDay(clock: ClockState): ClockState {
  clock.day += 1;
  clock.currentMinutes = 0;
  clock.isNight = false;
  return clock;
}

export function formatClock(clock: ClockState): string {
  const totalMinutes = clock.startHour * 60 + Math.floor(clock.currentMinutes);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
