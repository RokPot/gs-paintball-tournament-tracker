import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import League from 'types/League';
import Tournament from 'types/Tournament';
import { processError } from 'utils/requestsUtils';
import {
  snackbarErrorOptions,
  snackbarSuccessOptions,
} from 'utils/snackbarUtils';

const useLeagueFlows = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { invalidateSelectedLeague, invalidateLeaguesList } =
    LeagueQueries.useLeagueInvalidations();
  const { mutateAsync: updateExistingLeagueMutate } =
    LeagueQueries.useUpdateLeague();
  const { mutateAsync: addLeagueMutate } = LeagueQueries.useAddLeague();
  const { mutateAsync: deleteExistingLeagueMutate } =
    LeagueQueries.useDeleteLeague();

  const setSelectedLeagueTournament = useCallback(
    async (tournament?: Tournament, selectedLeague?: League | null) => {
      try {
        if (!selectedLeague) {
          return;
        }
        const updatedLeague = selectedLeague;
        updatedLeague.activeTournament = tournament || undefined;

        await updateExistingLeagueMutate(updatedLeague);
        enqueueSnackbar('Tournament selected', snackbarSuccessOptions);
        await invalidateSelectedLeague();
        await invalidateLeaguesList();
      } catch (e) {
        processError(e);
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
      }
    },
    [
      enqueueSnackbar,
      invalidateLeaguesList,
      invalidateSelectedLeague,
      updateExistingLeagueMutate,
    ],
  );

  const setSelectedLeague = async (
    newActiveLeague?: League | null,
    currentActiveLeague?: League | null,
  ) => {
    try {
      const isCurrentLeagueSameAsNewLeague =
        newActiveLeague?.id === currentActiveLeague?.id;

      const isLeagueAlreadyActiveAndIsNotNewLeague =
        currentActiveLeague && !isCurrentLeagueSameAsNewLeague;

      if (isLeagueAlreadyActiveAndIsNotNewLeague) {
        currentActiveLeague.isLeagueSelected = false;
        await updateExistingLeagueMutate(currentActiveLeague);
      }

      if (newActiveLeague) {
        newActiveLeague.isLeagueSelected = !isCurrentLeagueSameAsNewLeague;
        await updateExistingLeagueMutate(newActiveLeague);
        enqueueSnackbar('League selected', snackbarSuccessOptions);
      }

      await invalidateSelectedLeague();
      await invalidateLeaguesList();
    } catch (e) {
      processError(e);
      enqueueSnackbar('Something went wrong', snackbarErrorOptions);
    }
  };

  const addOrEditLeague = async (
    league: League,
    shouldUpdateExistingLeague?: boolean,
  ) => {
    try {
      if (shouldUpdateExistingLeague) {
        await updateExistingLeagueMutate(league);
      } else {
        await addLeagueMutate(league);
      }
      enqueueSnackbar(
        shouldUpdateExistingLeague ? 'League updated' : 'League created',
        snackbarSuccessOptions,
      );
      await invalidateLeaguesList();
    } catch (e) {
      processError(e);
      enqueueSnackbar('Something went wrong', snackbarErrorOptions);
    }
  };

  const deleteExistingLeague = async (league: League) => {
    try {
      await deleteExistingLeagueMutate(league);
      enqueueSnackbar('League deleted', snackbarSuccessOptions);
      await invalidateLeaguesList();
    } catch (e) {
      processError(e);
      enqueueSnackbar('Something went wrong', snackbarErrorOptions);
    }
  };

  return {
    addOrEditLeague,
    deleteExistingLeague,
    setSelectedLeague,
    setSelectedLeagueTournament,
  };
};

export default useLeagueFlows;
