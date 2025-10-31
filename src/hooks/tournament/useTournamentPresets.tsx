import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { DefaultGameSettings } from 'types/GameSettings';
import Team from 'types/Team';
import { DefaultTournamentRules } from 'types/TournamentRules';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentTypeEnum } from 'types/TournamentType';
import { convertFromSecondsDayjs } from 'utils/dateUtils';
import { v4 } from 'uuid';

export interface IAddTournament {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  gameSettings: {
    longBreakTimeInSeconds: Dayjs;
    shortBreakTimeInSeconds: Dayjs;
    gameTimeInSeconds: Dayjs;
    manualGameStartTimeInSeconds: Dayjs;
    betweenGamePauseTimeInSeconds: Dayjs;
  };
  settings: TournamentSettings;
  teams: Team[];
}

const defaultGameSettings = {
  longBreakTimeInSeconds: convertFromSecondsDayjs(
    DefaultGameSettings.longBreakTimeInSeconds,
  ),
  shortBreakTimeInSeconds: convertFromSecondsDayjs(
    DefaultGameSettings.shortBreakTimeInSeconds,
  ),
  gameTimeInSeconds: convertFromSecondsDayjs(
    DefaultGameSettings.gameTimeInSeconds,
  ),
  manualGameStartTimeInSeconds: convertFromSecondsDayjs(
    DefaultGameSettings.manualGameStartTimeInSeconds,
  ),
  betweenGamePauseTimeInSeconds: convertFromSecondsDayjs(
    DefaultGameSettings.betweenGamePauseTimeInSeconds,
  ),
};

interface ITournamentPresets {
  id: string;
  name: string;
  preset: IAddTournament;
  tournamentName: string;
}

const useTournamentPresets = () => {
  const presets: ITournamentPresets[] = useMemo(() => {
    const TournamentDefaultSettings: IAddTournament = {
      name: `Renting - ${dayjs().format('DD.MM.YYYY - HH:mm')}`,
      startDate: dayjs(),
      endDate: dayjs().add(1, 'day'),
      gameSettings: defaultGameSettings,
      settings: {
        id: v4(),
        rules: DefaultTournamentRules,
        numberOfTeamSize: 3,
        firstStageType: {
          type: TournamentTypeEnum.roundRobin,
          settings: {
            numberOfWinsRequired: 2,
            firstPlaceNumberOfWinsRequired: 3,
            thirdPlaceNumberOfWinsRequired: 2,
          },
        },
        twoWinsDifference: false,
        switchGames: true,
        numberOfGroups: 1,
        secondStageType: {
          type: TournamentTypeEnum.singleElimination,
          settings: {
            numberOfWinsRequired: 2,
            firstPlaceNumberOfWinsRequired: 3,
            thirdPlaceNumberOfWinsRequired: 2,
          },
        },
        switchGroups: true,
        shouldInsertMatchMargins: true,
        pauseBetweenEachMatch: true,
      },
      teams: [],
    };
    const Renting2TeamsDefaultSettings: IAddTournament = {
      name: `Renting - ${dayjs().format('DD.MM.YYYY - HH:mm')}`,
      startDate: dayjs(),
      endDate: dayjs().add(1, 'day'),
      gameSettings: defaultGameSettings,
      settings: {
        id: v4(),
        rules: DefaultTournamentRules,
        numberOfTeamSize: 1,
        firstStageType: {
          type: TournamentTypeEnum.renting,
          settings: {
            numberOfWinsRequired: 2,
            firstPlaceNumberOfWinsRequired: 3,
            thirdPlaceNumberOfWinsRequired: 2,
          },
        },
        twoWinsDifference: false,
        switchGames: false,
        numberOfGroups: 1,
        secondStageType: undefined,
        switchGroups: false,
        shouldInsertMatchMargins: false,
        pauseBetweenEachMatch: true,
      },
      teams: [],
    };
    return [
      {
        id: 'renting2Teams',
        name: 'Rent 2 Teams',
        tournamentName: 'Renting',
        preset: Renting2TeamsDefaultSettings,
      },
      {
        id: 'tournament',
        name: 'Tournament',
        tournamentName: 'Tournament',
        preset: TournamentDefaultSettings,
      },
    ];
  }, []);
  return presets;
};

export default useTournamentPresets;
