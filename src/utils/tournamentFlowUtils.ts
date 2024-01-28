import Game from 'types/Game';
import { GameState } from 'types/GameState';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';

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
    console.log('Aj am hir');
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
  | 'NoMoreGames' => {
  let activeGroup = groups.find((group) => group.id === activeGroupId);
  if (!activeGroup) {
    return 'NoMoreGames';
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
    return 'NoMoreGames';
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
        return 'NoMoreGames';
      }
      newActiveGame = game1;
      newPairedGame1 = game1;
      newPairedGame2 = game2;
    } else {
      const newNextGame = getNextGame(activeGroup!);
      if (!newNextGame?.game1) {
        return 'NoMoreGames';
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
