import { QueryKey } from './QueryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import useLeagueService from 'services/LeagueService';
import useTeamService from 'services/TeamService';
import { League } from 'types/League';

const useLeagueQueries = () => {
  const {
    addNewLeague,
    getLeagues,
    updateLeague,
    deleteLeague,
    getActiveLeague,
  } = useLeagueService();
  const { addNewLeaderBoardTeams } = useTeamService();
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const queryClient = useQueryClient();

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
  }, []);

  const invalidateSelectedLeague = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.SelectedLeague] });
  }, []);

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

  const { mutateAsync: updateExistingLeague } = useMutation({
    mutationFn: (league: League) => {
      return updateLeague(league);
    },
  });
  const setSelectedLeague = async (
    newActiveLeague?: League | null,
    currentActiveLeague?: League | null
  ) => {
    const isCurrentLeagueSameAsNewLeague =
      newActiveLeague?.id === currentActiveLeague?.id;

    const isLeagueAlreadyActiveAndIsNotNewLeague =
      currentActiveLeague && !isCurrentLeagueSameAsNewLeague;

    if (isLeagueAlreadyActiveAndIsNotNewLeague) {
      currentActiveLeague.isLeagueSelected = false;
      await updateExistingLeague(currentActiveLeague);
    }

    if (newActiveLeague) {
      newActiveLeague.isLeagueSelected = !isCurrentLeagueSameAsNewLeague;
      await updateExistingLeague(newActiveLeague);
    }

    await invalidateSelectedLeague();
    await invalidateLeaguesList();
  };

  const addLeague = async (
    league: League,
    shouldUpdateExistingLeague?: boolean
  ) => {
    if (shouldUpdateExistingLeague) {
      console.log(
        league.leaderboard.filter((leaderboardTeam) => !leaderboardTeam._rev)
      );
      await addNewLeaderBoardTeams(
        league.leaderboard.filter((leaderboardTeam) => !leaderboardTeam._rev)
      );
      await updateExistingLeague(league);
    } else {
      await addNewLeaderBoardTeams(league.leaderboard);
      await addLeagueMutate(league);
    }

    await invalidateLeaguesList();
  };

  const deleteExistingLeague = async (league: League) => {
    await deleteExistingLeagueMutate(league);
    await invalidateLeaguesList();
  };

  return {
    leaguesList,
    selectedLeague,
    isFetchingLeaguesList,
    isLoading: isFetchingLeaguesList || isFetchingSelectedLeague,
    invalidateLeaguesList,
    addLeague,
    deleteExistingLeague,
    updateExistingLeague,
    setSelectedLeague,
  };
};

export default useLeagueQueries;
