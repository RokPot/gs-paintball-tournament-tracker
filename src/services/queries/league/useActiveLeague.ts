import { useQuery } from '@tanstack/react-query';
import useLeagueService from 'services/LeagueService';
import QueryKey from '../QueryKeys';

const useActiveLeague = () => {
  const { getActiveLeague } = useLeagueService();

  const { data: activeLeague, isFetching: isFetchingActiveLeague } = useQuery({
    queryKey: [QueryKey.SelectedLeague],
    queryFn: () => getActiveLeague().then((res) => res),
  });

  return {
    activeLeague,
    isFetchingActiveLeague,
  };
};

export default useActiveLeague;
