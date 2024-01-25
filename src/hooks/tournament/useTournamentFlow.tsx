import { useCallback, useMemo } from 'react';
import useLeagueInvalidations from 'services/queries/league/useLeagueInvalidations';
import useUpdateTournament from 'services/queries/tournament/useUpdateTournament';
import Tournament from 'types/Tournament';
import { TournamentStatus } from 'types/TournamentStatus';

const useTournamentFlow = (tournament?: Tournament) => {
  const { updateTournament } = useUpdateTournament();
  const { invalidateSelectedLeague } = useLeagueInvalidations();

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

  const onMatchFinished = useCallback(async () => {}, []);
  const finishGame = useCallback(() => {}, []);
  return useMemo(() => {
    return {
      currentStage,
      currentGame,
      currentGroup,
      beginTournament,
      onMatchFinished,
      finishGame,
    };
  }, [
    beginTournament,
    currentGame,
    currentGroup,
    currentStage,
    finishGame,
    onMatchFinished,
  ]);
};

export default useTournamentFlow;
