import { useMutation } from '@tanstack/react-query';
import useLeagueService from 'services/LeagueService';
import League from 'types/League';

const useDeleteLeague = () => {
  const { deleteLeague } = useLeagueService();

  const { mutateAsync: deleteExistingLeagueMutate } = useMutation({
    mutationFn: (league: League) => {
      return deleteLeague(league);
    },
  });

  return {
    deleteExistingLeagueMutate,
  };
};

export default useDeleteLeague;
