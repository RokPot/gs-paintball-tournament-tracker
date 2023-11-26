import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useLeagueService from 'services/LeagueService';
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
import QueryKey from './QueryKeys';

const useLeagueQueries = () => {
  const {
    addNewLeague,
    getLeagues,
    updateLeague,
    deleteLeague,
    getActiveLeague,
  } = useLeagueService();
  const { addNewLeaderBoardTeams } = useTeamService();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: leaguesList, isFetching: isFetchingLeaguesList } = useQuery({
    queryKey: [QueryKey.LeaguesList],
    queryFn: () => getLeagues().then((res) => res),
  });

  const { data: selectedLeague, isFetching: isFetchingSelectedLeague } =
    useQuery({
      queryKey: [QueryKey.SelectedLeague],
      queryFn: () => getActiveLeague().then((res) => res),
    });

  const invalidateLeaguesList = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.LeaguesList] });
  }, [queryClient]);

  const invalidateSelectedLeague = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.SelectedLeague] });
  }, [queryClient]);

  const { mutateAsync: addLeagueMutate } = useMutation({
    mutationFn: (league: League) => {
      return addNewLeague(league);
    },
  });

  const { mutateAsync: deleteExistingLeagueMutate } = useMutation({
    mutationFn: (league: League) => {
      return deleteLeague(league);
    },
  });

  const { mutateAsync: updateExistingLeagueMutate } = useMutation({
    mutationFn: (league: League) => {
      return updateLeague(league);
    },
  });

  const setSelectedLeagueTournament = async (tournament?: Tournament) => {
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
  };

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
    leaguesList,
    selectedLeague,
    isFetchingLeaguesList,
    isLoading: isFetchingLeaguesList || isFetchingSelectedLeague,
    addOrEditLeague,
    deleteExistingLeague,
    setSelectedLeague,
    setSelectedLeagueTournament,

    updateExistingLeagueMutate,
    invalidateLeaguesList,
    invalidateSelectedLeague,
  };
};

export default useLeagueQueries;
