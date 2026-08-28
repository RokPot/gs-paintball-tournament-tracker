import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import useActiveStateServiceRxDB from 'services/ActiveStateServiceRxDB';
import { IActiveState } from 'types/interfaces/IActiveState';

export namespace ActiveStateQueries {
  export const keys = {
    all: ['activeState'] as const,
    active: () => [...keys.all, 'active'],
  };

  /**
   * Hook to get the current active state
   * Returns the singleton active state with leagueId, tournamentId, and gameId
   */
  export const useActiveState = () => {
    const { getActiveState } = useActiveStateServiceRxDB();

    return useQuery({
      queryKey: ActiveStateQueries.keys.active(),
      queryFn: () => getActiveState().then((res) => res),
    });
  };

  /**
   * Hook to update the active state
   * Can update leagueId, tournamentId, and/or gameId
   */
  export const useUpdateActiveState = () => {
    const { updateActiveState } = useActiveStateServiceRxDB();

    return useMutation({
      mutationFn: (
        updates: Partial<
          Pick<IActiveState, 'gameId' | 'tournamentId' | 'leagueId'>
        >,
      ) => {
        return updateActiveState(updates);
      },
    });
  };

  /**
   * Hook to set the active league
   */
  export const useSetActiveLeague = () => {
    const { setActiveLeague } = useActiveStateServiceRxDB();

    return useMutation({
      mutationFn: (leagueId: string | null) => {
        return setActiveLeague(leagueId);
      },
    });
  };

  /**
   * Hook to set the active tournament
   */
  export const useSetActiveTournament = () => {
    const { setActiveTournament } = useActiveStateServiceRxDB();

    return useMutation({
      mutationFn: (tournamentId: string | null) => {
        return setActiveTournament(tournamentId);
      },
    });
  };

  /**
   * Hook to set the active game
   */
  export const useSetActiveGame = () => {
    const { setActiveGame } = useActiveStateServiceRxDB();

    return useMutation({
      mutationFn: (gameId: string | null) => {
        return setActiveGame(gameId);
      },
    });
  };

  /**
   * Hook to invalidate active state queries
   */
  export const useActiveStateInvalidations = () => {
    const queryClient = useQueryClient();

    const invalidateActiveState = useCallback(async () => {
      queryClient.invalidateQueries({
        queryKey: ActiveStateQueries.keys.active(),
      });
    }, [queryClient]);

    return {
      invalidateActiveState,
    };
  };

  /**
   * Hook to initialize the active state (call on app startup)
   */
  export const useInitializeActiveState = () => {
    const { initializeActiveState } = useActiveStateServiceRxDB();

    return useMutation({
      mutationFn: () => {
        return initializeActiveState();
      },
    });
  };
}
