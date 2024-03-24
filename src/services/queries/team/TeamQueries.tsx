import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import useTeamService from 'services/TeamService';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';

export namespace TeamQueries {
  export const keys = {
    all: ['teams'] as const,
    list: () => [...keys.all, 'list'],
  };

  export const useAddTeam = () => {
    const { addNewTeam } = useTeamService();

    return useMutation({
      mutationFn: (team: Team) => {
        return addNewTeam(team);
      },
    });
  };

  export const useAddLeaderboardTeam = () => {
    const { addNewLeaderBoardTeam } = useTeamService();

    return useMutation({
      mutationFn: (team: LeaderboardTeam) => {
        return addNewLeaderBoardTeam(team);
      },
    });
  };

  export const useAddLeaderboardTeams = () => {
    const { addNewLeaderBoardTeams } = useTeamService();

    return useMutation({
      mutationFn: (teams: LeaderboardTeam[]) => {
        return addNewLeaderBoardTeams(teams);
      },
    });
  };

  export const useDeleteTeam = () => {
    const { deleteTeam: deleteTeamService } = useTeamService();

    return useMutation({
      mutationFn: (team: Team) => {
        return deleteTeamService(team);
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
    const { getTeams } = useTeamService();

    return useQuery({
      queryKey: TeamQueries.keys.list(),
      queryFn: () => getTeams().then((res) => res),
    });
  };

  export const useUpdateTeam = () => {
    const { updateTeam: updateTeamService } = useTeamService();

    return useMutation({
      mutationFn: (team: Team) => {
        return updateTeamService(team);
      },
    });
  };
}
