import { v4 } from 'uuid';

export interface GameSettings {
  id: string;
  longBreakTimeInSeconds: number;
  shortBreakTimeInSeconds: number;
  gameTimeInSeconds: number;
}

export const DefaultGameSettings: GameSettings = {
  id: v4(),
  gameTimeInSeconds: 5 * 60,
  longBreakTimeInSeconds: 1 * 60,
  shortBreakTimeInSeconds: 30,
};
