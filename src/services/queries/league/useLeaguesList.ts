import { useQuery } from '@tanstack/react-query';
import useLeagueService from 'services/LeagueService';
import QueryKey from '../QueryKeys';

const useLeaguesList = () => {
  const { getLeagues } = useLeagueService();

  const { data: leaguesList, isFetching: isFetchingLeaguesList } = useQuery({
    queryKey: [QueryKey.LeaguesList],
    queryFn: () => getLeagues().then((res) => res),
  });

  return {
    leaguesList,
    isFetchingLeaguesList,
  };
};

export default useLeaguesList;
