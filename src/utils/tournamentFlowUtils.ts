import { compact } from 'lodash';
import { isByePlaceholderGame } from 'types/BracketProperties';
import Game from 'types/Game';
import { MATCH_POINTS_CONSTANTS } from 'types/GamePointsConstants';
import { GameState, GameWinner } from 'types/GameState';
import { Match } from 'types/Match';
import MatchState from 'types/MatchState';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentSettings } from 'types/TournamentSettings';
import {
  TournamentType,
  TournamentTypeEnum,
  TournamentTypeSettings,
} from 'types/TournamentType';

export namespace TournamentFlow {
  export const MAX_STAGES = 2;

  export enum FlowState {
    NoGamesAvailable = 'noGamesAvailable',
    GamesAvailable = 'gamesAvailable',
    GroupNotFound = 'groupNotFound',
    NotDefined = 'notDefined',
  }

  export enum EndTournamentCheck {
    GoToNextTournamentStage = 'goToNextTournamentStage',
    FinishTournament = 'finishTournament',
    ContinueTournamentStage = 'continueTournamentStage',
  }

  type NextGameState =
    | {
        newActiveGame: TournamentScheduleGame;
        newPairedGame1: TournamentScheduleGame;
        newPairedGame2?: TournamentScheduleGame;
      }
    | FlowState.NoGamesAvailable;
  interface ProcessedFinishedMatchState {
    gamesToUpdate: Game[];
    flowState: TournamentFlow.FlowState;
    nextGameState: NextGameState;
  }

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
        group.games.some(
          (game) => ![GameState.finished].includes(game.gameState),
        )
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
    const isGamePlayable = (game?: Game) =>
      !!game &&
      !isByePlaceholderGame(game) &&
      game.gameState !== GameState.finished;

    if (!isGamePlayable(pairedGame1) && !isGamePlayable(pairedGame2)) {
      return { shouldSwitchToNewPair: true };
    }
    return {
      game1Available: isGamePlayable(pairedGame1),
      game2Available: isGamePlayable(pairedGame2),
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
      game1:
        availableGroupGames.length > 0 ? availableGroupGames[0] : undefined,
      game2:
        availableGroupGames.length > 1 ? availableGroupGames[1] : undefined,
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
      game1: schedule
        .slice(currentScheduleGameIndex)
        .find((scheduledGame) => !isByePlaceholderGame(scheduledGame.game)),
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
    const playableGames = schedule
      .slice(currentScheduleGameIndex)
      .filter((scheduledGame) => !isByePlaceholderGame(scheduledGame.game));
    const game1 = playableGames[0];
    if (!game1) {
      return {
        game1: undefined,
        game2: undefined,
      };
    }

    const isUnpaired =
      !game1.pairedGameId ||
      game1.pairedGameId === 'NoPairedGameId' ||
      game1.pairedGameId === 'NoPairedGame';
    const storedPair = isUnpaired
      ? undefined
      : playableGames.find(
          (scheduledGame) =>
            scheduledGame.id === game1.pairedGameId &&
            scheduledGame.id !== game1.id &&
            scheduledGame.game.gameState !== GameState.finished,
        );
    if (storedPair) {
      return {
        game1,
        game2: storedPair,
      };
    }

    let game2: TournamentScheduleGame | undefined = playableGames[1];
    if (game1.group.id !== game2?.group.id) {
      game2 = undefined;
    }
    return {
      game1,
      game2,
    };
  };

  const MAX_UPCOMING_GROUPS = 2;

  export const getUpcomingScheduleGameGroups = (
    schedule?: TournamentScheduleGame[],
  ): TournamentScheduleGame[][] => {
    if (!schedule?.length) {
      return [];
    }

    const createdPlayableGames = schedule.filter(
      (scheduledGame) =>
        scheduledGame.game.gameState === GameState.created &&
        !isByePlaceholderGame(scheduledGame.game),
    );

    const groupedUpcomingGames: TournamentScheduleGame[][] = [];
    for (let i = 0; i < createdPlayableGames.length; ) {
      if (groupedUpcomingGames.length >= MAX_UPCOMING_GROUPS) {
        break;
      }
      const firstGamePair = createdPlayableGames[i];
      const secondGamePair = createdPlayableGames[i + 1];
      if (firstGamePair?.pairedGameId === secondGamePair?.id) {
        groupedUpcomingGames.push([firstGamePair, secondGamePair]);
        i += 2;
      } else {
        groupedUpcomingGames.push([firstGamePair]);
        i += 1;
      }
    }
    return groupedUpcomingGames;
  };

