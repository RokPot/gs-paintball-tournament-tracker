import Game from 'types/Game';
import { GameState } from 'types/GameState';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentScheduleGame } from 'types/TournamentScheduleGame';
import { TournamentSettings } from 'types/TournamentSettings';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentType } from 'types/TournamentType';

export enum FlowState {
  NoGamesAvailable = 'noGamesAvailable',
  GamesAvailable = 'gamesAvailable',
  GroupNotFound = 'groupNotFound',
  NotDefined = 'notDefined',
}

type NextGameState =
  | {
      newActiveGame: TournamentScheduleGame;
      newPairedGame1: TournamentScheduleGame;
      newPairedGame2?: TournamentScheduleGame;
    }
  | FlowState.NoGamesAvailable;

export const getNextGroup = (
  currentGroup: TournamentGroup,
  groups: TournamentGroup[],
  currentStage: number,
  switchGroups: boolean,
) => {
  if (!switchGroups) {
    if (
      currentGroup.games.some(
        (game) => ![GameState.finished].includes(game.gameState),
      )
    ) {
      return currentGroup;
    }
  }

  const currentStageGroups = groups.filter(
    (group) => group.stage === currentStage,
  );

  const groupIndexes: number[] = [];
  for (let i = 0; i < currentStageGroups.length; i += 1) {
    const group = currentStageGroups[i];
    if (
      group.games.some((game) => ![GameState.finished].includes(game.gameState))
    ) {
      groupIndexes.push(group.groupIndex);
    }
  }
  const availableNextGroupsForSwitching = groupIndexes.filter(
    (groupIndex) => groupIndex !== currentGroup.groupIndex,
  );
  const areThereNoOtherAvailableGroups =
    !availableNextGroupsForSwitching?.length;
  const isCurrentGroupStillAvailable = groupIndexes.find(
    (groupIndex) => currentGroup.groupIndex === groupIndex,
  );
  if (areThereNoOtherAvailableGroups && isCurrentGroupStillAvailable) {
    return currentGroup;
  }

  let nextGroupIndex = availableNextGroupsForSwitching.find(
    (groupIndex) => groupIndex === currentGroup.groupIndex + 1,
  );
  if (nextGroupIndex === undefined) {
    const [firstAvailableGroupIndex] = availableNextGroupsForSwitching;
    nextGroupIndex = firstAvailableGroupIndex;
  }
  return groups.find((group) => group.groupIndex === nextGroupIndex);
};

export const checkIfCurrentGamesAreFinished = (
  pairedGame1: Game,
  pairedGame2?: Game,
): {
  shouldSwitchToNewPair?: boolean;
  game1Available?: boolean;
  game2Available?: boolean;
} => {
  if (
    (pairedGame1.gameState === GameState.finished &&
      pairedGame2?.gameState === GameState.finished) ||
    (!pairedGame2 && pairedGame1.gameState === GameState.finished)
  ) {
    return { shouldSwitchToNewPair: true };
  }
  return {
    game1Available: pairedGame1?.gameState !== GameState.finished,
    game2Available: pairedGame2?.gameState !== GameState.finished,
  };
};

export const getNextGame = (currentGroup: TournamentGroup) => {
  const availableGroupGames = currentGroup.games.filter(
    (game) => game.gameState === GameState.created,
  );
  return availableGroupGames.length >= 1
    ? { game1: availableGroupGames[0] }
    : null;
};

export const getNextGamePair = (currentGroup: TournamentGroup) => {
  const availableGroupGames = currentGroup.games.filter(
    (game) => game.gameState === GameState.created,
  );
  return {
    game1: availableGroupGames.length > 0 ? availableGroupGames[0] : undefined,
    game2: availableGroupGames.length > 1 ? availableGroupGames[1] : undefined,
  };
};

export const getNextScheduledGame = (
  schedule: TournamentScheduleGame[],
  currentScheduleGameIndex: number,
) => {
  if (schedule.length < currentScheduleGameIndex) {
    return {
      game1: undefined,
      game2: undefined,
    };
  }

  return {
    game1:
      schedule.length > currentScheduleGameIndex
        ? schedule[currentScheduleGameIndex]
        : undefined,
  };
};

export const getNextScheduledGamePair = (
  schedule: TournamentScheduleGame[],
  currentScheduleGameIndex: number,
) => {
  if (schedule.length < currentScheduleGameIndex) {
    return {
      game1: undefined,
      game2: undefined,
    };
  }

  return {
    game1:
      schedule.length > currentScheduleGameIndex
        ? schedule[currentScheduleGameIndex]
        : undefined,
    game2:
      schedule.length > currentScheduleGameIndex + 1
        ? schedule[currentScheduleGameIndex + 1]
        : undefined,
  };
};

