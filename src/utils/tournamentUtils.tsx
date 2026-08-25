import { compact } from 'lodash';
import Game from 'types/Game';
import { GameSettings } from 'types/GameSettings';
import { GameState } from 'types/GameState';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import {
  TournamentType,
  TournamentTypeEnum,
  TournamentTypeSettings,
} from 'types/TournamentType';
import { v4 } from 'uuid';
import { shuffleArray } from './arrayUtils';
import { generateGamesForRoundRobin } from './tournament/roundRobinUtils';
import { TournamentFlow } from './tournamentFlowUtils';
import { calculateTournamentGroupLeaderboard } from './tournamentResultUtils';

export const TBD_TEAM_LABEL = 'TBD';

export { isByePlaceholderGame } from 'types/BracketProperties';

/**
 * Falls back to the shorter team tag once the full name would overflow a
 * results-window row, so the same team always renders identically across the
 * hero, the on-deck line and the schedule.
 */
export const getDisplayTeamName = (team?: Team, maxChars = 12) => {
  if (!team?.id || !team.teamName || team.teamName === TBD_TEAM_LABEL) {
    return TBD_TEAM_LABEL;
  }
  if (team.teamName.length > maxChars && team.teamTag) {
    return team.teamTag;
  }
  return team.teamName;
};

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
    // Finals + third place. Both games are terminal — they must not
    // point at a following round or flow will fill leftover TBD slots.
    const newThirdPlaceId = v4();
    const thirdPlaceGame: Game = new Game({
      gameState: GameState.created,
      id: newThirdPlaceId,
      _id: newThirdPlaceId,
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
        winnerNextRoundGameNumber: -1,
        isThridPlaceGame: true,
        isFirstPlaceGame: false,
        previousLayerGame1Number: 1,
        previousLayerGame2Number: 2,
      },
      gameTime,
    });

    const newFirstPlaceId = v4();
    const firstPlaceGame: Game = new Game({
      gameState: GameState.created,
      id: newFirstPlaceId,
      _id: newFirstPlaceId,
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
        isThridPlaceGame: false,
        isFirstPlaceGame: true,
      },
      gameTime,
    });
    games.push(thirdPlaceGame, firstPlaceGame);
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
        winnerNextRoundGameNumber: 2,
        loserNextRoundGameNumber: 1,
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
        winnerNextRoundGameNumber: 2,
        loserNextRoundGameNumber: 1,
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

export const generateGamesForRenting = (
  teams: Team[],
  gameSettings: GameSettings,
) => {
  const newId1 = v4();

  const game1: Game = new Game({
    gameState: GameState.created,
    id: newId1,
    _id: newId1,
    matches: [],
    team1: teams[0],
    team1Wins: 0,
    team2: teams[1],
    team2Wins: 0,
    bracketProperties: null,
    gameTime: gameSettings.gameTimeInSeconds,
  });
  return {
    games: [game1],
    totalNumberOfRounds: 1,
  };
};

