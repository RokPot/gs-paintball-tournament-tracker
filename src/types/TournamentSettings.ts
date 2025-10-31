import { v4 } from 'uuid';
import { DefaultTournamentRules, TournamentRules } from './TournamentRules';
import { TournamentType, TournamentTypeEnum } from './TournamentType';

export interface TournamentSettings {
  id: string;
  numberOfTeamSize: number;
  twoWinsDifference: boolean;
  switchGroups: boolean;
  switchGames: boolean;
  numberOfGroups: number;
  firstStageType: TournamentType;
  secondStageType?: TournamentType;
  shouldInsertMatchMargins: boolean;
  pauseBetweenEachMatch: boolean;

  rules: TournamentRules;
}

export const DefaultTournamentSettings: TournamentSettings = {
  id: v4(),

  twoWinsDifference: false,
  switchGroups: false,
  switchGames: false,
  numberOfGroups: 1,
  firstStageType: {
    type: TournamentTypeEnum.roundRobin,
    settings: {
      numberOfWinsRequired: 2,
      firstPlaceNumberOfWinsRequired: 2,
      thirdPlaceNumberOfWinsRequired: 2,
    },
  },
  secondStageType: {
    type: TournamentTypeEnum.singleElimination,
    settings: {
      numberOfWinsRequired: 2,
      firstPlaceNumberOfWinsRequired: 3,
      thirdPlaceNumberOfWinsRequired: 2,
    },
  },
  numberOfTeamSize: 3,
  shouldInsertMatchMargins: true,
  pauseBetweenEachMatch: true,
  rules: DefaultTournamentRules,
};