export const switchGames = (
  groups: TournamentGroup[],
  settings: TournamentSettings,
  currentStage: number,
  activeGroupId: string,
  activeGame: Game,
  pairedGame1: Game,
  pairedGame2?: Game,
):
  | {
      newActiveGame: Game;
      newPairedGame1: Game;
      newPairedGame2?: Game;
      activeGroup: TournamentGroup;
    }
  | FlowState.GroupNotFound
  | FlowState.NoGamesAvailable => {
  let activeGroup = groups.find((group) => group.id === activeGroupId);
  if (!activeGroup) {
    return FlowState.GroupNotFound;
  }
  let newActiveGame: Game = activeGame;
  let newPairedGame1: Game = pairedGame1;
  let newPairedGame2: Game | undefined = pairedGame2;

  const {
    game1Available,
    game2Available,
    shouldSwitchToNewPair: switchToNewPair,
  } = checkIfCurrentGamesAreFinished(pairedGame1, pairedGame2);

  activeGroup = getNextGroup(
    activeGroup,
    groups,
    currentStage,
    settings.switchGroups,
  );
  if (!activeGroup) {
    return FlowState.GroupNotFound;
  }
  if (game1Available || game2Available) {
    const isGame1Active = pairedGame1.id === activeGame.id;
    if (settings.switchGames) {
      if (isGame1Active) {
        if (game2Available) {
          // return game 2
          return {
            newActiveGame: newPairedGame2!,
            newPairedGame1,
            newPairedGame2,
            activeGroup,
          };
        }
        // return game 1
        return {
          newActiveGame: newPairedGame1,
          newPairedGame1,
          newPairedGame2,
          activeGroup,
        };
      }
      if (game1Available) {
        // return game 1
        return {
          newActiveGame: newPairedGame1,
          newPairedGame1,
          newPairedGame2,
          activeGroup,
        };
      }
      // return game 2
      return {
        newActiveGame: newPairedGame2!,
        newPairedGame1,
        newPairedGame2,
        activeGroup,
      };
    }
  }

  if (switchToNewPair) {
    if (settings.switchGames) {
      const { game1, game2 } = getNextGamePair(activeGroup!);
      if (!game1) {
        return FlowState.NoGamesAvailable;
      }
      newActiveGame = game1;
      newPairedGame1 = game1;
      newPairedGame2 = game2;
    } else {
      const newNextGame = getNextGame(activeGroup!);
      if (!newNextGame?.game1) {
        return FlowState.NoGamesAvailable;
      }
      newActiveGame = newNextGame.game1;
      newPairedGame1 = newNextGame.game1;
    }
  }

  // Not switching games
  return {
    newActiveGame,
    newPairedGame1,
    newPairedGame2,
    activeGroup,
  };
};

const switchToNextRoundRobinGame = (
  schedule: TournamentScheduleGame[],
  settings: TournamentSettings,
  activeGame: TournamentScheduleGame,
  pairedScheduledGame1: TournamentScheduleGame,
  pairedScheduledGame2?: TournamentScheduleGame,
): NextGameState => {
  const availableScheduledGames = schedule?.filter(
    (scheduledGame) => scheduledGame.game.gameState !== GameState.finished,
  );
  if (!availableScheduledGames?.length) {
    return FlowState.NoGamesAvailable;
  }
  let newActiveGame: TournamentScheduleGame = activeGame;
  let newPairedGame1: TournamentScheduleGame = pairedScheduledGame1;
  let newPairedGame2: TournamentScheduleGame | undefined = pairedScheduledGame2;

  const {
    game1Available,
    game2Available,
    shouldSwitchToNewPair: switchToNewPair,
  } = checkIfCurrentGamesAreFinished(newPairedGame1.game, newPairedGame2?.game);

  if (game1Available || game2Available) {
    const isGame1Active = pairedScheduledGame1.id === activeGame.id;
    if (settings.switchGames) {
      if (isGame1Active) {
        // If Game 1 is active, set game 2 as active game if its available
        return {
          newActiveGame: game2Available ? newPairedGame2! : newPairedGame1,
          newPairedGame1,
          newPairedGame2,
        };
      }
      if (!isGame1Active) {
        // If Game 2 is active, set game 1 as active game if its available
        return {
          newActiveGame: game1Available ? newPairedGame1 : newPairedGame2!,
          newPairedGame1,
          newPairedGame2,
        };
      }
    }
  }

  if (switchToNewPair) {
    if (settings.switchGames) {
      const { game1, game2 } = getNextScheduledGamePair(
        schedule,
        activeGame.gameNumber,
      );
      if (!game1) {
        return FlowState.NoGamesAvailable;
      }
      newActiveGame = game1;
      newPairedGame1 = game1;
      newPairedGame2 = game2;
    } else {
      const newNextGame = getNextScheduledGame(schedule, activeGame.gameNumber);
      if (!newNextGame?.game1) {
        return FlowState.NoGamesAvailable;
      }
      newActiveGame = newNextGame.game1;
      newPairedGame1 = newNextGame.game1;
    }
  }

  // Not switching games
  return {
    newActiveGame,
    newPairedGame1,
    newPairedGame2,
  };
};

