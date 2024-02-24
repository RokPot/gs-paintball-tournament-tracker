import { useMutation } from '@tanstack/react-query';
import useLeagueService from 'services/LeagueService';
import League from 'types/League';

const useAddLeague = () => {
  const { addNewLeague } = useLeagueService();

  const { mutateAsync: addLeagueMutate } = useMutation({
    mutationFn: (league: League) => {
      return addNewLeague(league);
    },
  });

  return {
    addLeagueMutate,
  };
};

export default useAddLeague;
