import Game from 'types/Game';
import { GameState } from 'types/GameState';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import { v4 } from 'uuid';

export const generateGamesForLayer = (
  roundToGenerate: number,
  totalNumberOfRoundsToGenerate: number,
  skipFirstRound?: boolean,
) => {
  let round = roundToGenerate;
  let totalNumberOfRounds = totalNumberOfRoundsToGenerate;
  const games: Game[] = [];
  const numberOfGamesForRound = 2 ** (totalNumberOfRounds - round - 1);
  let currentLayerPairCount = 1;
  let nextRoundGameNumber = 1;
  if (skipFirstRound) {
    round += 1;
    //
    totalNumberOfRounds += 1;
  }
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

const nextLayer = (pls: any) => {
  const out: any = [];
  const length = pls.length * 2 + 1;
  pls.forEach((d: any) => {
    out.push(d);
    out.push(length - d);
  });
  return out;
};

export const getTeamsSeeding = (numPlayers: number) => {
  const rounds = Math.log(numPlayers) / Math.log(2) - 1;
  let pls = [1, 2];
  for (let i = 0; i < rounds; i += 1) {
    pls = nextLayer(pls);
  }
  return pls;
};

export const generateFillerGame = (team1: Team, team2: Team) => {
  return new Game({
    gameState: GameState.created,
    id: v4(),
    matches: [],
    team1,
    team1Wins: 0,
    team2,
    team2Wins: 0,
    bracketProperties: {
      bye: false,
      round: 0,
      roundGameNumber: 1,
      winnerNextRoundGameNumber: 1,
      loserNextRoundGameNumber: 2,
      isFirstPlaceGame: false,
      previousLayerGame1Number: 1,
      previousLayerGame2Number: 2,
    },
  });
};

export const generateGamesForEliminationBrackets = (teams: Team[]) => {
  console.log(teams);
  const numberOfTeams = 16;
  const teamss: Team[] = [];
  const teamsSeeding = getTeamsSeeding(numberOfTeams);
  console.log('teamsSeeding', teamsSeeding);
  const numberOfGames = Math.ceil(numberOfTeams / 2);
  const games: Game[] = [];
  let totalNumberOfRounds = 0;
  while (numberOfGames > 2 ** totalNumberOfRounds) {
    totalNumberOfRounds += 1;
  }
  totalNumberOfRounds += 1;
  for (let i = 0; i < numberOfTeams; i += 1) {
    const newTeam = new Team({
      _id: v4(),
      id: v4(),
      teamName: `TBD${i + 1}`,
      teamTag: `TBD${i + 1}`,
    });
    teamss.push(newTeam);
  }
  if (numberOfTeams < 2 ** totalNumberOfRounds) {
    // this is not done, brackets generation needs to be fixed first
    // const numberOfTeamsLeft = numberOfTeams - 2 ** (totalNumberOfRounds - 1);
    // const teamsLeft = teamss.slice(
    //   teamss.length - numberOfTeamsLeft,
    //   teamss.length,
    // );
    // totalNumberOfRounds -= 1;
    // console.log(
    //   'teams, left out, need to change first layer',
    //   numberOfTeams - 2 ** totalNumberOfRounds,
    //   teamsLeft,
    // );
    // games.push(generateFillerGame(teamsLeft[0], teamsLeft[0]));
    // for (let round = 0; round <= totalNumberOfRounds + 1; round += 1) {
    //   games.push(...generateGamesForLayer(round, totalNumberOfRounds, true));
    // }
    // totalNumberOfRounds += 1;
  } else {
    for (let round = 0; round < totalNumberOfRounds; round += 1) {
      games.push(...generateGamesForLayer(round, totalNumberOfRounds));
    }
  }

  const roundOneGames = games.filter(
    (game) => game.bracketProperties?.round === 0,
  );

  for (let j = 0, i = 0; j < roundOneGames.length; j += 1) {
    // assign team 1 2 3 4 5
    if (i >= teamss.length) {
      // games[j].bracketProperties!.bye = false; a
      games[j].team1.teamName += 'BYE';
      games[j].team2.teamName += 'BYE';
    } else {
      if (i < teamss.length) {
        games[j].team1 = teamss[teamsSeeding[i] - 1];
        i += 1;
      } else {
        games[j].bracketProperties!.bye = true;
      }
      if (i < teamss.length) {
        games[j].team2 = teamss[teamsSeeding[i] - 1];
        i += 1;
      } else {
        // games[j].bracketProperties!.bye = false;
        games[j].team1.teamName += 'BYE';
        games[j].team2.teamName += 'BYE';
      }
    }
  }
  console.log(games.map((game) => game.bracketProperties));
  return { totalNumberOfRounds, games };
};

export const initializeTournament = (tournament: Tournament) => {
  return tournament;
};