const switchToNextSingleEliminationsGame = (
  schedule: TournamentScheduleGame[],
  settings: TournamentSettings,
  activeGame: TournamentScheduleGame,
  pairedScheduledGame1: TournamentScheduleGame,
  pairedScheduledGame2?: TournamentScheduleGame,
): NextGameState => {
  if (!activeGame?.game?.bracketProperties) {
    return FlowState.NoGamesAvailable;
  }
  const currentBracketsRound = activeGame.game.bracketProperties.round;
  const availableScheduledGames = schedule?.filter(
    (scheduledGame) =>
      scheduledGame.game.gameState !== GameState.finished &&
      scheduledGame.game?.bracketProperties?.round === currentBracketsRound,
  );

  if (!availableScheduledGames?.length) {
    return FlowState.NoGamesAvailable;
  }
  let newActiveGame: TournamentScheduleGame = activeGame;
  let newPairedGame1: TournamentScheduleGame = pairedScheduledGame1;
  let newPairedGame2: TournamentScheduleGame | undefined = pairedScheduledGame2;

  const {
    game1Available,
    game2Available,
    shouldSwitchToNewPair: switchToNewPair,
  } = checkIfCurrentGamesAreFinished(newPairedGame1.game, newPairedGame2?.game);

  if (game1Available || game2Available) {
    const isGame1Active = pairedScheduledGame1.id === activeGame.id;
    if (settings.switchGames) {
      if (isGame1Active) {
        // If Game 1 is active, set game 2 as active game if its available
        return {
          newActiveGame: game2Available ? newPairedGame2! : newPairedGame1,
          newPairedGame1,
          newPairedGame2,
        };
      }
      if (!isGame1Active) {
        // If Game 2 is active, set game 1 as active game if its available
        return {
          newActiveGame: game1Available ? newPairedGame1 : newPairedGame2!,
          newPairedGame1,
          newPairedGame2,
        };
      }
    }
  }

  if (switchToNewPair) {
    if (settings.switchGames) {
      const { game1, game2 } = getNextScheduledGamePair(
        schedule,
        activeGame.gameNumber,
      );
      if (!game1) {
        return FlowState.NoGamesAvailable;
      }
      newActiveGame = game1;
      newPairedGame1 = game1;
      newPairedGame2 = game2;
    } else {
      const newNextGame = getNextScheduledGame(schedule, activeGame.gameNumber);
      if (!newNextGame?.game1) {
        return FlowState.NoGamesAvailable;
      }
      newActiveGame = newNextGame.game1;
      newPairedGame1 = newNextGame.game1;
    }
  }

  return {
    newActiveGame,
    newPairedGame1,
    newPairedGame2,
  };
};

export const switchToNextScheduledGames = (
  schedule: TournamentScheduleGame[],
  settings: TournamentSettings,
  currentStageTournamentType: TournamentType,
  activeGame: TournamentScheduleGame,
  pairedScheduledGame1: TournamentScheduleGame,
  pairedScheduledGame2?: TournamentScheduleGame,
): NextGameState => {
  switch (currentStageTournamentType) {
    case TournamentType.roundRobin: {
      return switchToNextRoundRobinGame(
        schedule,
        settings,
        activeGame,
        pairedScheduledGame1,
        pairedScheduledGame2,
      );
    }
    case TournamentType.singleElimination: {
      return switchToNextSingleEliminationsGame(
        schedule,
        settings,
        activeGame,
        pairedScheduledGame1,
        pairedScheduledGame2,
      );
    }
    default: {
      break;
    }
  }
  return FlowState.NoGamesAvailable;
};

const prepareGamesForTheNextStage = (
  teams: Team[][],
  tournament: Tournament,
) => {
  return tournament;
};

export const proceedToNextTournamentStage = (tournament: Tournament) => {
  tournament.state.stage += 1;
  tournament.state.status = TournamentStatus.stageChange;
  const newTournament = prepareGamesForTheNextStage([], tournament);
  return newTournament;
};
