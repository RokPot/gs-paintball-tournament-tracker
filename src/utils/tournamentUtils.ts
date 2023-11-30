import Game from 'types/Game';
import { GameState } from 'types/GameState';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import { v4 } from 'uuid';

export const generateGamesForLayer = (
  round: number,
  totalNumberOfRounds: number,
) => {
  const games: Game[] = [];
  const numberOfGamesForRound = 2 ** (totalNumberOfRounds - round - 1);
  let currentLayerPairCount = 1;
  let nextRoundGameNumber = 1;

  if (round + 1 === totalNumberOfRounds) {
    // Finals + third place
    const firstPlaceGame: Game = {
      gameState: GameState.created,
      id: v4(),
      matches: [],
      team1: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team1Wins: 0,
      team2: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team2Wins: 0,
      bracketProperties: {
        bye: false,
        round,
        roundGameNumber: 1,
        winnerNextRoundGameNumber: 1,
        loserNextRoundGameNumber: 2,
        isFirstPlaceGame: true,
        previousLayerGame1Number: 1,
        previousLayerGame2Number: 2,
      },
    };
    const thirdPlaceGame: Game = {
      gameState: GameState.created,
      id: v4(),
      matches: [],
      team1: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team1Wins: 0,
      team2: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team2Wins: 0,
      bracketProperties: {
        bye: false,
        round,
        roundGameNumber: 2,
        winnerNextRoundGameNumber: -1,
        isThridPlaceGame: true,
      },
    };
    games.push(firstPlaceGame, thirdPlaceGame);
    return games;
  }
  if (round + 2 === totalNumberOfRounds) {
    // last round before finals
    const game1: Game = {
      gameState: GameState.created,
      id: v4(),
      matches: [],
      team1: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team1Wins: 0,
      team2: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team2Wins: 0,
      bracketProperties: {
        bye: false,
        round,
        roundGameNumber: 1,
        winnerNextRoundGameNumber: 1,
        loserNextRoundGameNumber: 2,
        previousLayerGame1Number: 3,
        previousLayerGame2Number: 4,
      },
    };
    const game2: Game = {
      gameState: GameState.created,
      id: v4(),
      matches: [],
      team1: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team1Wins: 0,
      team2: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team2Wins: 0,
      bracketProperties: {
        bye: false,
        round,
        roundGameNumber: 2,
        winnerNextRoundGameNumber: 1,
        loserNextRoundGameNumber: 2,
        previousLayerGame1Number: 1,
        previousLayerGame2Number: 2,
      },
    };
    games.push(game1, game2);
    return games;
  }

  for (let i = 0; i < numberOfGamesForRound; i += 1) {
    if (currentLayerPairCount > 2) {
      currentLayerPairCount = 1;
      nextRoundGameNumber += 1;
    }
    const newGame: Game = {
      gameState: GameState.created,
      id: v4(),
      matches: [],
      team1: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team1Wins: 0,
      team2: new Team({
        _id: v4(),
        id: v4(),
        teamName: 'TBD',
        teamTag: 'TBD',
      }),
      team2Wins: 0,
      bracketProperties: {
        bye: false,
        round,
        roundGameNumber: i + 1,
        winnerNextRoundGameNumber: nextRoundGameNumber,
        previousLayerGame1Number: i * 2 + 1,
        previousLayerGame2Number: i * 2 + 2,
      },
    };
    currentLayerPairCount += 1;
    games.push(newGame);
  }
  return games;
};

export const generateGamesForEliminationBrackets = (teams: Team[]) => {
  console.log(teams);
  const numberOfTeams = 32;
  const teamss: Team[] = [];

  for (let i = 0; i < numberOfTeams; i += 1) {
    teamss.push(
      new Team({
        _id: v4(),
        id: v4(),
        teamName: `TBD${i}`,
        teamTag: `TBD${i}`,
      }),
    );
  }

  const numberOfGames = Math.ceil(numberOfTeams / 2);
  const isTeamLeftOut = numberOfTeams % 2 > 0;
  const games: Game[] = [];
  let totalNumberOfRounds = 0;
  while (numberOfGames > 2 ** totalNumberOfRounds) {
    totalNumberOfRounds += 1;
  }
  totalNumberOfRounds += 1;

  if (isTeamLeftOut) {
    totalNumberOfRounds += 1;
  }

  for (let round = 0; round < totalNumberOfRounds; round += 1) {
    games.push(...generateGamesForLayer(round, totalNumberOfRounds));
  }

  for (let round = 0; round < totalNumberOfRounds; round += 1) {}
  console.log(games.map((game) => game.bracketProperties));
  return { totalNumberOfRounds, games };
};

export const initializeTournament = (tournament: Tournament) => {
  return tournament;
};
