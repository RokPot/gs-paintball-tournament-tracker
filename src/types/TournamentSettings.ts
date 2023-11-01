import { v4 } from 'uuid';

export interface TournamentSettings {
  id: string;
  numberOfWinsRequired: number;
  twoWinsDifference: boolean;
  switchGroups: boolean;
  switchGames: boolean;
}

export const DefaultTournamentSettings: TournamentSettings = {
  id: v4(),
  numberOfWinsRequired: 2,
  twoWinsDifference: false,
  switchGroups: false,
  switchGames: false,
};
