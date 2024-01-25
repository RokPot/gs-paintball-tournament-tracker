import { useCallback, useMemo } from 'react';
import useLeagueInvalidations from 'services/queries/league/useLeagueInvalidations';
import useUpdateTournament from 'services/queries/tournament/useUpdateTournament';
import Tournament from 'types/Tournament';
import { TournamentStatus } from 'types/TournamentStatus';

const useTournamentFlow = (tournament?: Tournament) => {
  const { updateTournament } = useUpdateTournament();
  const { invalidateSelectedLeague } = useLeagueInvalidations();

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
      beginTournament,
      onMatchFinished,
      finishGame,
    };
  }, [beginTournament, finishGame, onMatchFinished]);
};

export default useTournamentFlow;
