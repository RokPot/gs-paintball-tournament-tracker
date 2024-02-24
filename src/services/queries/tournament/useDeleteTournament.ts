import { useMutation } from '@tanstack/react-query';
import useTournamentService from 'services/TournamentService';
import Tournament from 'types/Tournament';

const useDeleteTournament = () => {
  const { updateTournament } = useTournamentService();

  const { mutateAsync: updateExistingTournamentMutate } = useMutation({
    mutationFn: (tournament: Tournament) => {
      return updateTournament(tournament.toDto());
    },
  });

  return {
    updateExistingTournamentMutate,
  };
};

export default useDeleteTournament;
