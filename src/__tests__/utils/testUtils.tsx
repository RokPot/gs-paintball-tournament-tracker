import Game from 'types/Game';
import { DefaultGameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import { Match } from 'types/Match';
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
import { TournamentType } from 'types/TournamentType';
import { generateTournamentSchedule } from 'utils/tournamentUtils';

interface GenerateStage1Tournament {
  numberOfGroups: number;
  teams: Team[][];
  games: Game[][];
  tournamentSettings: TournamentSettings;
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
  }: GenerateGameProps) => {
    return new Game(
      new Game({
        _id: `G${index}`,
        bracketProperties: null,
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

  export const generateTournamentGroup = (
    index: number,
    games: Game[],
    teams: Team[],
    tournamentType: TournamentType = TournamentType.roundRobin,
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
  ) => {
    return new TournamentStage({
      _id: `stage${index}`,
      id: `stage${index}`,
      groups,
      schedule,
      stage,
    });
  };

  export const generateTournament = (
    index: number,
    stages: TournamentStage[],
    teams: Team[],
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
      settings: DefaultTournamentSettings,

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
          tournamentSettings.type,
        ),
      );
    }
    const stage1ScheduledGames = generateTournamentSchedule(
      groups,
      tournamentSettings,
      tournamentSettings.type,
    );
    const firstStage = TestUtils.generateTournamentStage(
      1,
      groups,
      stage1ScheduledGames,
      1,
    );
    return TestUtils.generateTournament(
      1,
      [firstStage],
      teams.flatMap((flatTeams) => flatTeams),
    );
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
