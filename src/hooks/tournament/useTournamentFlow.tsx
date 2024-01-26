import useGameQueries from 'hooks/game/useGameQueries';
import { useCallback, useMemo } from 'react';
import useLeagueInvalidations from 'services/queries/league/useLeagueInvalidations';
import useUpdateTournament from 'services/queries/tournament/useUpdateTournament';
import Game from 'types/Game';
import { Match } from 'types/Match';
import MatchState from 'types/MatchState';
import Tournament from 'types/Tournament';
import { TournamentStatus } from 'types/TournamentStatus';

const useTournamentFlow = (tournament?: Tournament) => {
  const { updateTournament } = useUpdateTournament();
  const { invalidateSelectedLeague } = useLeagueInvalidations();
  const { updateGameData } = useGameQueries();
  const currentStage = useMemo(
    () => tournament?.state?.stage,
    [tournament?.state?.stage],
  );

  const currentGroup = useMemo(() => {
    if (!tournament) {
      return undefined;
    }
    return tournament.groups.find(
      (group) => tournament.state.currentGroupId === group.id,
    );
  }, [tournament]);

  const currentGame = useMemo(() => {
    if (!currentGroup || !tournament) {
      return undefined;
    }
    return currentGroup?.games.find(
      (game) => tournament.state.currentGameId === game.id,
    );
  }, [currentGroup, tournament]);

  const beginTournament = useCallback(async () => {
    if (!tournament) {
      return;
    }
    tournament.state.status = TournamentStatus.inProgress;
    const newCurrentGroup = tournament.groups[0];
    const newCurrentGame = newCurrentGroup.games[0];
    tournament.state.currentGameId = newCurrentGame.id;
    tournament.state.currentGroupId = newCurrentGroup.id;
    await updateTournament(tournament);
    await invalidateSelectedLeague();
  }, [invalidateSelectedLeague, tournament, updateTournament]);

  const onGameFinishedProcedure = useCallback(() => {
    console.log('this should happen when game is finished');
  }, []);

  const checkIfGameIsFinished = useCallback((game: Game, timeLeft: number) => {
    if (timeLeft <= 0) {
      return true;
    }

    if (tournament?.settings.twoWinsDifference) {
      const team1Score = game.team1Wins;
      const team2Score = game.team2Wins;
      // todo rokpot
      const team1HasMoreThanThresholdWins = team1Score;
    }
  }, []);

  const onAfterFinishedMatchProcedure = useCallback(
    (game: Game, timeLeft: number) => {
      if (checkIfGameIsFinished()) {
        // Complete game
      }
      if (tournament?.settings.switchGames) {
      }
    },
    [],
  );

  const finishMatch = useCallback(
    async (match: Match, timeLeft: number) => {
      if (!currentGame) {
        return;
      }
      if (currentGame?.matches?.length > 0) {
        currentGame.matches.push(match);
      } else {
        currentGame.matches = [];
      }
      currentGame.gameTime = timeLeft;
      currentGame.team1Wins += match.matchState === MatchState.team1Win ? 1 : 0;
      currentGame.team2Wins += match.matchState === MatchState.team2Win ? 1 : 0;
      await updateGameData(currentGame);
    },
    [currentGame, updateGameData],
  );

  const finishGame = useCallback(() => {}, []);
  return useMemo(() => {
    return {
      currentStage,
      currentGame,
      currentGroup,
      beginTournament,
      finishMatch,
      finishGame,
    };
  }, [
    beginTournament,
    currentGame,
    currentGroup,
    currentStage,
    finishGame,
    finishMatch,
  ]);
};

export default useTournamentFlow;
