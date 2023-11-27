import useTeamService from 'services/TeamService';
import League from 'types/League';
import { useCallback } from 'react';
import Tournament from 'types/Tournament';
import { useSnackbar } from 'notistack';
import {
  snackbarErrorOptions,
  snackbarSuccessOptions,
} from 'utils/snackbarUtils';
import { processError } from 'utils/requestsUtils';
import useLeagueInvalidations from '../../services/queries/league/useLeagueInvalidations';
import useUpdateLeague from '../../services/queries/league/useUpdateLeague';
import useAddLeague from '../../services/queries/league/useAddLeague';
import useDeleteLeague from '../../services/queries/league/useDeleteLeague';

const useLeagueQueries = () => {
  const { addNewLeaderBoardTeams } = useTeamService();
  const { enqueueSnackbar } = useSnackbar();
  const { invalidateSelectedLeague, invalidateLeaguesList } =
    useLeagueInvalidations();
  const { updateExistingLeagueMutate } = useUpdateLeague();
  const { addLeagueMutate } = useAddLeague();
  const { deleteExistingLeagueMutate } = useDeleteLeague();

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
      } catch (e) {
        processError(e);
        enqueueSnackbar('Something went wrong', snackbarErrorOptions);
      }
    },
    [enqueueSnackbar, invalidateSelectedLeague, updateExistingLeagueMutate],
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
        await addNewLeaderBoardTeams(
          league.leaderboard.filter((leaderboardTeam) => !leaderboardTeam._rev),
        );
        await updateExistingLeagueMutate(league);
      } else {
        await addNewLeaderBoardTeams(league.leaderboard);
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

export default useLeagueQueries;
