import '@testing-library/jest-dom';
import Game from 'types/Game';
import { GameState, GameWinner } from 'types/GameState';
import Team from 'types/Team';

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

const games = [
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
    gameTime: 350,
    id: 'G2',
    matches: [],
    team1: team3,
    team2: team4,
    gameWinner: GameWinner.team1,
    team1Wins: 0,
    team2Wins: 0,
  }),
];

describe('TournamentResults', () => {
  it('should calculate results', () => {
    expect(games[0].team1.id).toBe(team1.id);
    expect(games[0].team2.id).toBe(team2.id);
    expect(games[1].team1.id).toBe(team3.id);
    expect(games[1].team2.id).toBe(team4.id);
  });
});
