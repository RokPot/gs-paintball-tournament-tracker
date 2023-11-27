import { useMutation } from '@tanstack/react-query';
import useLeagueService from 'services/LeagueService';
import League from 'types/League';

const useUpdateLeague = () => {
  const { updateLeague } = useLeagueService();

  const { mutateAsync: updateExistingLeagueMutate } = useMutation({
    mutationFn: (league: League) => {
      return updateLeague(league);
    },
  });

  return {
    updateExistingLeagueMutate,
  };
};

export default useUpdateLeague;
