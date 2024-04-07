import Game from 'types/Game';
import { GameState, GameWinner } from 'types/GameState';
import { Match } from 'types/Match';
import Team from 'types/Team';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentType } from 'types/TournamentType';

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
}
export const team1 = TestUtils.generateTeam(1);
export const team2 = TestUtils.generateTeam(2);
export const team3 = TestUtils.generateTeam(3);
export const team4 = TestUtils.generateTeam(4);
export const team5 = TestUtils.generateTeam(5);
export const team6 = TestUtils.generateTeam(6);
