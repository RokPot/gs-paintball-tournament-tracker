import { QueryKey } from './QueryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import useLeagueService from 'services/LeagueService';
import useTournamentService from 'services/TournamentService';
import { League } from 'types/League';

const useTournamentQueries = (leagueId: string) => {
  const { addNewLeague, getLeagues, updateLeague, deleteLeague } =
    useLeagueService();
  const { addNewTournament, getTournaments, getTournament } =
    useTournamentService();
  const queryClient = useQueryClient();

  const { data, isFetching: isFetchingLeaguesList } = useQuery({
    queryKey: [QueryKey.LeaguesList],
    queryFn: () => getTournaments(leagueId).then((res) => res),
  });

  const invalidateLeaguesList = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.LeaguesList] });
  }, []);

  const addLeague = useMutation({
    mutationFn: (league: League) => {
      return addNewLeague(league);
    },
  });

  const deleteExistingLeague = useMutation({
    mutationFn: (league: League) => {
      return deleteLeague(league);
    },
  });

  const updateExistingLeague = useMutation({
    mutationFn: (league: League) => {
      return updateLeague(league);
    },
  });

  return {
    leaguesList: data,
    isFetchingLeaguesList,
    invalidateLeaguesList,
    addLeague,
    deleteExistingLeague,
    updateExistingLeague,
  };
};

export default useTournamentQueries;
