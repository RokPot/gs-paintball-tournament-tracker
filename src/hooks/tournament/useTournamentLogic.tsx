import useGameFlows from 'hooks/game/useGameFlows';
import useCountdownSound from 'hooks/sounds/useCountdownSound';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import { TournamentQueries } from 'services/queries/tournament/TournamentQueries';
import useTimerStore from 'store/TimerStore';
import Game from 'types/Game';
import { DefaultGameSettings } from 'types/GameSettings';
import { GameState, GameWinner } from 'types/GameState';
import { Match } from 'types/Match';
import Tournament from 'types/Tournament';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import TournamentStage from 'types/TournamentStage';

import { useSnackbar } from 'notistack';
import { TournamentStatus } from 'types/TournamentStatus';
import { snackbarSuccessOptions } from 'utils/snackbarUtils';
import { TournamentFlow } from 'utils/tournamentFlowUtils';
import { prepareGamesForTournament } from 'utils/tournamentUtils';
import useTournamentFlows from './useTournamentFlows';

const useTournamentLogic = (tournament?: Tournament) => {
  const {
    setDuration,
    setBreakDuration,
    getDuration,
    timingBreak,
    timingGame,
    startTimer,
    stopTimer,
    resetTimer,
  } = useTimerStore();
  const { playCountdown } = useCountdownSound();
  const { mutateAsync: updateTournament } =
    TournamentQueries.useUpdateTournament();
  const { invalidateSelectedLeague } = LeagueQueries.useLeagueInvalidations();
  const { updateGameData } = useGameFlows();

  const [currentScheduledGame1, setScheduledCurrentGame1] =
    useState<TournamentScheduleGame>();
  const [currentScheduledGame2, setScheduledCurrentGame2] =
    useState<TournamentScheduleGame>();
  const [isMatchInProgress, setIsMatchInProgress] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [hasGameTimeRanOut, setHasGameTimeRanOut] = useState(false);
  const [showFinishMatchPopup, setShowFinishMatchPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addStageToTournament } = useTournamentFlows();

  const { enqueueSnackbar } = useSnackbar();

  const currentSchedule = useMemo(() => {
    if (!tournament?.currentStageSchedule) {
      return undefined;
    }
    return tournament.currentStageSchedule;
  }, [tournament?.currentStageSchedule]);

  const currentGroups = useMemo(() => {
    if (!tournament?.currentStageGroups) {
      return undefined;
    }
    return tournament.currentStageGroups;
  }, [tournament?.currentStageGroups]);

  const currentStage = useMemo(
    () => tournament?.state?.stage,
    [tournament?.state?.stage],
  );

  const activeScheduledGame = useMemo(() => {
    if (!tournament || !currentSchedule) {
      return undefined;
    }
    return currentSchedule?.find(
      (scheduledGame) => tournament.state.activeGameId === scheduledGame.id,
    );
  }, [currentSchedule, tournament]);

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
    if (!tournament || !currentSchedule) {
      return;
    }
    tournament.state.status = TournamentStatus.inProgress;

    const starterGames = prepareGamesForTournament(tournament, currentSchedule);
    if (!starterGames) {
      return;
    }

    await setNewActiveGroupAndGames(
      starterGames.newPairedGame1,
      starterGames.newPairedGame1,
      starterGames.newPairedGame2,
    );
    resetTimer();
  }, [currentSchedule, resetTimer, setNewActiveGroupAndGames, tournament]);

  const finishGame = useCallback(
    async (game: Game, gameWinner: GameWinner) => {
      const finishedGame = TournamentFlow.finishSelectedGame(game, gameWinner);
      const nextEliminationsGame =
        TournamentFlow.prepareNextGameIfEliminationsTournament(
          game,
          currentGroups?.find(
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
      currentGroups,
      currentStageTournamentType,
      updateGameData,
    ],
  );

  const onAfterFinishedMatchProcedure = useCallback(
    async (
      game: TournamentScheduleGame,
      timeLeft: number,
    ): Promise<TournamentFlow.FlowState> => {
      if (!tournament || !tournamentSettings || !currentSchedule) {
        return TournamentFlow.FlowState.NotDefined;
      }
      const isGame1ActiveGame = activeScheduledGame?.id === game.id;

      const currentTmpGame1 = isGame1ActiveGame ? game : currentScheduledGame1;
      const currentTmpGame2 = !isGame1ActiveGame ? game : currentScheduledGame2;
      const { gameWinner } = TournamentFlow.checkIfGameIsFinishedProcedure(
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
      const newGroupAndGames = TournamentFlow.switchToNextScheduledGames(
        currentSchedule,
        tournamentSettings,
        currentStageTournamentType!,
        isGame1ActiveGame ? currentTmpGame1! : currentTmpGame2!,
        currentTmpGame1!,
        currentTmpGame2,
      );

      if (newGroupAndGames === TournamentFlow.FlowState.NoGamesAvailable) {
        return TournamentFlow.FlowState.NoGamesAvailable;
      }

      await setNewActiveGroupAndGames(
        newGroupAndGames.newActiveGame,
        newGroupAndGames.newPairedGame1,
        newGroupAndGames.newPairedGame2,
      );
      setGameAndBreakDuration(newGroupAndGames.newActiveGame);
      return TournamentFlow.FlowState.GamesAvailable;
    },
    [
      tournament,
      tournamentSettings,
      currentSchedule,
      activeScheduledGame?.id,
      currentScheduledGame1,
      currentScheduledGame2,
      currentStageTournamentType,
      setNewActiveGroupAndGames,
      setGameAndBreakDuration,
      finishGame,
    ],
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
      if (!activeScheduledGame || !currentGroups || !tournament) {
        return;
      }
      try {
        setIsProcessing(true);
        const { currentDuration, duration: timeLeft } = getDuration();

        TournamentFlow.addMatchDataToGame(
          activeScheduledGame,
          match,
          timeLeft,
          currentDuration,
        );

        const afterFinishedMatchStatus = await onAfterFinishedMatchProcedure(
          activeScheduledGame,
          timeLeft,
        );
        if (
          afterFinishedMatchStatus === TournamentFlow.FlowState.NoGamesAvailable
        ) {
          const currentStageGamesThatAreNotYetFinished = currentGroups
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
      currentGroups,
      finishTournament,
      getDuration,
      goToNextTournamentStage,
      onAfterFinishedMatchProcedure,
      tournament,
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
    async (nextStage: TournamentStage) => {
      if (!tournament) {
        return;
      }
      tournament.state.status = TournamentStatus.inProgress;

      await addStageToTournament(tournament, nextStage);
      enqueueSnackbar(
        'Tournament proceeded to next stage',
        snackbarSuccessOptions,
      );

      const nextStageStarterGames = prepareGamesForTournament(
        tournament,
        nextStage.schedule,
      );

      if (!nextStageStarterGames) {
        return;
      }

      await setNewActiveGroupAndGames(
        nextStageStarterGames.newPairedGame1,
        nextStageStarterGames.newPairedGame1,
        nextStageStarterGames.newPairedGame2,
      );
      resetTimer();
    },
    [
      addStageToTournament,
      enqueueSnackbar,
      resetTimer,
      setNewActiveGroupAndGames,
      tournament,
    ],
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

export default useTournamentLogic;
