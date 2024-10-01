import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import useLeagueService from 'services/LeagueService';
import League from 'types/League';

export namespace LeagueQueries {
  export const keys = {
    all: ['leagues'] as const,
    selectedLeague: () => [...keys.all, 'selected-league'],
    list: () => [...keys.all, 'list'],
  };

  export const useActiveLeague = () => {
    const { getActiveLeague } = useLeagueService();

    return useQuery({
      queryKey: LeagueQueries.keys.selectedLeague(),
      queryFn: () => getActiveLeague().then((res) => res),
    });
  };

  export const useAddLeague = () => {
    const { addNewLeague } = useLeagueService();

    return useMutation({
      mutationFn: (league: League) => {
        return addNewLeague(league);
      },
    });
  };

  export const useDeleteLeague = () => {
    const { deleteLeague } = useLeagueService();

    return useMutation({
      mutationFn: (league: League) => {
        return deleteLeague(league);
      },
    });
  };

  export const useLeagueInvalidations = () => {
    const queryClient = useQueryClient();

    const invalidateLeaguesList = useCallback(async () => {
      queryClient.invalidateQueries({ queryKey: LeagueQueries.keys.list() });
    }, [queryClient]);

    const invalidateSelectedLeague = useCallback(async () => {
      queryClient.invalidateQueries({
        queryKey: LeagueQueries.keys.selectedLeague(),
      });
    }, [queryClient]);
    return {
      invalidateLeaguesList,
      invalidateSelectedLeague,
    };
  };

  export const useLeaguesList = () => {
    const { getLeagues } = useLeagueService();

    return useQuery({
      queryKey: LeagueQueries.keys.list(),
      queryFn: () => getLeagues().then((res) => res),
    });
  };

  export const useUpdateLeague = () => {
    const { updateLeague } = useLeagueService();

    return useMutation({
      mutationFn: (league: League) => {
        return updateLeague(league);
      },
    });
  };
}
