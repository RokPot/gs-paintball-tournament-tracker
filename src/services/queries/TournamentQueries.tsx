import { useMutation } from '@tanstack/react-query';
import useTournamentService from 'services/TournamentService';
import League from 'types/League';
import Tournament from 'types/Tournament';
import useLeagueQueries from './LeagueQueries';

const useTournamentQueries = () => {
  const {
    addNewTournament,

    deleteTournament,
    updateTournament,
  } = useTournamentService();
  const {
    invalidateLeaguesList,
    invalidateSelectedLeague,
    selectedLeague,
    updateExistingLeague,
  } = useLeagueQueries();

  const { mutateAsync: addTournament } = useMutation({
    mutationFn: (tournament: Tournament) => {
      return addNewTournament(tournament.toDto());
    },
  });

  const { mutateAsync: deleteExistingTournament } = useMutation({
    mutationFn: (tournament: Tournament) => {
      return deleteTournament(tournament.toDto());
    },
  });

  const { mutateAsync: updateExistingTournament } = useMutation({
    mutationFn: (tournament: Tournament) => {
      return updateTournament(tournament.toDto());
    },
  });

  const addNewTournamentToLeague = async (
    tournament: Tournament,
    league?: League,
  ): Promise<League | undefined> => {
    if (!league) {
      return undefined;
    }
    const newTournament = await addNewTournament(tournament.toDto());
    if (!newTournament) {
      return undefined;
    }
    league.tournaments = [...league.tournaments, newTournament];
    await updateExistingLeague(league);
    await invalidateLeaguesList();
    if (league.id === selectedLeague?.id) {
      await invalidateSelectedLeague();
    }
    return league;
  };

  return {
    addTournament,
    deleteExistingTournament,
    updateExistingTournament,
    addNewTournamentToLeague,
  };
};

export default useTournamentQueries;
