import League from 'types/League';
import { useCallback } from 'react';
import Tournament from 'types/Tournament';
import { useSnackbar } from 'notistack';
import {
  snackbarErrorOptions,
  snackbarSuccessOptions,
} from 'utils/snackbarUtils';
import { processError } from 'utils/requestsUtils';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import { TeamQueries } from 'services/queries/team/TeamQueries';

const useLeagueFlows = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { invalidateSelectedLeague, invalidateLeaguesList } =
    LeagueQueries.useLeagueInvalidations();
  const { mutateAsync: updateExistingLeagueMutate } =
    LeagueQueries.useUpdateLeague();
  const { mutateAsync: addLeagueMutate } = LeagueQueries.useAddLeague();
  const { mutateAsync: deleteExistingLeagueMutate } =
    LeagueQueries.useDeleteLeague();
  const { mutateAsync: addNewLeaderBoardTeams } =
    TeamQueries.useAddLeaderboardTeams();

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

export default useLeagueFlows;
