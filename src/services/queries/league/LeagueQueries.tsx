import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import useLeagueServiceRxDB from 'services/LeagueServiceRxDB';
import League from 'types/League';

export namespace LeagueQueries {
  export const keys = {
    all: ['leagues'] as const,
    list: () => [...keys.all, 'list'],
  };

  export const useAddLeague = () => {
    const { addNewLeague } = useLeagueServiceRxDB();

    return useMutation({
      mutationFn: (league: League) => {
        return addNewLeague(league.toDto());
      },
    });
  };

  export const useDeleteLeague = () => {
    const { deleteLeague } = useLeagueServiceRxDB();

    return useMutation({
      mutationFn: (league: League) => {
        return deleteLeague(league.toDto());
      },
    });
  };

  export const useLeagueInvalidations = () => {
    const queryClient = useQueryClient();

    const invalidateLeaguesList = useCallback(async () => {
      queryClient.invalidateQueries({ queryKey: LeagueQueries.keys.list() });
    }, [queryClient]);

    return {
      invalidateLeaguesList,
    };
  };

  export const useLeaguesList = () => {
    const { getLeagues } = useLeagueServiceRxDB();

    return useQuery({
      queryKey: LeagueQueries.keys.list(),
      queryFn: () => getLeagues().then((res) => res),
    });
  };

  export const useUpdateLeague = () => {
    const { updateLeague } = useLeagueServiceRxDB();

    return useMutation({
      mutationFn: (league: League) => {
        return updateLeague(league.toDto());
      },
    });
  };
}
