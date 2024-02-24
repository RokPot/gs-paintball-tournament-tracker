import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import QueryKey from '../QueryKeys';

const useLeagueInvalidations = () => {
  const queryClient = useQueryClient();

  const invalidateLeaguesList = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.LeaguesList] });
  }, [queryClient]);

  const invalidateSelectedLeague = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.SelectedLeague] });
  }, [queryClient]);
  return {
    invalidateLeaguesList,
    invalidateSelectedLeague,
  };
};

export default useLeagueInvalidations;
