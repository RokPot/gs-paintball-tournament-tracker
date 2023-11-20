import { TournamentType } from './TournamentType';
import { v4 } from 'uuid';

export interface TournamentSettings {
  id: string;
  numberOfWinsRequired: number;
  twoWinsDifference: boolean;
  switchGroups: boolean;
  switchGames: boolean;
  numberOfGroups: number;
  type: TournamentType;
  secondStageType?: TournamentType;
  numberOfTeamSize: number;
}

export const DefaultTournamentSettings: TournamentSettings = {
  id: v4(),
  numberOfWinsRequired: 2,
  twoWinsDifference: false,
  switchGroups: false,
  switchGames: false,
  numberOfGroups: 1,
  type: TournamentType.roundRobin,
  secondStageType: TournamentType.singleElimination,
  numberOfTeamSize: 3,
};
