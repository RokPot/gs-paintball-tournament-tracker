import useGameQueries from 'hooks/game/useGameQueries';
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
import { TournamentScheduleGame } from 'types/TournamentScheduleGame';
import { TournamentStatus } from 'types/TournamentStatus';
import { switchToNextScheduledGames } from 'utils/tournamentFlowUtils';

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
      game.gameState = GameState.finished;
      game.gameWinner = gameWinner;
      await updateGameData(game);
      return game;
    },
    [updateGameData],
  );

  const checkIfGameIsFinished = useCallback(
    (game: Game, timeLeft: number): GameWinner => {
      const { twoWinsDifference, numberOfWinsRequired } = tournament!.settings;
      const team1Score = game.team1Wins;
      const team2Score = game.team2Wins;

      if (timeLeft <= 0) {
        const team1HasMoreWinsThanTeam2 = team1Score > team2Score;
        const team2HasMoreWinsThanTeam1 = team2Score > team1Score;
        const isGameADraw = team1Score === team2Score;
        if (team1HasMoreWinsThanTeam2) {
          return GameWinner.team1;
        }
        if (team2HasMoreWinsThanTeam1) {
          return GameWinner.team2;
        }
        if (isGameADraw) {
          return GameWinner.draw;
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
        return GameWinner.team1;
      }
      if (team2HasMoreThanThresholdWins && team2HasMoreWinsThanTeam1) {
        return GameWinner.team2;
      }
      if (
        (team1HasMoreThanThresholdWins || team2HasMoreThanThresholdWins) &&
        isGameADraw
      ) {
        return GameWinner.draw;
      }
      return GameWinner.notYet;
    },
    [tournament],
  );

  const onAfterFinishedMatchProcedure = useCallback(
    async (game: TournamentScheduleGame, timeLeft: number) => {
      const isGame1ActiveGame = activeScheduledGame?.id === game.id;

      const currentTmpGame1 = isGame1ActiveGame ? game : currentScheduledGame1;
      const currentTmpGame2 = !isGame1ActiveGame ? game : currentScheduledGame2;
      const gameWinner = checkIfGameIsFinished(
        isGame1ActiveGame ? currentTmpGame1!.game : currentTmpGame2!.game,
        timeLeft,
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
        tournament?.schedule!,
        tournamentSettings!,
        isGame1ActiveGame ? currentTmpGame1! : currentTmpGame2!,
        currentTmpGame1!,
        currentTmpGame2,
      );

      if (newGroupAndGames === 'NoMoreGames') {
        return;
      }
      await setNewActiveGroupAndGames(
        newGroupAndGames.newActiveGame,
        newGroupAndGames.newPairedGame1,
        newGroupAndGames.newPairedGame2,
      );
    },
    [
      activeScheduledGame?.id,
      currentScheduledGame1,
      currentScheduledGame2,
      checkIfGameIsFinished,
      tournament?.schedule,
      tournamentSettings,
      setNewActiveGroupAndGames,
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
        await onAfterFinishedMatchProcedure(activeScheduledGame, timeLeft);
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
      getDuration,
      onAfterFinishedMatchProcedure,
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
      100,
      activeScheduledGame.game.gameTime * 1000,
      (gameSettings.manualGameStartTimeInSeconds ||
        DefaultGameSettings.manualGameStartTimeInSeconds) * 1000,
      false,
      (hasFinished) => {
        console.log('hasFinished', hasFinished);
        setHasGameTimeRanOut(true);
        setShowFinishMatchPopup(true);
      },
    );
  }, [
    activeScheduledGame,
    gameSettings,
    isMatchInProgress,
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
  }, [timingGame]);

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
    setDuration(activeScheduledGame.game.gameTime * 1000 || 0);
    setBreakDuration(
      (gameSettings.manualGameStartTimeInSeconds ||
        DefaultGameSettings.manualGameStartTimeInSeconds) * 1000 || 0,
    );
    setFirstLoad(true);
  }, [activeScheduledGame, firstLoad, tournament]);

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
  ]);
};

export default useTournamentFlow;