  const isLockedGameState = (gameState: GameState) =>
    gameState === GameState.finished || gameState === GameState.postponed;

  export const applyActivePairGameStates = (
    activeGame: TournamentScheduleGame,
    pairedGame1: TournamentScheduleGame,
    pairedGame2?: TournamentScheduleGame,
  ) => {
    if (!isLockedGameState(activeGame.game.gameState)) {
      activeGame.game.gameState = GameState.playing;
    }
    if (
      pairedGame1.id !== activeGame.id &&
      !isLockedGameState(pairedGame1.game.gameState)
    ) {
      pairedGame1.game.gameState = GameState.waiting;
    }
    if (
      pairedGame2 &&
      pairedGame2.id !== activeGame.id &&
      !isLockedGameState(pairedGame2.game.gameState)
    ) {
      pairedGame2.game.gameState = GameState.waiting;
    }
  };

  const switchToNewActiveGame = (
    pairedGame1: TournamentScheduleGame,
    pairedGame2?: TournamentScheduleGame,
  ) => {
    return pairedGame2 &&
      pairedGame2.game.gameState !== GameState.finished &&
      !isByePlaceholderGame(pairedGame2.game)
      ? pairedGame2
      : pairedGame1;
  };

  const switchToNextRoundRobinGame = (
    schedule: TournamentScheduleGame[],
    settings: TournamentSettings,
    activeGame: TournamentScheduleGame,
  ): NextGameState => {
    const availableScheduledGames = schedule?.filter(
      (scheduledGame) => scheduledGame.game.gameState !== GameState.finished,
    );
    if (!availableScheduledGames?.length) {
      return FlowState.NoGamesAvailable;
    }
    let newActiveGame: TournamentScheduleGame = activeGame;

    const currentPairedGame1 = activeGame;
    const currentPairedGame2: TournamentScheduleGame | undefined =
      schedule.find((schedGame) => schedGame.id === activeGame.pairedGameId);

    let newPairedGame1: TournamentScheduleGame = currentPairedGame1;
    let newPairedGame2: TournamentScheduleGame | undefined = currentPairedGame2;

    const {
      game1Available,
      game2Available,
      shouldSwitchToNewPair: switchToNewPair,
    } = checkIfCurrentGamesAreFinished(
      currentPairedGame1.game,
      currentPairedGame2?.game,
    );

    if (game1Available || game2Available) {
      if (settings.switchGames) {
        return {
          newActiveGame: switchToNewActiveGame(newPairedGame1, newPairedGame2),
          newPairedGame1,
          newPairedGame2,
        };
      }
    }

    if (switchToNewPair) {
      if (settings.switchGames) {
        const { game1, game2 } = getNextScheduledGamePair(
          schedule,
          Math.max(
            currentPairedGame1.gameNumber,
            currentPairedGame2?.gameNumber ?? 0,
          ),
        );
        if (!game1) {
          return FlowState.NoGamesAvailable;
        }
        newActiveGame = game1;
        newPairedGame1 = game1;
        newPairedGame2 = game2;
      } else {
        const newNextGame = getNextScheduledGame(
          schedule,
          activeGame.gameNumber,
        );
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
  ): NextGameState => {
    if (!activeGame?.game?.bracketProperties) {
      return FlowState.NoGamesAvailable;
    }

    const currentBracketsRound = activeGame.game.bracketProperties.round;
    let availableScheduledGames = schedule?.filter(
      (scheduledGame) =>
        scheduledGame.game.gameState !== GameState.finished &&
        !isByePlaceholderGame(scheduledGame.game) &&
        scheduledGame.game?.bracketProperties?.round === currentBracketsRound,
    );

    if (!availableScheduledGames?.length) {
      availableScheduledGames = schedule?.filter(
        (scheduledGame) =>
          scheduledGame.game.gameState !== GameState.finished &&
          !isByePlaceholderGame(scheduledGame.game) &&
          scheduledGame.game?.bracketProperties?.round ===
            currentBracketsRound + 1,
      );
      if (!availableScheduledGames?.length) {
        return FlowState.NoGamesAvailable;
      }
    }

    if (!availableScheduledGames?.length) {
      // If current round games are finished go to next round
      availableScheduledGames = schedule?.filter(
        (scheduledGame) =>
          scheduledGame.game.gameState !== GameState.finished &&
          !isByePlaceholderGame(scheduledGame.game) &&
          scheduledGame.game?.bracketProperties?.round ===
            currentBracketsRound + 1,
      );
      if (!availableScheduledGames?.length) {
        return FlowState.NoGamesAvailable;
      }
    }
    let newActiveGame: TournamentScheduleGame = activeGame;
    let newPairedGame1: TournamentScheduleGame = activeGame;
    let newPairedGame2: TournamentScheduleGame | undefined = schedule.find(
      (schedGame) => schedGame.id === activeGame.pairedGameId,
    );

    const {
      game1Available,
      game2Available,
      shouldSwitchToNewPair: switchToNewPair,
    } = checkIfCurrentGamesAreFinished(
      newPairedGame1.game,
      newPairedGame2?.game,
    );

    if (game1Available || game2Available) {
      if (settings.switchGames) {
        return {
          newActiveGame: switchToNewActiveGame(newPairedGame1, newPairedGame2),
          newPairedGame1,
          newPairedGame2,
        };
      }
    }

    if (switchToNewPair) {
      if (settings.switchGames) {
        const { game1, game2 } = getNextScheduledGamePair(
          schedule,
          Math.max(newPairedGame1.gameNumber, newPairedGame2?.gameNumber ?? 0),
        );
        if (!game1) {
          return FlowState.NoGamesAvailable;
        }
        newActiveGame = game1;
        newPairedGame1 = game1;
        newPairedGame2 = game2;
      } else {
        const newNextGame = getNextScheduledGame(
          schedule,
          activeGame.gameNumber,
        );
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
  ): NextGameState => {
    switch (currentStageTournamentType.type) {
      case TournamentTypeEnum.roundRobin: {
        return switchToNextRoundRobinGame(schedule, settings, activeGame);
      }
      case TournamentTypeEnum.singleElimination: {
        return switchToNextSingleEliminationsGame(
          schedule,
          settings,
          activeGame,
        );
      }
      default: {
        break;
      }
    }
    return FlowState.NoGamesAvailable;
  };

  const getNumberOfWinsRequired = (
    stageSettings: TournamentTypeSettings,
    isFirstPlaceGame: boolean,
    isThirdPlaceGame: boolean,
  ) => {
    if (isFirstPlaceGame) {
      return stageSettings?.firstPlaceNumberOfWinsRequired;
    }
    if (isThirdPlaceGame) {
      return stageSettings?.thirdPlaceNumberOfWinsRequired;
    }
    return stageSettings.numberOfWinsRequired;
  };

  export const checkIfGameIsFinishedProcedure = (
    game: Game,
    timeLeft: number,
    tournamentSettings: TournamentSettings,
    isFirstPlaceGame: boolean,
    isThirdPlaceGame: boolean,
    stageSettings: TournamentTypeSettings,
  ) => {
    const { twoWinsDifference } = tournamentSettings;

    const team1Score = game.team1Wins;
    const team2Score = game.team2Wins;

    const numberOfWinsRequired = getNumberOfWinsRequired(
      stageSettings,
      isFirstPlaceGame,
      isThirdPlaceGame,
    );

    if (timeLeft <= 0) {
      const team1HasMoreWinsThanTeam2 = team1Score > team2Score;
      const team2HasMoreWinsThanTeam1 = team2Score > team1Score;
      const isGameADraw = team1Score === team2Score;
      if (team1HasMoreWinsThanTeam2) {
        return { gameWinner: GameWinner.team1, winningTeam: game.team1 };
      }
      if (team2HasMoreWinsThanTeam1) {
        return { gameWinner: GameWinner.team2, winningTeam: game.team2 };
      }

      if (isGameADraw) {
        return { gameWinner: GameWinner.draw };
      }
    }

    if (
      tournamentSettings.secondStageType &&
      [TournamentTypeEnum.training, TournamentTypeEnum.renting].includes(
        tournamentSettings.secondStageType.type,
      )
    ) {
      return { gameWinner: GameWinner.notYet };
    }

    const addToTeamsForTwosDifference = twoWinsDifference ? 1 : 0;

    const team1HasMoreThanThresholdWins = team1Score >= numberOfWinsRequired;
    const team2HasMoreThanThresholdWins = team2Score >= numberOfWinsRequired;

    const team1HasMoreWinsThanTeam2 =
      team1Score > team2Score + addToTeamsForTwosDifference;
    const team2HasMoreWinsThanTeam1 =
      team2Score > team1Score + addToTeamsForTwosDifference;
    const isGameADraw = team1Score === team2Score;

    if (team1HasMoreThanThresholdWins && team1HasMoreWinsThanTeam2) {
      return { gameWinner: GameWinner.team1, winningTeam: game.team1 };
    }
    if (team2HasMoreThanThresholdWins && team2HasMoreWinsThanTeam1) {
      return { gameWinner: GameWinner.team2, winningTeam: game.team2 };
    }
    if (
      (team1HasMoreThanThresholdWins || team2HasMoreThanThresholdWins) &&
      isGameADraw &&
      !twoWinsDifference
    ) {
      return { gameWinner: GameWinner.draw };
    }
    return { gameWinner: GameWinner.notYet };
  };

  export const getNextGamesForEliminationsTournament = (
    game: Game,
    currentGroup?: TournamentGroup,
    currentStageTournamentType?: TournamentType,
  ) => {
    if (!currentGroup || !currentStageTournamentType) {
      return {
        nextRoundGameWinner: undefined,
        nextRoundGameLoser: undefined,
      };
    }

    switch (currentStageTournamentType.type) {
      case TournamentTypeEnum.singleElimination: {
        const currentGameBracketProperties = game.bracketProperties;
        const currentGroupGames = currentGroup.games;
        let nextRelatedBracketGameForWinningTeam: Game | undefined;
        let nextRelatedBracketGameForLosingTeam: Game | undefined;
        if (
          currentGameBracketProperties?.winnerNextRoundGameNumber !== undefined
        ) {
          nextRelatedBracketGameForWinningTeam = currentGroupGames?.find(
            (newGame) =>
              newGame.bracketProperties?.round ===
                currentGameBracketProperties!.round + 1 &&
              newGame.bracketProperties.roundGameNumber ===
                currentGameBracketProperties?.winnerNextRoundGameNumber,
          );
        }

        if (
          currentGameBracketProperties?.loserNextRoundGameNumber !== undefined
        ) {
          nextRelatedBracketGameForLosingTeam = currentGroupGames?.find(
            (newGame) =>
              newGame.bracketProperties?.round ===
                currentGameBracketProperties!.round + 1 &&
              newGame.bracketProperties.roundGameNumber ===
                currentGameBracketProperties?.loserNextRoundGameNumber,
          );
        }

        return {
          nextRoundGameWinner: nextRelatedBracketGameForWinningTeam,
          nextRoundGameLoser: nextRelatedBracketGameForLosingTeam,
        };
      }
      case TournamentTypeEnum.roundRobin:
      case TournamentTypeEnum.training:
      case TournamentTypeEnum.renting:
      default: {
        break;
      }
    }
    return {
      nextRoundGameWinner: undefined,
      nextRoundGameLoser: undefined,
    };
  };

  export const prepareNextGameIfEliminationsTournament = (
    game: Game,
    currentGroup?: TournamentGroup,
    currentStageTournamentType?: TournamentType,
    overrideExisting?: boolean,
  ) => {
    if (!currentGroup || !currentStageTournamentType) {
      return undefined;
    }

    switch (currentStageTournamentType.type) {
      case TournamentTypeEnum.singleElimination: {
        const {
          nextRoundGameLoser: nextRelatedBracketGameForLosingTeam,
          nextRoundGameWinner: nextRelatedBracketGameForWinningTeam,
        } = getNextGamesForEliminationsTournament(
          game,
          currentGroup,
          currentStageTournamentType,
        );

        if (nextRelatedBracketGameForWinningTeam) {
          const winningTeam =
            game.gameWinner === GameWinner.team1 ? game.team1 : game.team2;
          const losingTeam =
            game.gameWinner === GameWinner.team1 ? game.team2 : game.team1;
          if (overrideExisting) {
            if (
              [winningTeam.id, losingTeam.id].includes(
                nextRelatedBracketGameForWinningTeam.team1.id,
              )
            ) {
              nextRelatedBracketGameForWinningTeam.team1 = winningTeam;
            } else if (
              [winningTeam.id, losingTeam.id].includes(
                nextRelatedBracketGameForWinningTeam.team2.id,
              )
            ) {
              nextRelatedBracketGameForWinningTeam.team2 = winningTeam;
            }
          } else if (!nextRelatedBracketGameForWinningTeam.team1.id) {
            nextRelatedBracketGameForWinningTeam.team1 = winningTeam;
          } else if (!nextRelatedBracketGameForWinningTeam.team2.id) {
            nextRelatedBracketGameForWinningTeam.team2 = winningTeam;
          }
        }

        if (nextRelatedBracketGameForLosingTeam) {
          const losingTeam =
            game.gameWinner === GameWinner.team1 ? game.team2 : game.team1;
          const winningTeam =
            game.gameWinner === GameWinner.team1 ? game.team1 : game.team2;
          if (overrideExisting) {
            if (
              [winningTeam.id, losingTeam.id].includes(
                nextRelatedBracketGameForLosingTeam.team1.id,
              )
            ) {
              nextRelatedBracketGameForLosingTeam.team1 = losingTeam;
            } else if (
              [winningTeam.id, losingTeam.id].includes(
                nextRelatedBracketGameForLosingTeam.team2.id,
              )
            ) {
              nextRelatedBracketGameForLosingTeam.team2 = losingTeam;
            }
          } else if (!nextRelatedBracketGameForLosingTeam.team1.id) {
            nextRelatedBracketGameForLosingTeam.team1 = losingTeam;
          } else if (!nextRelatedBracketGameForLosingTeam.team2.id) {
            nextRelatedBracketGameForLosingTeam.team2 = losingTeam;
          }
        }
        return {
          nextRoundGameWinner: nextRelatedBracketGameForWinningTeam,
          nextRoundGameLoser: nextRelatedBracketGameForLosingTeam,
        };
      }
      case TournamentTypeEnum.roundRobin:
      case TournamentTypeEnum.renting:
      case TournamentTypeEnum.training:
      default: {
        break;
      }
    }
    return undefined;
  };

  export const finishSelectedGame = (game: Game, gameWinner: GameWinner) => {
    game.gameState = GameState.finished;
    game.gameWinner = gameWinner;
    return game;
  };

  /**
   * Remaining clock for the next match of this game. A game that has not
   * played a match yet always starts from the configured length, so switching
   * to the paired game does not inherit the previous game's leftover.
   */
  export const getRemainingGameTimeInSeconds = (
    game: Game,
    defaultGameTimeInSeconds: number,
  ) => {
    if (!game.matches?.length) {
      return defaultGameTimeInSeconds;
    }
    return game.gameTime;
  };

  export const addMatchDataToGame = (
    scheduledGame: TournamentScheduleGame,
    match: Match,
    timeLeftInMilliseconds: number,
    currentDuration: number,
  ) => {
    match.matchDurationInSeconds = currentDuration;
    if (scheduledGame.game?.matches?.length > 0) {
      scheduledGame.game.matches.push(match);
    } else {
      scheduledGame.game.matches = [match];
    }

    scheduledGame.game.gameTime = timeLeftInMilliseconds / 1000;

    switch (match.matchState) {
      case MatchState.team1Win:
        scheduledGame.game.team1Wins += MATCH_POINTS_CONSTANTS.WIN;
        break;
      case MatchState.team2Win:
        scheduledGame.game.team2Wins += MATCH_POINTS_CONSTANTS.WIN;
        break;
      case MatchState.draw:
        scheduledGame.game.team1Wins += MATCH_POINTS_CONSTANTS.DRAW;
        scheduledGame.game.team2Wins += MATCH_POINTS_CONSTANTS.DRAW;
        break;
      default:
        break;
    }

    return scheduledGame;
  };

  export const checkIfGameIsFinished = (
    game: Game,
    timeLeft: number,
    tournamentSettings: TournamentSettings,
    stageSettings: TournamentTypeSettings,
    isFirstPlaceGame: boolean,
    isThirdPlaceGame: boolean,
  ) => {
    const { twoWinsDifference } = tournamentSettings;
    const team1Score = game.team1Wins;
    const team2Score = game.team2Wins;

    const numberOfWinsRequired = getNumberOfWinsRequired(
      stageSettings,
      isFirstPlaceGame,
      isThirdPlaceGame,
    );

    if (timeLeft <= 0) {
      const team1HasMoreWinsThanTeam2 = team1Score > team2Score;
      const team2HasMoreWinsThanTeam1 = team2Score > team1Score;
      const isGameADraw = team1Score === team2Score;
      if (team1HasMoreWinsThanTeam2) {
        return { gameWinner: GameWinner.team1, winningTeam: game.team1 };
      }
      if (team2HasMoreWinsThanTeam1) {
        return { gameWinner: GameWinner.team2, winningTeam: game.team2 };
      }
      if (isGameADraw) {
        return { gameWinner: GameWinner.draw };
      }
    }

    const addToTeamsForTwosDifference = twoWinsDifference ? 1 : 0;

    const team1HasMoreThanThresholdWins = team1Score >= numberOfWinsRequired;
    const team2HasMoreThanThresholdWins = team2Score >= numberOfWinsRequired;

    const team1HasMoreWinsThanTeam2 =
      team1Score > team2Score + addToTeamsForTwosDifference;
    const team2HasMoreWinsThanTeam1 =
      team2Score > team1Score + addToTeamsForTwosDifference;
    const isGameADraw = team1Score === team2Score;

    if (team1HasMoreThanThresholdWins && team1HasMoreWinsThanTeam2) {
      return { gameWinner: GameWinner.team1, winningTeam: game.team1 };
    }
    if (team2HasMoreThanThresholdWins && team2HasMoreWinsThanTeam1) {
      return { gameWinner: GameWinner.team2, winningTeam: game.team2 };
    }
    if (
      (team1HasMoreThanThresholdWins || team2HasMoreThanThresholdWins) &&
      isGameADraw
    ) {
      return { gameWinner: GameWinner.draw };
    }
    return { gameWinner: GameWinner.notYet };
  };

  export const prepareGamesForTournament = (
    tournament?: Tournament,
    schedule?: TournamentScheduleGame[],
  ) => {
    if (!tournament || !schedule) {
      return undefined;
    }

    const playableGames = schedule.filter(
      (scheduledGame) => !isByePlaceholderGame(scheduledGame.game),
    );
    const newPairedGame1 = playableGames[0];
    const newPairedGame2 =
      playableGames.length > 1 && tournament.settings.switchGames
        ? playableGames[1]
        : undefined;

    if (!newPairedGame1) {
      return undefined;
    }

    newPairedGame1.game.gameState = GameState.playing;
    if (newPairedGame2) {
      newPairedGame2.game.gameState = GameState.waiting;
    }
    return {
      newPairedGame1,
      newPairedGame2,
    };
  };

  export const finishGameAndPrepareNextGames = (
    game: Game,
    gameWinner: GameWinner,
    currentGroup?: TournamentGroup,
    currentStageTournamentType?: TournamentType,
  ) => {
    if (!currentGroup || !game || !currentStageTournamentType) {
      return [];
    }
    const finishedGame = TournamentFlow.finishSelectedGame(game, gameWinner);
    const nextEliminationsGame =
      TournamentFlow.prepareNextGameIfEliminationsTournament(
        game,
        currentGroup,
        currentStageTournamentType,
      );
    return compact([
      finishedGame && finishedGame,
      nextEliminationsGame?.nextRoundGameLoser &&
        nextEliminationsGame?.nextRoundGameLoser,
      nextEliminationsGame?.nextRoundGameWinner &&
        nextEliminationsGame?.nextRoundGameWinner,
    ]);
  };

  export const addTwoMinutesToDrawGame = (game: Game) => {
    game.gameTime += 120;
    return game;
  };

  export const onAfterFinishedMatchProcedure = (
    currentActiveScheduledGame: TournamentScheduleGame,
    timeLeft: number,
    tournament: Tournament,
  ): ProcessedFinishedMatchState => {
    const returnState: ProcessedFinishedMatchState = {
      gamesToUpdate: [],
      flowState: FlowState.GamesAvailable,
      nextGameState: FlowState.NoGamesAvailable,
    };

    if (
      !currentActiveScheduledGame ||
      !tournament ||
      !tournament.settings ||
      !tournament.currentStageGroups
    ) {
      returnState.flowState = TournamentFlow.FlowState.NotDefined;
      return returnState;
    }
    // 1. Check if game should be finished with this match
    const { gameWinner } = TournamentFlow.checkIfGameIsFinishedProcedure(
      currentActiveScheduledGame.game,
      timeLeft,
      tournament.settings,
      !!currentActiveScheduledGame.game.bracketProperties?.isFirstPlaceGame,
      !!currentActiveScheduledGame.game.bracketProperties?.isThridPlaceGame,
      tournament.currentStage!.stageGamesType.settings,
    );

    const groupOfCurrentGame = tournament.currentStageGroups.find(
      (group) => group.id === currentActiveScheduledGame?.group?.id,
    );

    const currentStageTournamentType =
      tournament.state.stage === 1
        ? tournament.settings.firstStageType
        : tournament.settings.secondStageType;

    if (gameWinner !== GameWinner.notYet) {
      if (
        gameWinner === GameWinner.draw &&
        currentStageTournamentType?.type ===
          TournamentTypeEnum.singleElimination
      ) {
        const extendedGame = TournamentFlow.addTwoMinutesToDrawGame(
          currentActiveScheduledGame.game,
        );
        returnState.gamesToUpdate.push(extendedGame);
      }
      if (
        gameWinner !== GameWinner.draw ||
        (gameWinner === GameWinner.draw &&
          currentStageTournamentType?.type !==
            TournamentTypeEnum.singleElimination)
      ) {
        const finishedAndRelatedGames =
          TournamentFlow.finishGameAndPrepareNextGames(
            currentActiveScheduledGame.game,
            gameWinner,
            groupOfCurrentGame,
            currentStageTournamentType,
          );
        returnState.gamesToUpdate.push(...finishedAndRelatedGames);
      }
      // 2. Finish this match, and prepare related matches
    }

    // 3. Handle game switching
    const nextGameState = TournamentFlow.switchToNextScheduledGames(
      tournament.currentStageSchedule || [],
      tournament.settings,
      currentStageTournamentType!,
      currentActiveScheduledGame,
    );

    if (nextGameState === TournamentFlow.FlowState.NoGamesAvailable) {
      returnState.flowState = TournamentFlow.FlowState.NoGamesAvailable;
      return returnState;
    }
    returnState.flowState = TournamentFlow.FlowState.GamesAvailable;
    returnState.nextGameState = nextGameState;

    return returnState;
  };

  export const onAfterFinishedMatchEndTournamentCheck = (
    newTournamentState: ProcessedFinishedMatchState,
    currentGroups: TournamentGroup[],
    tournament: Tournament,
  ): EndTournamentCheck => {
    if (
      newTournamentState.flowState !== TournamentFlow.FlowState.NoGamesAvailable
    ) {
      return EndTournamentCheck.ContinueTournamentStage;
    }

    const currentStageGamesThatAreNotYetFinished = currentGroups
      .map((group) =>
        group.games.filter((game) => game.gameState !== GameState.finished),
      )
      .flat();
    // If there are no more games, that means that we should check if tournament is finished, or if we need to change group or tournament stage

    if (!currentStageGamesThatAreNotYetFinished?.length) {
      if (
        tournament?.settings?.secondStageType &&
        tournament.settings?.numberOfGroups > 1 &&
        tournament.state.stage < MAX_STAGES
      ) {
        return EndTournamentCheck.GoToNextTournamentStage;
      }

      return EndTournamentCheck.FinishTournament;
    }
    return EndTournamentCheck.ContinueTournamentStage;
  };
}
