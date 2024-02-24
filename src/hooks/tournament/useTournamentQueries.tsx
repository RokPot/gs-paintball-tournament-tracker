import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import useUpdateTournament from 'services/queries/tournament/useUpdateTournament';
import League from 'types/League';
import Tournament from 'types/Tournament';
import { snackbarSuccessOptions } from 'utils/snackbarUtils';
import useLeagueInvalidations from '../../services/queries/league/useLeagueInvalidations';
import useUpdateLeague from '../../services/queries/league/useUpdateLeague';
import useAddTournament from '../../services/queries/tournament/useAddTournament';

const useTournamentQueries = () => {
  const { addTournament } = useAddTournament();
  const { updateExistingLeagueMutate } = useUpdateLeague();
  const { invalidateLeaguesList, invalidateSelectedLeague } =
    useLeagueInvalidations();
  const { updateTournament } = useUpdateTournament();
  const { enqueueSnackbar } = useSnackbar();

  const addNewTournamentToLeague = useCallback(
    async (
      tournament: Tournament,
      league?: League | null,
      selectedLeague?: League,
    ): Promise<League | undefined> => {
      if (!league) {
        return undefined;
      }
      const newTournament = await addTournament(tournament);
      if (!newTournament) {
        return undefined;
      }
      league.tournaments = [...league.tournaments, newTournament];
      await updateExistingLeagueMutate(league);
      await invalidateLeaguesList();
      if (league.id === selectedLeague?.id) {
        await invalidateSelectedLeague();
      }
      return league;
    },
    [
      addTournament,
      invalidateLeaguesList,
      invalidateSelectedLeague,
      updateExistingLeagueMutate,
    ],
  );

  const addOrEditTournament = useCallback(
    async (
      tournament: Tournament,
      league?: League | null,
      shouldUpdate?: boolean,
    ) => {
      if (shouldUpdate) {
        await updateTournament(tournament);
        enqueueSnackbar('Tournament updated', snackbarSuccessOptions);
      } else {
        await addNewTournamentToLeague(tournament, league);
        enqueueSnackbar('Tournament created', snackbarSuccessOptions);
      }
    },
    [addNewTournamentToLeague, enqueueSnackbar, updateTournament],
  );

  return {
    addNewTournamentToLeague,
    addOrEditTournament,
  };
};

export default useTournamentQueries;
