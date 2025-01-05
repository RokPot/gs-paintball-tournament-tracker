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
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import TournamentStage from 'types/TournamentStage';

import useIPCRendererMessages from 'hooks/main/useIPCRendererMessages';
import useTimeLeftSpeech from 'hooks/sounds/useTimeLeftSpeech';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import useConfirmationModalStore from 'store/ConfirmationModalStore';
import useTournamentStore from 'store/TournamentStore';
import ActivityChangeType from 'types/ActivityChangeType';
import League from 'types/League';
import Team from 'types/Team';
import TournamentActivity from 'types/TournamentActivity';
import { TournamentStatus } from 'types/TournamentStatus';
import useBus from 'use-bus';
import { snackbarSuccessOptions } from 'utils/snackbarUtils';
import { TournamentFlow } from 'utils/tournamentFlowUtils';
import useTournamentFlows from './useTournamentFlows';

const useTournamentLogic = (activeLeague?: League | null) => {
  const { mutateAsync: updateTournament } =
    TournamentQueries.useUpdateTournament();

  const { invalidateSelectedLeague } = LeagueQueries.useLeagueInvalidations();

  const location = useLocation();

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

  const {
    start10SecondsSpeech,
    start30SecondsSpeech,
    stop10SecondsSpeech,
    stop30SecondsSpeech,
  } = useTimeLeftSpeech();

  const { playCountdown, stopCountdown, playMatchPoint } = useCountdownSound();

  const { updateGameData } = useGameFlows();
  const { openModal } = useConfirmationModalStore();

  const {
    isMatchInProgress,
    setCurrentActiveGame,
    setIsMatchInProgress,
    showFinishMatchModal,
    setShowFinishMatchModal,
    hasGameTimeRanOut,
    setHasGameTimeRanOut,
  } = useTournamentStore();

  const [dirtyCount, setDirtyCount] = useState(0);
  const [firstLoad, setFirstLoad] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addStageToTournament, addNewTournamentActivity } =
    useTournamentFlows();

  const { sendGameSwitched } = useIPCRendererMessages();
  const { enqueueSnackbar } = useSnackbar();

  const forceRefreshTournament = useCallback(() => {
    setDirtyCount((prev) => prev + 1);
  }, []);

  const tournament = useMemo(() => {
    if (!activeLeague) {
      return undefined;
    }
    return activeLeague?.activeTournament;
  }, [activeLeague, location, dirtyCount]);

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

  const stopSpeech = useCallback(() => {
    stop10SecondsSpeech();
    stop30SecondsSpeech();
  }, [stop10SecondsSpeech, stop30SecondsSpeech]);

  const startSpeech = useCallback(
    (seconds: number) => {
      stopSpeech();
      switch (seconds) {
        case 10: {
          start10SecondsSpeech();
          break;
        }
        case 30: {
          start30SecondsSpeech();
          break;
        }
        default:
          break;
      }
    },
    [start10SecondsSpeech, start30SecondsSpeech, stopSpeech],
  );

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
      }
      if (newGame2) {
        await updateGameData(newGame2.game);
      }
      await Promise.all([
        updateTournament(tournament),
        invalidateSelectedLeague(),
      ]);
      forceRefreshTournament();
    },
    [
      forceRefreshTournament,
      invalidateSelectedLeague,
      tournament,
      updateGameData,
      updateTournament,
    ],
  );

  const beginTournament = useCallback(async () => {
    if (!tournament || !currentSchedule) {
      return;
    }
    tournament.state.status = TournamentStatus.inProgress;

    const starterGames = TournamentFlow.prepareGamesForTournament(
      tournament,
      currentSchedule,
    );
    if (!starterGames) {
      return;
    }

    await setNewActiveGroupAndGames(
      starterGames.newPairedGame1,
      starterGames.newPairedGame1,
      starterGames.newPairedGame2,
    );
    resetTimer();
    await invalidateSelectedLeague();
    forceRefreshTournament();
  }, [
    currentSchedule,
    forceRefreshTournament,
    invalidateSelectedLeague,
    resetTimer,
    setNewActiveGroupAndGames,
    tournament,
  ]);

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

  const finishTournament = useCallback(async () => {
    if (!tournament) {
      return;
    }
    tournament.state.isTournamentFinished = true;
    tournament.state.status = TournamentStatus.finished;

    await updateTournament(tournament);
    await invalidateSelectedLeague();
    forceRefreshTournament();
  }, [
    forceRefreshTournament,
    invalidateSelectedLeague,
    tournament,
    updateTournament,
  ]);

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
        const newTournamentActivity: TournamentActivity =
          new TournamentActivity({
            id: '',
            _id: '',
            game: activeScheduledGame.game,
            changeType: ActivityChangeType.MatchFinished,
            previousTeam1Wins: activeScheduledGame.game.team1Wins,
            previousTeam2Wins: activeScheduledGame.game.team2Wins,
            nextTeam1Wins: 0,
            nextTeam2Wins: 0,
            stage: currentStage || 1,
            tournamentId: tournament._id,
            updatedAt: new Date(),
            gameTime: activeScheduledGame.game.gameTime,
            match,
          });
        const { currentDuration, duration: timeLeft } = getDuration();

        TournamentFlow.addMatchDataToGame(
          activeScheduledGame,
          match,
          timeLeft,
          currentDuration,
        );

        const newTournamentState = TournamentFlow.onAfterFinishedMatchProcedure(
          activeScheduledGame,
          timeLeft,
          tournament,
        );

        if (newTournamentState.gamesToUpdate.length > 0) {
          for (let i = 0; i < newTournamentState.gamesToUpdate.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await updateGameData(newTournamentState.gamesToUpdate[i]);
          }
        }

        if (
          newTournamentState?.nextGameState !==
          TournamentFlow.FlowState.NoGamesAvailable
        ) {
          const { nextGameState } = newTournamentState;
          await setNewActiveGroupAndGames(
            nextGameState.newActiveGame,
            nextGameState.newPairedGame1,
            nextGameState.newPairedGame2,
          );
          setGameAndBreakDuration(nextGameState.newActiveGame);
        }
        newTournamentActivity.nextTeam1Wins =
          activeScheduledGame.game.team1Wins;
        newTournamentActivity.nextTeam2Wins =
          activeScheduledGame.game.team2Wins;
        await addNewTournamentActivity(newTournamentActivity);

        const tournamentEndState =
          TournamentFlow.onAfterFinishedMatchEndTournamentCheck(
            newTournamentState,
            currentGroups,
            tournament,
          );

        switch (tournamentEndState) {
          case TournamentFlow.EndTournamentCheck.GoToNextTournamentStage:
            await goToNextTournamentStage();
            break;
          case TournamentFlow.EndTournamentCheck.FinishTournament:
            await finishTournament();
            break;
          case TournamentFlow.EndTournamentCheck.ContinueTournamentStage:
          default:
            sendGameSwitched();
            break;
        }
      } catch (e) {
        console.error(e);
      } finally {
        setShowFinishMatchModal(false);
        setIsMatchInProgress(false);
        setIsProcessing(false);
      }
    },
    [
      activeScheduledGame,
      addNewTournamentActivity,
      currentGroups,
      currentStage,
      finishTournament,
      getDuration,
      goToNextTournamentStage,
      sendGameSwitched,
      setGameAndBreakDuration,
      setIsMatchInProgress,
      setNewActiveGroupAndGames,
      setShowFinishMatchModal,
      tournament,
      updateGameData,
    ],
  );

  const onTimerFinished = useCallback(() => {
    playMatchPoint();
    setHasGameTimeRanOut(true);
    setShowFinishMatchModal(true);
  }, [playMatchPoint, setHasGameTimeRanOut, setShowFinishMatchModal]);

  const onBreakFinished = useCallback(() => {}, []);

  const onStartCountDown = useCallback(() => {
    playCountdown();
  }, [playCountdown]);

  const onTimer30SecondsLeft = useCallback(() => {
    startSpeech(30);
  }, [startSpeech]);

  const onTimer10SecondsLeft = useCallback(() => {
    startSpeech(10);
  }, [startSpeech]);

  const startStopMatch = useCallback(() => {
    if (!activeScheduledGame || !tournament || !gameSettings) {
      return;
    }
    setHasGameTimeRanOut(false);
    if (isMatchInProgress) {
      stopTimer();
      stopSpeech();
      setIsMatchInProgress(false);
      stopCountdown();
      return;
    }

    setIsMatchInProgress(true);
    setCurrentActiveGame(activeScheduledGame.game, true);
    const timerDelayInMs = 200;
    const timerDurationInMs = activeScheduledGame.game.gameTime * 1000;
    const breakDurationInMs =
      (gameSettings.manualGameStartTimeInSeconds ||
        DefaultGameSettings.manualGameStartTimeInSeconds) * 1000;

    startTimer(
      timerDelayInMs,
      timerDurationInMs,
      breakDurationInMs,
      onTimerFinished,
      onBreakFinished,
      onStartCountDown,
      onTimer10SecondsLeft,
      onTimer30SecondsLeft,
    );
  }, [
    activeScheduledGame,
    gameSettings,
    isMatchInProgress,
    onBreakFinished,
    onStartCountDown,
    onTimer10SecondsLeft,
    onTimer30SecondsLeft,
    onTimerFinished,
    setCurrentActiveGame,
    setHasGameTimeRanOut,
    setIsMatchInProgress,
    startTimer,
    stopCountdown,
    stopSpeech,
    stopTimer,
    tournament,
  ]);

  const onTeamPause = useCallback(
    (team: Team, isRefereeAction?: boolean | undefined) => {
      if (!isMatchInProgress) {
        return;
      }

      const isCurrentMatchInProgress = timingGame;
      const isCurrentMatchInCountdown = timingBreak;

      if (isCurrentMatchInCountdown || isRefereeAction) {
        stopCountdown();
        stopTimer();
        stopSpeech();
        return;
      }

      if (isCurrentMatchInProgress) {
        openModal({
          title: 'Team Pause Confirmation',
          Confirmation:
            'Pause will force the game to stop and game time will be reset',
          onConfirm: () => {
            stopCountdown();
            stopTimer();
            stopSpeech();
          },
        });
      }
    },
    [
      isMatchInProgress,
      openModal,
      stopCountdown,
      stopSpeech,
      stopTimer,
      timingBreak,
      timingGame,
    ],
  );

  const setFinishMatchModal = useCallback(
    (shouldShowFinishMatchModal: boolean) => {
      stopTimer();
      stopSpeech();
      if (shouldShowFinishMatchModal) {
        playMatchPoint();
      }
      setShowFinishMatchModal(shouldShowFinishMatchModal);
    },
    [playMatchPoint, setShowFinishMatchModal, stopSpeech, stopTimer],
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
      isCurrentMatchInProgress ||
      hasGameTimeRanOut ||
      showFinishMatchModal
    ) {
      return;
    }

    setGameAndBreakDuration(activeScheduledGame);
    setFirstLoad(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const nextStageStarterGames = TournamentFlow.prepareGamesForTournament(
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

  useBus(
    'FinishMatch',
    (event: any) => {
      if (!isMatchInProgress || showFinishMatchModal || timingBreak) {
        return;
      }
      if (event.payload === 'Team1Button') {
        setFinishMatchModal(true);
      }
      if (event.payload === 'Team2Button') {
        setFinishMatchModal(true);
      }
    },
    [isMatchInProgress, showFinishMatchModal, setFinishMatchModal],
  );

  return useMemo(() => {
    return {
      currentStage,
      activeGame: activeScheduledGame,
      timingBreak,
      isMatchInProgress,
      hasGameTimeRanOut,
      isProcessing,
      showFinishMatchModal,
      startStopMatch,
      beginTournament,
      finishMatch,
      finishGame,
      setFinishMatchModal,
      confirmNextTournamentStage,
      onTeamPause,
      setFirstLoad,
      forceRefreshTournament,
    };
  }, [
    currentStage,
    activeScheduledGame,
    timingBreak,
    isMatchInProgress,
    hasGameTimeRanOut,
    isProcessing,
    showFinishMatchModal,
    startStopMatch,
    beginTournament,
    finishMatch,
    finishGame,
    setFinishMatchModal,
    confirmNextTournamentStage,
    onTeamPause,
    setFirstLoad,
    forceRefreshTournament,
  ]);
};

export default useTournamentLogic;