export const generateRentingSchedule = (groups: TournamentGroup[]) => {
  const scheduledGames: TournamentScheduleGame[] = [];
  scheduledGames.push({
    game: groups[0].games[0],
    gameNumber: 1,
    group: groups[0],
    id: v4(),
    index: 0,
    pairedGameId: 'NoPairedGameId',
  });

  return scheduledGames;
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

    for (let round = 0; round < totalNumberOfRounds; round += 1) {
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
        games[j].bracketProperties!.bye = true;
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
    ...(JSON.parse(JSON.stringify(groups)) as TournamentGroup[]),
  ];
  const totalGames = innerGroups.reduce((prev, curr) => {
    return prev + (curr?.games?.length || 0);
  }, 0);

  let mostCurrentGroup = innerGroups[0];
  let currentGameNumber = 0;
  let pairedGame1: Game = mostCurrentGroup.games[0];
  let pairedGame2: Game | null = switchGames ? mostCurrentGroup.games[1] : null;

  let scheduledGame1: TournamentScheduleGame | undefined;

  let scheduledGame2: TournamentScheduleGame | undefined;

  const scheduledGames: TournamentScheduleGame[] = [];

  if (pairedGame1) {
    pairedGame1.gameState = GameState.finished;
    scheduledGame1 = {
      game: pairedGame1,
      gameNumber: 1,
      group: mostCurrentGroup,
      id: v4(),
      pairedGameId: 'NoPairedGame',
      index: 0,
    };
  }
  if (pairedGame2) {
    pairedGame2.gameState = GameState.finished;
    scheduledGame2 = {
      game: pairedGame2,
      gameNumber: 2,
      group: mostCurrentGroup,
      id: v4(),
      index: 1,
      pairedGameId: 'NoPairedGame',
    };
  }

  if (scheduledGame1) {
    scheduledGame1.pairedGameId = scheduledGame2?.id || 'NoPairedGameId';
    scheduledGames.push(scheduledGame1);
  }
  if (scheduledGame2) {
    scheduledGame2.pairedGameId = scheduledGame1?.id || 'NoPairedGameId';
    scheduledGames.push(scheduledGame2);
  }

  currentGameNumber = scheduledGames.length + 1;
  while (scheduledGames.length < totalGames) {
    const newGroup = TournamentFlow.getNextGroup(
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
      const gamePair = TournamentFlow.getNextGamePair(mostCurrentGroup);
      if (!gamePair) {
        break;
      }
      let scheduledPairedGame1: TournamentScheduleGame | undefined;
      let scheduledPairedGame2: TournamentScheduleGame | undefined;
      if (gamePair.game1) {
        pairedGame1 = gamePair.game1;
        pairedGame1.gameState = GameState.finished;
        scheduledPairedGame1 = {
          game: pairedGame1,
          gameNumber: currentGameNumber,
          group: mostCurrentGroup,
          id: v4(),
          index: scheduledGames.length,
          pairedGameId: 'NoPairedGameId',
        };

        currentGameNumber += 1;
      }

      if (gamePair.game2) {
        pairedGame2 = gamePair.game2;
        pairedGame2.gameState = GameState.finished;
        scheduledPairedGame2 = {
          game: pairedGame2,
          gameNumber: currentGameNumber,
          group: mostCurrentGroup,
          id: v4(),
          index: scheduledGames.length,
          pairedGameId: 'NoPairedGameId',
        };

        currentGameNumber += 1;
      }
      if (scheduledPairedGame1) {
        scheduledPairedGame1.pairedGameId =
          scheduledPairedGame2?.id || 'NoPairedGameId';
        scheduledGames.push(scheduledPairedGame1);
      }
      if (scheduledPairedGame2) {
        scheduledPairedGame2.pairedGameId =
          scheduledPairedGame1?.id || 'NoPairedGameId';
        scheduledGames.push(scheduledPairedGame2);
      }
    } else {
      const gamePair = TournamentFlow.getNextGame(mostCurrentGroup);
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
          index: scheduledGames.length,
          pairedGameId: 'NoPairedGameId',
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

const generateSingleEliminationSchedule = (
  groups: TournamentGroup[],
  settings: TournamentSettings,
) => {
  if (!groups?.length) {
    return [];
  }
  const { switchGames, switchGroups } = settings;

  const innerGroups = [
    ...(JSON.parse(JSON.stringify(groups)) as TournamentGroup[]),
  ];
  const totalGames = innerGroups.reduce((prev, curr) => {
    return prev + (curr?.games?.length || 0);
  }, 0);

  let mostCurrentGroup = innerGroups?.[0];
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
        game: new Game(pairedGame1),
        gameNumber: 1,
        group: mostCurrentGroup,
        id: v4(),
      } as TournamentScheduleGame),
    pairedGame2 &&
      ({
        game: new Game(pairedGame2),
        gameNumber: 2,
        group: mostCurrentGroup,
        id: v4(),
      } as TournamentScheduleGame),
  ]);
  currentGameNumber = scheduledGames.length + 1;
  while (scheduledGames.length < totalGames) {
    const newGroup = TournamentFlow.getNextGroup(
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
      const gamePair = TournamentFlow.getNextGamePair(mostCurrentGroup);
      if (!gamePair) {
        break;
      }
      let scheduledPairedGame1: TournamentScheduleGame | undefined;
      let scheduledPairedGame2: TournamentScheduleGame | undefined;

      if (gamePair.game1) {
        pairedGame1 = gamePair.game1;
        pairedGame1.gameState = GameState.finished;
        scheduledPairedGame1 = {
          game: new Game(pairedGame1),
          gameNumber: currentGameNumber,
          group: mostCurrentGroup,
          id: v4(),
          index: scheduledGames.length,
          pairedGameId: 'NoPairedGameId',
        };
        currentGameNumber += 1;
      }

      if (gamePair.game2) {
        pairedGame2 = gamePair.game2;
        pairedGame2.gameState = GameState.finished;
        scheduledPairedGame2 = {
          game: pairedGame2,
          gameNumber: currentGameNumber,
          group: mostCurrentGroup,
          id: v4(),
          index: scheduledGames.length,
          pairedGameId: 'NoPairedGameId',
        };
        currentGameNumber += 1;
      }
      if (scheduledPairedGame1) {
        scheduledGames.push(scheduledPairedGame1);
      }
      if (scheduledPairedGame2) {
        scheduledGames.push(scheduledPairedGame2);
      }
    } else {
      const gamePair = TournamentFlow.getNextGame(mostCurrentGroup);
      if (!gamePair) {
        break;
      }

      if (gamePair.game1) {
        pairedGame1 = gamePair.game1;
        pairedGame1.gameState = GameState.finished;
        scheduledGames.push({
          game: new Game(pairedGame1),
          gameNumber: currentGameNumber,
          group: mostCurrentGroup,
          id: v4(),
          index: scheduledGames.length,
          pairedGameId: 'NoPairedGameId',
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
  type?: TournamentType,
) => {
  if (!groups?.length || !settings || !type) {
    return [];
  }
  switch (type.type) {
    case TournamentTypeEnum.roundRobin:
      return generateRoundRobinSchedule(groups, settings);
    case TournamentTypeEnum.singleElimination:
      return generateSingleEliminationSchedule(groups, settings);
    case TournamentTypeEnum.renting:
      return generateRentingSchedule(groups);
    case TournamentTypeEnum.training:
      return [];
    default:
      return [];
  }
};

const getLeaderboardForPreviousStageGroups = (
  previousStageGroups?: TournamentGroup[],
  settings?: TournamentSettings,
  previousStageTypeSettings?: TournamentTypeSettings,
  numberOfTopTeamsToProceedToNextStage: number = 2,
) => {
  if (!previousStageGroups || !settings || !previousStageTypeSettings) {
    return undefined;
  }
  const previousStageGroupWinners: { groupIndex: number; teams: Team[] }[] = [];
  previousStageGroups?.forEach((previousStageGroup) => {
    const groupLeaderboard = calculateTournamentGroupLeaderboard(
      previousStageGroup,
      settings,
    );
    if (!groupLeaderboard?.length) {
      return;
    }
    previousStageGroupWinners.push({
      groupIndex: previousStageGroup.groupIndex,
      teams: groupLeaderboard
        .slice(0, numberOfTopTeamsToProceedToNextStage)
        .map((leaderboardTeam) => leaderboardTeam.team),
    });
  });
  return previousStageGroupWinners;
};

export const generateNewGames = (
  teams?: Team[],
  gameSettings?: GameSettings,
  type?: TournamentType,
) => {
  if (!teams?.length || !gameSettings || !type) {
    return {
      games: [],
      totalNumberOfRounds: 0,
    };
  }
  switch (type.type) {
    case TournamentTypeEnum.roundRobin:
      return generateGamesForRoundRobin(teams, gameSettings);
    case TournamentTypeEnum.singleElimination:
      return generateGamesForEliminationBrackets(teams, gameSettings);
    case TournamentTypeEnum.renting:
      return generateGamesForRenting(teams, gameSettings);
    case TournamentTypeEnum.training:
      return {
        games: [],
        totalNumberOfRounds: 0,
      };
    default:
      return {
        games: [],
        totalNumberOfRounds: 0,
      };
  }
};

export const generateNewStage = (
  teams: Team[],
  stageNumber: number,
  numberOfGroups: number,
  tournamentType: TournamentType,
  tournament: Tournament,
) => {
  const newStageGroups: TournamentGroup[] = [];

  // 1. Set new empty groups
  for (let i = 0; i < numberOfGroups; i += 1) {
    const newId = v4();
    newStageGroups.push(
      new TournamentGroup({
        games: [],
        groupIndex: i + 1,
        _id: newId,
        id: newId,
        teams: [],
        groupType: tournamentType,
        stage: 1,
      }),
    );
  }

  // 2. Push teams to groups
  for (let i = 0, groupIndex = 0; i < teams.length; i += 1) {
    newStageGroups[groupIndex].teams.push(teams[i]);
    groupIndex = groupIndex + 1 >= numberOfGroups ? 0 : groupIndex + 1;
  }

  // 3. Generate games for new groups
  for (let i = 0; i < newStageGroups.length; i += 1) {
    const { games, totalNumberOfRounds } = generateNewGames(
      newStageGroups[i].teams,
      tournament.gameSettings,
      tournamentType,
    );
    newStageGroups[i].games = games;
    newStageGroups[i].settings = {
      bracketNumberOfRounds: totalNumberOfRounds || 0,
    };
  }

  console.log(
    newStageGroups[0].games.map((game) => ({
      nextGame: game.bracketProperties?.winnerNextRoundGameNumber,
      losernextgame: game.bracketProperties?.loserNextRoundGameNumber,
    })),
  );

  // 4. Generate Schedule for groups
  const newStageSchedule = generateTournamentSchedule(
    newStageGroups,
    tournament.settings,
    tournamentType,
  );

  const newStageId = v4();
  const newStage = new TournamentStage({
    _id: newStageId,
    id: newStageId,
    groups: newStageGroups,
    stage: stageNumber,
    schedule: newStageSchedule,
    stageGamesType: tournamentType,
  });
  return newStage;
};

export const generateNextTournamentStage = (
  tournament?: Tournament,
  type?: TournamentType,
) => {
  const numberOfTopTeamsToProceedToNextStage = 2;
  if (!tournament || !type) {
    return undefined;
  }
  const previousStageGroupWinners = getLeaderboardForPreviousStageGroups(
    tournament?.previousStage?.groups,
    tournament.settings,
    tournament?.previousStage?.stageGamesType.settings,
  );

  if (!previousStageGroupWinners) {
    return undefined;
  }

  let nextStageTeams: Team[] = [];

  for (let i = 0; i < tournament.settings.numberOfGroups; i += 1) {
    nextStageTeams.push(...previousStageGroupWinners[i].teams);
  }

  switch (tournament.settings.secondStageType?.type) {
    case TournamentTypeEnum.roundRobin: {
      nextStageTeams = shuffleArray(nextStageTeams);
      break;
    }
    case TournamentTypeEnum.singleElimination: {
      const seededTeamsGrouped: Team[][] = [];
      for (let i = 0; i < numberOfTopTeamsToProceedToNextStage; i += 1) {
        const seedTeams: Team[] = [];
        for (let j = 0; j < tournament.settings.numberOfGroups; j += 1) {
          const seedTeam =
            nextStageTeams[i + j * numberOfTopTeamsToProceedToNextStage];
          if (seedTeam) {
            seedTeams.push(seedTeam);
          }
        }
        if (tournament.settings.numberOfGroups > 2) {
          seedTeams.reverse();
        }
        seededTeamsGrouped.push(seedTeams);
      }
      nextStageTeams = seededTeamsGrouped.flat(1);
      break;
    }
    default:
      break;
  }

  const nextStageNumber = (tournament?.previousStage?.stage || 1) + 1;

  return generateNewStage(nextStageTeams, nextStageNumber, 1, type, tournament);
};
