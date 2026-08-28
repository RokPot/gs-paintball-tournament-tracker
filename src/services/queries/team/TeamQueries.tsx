import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import useTeamServiceRxDB from 'services/TeamServiceRxDB';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';

export namespace TeamQueries {
  export const keys = {
    all: ['teams'] as const,
    list: () => [...keys.all, 'list'],
  };

  export const useAddTeam = () => {
    const { addNewTeam } = useTeamServiceRxDB();

    return useMutation({
      mutationFn: (team: Team) => {
        return addNewTeam(team.toDto());
      },
    });
  };

  export const useAddLeaderboardTeam = () => {
    const { addNewLeaderboardTeam } = useTeamServiceRxDB();

    return useMutation({
      mutationFn: (leaderboardTeam: LeaderboardTeam) => {
        return addNewLeaderboardTeam(leaderboardTeam.toDto());
      },
    });
  };

  export const useDeleteTeam = () => {
    const { deleteTeam: deleteTeamService } = useTeamServiceRxDB();

    return useMutation({
      mutationFn: (team: Team) => {
        return deleteTeamService(team.toDto());
      },
    });
  };

  export const useTeamInvalidations = () => {
    const queryClient = useQueryClient();

    const invalidateTeamsList = useCallback(async () => {
      queryClient.invalidateQueries({ queryKey: TeamQueries.keys.list() });
    }, [queryClient]);

    return {
      invalidateTeamsList,
    };
  };

  export const useTeamsList = () => {
    const { getTeams } = useTeamServiceRxDB();

    return useQuery({
      queryKey: TeamQueries.keys.list(),
      queryFn: () => getTeams().then((res) => res),
    });
  };

  export const useUpdateTeam = () => {
    const { updateTeam: updateTeamService } = useTeamServiceRxDB();

    return useMutation({
      mutationFn: (team: Team) => {
        return updateTeamService(team.toDto());
      },
    });
  };
}
