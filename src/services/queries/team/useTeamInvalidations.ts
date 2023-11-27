import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import QueryKey from '../QueryKeys';

const useTeamInvalidations = () => {
  const queryClient = useQueryClient();

  const invalidateTeamsList = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.TeamsList] });
  }, [queryClient]);

  return {
    invalidateTeamsList,
  };
};

export default useTeamInvalidations;
