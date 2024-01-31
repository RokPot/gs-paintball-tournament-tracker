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
import TournamentGroup from 'types/TournamentGroup';
import { TournamentStatus } from 'types/TournamentStatus';
import { switchGames } from 'utils/tournamentFlowUtils';

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

  const [currentGame1, setCurrentGame1] = useState<Game>();
  const [currentGame2, setCurrentGame2] = useState<Game>();
  const [isMatchInProgress, setIsMatchInProgress] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [hasGameTimeRanOut, setHasGameTimeRanOut] = useState(false);
  const [showFinishMatchPopup, setShowFinishMatchPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentStage = useMemo(
    () => tournament?.state?.stage,
    [tournament?.state?.stage],
  );

  const activeGroup = useMemo(() => {
    if (!tournament) {
      return undefined;
    }
    return tournament.groups.find(
      (group) => tournament.state.activeGroupId === group.id,
    );
  }, [tournament]);

  const activeGame = useMemo(() => {
    if (!tournament || !activeGroup) {
      return undefined;
    }
    return activeGroup.games.find(
      (group) => tournament.state.activeGameId === group.id,
    );
  }, [tournament, activeGroup]);

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
      newActiveGame: Game,
      newActiveGroup: TournamentGroup,
      newGame1: Game,
      newGame2?: Game,
      oldGame1?: Game,
      oldGame2?: Game,
    ) => {
      if (!tournament) {
        return;
      }
      tournament.state.activeGameId = newActiveGame.id;
      tournament.state.pairedGame1Id = newGame1.id;
      tournament.state.pairedGame2Id = newGame2?.id;
      tournament.state.activeGroupId = newActiveGroup.id;
      if (newGame1) {
        await updateGameData(newGame1);
      }
      if (newGame2) {
        await updateGameData(newGame2);
      }
      // if (oldGame1) {
      //   await updateGameData(oldGame1);
      // }
      // if (oldGame2) {
      //   await updateGameData(oldGame2);
      // }
      await updateTournament(tournament);
      await invalidateSelectedLeague();
    },
    [invalidateSelectedLeague, tournament, updateGameData, updateTournament],
  );

  const beginTournament = useCallback(async () => {
    if (!tournament) {
      return;
    }
    tournament.state.status = TournamentStatus.inProgress;

    // Begin tournament
    const newCurrentGroup = tournament.groups[0];
    const newPairedGame1 = newCurrentGroup.games[0];
    const newPairedGame2 =
      newCurrentGroup.games.length > 1 && tournament.settings.switchGames
        ? newCurrentGroup.games[1]
        : undefined;
    newPairedGame1.gameState = GameState.playing;
    setNewActiveGroupAndGames(
      newPairedGame1,
      newCurrentGroup,
      newPairedGame1,
      newPairedGame2,
    );
    setCurrentGame1(newPairedGame1);
    setCurrentGame2(newPairedGame2);
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
    async (game: Game, timeLeft: number) => {
      const isGame1ActiveGame = activeGame?.id === game.id;

      let currentTmpGame1 = isGame1ActiveGame ? game : currentGame1;
      let currentTmpGame2 = !isGame1ActiveGame ? game : currentGame2;
      const gameWinner = checkIfGameIsFinished(
        isGame1ActiveGame ? currentTmpGame1! : currentTmpGame2!,
        timeLeft,
      );
      if (gameWinner !== GameWinner.notYet) {
        // Complete game
        if (isGame1ActiveGame) {
          currentTmpGame1 = await finishGame(currentTmpGame1!, gameWinner);
        } else {
          currentTmpGame2 = await finishGame(currentTmpGame2!, gameWinner);
        }
      }
      const newGroupAndGames = switchGames(
        tournament?.groups!,
        tournamentSettings!,
        tournament?.state.stage!,
        activeGroup?.id!,
        isGame1ActiveGame ? currentTmpGame1! : currentTmpGame2!,
        currentTmpGame1!,
        currentTmpGame2,
      );
      if (newGroupAndGames === 'NoMoreGames') {
        return;
      }
      await setNewActiveGroupAndGames(
        newGroupAndGames.newActiveGame,
        newGroupAndGames.activeGroup,
        newGroupAndGames.newPairedGame1,
        newGroupAndGames.newPairedGame2,
        currentTmpGame1,
        currentTmpGame2,
      );
    },
    [
      activeGame?.id,
      activeGroup?.id,
      checkIfGameIsFinished,
      currentGame1,
      currentGame2,
      finishGame,
      setNewActiveGroupAndGames,
      tournament?.groups,
      tournament?.state.stage,
      tournamentSettings,
    ],
  );

  const finishMatch = useCallback(
    async (match: Match) => {
      if (!activeGame) {
        return;
      }
      try {
        setIsProcessing(true);
        const { currentDuration, duration: timeLeft } = getDuration();
        match.matchDurationInSeconds = currentDuration;
        if (activeGame?.matches?.length > 0) {
          activeGame.matches.push(match);
        } else {
          activeGame.matches = [match];
        }

        activeGame.gameTime = timeLeft / 1000;
        activeGame.team1Wins +=
          match.matchState === MatchState.team1Win ? 1 : 0;
        activeGame.team2Wins +=
          match.matchState === MatchState.team2Win ? 1 : 0;
        await onAfterFinishedMatchProcedure(activeGame, timeLeft);
      } catch (e) {
        console.error(e);
      } finally {
        setShowFinishMatchPopup(false);
        setIsMatchInProgress(false);
        setIsProcessing(false);
      }
    },
    [activeGame, getDuration, onAfterFinishedMatchProcedure],
  );

  const startStopMatch = useCallback(() => {
    if (!activeGame || !tournament || !gameSettings) {
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
      activeGame.gameTime * 1000,
      (gameSettings.manualGameStartTimeInSeconds ||
        DefaultGameSettings.manualGameStartTimeInSeconds) * 1000,
      false,
      (hasFinished) => {
        setHasGameTimeRanOut(hasFinished);
        setShowFinishMatchPopup(hasFinished);
      },
    );
  }, [
    activeGame,
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
      !activeGame ||
      !tournament ||
      !gameSettings ||
      firstLoad ||
      isCurrentMatchInProgress
    ) {
      return;
    }
    setDuration(activeGame.gameTime * 1000 || 0);
    setBreakDuration(
      (gameSettings.manualGameStartTimeInSeconds ||
        DefaultGameSettings.manualGameStartTimeInSeconds) * 1000 || 0,
    );
    setFirstLoad(true);
  }, [activeGame, firstLoad, tournament]);

  return useMemo(() => {
    return {
      currentStage,
      activeGame,
      activeGroup,
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
    activeGame,
    activeGroup,
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
