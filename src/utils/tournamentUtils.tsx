import { compact } from 'lodash';
import Game from 'types/Game';
import { GameSettings } from 'types/GameSettings';
import { GameState } from 'types/GameState';
import Team from 'types/Team';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentScheduleGame } from 'types/TournamentScheduleGame';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentType } from 'types/TournamentType';
import { v4 } from 'uuid';
import {
  getNextGame,
  getNextGamePair,
  getNextGroup,
} from './tournamentFlowUtils';

export const generateGamesForLayer = (
  roundToGenerate: number,
  totalNumberOfRoundsToGenerate: number,
  gameTime: number,
) => {
  const round = roundToGenerate;
  const totalNumberOfRounds = totalNumberOfRoundsToGenerate;
  const games: Game[] = [];
  const numberOfGamesForRound = 2 ** (totalNumberOfRounds - round - 1);
  let currentLayerPairCount = 1;
  let nextRoundGameNumber = 1;

  if (round + 1 === totalNumberOfRounds) {
    // Finals + third place
    const newFPId = v4();
    const firstPlaceGame: Game = new Game({
      gameState: GameState.created,
      id: newFPId,
      _id: newFPId,
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
      gameTime,
    });

    const newTPId = v4();
    const thirdPlaceGame: Game = new Game({
      gameState: GameState.created,
      id: newTPId,
      _id: newTPId,
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
      gameTime,
    });
    games.push(firstPlaceGame, thirdPlaceGame);
    return games;
  }
  if (round + 2 === totalNumberOfRounds) {
    const newId1 = v4();
    // last round before finals
    const game1: Game = new Game({
      gameState: GameState.created,
      id: newId1,
      _id: newId1,
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
      gameTime,
    });

    const newId2 = v4();
    const game2: Game = new Game({
      gameState: GameState.created,
      id: newId2,
      _id: newId2,
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
      gameTime,
    });
    games.push(game1, game2);
    return games;
  }

  for (let i = 0; i < numberOfGamesForRound; i += 1) {
    if (currentLayerPairCount > 2) {
      currentLayerPairCount = 1;
      nextRoundGameNumber += 1;
    }

    const newId = v4();
    const newGame: Game = new Game({
      gameState: GameState.created,
      id: newId,
      _id: newId,
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
      gameTime,
    });
    currentLayerPairCount += 1;
    games.push(newGame);
  }
  return games;
};

const nextRoundSeeds = (teamSeeds: number[]) => {
  const nextRoundSeedsArray: any = [];
  const teamSeedsLength = teamSeeds.length * 2 + 1;
  teamSeeds.forEach((index: number) => {
    nextRoundSeedsArray.push(index);
    nextRoundSeedsArray.push(teamSeedsLength - index);
  });
  return nextRoundSeedsArray;
};

export const getTeamsSeeding = (numPlayers: number) => {
  const rounds = Math.log(numPlayers) / Math.log(2) - 1;
  let teamSeeds = [1, 2];
  for (let i = 0; i < rounds; i += 1) {
    teamSeeds = nextRoundSeeds(teamSeeds);
  }
  return teamSeeds;
};

export const generateFillerGame = (
  team1: Team,
  team2: Team,
  gameTime: number,
) => {
  const newId = v4();
  return new Game({
    gameState: GameState.created,
    id: newId,
    _id: newId,
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
    gameTime,
  });
};

const getNumberOfRounds = (numberOfTeams: number) => {
  return Math.ceil(Math.log(numberOfTeams) / Math.log(2));
};

const getTeamPairsForUnevenRound1 = (
  teams: Team[],
  startingSeed: number,
  numberOfTeamsLeft: number,
  numberOfTeamsInRound2: number,
) => {
  const teamPairs: Team[][] = [];
  for (let j = 0, i = startingSeed; j < numberOfTeamsLeft; j += 1, i -= 1) {
    teamPairs.push([teams[i - 1], teams[j + numberOfTeamsInRound2]]);
  }
  return teamPairs;
};

export const getGamePairs = (games: Game[]) => {
  const pairedGames: Game[][] = [];
  let newPair: Game[] = [];
  for (let i = 0; i < games.length; i += 1) {
    if (newPair.length >= 2) {
      pairedGames.push(newPair);
      newPair = [];
    }
    newPair.push(games[i]);
  }

  if (newPair.length > 0) {
    pairedGames.push(newPair);
  }
  return pairedGames;
};

