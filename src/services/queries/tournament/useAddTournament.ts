import { useMutation } from '@tanstack/react-query';
import useTournamentService from 'services/TournamentService';
import Tournament from 'types/Tournament';

const useAddTournament = () => {
  const { addNewTournament } = useTournamentService();

  const { mutateAsync: addTournament } = useMutation({
    mutationFn: (tournament: Tournament) => {
      return addNewTournament(tournament.toDto());
    },
  });

  return {
    addTournament,
  };
};

export default useAddTournament;
