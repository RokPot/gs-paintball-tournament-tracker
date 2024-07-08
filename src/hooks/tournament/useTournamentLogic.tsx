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
import useConfirmationModalStore from 'store/ConfirmationModalStore';
import ActivityChangeType from 'types/ActivityChangeType';
import Team from 'types/Team';
import TournamentActivity from 'types/TournamentActivity';
import { TournamentStatus } from 'types/TournamentStatus';
import { snackbarSuccessOptions } from 'utils/snackbarUtils';
import { TournamentFlow } from 'utils/tournamentFlowUtils';
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
  const { playCountdown, stopCountdown } = useCountdownSound();
  const { mutateAsync: updateTournament } =
    TournamentQueries.useUpdateTournament();
  const { invalidateSelectedLeague } = LeagueQueries.useLeagueInvalidations();
  const { updateGameData } = useGameFlows();
  const { openModal } = useConfirmationModalStore();
  const [isMatchInProgress, setIsMatchInProgress] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [hasGameTimeRanOut, setHasGameTimeRanOut] = useState(false);
  const [showFinishMatchModal, setShowFinishMatchModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addStageToTournament, addNewTournamentActivity } =
    useTournamentFlows();

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
      }
      if (newGame2) {
        await updateGameData(newGame2.game);
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
      setGameAndBreakDuration,
      setNewActiveGroupAndGames,
      tournament,
      updateGameData,
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
        setShowFinishMatchModal(true);
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
        return;
      }

      if (isCurrentMatchInProgress) {
        openModal({
          title: 'Team Pause Confirmation',
          Confirmation:
            'Pause will force the game to pase and game time will be reset',
          onConfirm: () => {
            stopCountdown();
            stopTimer();
          },
        });
      }
    },
    [
      isMatchInProgress,
      openModal,
      stopCountdown,
      stopTimer,
      timingBreak,
      timingGame,
    ],
  );

  const setFinishMatchModal = useCallback(
    (shouldShowFinishMatchModal: boolean) => {
      stopTimer();
      setShowFinishMatchModal(shouldShowFinishMatchModal);
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
  ]);
};

export default useTournamentLogic;
