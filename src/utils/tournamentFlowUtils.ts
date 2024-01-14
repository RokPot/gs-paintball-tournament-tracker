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
  if (
    !switchGroups &&
    currentGroup.games.some(
      (game) => ![GameState.finished].includes(game.gameState),
    )
  ) {
    return currentGroup;
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
  return { game1: availableGroupGames[0], game2: availableGroupGames[1] };
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
  const { switchToNewPair } = checkIfCurrentGamesAreFinished(
    pairedGame1,
    pairedGame2,
  );
  if (switchToNewPair) {
    if (settings.switchGroups) {
      // Get new games in a new group
      activeGroup = getNextGroup(
        activeGroup,
        groups,
        currentStage,
        settings.switchGroups,
      );
    }
    if (settings.switchGames) {
      getNextGamePair(activeGroup!);
    } else {
      getNextGame(activeGroup!);
    }
  }
};
