import Game from 'types/Game';
import { GameState } from 'types/GameState';
import Team from 'types/Team';
import { v4 } from 'uuid';

export const getRoundRobinGame = (teams: Team[]) => {
  console.log(teams);
};

const checkIfthereAreSameTeamsRoundGame = (
  game1Indices: number[],
  game2Indices: number[],
) => {
  const isFirstIndiceTheSame = game1Indices.includes(game2Indices[0]);
  const isSecondIndiceTheSame = game1Indices.includes(game2Indices[1]);
  return isFirstIndiceTheSame || isSecondIndiceTheSame;
};

export const reorderRoundRobinGames = (games: Game[], indices: number[][]) => {
  console.log(games, indices);
  const tmpInidices = indices;
  const reorderedIndices: number[][] = [];
  let firstGameIndex = 0;
  let secondGameIndex = indices.length - 1;

  let retries = 0;
  // resolve current indices
  let round = 0;

  while (retries < 100) {
    const game1Indices = indices[firstGameIndex];
    const game2Indices = indices[secondGameIndex];

    if (checkIfthereAreSameTeamsRoundGame(game1Indices, game2Indices)) {
      // resolve same teams in round if possible
      for (let i = reorderedIndices.length - 2; i >= 0; i -= 1) {
        console.log('do something');
      }
    } else {
      // go to next round
      reorderedIndices.push(game1Indices, game2Indices);
    }
    retries += 5;
    firstGameIndex += 1;
    secondGameIndex -= 1;
  }
  console.log(reorderedIndices);
};

export const generateGamesForRoundRobin = (teams: Team[]) => {
  const numberOfTeams = teams.length;
  const numberOfGames = (numberOfTeams * (numberOfTeams - 1)) / 2;
  const numberOfRounds = Math.floor(numberOfGames / 2);
  const gamesLeft = numberOfGames % 2;
  console.log(numberOfTeams, numberOfGames, numberOfRounds, gamesLeft);
  const games: Game[] = [];
  const indices: number[][] = [];
  for (let i = 0; i < numberOfTeams; i += 1) {
    for (let j = i + 1; j < numberOfTeams; j += 1) {
      const newGame: Game = {
        gameState: GameState.created,
        id: v4(),
        matches: [],
        team1: teams[i],
        team1Wins: 0,
        team2: teams[j],
        team2Wins: 0,
        bracketProperties: null,
      };
      games.push(newGame);
      console.log('team1', i, 'team2', j);
      indices.push([i, j]);
    }
  }
  reorderRoundRobinGames(games, indices);
};
