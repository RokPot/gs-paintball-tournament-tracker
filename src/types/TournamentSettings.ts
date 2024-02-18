import { v4 } from 'uuid';
import { TournamentType } from './TournamentType';
import { DefaultTournamentRules, TournamentRules } from './TournamentRules';

export interface TournamentSettings {
  id: string;
  numberOfWinsRequired: number;
  numberOfTeamSize: number;
  twoWinsDifference: boolean;
  switchGroups: boolean;
  switchGames: boolean;
  numberOfGroups: number;
  type: TournamentType;
  secondStageType?: TournamentType;
  shouldInsertMatchMargins: boolean;
  pauseBetweenEachMatch: boolean;

  rules: TournamentRules;
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
  shouldInsertMatchMargins: true,
  pauseBetweenEachMatch: true,
  rules: DefaultTournamentRules,
};
