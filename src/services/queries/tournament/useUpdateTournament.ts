import { useMutation } from '@tanstack/react-query';
import useTournamentService from 'services/TournamentService';
import Tournament from 'types/Tournament';

const useUpdateTournament = () => {
  const { updateTournament: updateExistingTournament } = useTournamentService();

  const { mutateAsync: updateTournament } = useMutation({
    mutationFn: (tournament: Tournament) => {
      return updateExistingTournament(tournament.toDto());
    },
  });

  return {
    updateTournament,
  };
};

export default useUpdateTournament;
