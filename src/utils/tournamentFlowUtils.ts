import Game from 'types/Game';
import { GameState } from 'types/GameState';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentSettings } from 'types/TournamentSettings';

export const switchGroups = (
  currentGroup: TournamentGroup,
  groups: TournamentGroup[],
  currentStage: number,
) => {
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
  settings: TournamentSettings,
): { switchToNewPair?: boolean; newActiveGameId?: string } => {
  if (
    (pairedGame1.gameState === GameState.finished &&
      pairedGame2?.gameState === GameState.finished) ||
    (!pairedGame2 && pairedGame1.gameState === GameState.finished)
  ) {
    return { switchToNewPair: true };
  }
  if (pairedGame1.gameState === GameState.playing && pairedGame2) {
    return { newActiveGameId: pairedGame2.id };
  }
  return { newActiveGameId: pairedGame1.id };
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
  return availableGroupGames.length >= 2
    ? { game1: availableGroupGames[0], game2: availableGroupGames[1] }
    : null;
};

export const switchGames = (
  groups: TournamentGroup[],
  settings: TournamentSettings,
  currentStage: number,
  activeGroupId: string,
  activeGameId: string,
  pairedGame1: Game,
  pairedGame2?: Game,
) => {
  let activeGroup = groups.find((group) => group.id === activeGroupId);
  if (!activeGroup) {
    return;
  }
  const { switchToNewPair, newActiveGameId } = checkIfCurrentGamesAreFinished(
    pairedGame1,
    pairedGame2,
    settings,
  );
  if (switchToNewPair) {
    if (settings.switchGroups) {
      // Get new games in a new group
      activeGroup = switchGroups(activeGroup, groups, currentStage);
    }
    if (settings.switchGames) {
      getNextGamePair(activeGroup!);
    } else {
      getNextGame(activeGroup!);
    }
  }
};
