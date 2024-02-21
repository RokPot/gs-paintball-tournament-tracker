import '@testing-library/jest-dom';
import Game from 'types/Game';
import { GameState, GameWinner } from 'types/GameState';
import Team from 'types/Team';
import TournamentGroup from 'types/TournamentGroup';
import { DefaultTournamentSettings } from 'types/TournamentSettings';
import { TournamentType } from 'types/TournamentType';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';

const team1 = new Team({
  _id: '1',
  id: '1',
  teamName: 'team1',
  teamTag: 'T1',
  draw: 0,
  loses: 0,
  wins: 0,
});

const team2 = new Team({
  _id: '2',
  id: '2',
  teamName: 'team2',
  teamTag: 'T2',
  draw: 0,
  loses: 0,
  wins: 0,
});

const team3 = new Team({
  _id: '3',
  id: '3',
  teamName: 'team3',
  teamTag: 'T3',
  draw: 0,
  loses: 0,
  wins: 0,
});

const team4 = new Team({
  _id: '4',
  id: '4',
  teamName: 'team4',
  teamTag: 'T4',
  draw: 0,
  loses: 0,
  wins: 0,
});

describe('TournamentResults', () => {
  it('should calculate results', () => {
    const gamesWithClearWinner = [
      new Game({
        _id: 'G1',
        bracketProperties: null,
        gameState: GameState.finished,
        gameTime: 350,
        id: 'G1',
        matches: [],
        team1,
        team2,
        gameWinner: GameWinner.team1,
        team1Wins: 0,
        team2Wins: 0,
      }),
      new Game({
        _id: 'G2',
        bracketProperties: null,
        gameState: GameState.finished,
        gameTime: 400,
        id: 'G2',
        matches: [],
        team1: team3,
        team2: team4,
        gameWinner: GameWinner.team1,
        team1Wins: 0,
        team2Wins: 0,
      }),
      new Game({
        _id: 'G3',
        bracketProperties: null,
        gameState: GameState.finished,
        gameTime: 350,
        id: 'G3',
        matches: [],
        team1,
        team2: team3,
        gameWinner: GameWinner.team1,
        team1Wins: 0,
        team2Wins: 0,
      }),
    ];
    expect(gamesWithClearWinner[0].team1.id).toBe(team1.id);
    expect(gamesWithClearWinner[0].team2.id).toBe(team2.id);
    expect(gamesWithClearWinner[1].team1.id).toBe(team3.id);
    expect(gamesWithClearWinner[1].team2.id).toBe(team4.id);
    const newGroup = new TournamentGroup({
      _id: 'TG1',
      id: 'TG1',
      games: gamesWithClearWinner,
      groupIndex: 1,
      groupType: TournamentType.singleElimination,
      stage: 1,
      teams: [team1, team2, team3, team4],
    });
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(4);
    expect(leaderboard[0].team.id).toBe(team1.id);
    expect(leaderboard[1].team.id).toBe(team3.id);
    expect(leaderboard[2].team.id).toBe(team4.id);
    expect(leaderboard[3].team.id).toBe(team2.id);
  });

  it('should calculate results and check for HeadToHead tiebreaker', () => {
    const gamesWithClearWinner = [
      new Game({
        _id: 'G1',
        bracketProperties: null,
        gameState: GameState.finished,
        gameTime: 350,
        id: 'G1',
        matches: [],
        team1,
        team2,
        gameWinner: GameWinner.team1,
        team1Wins: 0,
        team2Wins: 0,
      }),
      new Game({
        _id: 'G2',
        bracketProperties: null,
        gameState: GameState.finished,
        gameTime: 400,
        id: 'G2',
        matches: [],
        team1: team3,
        team2: team4,
        gameWinner: GameWinner.team1,
        team1Wins: 0,
        team2Wins: 0,
      }),
      new Game({
        _id: 'G3',
        bracketProperties: null,
        gameState: GameState.finished,
        gameTime: 350,
        id: 'G3',
        matches: [],
        team1,
        team2: team3,
        gameWinner: GameWinner.team1,
        team1Wins: 0,
        team2Wins: 0,
      }),
      new Game({
        _id: 'G3',
        bracketProperties: null,
        gameState: GameState.finished,
        gameTime: 350,
        id: 'G3',
        matches: [],
        team1: team3,
        team2,
        gameWinner: GameWinner.team1,
        team1Wins: 0,
        team2Wins: 0,
      }),
    ];

    // T1 - T2, T1 win
    // T3 - T4, T3 win
    // T1 - T3, T1 win
    // T3 - T2, T3 win
    // T1, T3
    expect(gamesWithClearWinner[0].team1.id).toBe(team1.id);
    expect(gamesWithClearWinner[0].team2.id).toBe(team2.id);
    expect(gamesWithClearWinner[1].team1.id).toBe(team3.id);
    expect(gamesWithClearWinner[1].team2.id).toBe(team4.id);
    const newGroup = new TournamentGroup({
      _id: 'TG1',
      id: 'TG1',
      games: gamesWithClearWinner,
      groupIndex: 1,
      groupType: TournamentType.singleElimination,
      stage: 1,
      teams: [team1, team2, team3, team4],
    });
    const leaderboard = calculateTournamentGroupLeaderboard(newGroup, {
      ...DefaultTournamentSettings,
    });
    expect(leaderboard.length).toBe(4);
    expect(leaderboard[0].team.id).toBe(team1.id);
    expect(leaderboard[1].team.id).toBe(team3.id);
    expect(leaderboard[2].team.id).toBe(team4.id);
    expect(leaderboard[3].team.id).toBe(team2.id);
  });
});
