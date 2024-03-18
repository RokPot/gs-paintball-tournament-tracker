import useGameQueries from 'hooks/game/useGameQueries';
import useCountdownSound from 'hooks/sounds/useCountdownSound';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useLeagueInvalidations from 'services/queries/league/useLeagueInvalidations';
import useUpdateTournament from 'services/queries/tournament/useUpdateTournament';
import useTimerStore from 'store/TimerStore';
import Game from 'types/Game';
import { DefaultGameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import { Match } from 'types/Match';
import MatchState from 'types/MatchState';
import Tournament from 'types/Tournament';
import TournamentGroup from 'types/TournamentGroup';
import { TournamentScheduleGame } from 'types/TournamentScheduleGame';
import { TournamentStatus } from 'types/TournamentStatus';
import {
  FlowState,
  checkIfGameIsFinishedProcedure,
  finishSelectedGame,
  prepareNextGameIfEliminationsTournament,
  switchToNextScheduledGames,
} from 'utils/tournamentFlowUtils';

const useTournamentFlow = (tournament?: Tournament) => {
  const {
    setDuration,
    setBreakDuration,
    getDuration,
    timingBreak,
    timingGame,
    startTimer,
    stopTimer,
  } = useTimerStore();
  const { playCountdown } = useCountdownSound();
  const { updateTournament } = useUpdateTournament();
  const { invalidateSelectedLeague } = useLeagueInvalidations();
  const { updateGameData } = useGameQueries();

  const [currentScheduledGame1, setScheduledCurrentGame1] =
    useState<TournamentScheduleGame>();
  const [currentScheduledGame2, setScheduledCurrentGame2] =
    useState<TournamentScheduleGame>();
  const [isMatchInProgress, setIsMatchInProgress] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [hasGameTimeRanOut, setHasGameTimeRanOut] = useState(false);
  const [showFinishMatchPopup, setShowFinishMatchPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentStage = useMemo(
    () => tournament?.state?.stage,
    [tournament?.state?.stage],
  );

  const activeScheduledGame = useMemo(() => {
    if (!tournament) {
      return undefined;
    }
    return tournament.schedule?.find(
      (scheduledGame) => tournament.state.activeGameId === scheduledGame.id,
    );
  }, [tournament]);

  const tournamentSettings = useMemo(() => {
    if (!tournament) {
      return undefined;
    }
    return tournament?.settings;
  }, [tournament]);

  const gameSettings = useMemo(() => {
    if (!tournament) {
      return undefined;
    }
    return tournament?.gameSettings;
  }, [tournament]);

  const currentStageTournamentType = useMemo(() => {
    if (!tournament || !tournamentSettings) {
      return undefined;
    }
    return tournament.state.stage === 1
      ? tournamentSettings?.type
      : tournamentSettings?.secondStageType;
  }, [tournament, tournamentSettings]);

  const setGameAndBreakDuration = useCallback(
    (newScheduledGame?: TournamentScheduleGame) => {
      if (!newScheduledGame) {
        return;
      }
      setDuration(newScheduledGame.game.gameTime * 1000 || 0);
      setBreakDuration(
        (gameSettings?.manualGameStartTimeInSeconds ||
          DefaultGameSettings.manualGameStartTimeInSeconds) * 1000 || 0,
      );
    },
    [gameSettings?.manualGameStartTimeInSeconds, setBreakDuration, setDuration],
  );

  const setNewActiveGroupAndGames = useCallback(
    async (
      newActiveGame: TournamentScheduleGame,
      newGame1: TournamentScheduleGame,
      newGame2?: TournamentScheduleGame,
    ) => {
      if (!tournament) {
        return;
      }
      tournament.state.activeGameId = newActiveGame.id;
      newActiveGame.game.gameState = GameState.playing;
      tournament.state.pairedGame1Id = newGame1.id;
      tournament.state.pairedGame2Id = newGame2?.id;
      if (newGame1) {
        await updateGameData(newGame1.game);
        setScheduledCurrentGame1(newGame1);
      }
      if (newGame2) {
        await updateGameData(newGame2.game);
        setScheduledCurrentGame2(newGame2);
      }

      await updateTournament(tournament);
      await invalidateSelectedLeague();
    },
    [invalidateSelectedLeague, tournament, updateGameData, updateTournament],
  );

  const beginTournament = useCallback(async () => {
    if (!tournament || !tournament?.schedule) {
      return;
    }
    tournament.state.status = TournamentStatus.inProgress;

    // Begin tournament
    const newPairedGame1 = tournament.schedule[0];
    const newPairedGame2 =
      tournament.schedule.length > 1 && tournament.settings.switchGames
        ? tournament.schedule[1]
        : undefined;

    newPairedGame1.game.gameState = GameState.playing;
    await setNewActiveGroupAndGames(
      newPairedGame1,
      newPairedGame1,
      newPairedGame2,
    );
  }, [setNewActiveGroupAndGames, tournament]);

  const finishGame = useCallback(
    async (game: Game, gameWinner: GameWinner) => {
      const finishedGame = finishSelectedGame(game, gameWinner);
      const nextEliminationsGame = prepareNextGameIfEliminationsTournament(
        game,
        tournament?.groups?.find(
          (group) => group.id === activeScheduledGame?.group?.id,
        ),
        currentStageTournamentType,
      );
      if (finishedGame) {
        await updateGameData(finishedGame);
      }
      if (nextEliminationsGame?.nextRoundGameWinner) {
        await updateGameData(nextEliminationsGame?.nextRoundGameWinner);
      }
      if (nextEliminationsGame?.nextRoundGameLoser) {
        await updateGameData(nextEliminationsGame?.nextRoundGameLoser);
      }
      return game;
    },
    [
      activeScheduledGame?.group?.id,
      currentStageTournamentType,
      tournament?.groups,
      updateGameData,
    ],
  );

  const onAfterFinishedMatchProcedure = useCallback(
    async (
      game: TournamentScheduleGame,
      timeLeft: number,
    ): Promise<FlowState> => {
      if (!tournament || !tournamentSettings || !tournament.schedule) {
        return FlowState.NotDefined;
      }
      const isGame1ActiveGame = activeScheduledGame?.id === game.id;

      const currentTmpGame1 = isGame1ActiveGame ? game : currentScheduledGame1;
      const currentTmpGame2 = !isGame1ActiveGame ? game : currentScheduledGame2;
      const { gameWinner } = checkIfGameIsFinishedProcedure(
        isGame1ActiveGame ? currentTmpGame1!.game : currentTmpGame2!.game,
        timeLeft,
        tournamentSettings,
      );
      if (gameWinner !== GameWinner.notYet) {
        // Complete game
        if (isGame1ActiveGame) {
          currentTmpGame1!.game = await finishGame(
            currentTmpGame1!.game,
            gameWinner,
          );
        } else {
          currentTmpGame2!.game = await finishGame(
            currentTmpGame2!.game,
            gameWinner,
          );
        }
      }
      const newGroupAndGames = switchToNextScheduledGames(
        tournament.schedule,
        tournamentSettings,
        currentStageTournamentType!,
        isGame1ActiveGame ? currentTmpGame1! : currentTmpGame2!,
        currentTmpGame1!,
        currentTmpGame2,
      );

      if (newGroupAndGames === FlowState.NoGamesAvailable) {
        return FlowState.NoGamesAvailable;
      }

      await setNewActiveGroupAndGames(
        newGroupAndGames.newActiveGame,
        newGroupAndGames.newPairedGame1,
        newGroupAndGames.newPairedGame2,
      );
      setGameAndBreakDuration(newGroupAndGames.newActiveGame);
      return FlowState.GamesAvailable;
    },
    [
      tournament,
      tournamentSettings,
      activeScheduledGame?.id,
      currentScheduledGame1,
      currentScheduledGame2,
      currentStageTournamentType,
      setNewActiveGroupAndGames,
      setGameAndBreakDuration,
      finishGame,
    ],
  );

  const addMatchAndDataToGame = useCallback(
    (
      scheduledGame: TournamentScheduleGame,
      match: Match,
      timeLeftInMilliseconds: number,
    ) => {
      if (scheduledGame.game?.matches?.length > 0) {
        scheduledGame.game.matches.push(match);
      } else {
        scheduledGame.game.matches = [match];
      }

      scheduledGame.game.gameTime = timeLeftInMilliseconds / 1000;
      scheduledGame.game.team1Wins +=
        match.matchState === MatchState.team1Win ? 1 : 0;
      scheduledGame.game.team2Wins +=
        match.matchState === MatchState.team2Win ? 1 : 0;
    },
    [],
  );

  const finishTournament = useCallback(async () => {
    if (!tournament) {
      return;
    }
    tournament.state.isTournamentFinished = true;
    tournament.state.status = TournamentStatus.finished;

    await updateTournament(tournament);
    await invalidateSelectedLeague();
  }, [invalidateSelectedLeague, tournament, updateTournament]);

  const goToNextTournamentStage = useCallback(async () => {
    if (!tournament?.state) {
      return;
    }
    tournament.state.stage += 1;
    tournament.state.status = TournamentStatus.stageChange;
    await updateTournament(tournament);
  }, [tournament, updateTournament]);

  const finishMatch = useCallback(
    async (match: Match) => {
      if (!activeScheduledGame) {
        return;
      }
      try {
        setIsProcessing(true);
        const { currentDuration, duration: timeLeft } = getDuration();
        match.matchDurationInSeconds = currentDuration;
        addMatchAndDataToGame(activeScheduledGame, match, timeLeft);

        const afterFinishedMatchStatus = await onAfterFinishedMatchProcedure(
          activeScheduledGame,
          timeLeft,
        );
        if (afterFinishedMatchStatus === FlowState.NoGamesAvailable) {
          const currentStageGamesThatAreNotYetFinished = tournament?.groups
            .filter((group) => group.stage === tournament.state.stage)
            .map((group) =>
              group.games.filter(
                (game) => game.gameState !== GameState.finished,
              ),
            )
            .flat();
          // If there are no more games, that means that we should check if tournament is finished, or if we need to change group or tournament stage

          if (!currentStageGamesThatAreNotYetFinished?.length) {
            if (
              tournamentSettings?.secondStageType &&
              tournamentSettings?.numberOfGroups > 1
            ) {
              await goToNextTournamentStage();
              return;
            }
            await finishTournament();
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setShowFinishMatchPopup(false);
        setIsMatchInProgress(false);
        setIsProcessing(false);
      }
    },
    [
      activeScheduledGame,
      addMatchAndDataToGame,
      finishTournament,
      getDuration,
      goToNextTournamentStage,
      onAfterFinishedMatchProcedure,
      tournament?.groups,
      tournament?.state.stage,
      tournamentSettings?.numberOfGroups,
      tournamentSettings?.secondStageType,
    ],
  );

  const startStopMatch = useCallback(() => {
    if (!activeScheduledGame || !tournament || !gameSettings) {
      return;
    }
    if (isMatchInProgress) {
      stopTimer();
      setIsMatchInProgress(false);
      return;
    }

    setIsMatchInProgress(true);

    startTimer(
      200,
      activeScheduledGame.game.gameTime * 1000,
      (gameSettings.manualGameStartTimeInSeconds ||
        DefaultGameSettings.manualGameStartTimeInSeconds) * 1000,
      () => {
        setHasGameTimeRanOut(true);
        setShowFinishMatchPopup(true);
      },
      undefined,
      () => {
        playCountdown();
      },
    );
  }, [
    activeScheduledGame,
    gameSettings,
    isMatchInProgress,
    playCountdown,
    startTimer,
    stopTimer,
    tournament,
  ]);

  const setFinishMatchModal = useCallback(
    (shouldShowFinishMatchModal: boolean) => {
      stopTimer();
      setShowFinishMatchPopup(shouldShowFinishMatchModal);
    },
    [stopTimer],
  );
  useEffect(() => {
    setIsMatchInProgress(timingGame || timingBreak);
  }, [timingBreak, timingGame]);

  useEffect(() => {
    const isCurrentMatchInProgress =
      timingGame || timingBreak || isMatchInProgress;
    if (
      !activeScheduledGame ||
      !tournament ||
      !gameSettings ||
      firstLoad ||
      isCurrentMatchInProgress
    ) {
      return;
    }
    setGameAndBreakDuration(activeScheduledGame);

    setFirstLoad(true);
    // todo rokpot maybe we can properly populate dependencies
    // }, [activeScheduledGame, firstLoad, tournament]);
  }, [
    activeScheduledGame,
    firstLoad,
    gameSettings,
    isMatchInProgress,
    setGameAndBreakDuration,
    timingBreak,
    timingGame,
    tournament,
  ]);

  const confirmNextTournamentStage = useCallback(
    async (nextTournamentStageGroup: TournamentGroup) => {
      if (!tournament) {
        return;
      }
      const currentNextTournamentGroupIndex = tournament.groups.findIndex(
        (group) => group.id === nextTournamentStageGroup.id,
      );

      if (currentNextTournamentGroupIndex < 0) {
        tournament.groups.push(nextTournamentStageGroup);
      } else {
        tournament.groups[currentNextTournamentGroupIndex] =
          nextTournamentStageGroup;
      }
      tournament.state.status = TournamentStatus.inProgress;

      await updateTournament(tournament);
      await invalidateSelectedLeague();
    },
    [invalidateSelectedLeague, tournament, updateTournament],
  );

  return useMemo(() => {
    return {
      currentStage,
      activeGame: activeScheduledGame,
      beginTournament,
      finishMatch,
      finishGame,
      timingBreak,
      isMatchInProgress,
      startStopMatch,
      hasGameTimeRanOut,
      showFinishMatchPopup,
      setFinishMatchModal,
      isProcessing,
      confirmNextTournamentStage,
    };
  }, [
    currentStage,
    activeScheduledGame,
    beginTournament,
    finishMatch,
    finishGame,
    timingBreak,
    isMatchInProgress,
    startStopMatch,
    hasGameTimeRanOut,
    showFinishMatchPopup,
    setFinishMatchModal,
    isProcessing,
    confirmNextTournamentStage,
  ]);
};

export default useTournamentFlow;
