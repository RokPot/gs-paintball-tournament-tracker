import { QueryKey } from './QueryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import useTeamService from 'services/TeamService';
import { Team } from 'types/Team';

const useTeamQueries = () => {
  const { addNewTeam, getTeams, deleteTeam, updateTeam } = useTeamService();
  const queryClient = useQueryClient();

  const { data, isFetching: isFetchingTeamsList } = useQuery({
    queryKey: [QueryKey.TeamsList],
    queryFn: () => getTeams().then((res) => res),
  });

  const invalidateTeamsList = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.TeamsList] });
  }, []);

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
