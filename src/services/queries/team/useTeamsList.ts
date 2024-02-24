import { useQuery } from '@tanstack/react-query';
import useTeamService from 'services/TeamService';
import QueryKey from '../QueryKeys';

const useTeamsList = () => {
  const { getTeams } = useTeamService();

  const { data: teamsList, isFetching: isFetchingTeamsList } = useQuery({
    queryKey: [QueryKey.TeamsList],
    queryFn: () => getTeams().then((res) => res),
  });
  return {
    teamsList,
    isFetchingTeamsList,
  };
};

export default useTeamsList;
