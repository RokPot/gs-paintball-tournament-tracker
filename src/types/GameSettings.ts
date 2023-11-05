import dayjs, { Dayjs } from 'dayjs';
import { v4 } from 'uuid';

export interface GameSettings {
  id: string;
  longBreakTimeInSeconds: Dayjs;
  shortBreakTimeInSeconds: Dayjs;
  gameTimeInSeconds: Dayjs;
}

export const DefaultGameSettings: GameSettings = {
  id: v4(),
  gameTimeInSeconds: dayjs().minute(5).second(0),
  longBreakTimeInSeconds: dayjs().minute(1).second(0),
  shortBreakTimeInSeconds: dayjs().minute(0).second(30),
};
