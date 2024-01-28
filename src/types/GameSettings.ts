import { v4 } from 'uuid';

export interface GameSettings {
  id: string;
  longBreakTimeInSeconds: number;
  shortBreakTimeInSeconds: number;
  gameTimeInSeconds: number;
  // todo rokpoto handle this
  betweenGamePauseTimeInSeconds: number;
  manualGameStartTimeInSeconds: number;
}

export const DefaultGameSettings: GameSettings = {
  id: v4(),
  gameTimeInSeconds: 5 * 60,
  longBreakTimeInSeconds: 1 * 60,
  shortBreakTimeInSeconds: 30,
  betweenGamePauseTimeInSeconds: 30,
  manualGameStartTimeInSeconds: 30,
};