export const generateGamesForEliminationBrackets = (
  teams: Team[],
  gameSettings: GameSettings,
) => {
  const numberOfTeams = teams.length;
  let teamsSeeding = getTeamsSeeding(numberOfTeams);
  const games: Game[] = [];

  const totalNumberOfRounds = getNumberOfRounds(numberOfTeams);
  const numberOfTeamsInRound1 = 2 ** totalNumberOfRounds;
  if (numberOfTeams < numberOfTeamsInRound1) {
    const numberOfTeamsInRound2 = 2 ** (totalNumberOfRounds - 1);
    const numberOfTeamsLeft = numberOfTeams - numberOfTeamsInRound2;

    for (let round = 0; round <= totalNumberOfRounds; round += 1) {
      games.push(
        ...generateGamesForLayer(
          round,
          totalNumberOfRounds,
          gameSettings.gameTimeInSeconds,
        ),
      );
    }
    teamsSeeding = getTeamsSeeding(numberOfTeamsInRound2);
    const teamPairsForRound1 = getTeamPairsForUnevenRound1(
      teams,
      numberOfTeamsInRound2,
      numberOfTeamsLeft,
      numberOfTeamsInRound2,
    );
    const roundTwoGames = games.filter(
      (game) => game.bracketProperties?.round === 1,
    );

    for (let j = 0, i = 0; j < roundTwoGames.length; j += 1) {
      if (roundTwoGames[j].bracketProperties?.isThridPlaceGame) {
        continue;
      }
      if (i < teams.length) {
        if (i < teams.length) {
          const team1 = teams[teamsSeeding[i] - 1];

          roundTwoGames[j].team1 = team1;

          i += 1;
        }
        if (i < teams.length) {
          const team2 = teams[teamsSeeding[i] - 1];

          roundTwoGames[j].team2 = team2;

          i += 1;
        }
      }
    }
    const roundOneGames = games.filter(
      (game) => game.bracketProperties?.round === 0,
    );
    roundOneGames.forEach((game) => {
      game.bracketProperties!.bye = true;
    });
    const pairedCurrentRoundGames: Game[][] = [];

    let newPair: Game[] = [];
    for (let i = 0; i < roundOneGames.length; i += 1) {
      if (newPair.length >= 2) {
        pairedCurrentRoundGames.push(newPair);
        newPair = [];
      }

      newPair.push(roundOneGames[i]);
    }

    if (newPair.length > 0) {
      pairedCurrentRoundGames.push(newPair);
    }

    for (let j = 0; j < teamPairsForRound1.length; j += 1) {
      const teamIds = [
        teamPairsForRound1[j][0].id,
        teamPairsForRound1[j][1].id,
      ];
      const indexOfNextGame = roundTwoGames.findIndex(
        (roundTwoGame) =>
          teamIds.includes(roundTwoGame.team1.id) ||
          teamIds.includes(roundTwoGame.team2.id),
      );
      if (indexOfNextGame >= 0) {
        const round2Game = roundTwoGames[indexOfNextGame];

        let firstRoundGameIndex = indexOfNextGame * 2;
        // If first round bye is set to false, that means we already filled its place, and this should go to the next game
        const isFirstGameSet =
          games[firstRoundGameIndex].bracketProperties?.bye === false;

        firstRoundGameIndex += isFirstGameSet ? 1 : 0;
        const round1Team1 = teamPairsForRound1[j][0];
        const round1Team2 = teamPairsForRound1[j][1];
        if ([round1Team1.id, round1Team2.id].includes(round2Game.team1.id)) {
          round2Game.team1 = new Team({
            _id: v4(),
            id: v4(),
            teamName: `TBD round1`,
            teamTag: `TBD round1`,
          });
        }
        if ([round1Team1.id, round1Team2.id].includes(round2Game.team2.id)) {
          round2Game.team2 = new Team({
            _id: v4(),
            id: v4(),
            teamName: `TBD round1`,
            teamTag: `TBD round1`,
          });
        }
        games[firstRoundGameIndex].team1 = round1Team1;
        games[firstRoundGameIndex].team2 = round1Team2;
        games[firstRoundGameIndex].bracketProperties!.bye = false;
      }
    }
  } else {
    for (let round = 0; round < totalNumberOfRounds; round += 1) {
      games.push(
        ...generateGamesForLayer(
          round,
          totalNumberOfRounds,
          gameSettings.gameTimeInSeconds,
        ),
      );
    }
    const roundOneGames = games.filter(
      (game) => game.bracketProperties?.round === 0,
    );

    for (let j = 0, i = 0; j < roundOneGames.length; j += 1) {
      if (i >= teams.length) {
        games[j].team1.teamName += 'BYE';
        games[j].team2.teamName += 'BYE';
      } else {
        if (i < teams.length) {
          games[j].team1 = teams[teamsSeeding[i] - 1];
          i += 1;
        } else {
          games[j].bracketProperties!.bye = true;
        }
        if (i < teams.length) {
          games[j].team2 = teams[teamsSeeding[i] - 1];
          i += 1;
        }
      }
    }
  }

  return { totalNumberOfRounds, games };
};

