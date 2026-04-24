export interface PlayerModel {
  x: number;
  y: number;
  speed: number;
}

export interface CreatePlayerInput {
  x: number;
  y: number;
}

export const PLAYER_SPEED = 160;

export function createPlayerModel(input: CreatePlayerInput): PlayerModel {
  return {
    x: input.x,
    y: input.y,
    speed: PLAYER_SPEED,
  };
}
