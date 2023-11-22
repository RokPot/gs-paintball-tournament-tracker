import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import useTeamService from 'services/TeamService';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import { v4 } from 'uuid';
import QueryKey from './QueryKeys';

export const createNewLeaderboardTeam = (team: Team) => {
  const id = v4();
  return new LeaderboardTeam({
    _id: id,
    id,
    team,
    rank: 0,
    totalLosses: 0,
    totalPoints: 0,
    totalWins: 0,
    previousRank: 0,
  });
};

const useTeamQueries = () => {
  const { addNewTeam, getTeams, deleteTeam, updateTeam } = useTeamService();
  const queryClient = useQueryClient();

  const { data, isFetching: isFetchingTeamsList } = useQuery({
    queryKey: [QueryKey.TeamsList],
    queryFn: () => getTeams().then((res) => res),
  });

  const invalidateTeamsList = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.TeamsList] });
  }, [queryClient]);

  const addTeam = useMutation({
    mutationFn: (team: Team) => {
      return addNewTeam(team);
    },
  });

  const deleteExistingTeam = useMutation({
    mutationFn: (team: Team) => {
      return deleteTeam(team);
    },
  });

  const updateExistingTeam = useMutation({
    mutationFn: (team: Team) => {
      return updateTeam(team);
    },
  });

  return {
    teamsList: data,
    isFetchingTeamsList,
    invalidateTeamsList,
    addTeam,
    deleteExistingTeam,
    updateExistingTeam,
  };
};

export default useTeamQueries;