const generateRoundRobinSchedule = (
  groups: TournamentGroup[],
  settings: TournamentSettings,
) => {
  if (!groups?.length) {
    return [];
  }
  const { switchGames, switchGroups } = settings;

  const innerGroups = [
    ...(JSON.parse(
      JSON.stringify(groups.filter((group) => group.stage === 1)),
    ) as TournamentGroup[]),
  ];
  const totalGames = innerGroups.reduce((prev, curr) => {
    return prev + (curr?.games?.length || 0);
  }, 0);

  let mostCurrentGroup = innerGroups.filter((group) => group.stage === 1)[0];
  let currentGameNumber = 0;
  let pairedGame1: Game = mostCurrentGroup.games[0];
  let pairedGame2: Game | null = switchGames ? mostCurrentGroup.games[1] : null;

  if (pairedGame1) {
    pairedGame1.gameState = GameState.finished;
  }
  if (pairedGame2) {
    pairedGame2.gameState = GameState.finished;
  }

  const scheduledGames: TournamentScheduleGame[] = compact([
    pairedGame1 &&
      ({
        game: pairedGame1,
        gameNumber: 1,
        group: mostCurrentGroup,
        id: v4(),
      } as TournamentScheduleGame),
    pairedGame2 &&
      ({
        game: pairedGame2,
        gameNumber: 2,
        group: mostCurrentGroup,
        id: v4(),
      } as TournamentScheduleGame),
  ]);
  currentGameNumber = scheduledGames.length + 1;
  while (scheduledGames.length < totalGames) {
    const newGroup = getNextGroup(
      mostCurrentGroup,
      innerGroups,
      1,
      switchGroups,
    );
    if (!newGroup) {
      break;
    }
    mostCurrentGroup = newGroup;
    if (switchGames) {
      const gamePair = getNextGamePair(mostCurrentGroup);
      if (!gamePair) {
        break;
      }

      if (gamePair.game1) {
        pairedGame1 = gamePair.game1;
        pairedGame1.gameState = GameState.finished;
        scheduledGames.push({
          game: pairedGame1,
          gameNumber: currentGameNumber,
          group: mostCurrentGroup,
          id: v4(),
        });
        currentGameNumber += 1;
      }

      if (gamePair.game2) {
        pairedGame2 = gamePair.game2;
        pairedGame2.gameState = GameState.finished;
        scheduledGames.push({
          game: pairedGame2,
          gameNumber: currentGameNumber,
          group: mostCurrentGroup,
          id: v4(),
        });
        currentGameNumber += 1;
      }
    } else {
      const gamePair = getNextGame(mostCurrentGroup);
      if (!gamePair) {
        break;
      }

      if (gamePair.game1) {
        pairedGame1 = gamePair.game1;
        pairedGame1.gameState = GameState.finished;
        scheduledGames.push({
          game: pairedGame1,
          gameNumber: currentGameNumber,
          group: mostCurrentGroup,
          id: v4(),
        });
        currentGameNumber += 1;
      }
    }
  }
  scheduledGames.forEach((scheduledGame) => {
    scheduledGame.game.gameState = GameState.created;
  });
  return scheduledGames;
};

export const generateTournamentSchedule = (
  groups?: TournamentGroup[],
  settings?: TournamentSettings,
) => {
  if (!groups?.length || !settings) {
    return [];
  }
  switch (settings.type) {
    case TournamentType.roundRobin:
      return generateRoundRobinSchedule(groups, settings);
    case TournamentType.singleElimination:
      return [];
    case TournamentType.doubleElimination:
      return [];
    case TournamentType.training:
      return [];
    default:
      return [];
  }
};
