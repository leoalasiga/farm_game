export interface StaminaState {
  current: number;
  max: number;
}

export function createStamina(max: number): StaminaState {
  return {
    current: max,
    max,
  };
}

export function spendStamina(stamina: StaminaState, amount: number): boolean {
  if (amount > stamina.current) {
    return false;
  }

  stamina.current -= Math.max(0, amount);
  return true;
}

export function restoreStamina(stamina: StaminaState, amount: number): StaminaState {
  stamina.current = Math.min(stamina.max, stamina.current + Math.max(0, amount));
  return stamina;
}
