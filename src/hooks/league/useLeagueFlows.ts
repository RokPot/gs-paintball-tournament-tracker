import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import useActiveStateServiceRxDB from 'services/ActiveStateServiceRxDB';
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
  const { invalidateLeaguesList } = LeagueQueries.useLeagueInvalidations();
  const { mutateAsync: updateExistingLeagueMutate } =
    LeagueQueries.useUpdateLeague();
  const { mutateAsync: addLeagueMutate } = LeagueQueries.useAddLeague();
  const { mutateAsync: deleteExistingLeagueMutate } =
    LeagueQueries.useDeleteLeague();
  const { setActiveState, getActiveState } = useActiveStateServiceRxDB();

  const setSelectedLeagueTournament = useCallback(
    async (tournament?: Tournament, selectedLeague?: League | null) => {
      try {
        if (!selectedLeague) {
          return;
        }
        const updatedLeague = selectedLeague;
        updatedLeague.activeTournament = tournament || undefined;

        await setActiveState({
          tournamentId: tournament?._id || null,
          gameId: null,
        });
        await updateExistingLeagueMutate(updatedLeague);
        enqueueSnackbar(
          tournament ? 'Tournament selected' : 'Tournament cleared',
          snackbarSuccessOptions,
        );
        await invalidateLeaguesList();
      } catch (e) {
        processError(e);
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
      }
    },
    [
      enqueueSnackbar,
      invalidateLeaguesList,
      setActiveState,
      updateExistingLeagueMutate,
    ],
  );

  const setSelectedLeague = async (
    newActiveLeague?: League | null,
    currentActiveLeague?: League | null,
  ) => {
    try {
      const isTogglingOff =
        !newActiveLeague || newActiveLeague.id === currentActiveLeague?.id;

      if (isTogglingOff) {
        await setActiveState({
          leagueId: null,
          tournamentId: null,
          gameId: null,
        });
      } else {
        await setActiveState({
          leagueId: newActiveLeague._id,
          tournamentId: newActiveLeague.activeTournament?._id || null,
          gameId: null,
        });
        enqueueSnackbar('League selected', snackbarSuccessOptions);
      }

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
      const activeState = await getActiveState();
      await deleteExistingLeagueMutate(league);
      if (activeState?.leagueId === league._id) {
        await setActiveState({
          leagueId: null,
          tournamentId: null,
          gameId: null,
        });
      }
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
