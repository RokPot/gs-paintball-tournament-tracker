import { BracketProperties } from 'types/BracketProperties';
import Game from 'types/Game';
import { DefaultGameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import { Match } from 'types/Match';
import MatchState from 'types/MatchState';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import {
  DefaultTournamentSettings,
  TournamentSettings,
} from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentType, TournamentTypeEnum } from 'types/TournamentType';
import { generateTournamentSchedule } from 'utils/tournamentUtils';

interface GenerateStage1Tournament {
  numberOfGroups: number;
  teams: Team[][];
  games: Game[][];
  tournamentSettings: TournamentSettings;
  tournament?: Tournament;
}

interface GenerateGameProps {
  index: number;
  team1: Team;
  team2: Team;
  gameState: GameState;
  gameWinner: GameWinner;
  gameTime?: number;
  team1Wins?: number;
  team2Wins?: number;
  matches?: Match[];
  bracketProperties?: BracketProperties | null;
}
interface GenerateMatchProps {
  index: number;
  matchState: MatchState;
  team1Margin: number;

  team2Margin: number;

  matchDurationInSeconds: number;
}

export namespace TestUtils {
  export const generateGame = ({
    index,
    team1,
    team2,
    gameState = GameState.created,
    gameTime = 300,
    gameWinner = GameWinner.notYet,
    team1Wins = 0,
    team2Wins = 0,
    matches = [],
    bracketProperties = null,
  }: GenerateGameProps) => {
    return new Game(
      new Game({
        _id: `G${index}`,
        bracketProperties,
        gameState,
        gameTime,
        id: `G${index}`,
        matches,
        team1,
        team2,
        gameWinner,
        team1Wins,
        team2Wins,
      }),
    );
  };

  export const generateMatch = ({
    index,
    matchState,
    team1Margin,
    team2Margin,
    matchDurationInSeconds = 0,
  }: GenerateMatchProps) => {
    return {
      id: `M${index}`,
      matchState,
      team1Margin,
      team2Margin,
      matchDurationInSeconds,
    } satisfies Match;
  };

  export const generateTournamentGroup = (
    index: number,
    games: Game[],
    teams: Team[],
    tournamentType: TournamentType = {
      type: TournamentTypeEnum.roundRobin,
      settings: {
        numberOfWinsRequired: 2,
        firstPlaceNumberOfWinsRequired: 2,
        thirdPlaceNumberOfWinsRequired: 2,
      },
    },
  ) => {
    return new TournamentGroup({
      _id: `TG${index}`,
      id: `TG${index}`,
      games,
      groupIndex: index,
      groupType: tournamentType,
      stage: 1,
      teams,
    });
  };

  export const generateTeam = (index: number) => {
    return new Team({
      _id: `T${index}`,
      id: `T${index}`,
      teamName: `team${index}`,
      teamTag: `T${index}`,
      draw: 0,
      loses: 0,
      wins: 0,
    });
  };

  export const generateTournamentStage = (
    index: number,
    groups: TournamentGroup[],
    schedule: TournamentScheduleGame[],
    stage: number,
    stageType: TournamentType,
  ) => {
    return new TournamentStage({
      _id: `stage${index}`,
      id: `stage${index}`,
      groups,
      schedule,
      stage,
      stageGamesType: stageType,
    });
  };

  export const generateTournament = (
    index: number,
    stages: TournamentStage[],
    teams: Team[],
    settings?: TournamentSettings,
  ) => {
    return new Tournament({
      _id: `tournament${index}`,
      id: `tournament${index}`,
      name: `tournament${index}`,
      state: {
        id: 'state1',
        isGameInProgress: false,
        isTournamentFinished: false,
        stage: 1,
        status: TournamentStatus.created,
      },
      gameSettings: DefaultGameSettings,
      stages,
      settings: settings || DefaultTournamentSettings,

      teams,
    });
  };

  export const generateStage1Tournament = ({
    teams,
    numberOfGroups = 1,
    games,
    tournamentSettings = DefaultTournamentSettings,
  }: GenerateStage1Tournament) => {
    const groups: TournamentGroup[] = [];
    for (let i = 0; i < numberOfGroups; i += 1) {
      groups.push(
        TestUtils.generateTournamentGroup(
          i + 1,
          games[i],
          teams[i],
          tournamentSettings.firstStageType,
        ),
      );
    }
    const stage1ScheduledGames = generateTournamentSchedule(
      groups,
      tournamentSettings,
      tournamentSettings.firstStageType,
    );
    const firstStage = TestUtils.generateTournamentStage(
      1,
      groups,
      stage1ScheduledGames,
      1,
      tournamentSettings.firstStageType,
    );
    return TestUtils.generateTournament(
      1,
      [firstStage],
      teams.flatMap((flatTeams) => flatTeams),
      tournamentSettings,
    );
  };

  export const generateStage2Tournament = ({
    tournament,
    teams,
    numberOfGroups = 1,
    games,
    tournamentSettings = DefaultTournamentSettings,
  }: GenerateStage1Tournament) => {
    const groups: TournamentGroup[] = [];
    for (let i = 0; i < numberOfGroups; i += 1) {
      groups.push(
        TestUtils.generateTournamentGroup(
          i + 1,
          games[i],
          teams[i],
          tournamentSettings.secondStageType,
        ),
      );
    }
    const stage1ScheduledGames = generateTournamentSchedule(
      groups,
      tournamentSettings,
      tournamentSettings.firstStageType,
    );
    const secondStage = TestUtils.generateTournamentStage(
      1,
      groups,
      stage1ScheduledGames,
      2,
      tournamentSettings.secondStageType!,
    );
    if (tournament) {
      tournament.stages?.push(secondStage);
    }
  };
}
export const team1 = TestUtils.generateTeam(1);
export const team2 = TestUtils.generateTeam(2);
export const team3 = TestUtils.generateTeam(3);
export const team4 = TestUtils.generateTeam(4);
export const team5 = TestUtils.generateTeam(5);
export const team6 = TestUtils.generateTeam(6);
export const team7 = TestUtils.generateTeam(7);
export const team8 = TestUtils.generateTeam(8);
export const team9 = TestUtils.generateTeam(9);
export const team10 = TestUtils.generateTeam(10);
