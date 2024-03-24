import { useMutation } from '@tanstack/react-query';
import useTournamentService from 'services/TournamentService';
import Tournament from 'types/Tournament';

export namespace TournamentQueries {
  export const keys = {
    all: ['leagues'] as const,
    selectedLeague: () => [...keys.all, 'selected-league'],
    list: () => [...keys.all, 'list'],
  };

  export const useAddTournament = () => {
    const { addNewTournament } = useTournamentService();

    return useMutation({
      mutationFn: (tournament: Tournament) => {
        return addNewTournament(tournament.toDto());
      },
    });
  };

  export const useDeleteTournament = () => {
    const { updateTournament } = useTournamentService();

    return useMutation({
      mutationFn: (tournament: Tournament) => {
        return updateTournament(tournament.toDto());
      },
    });
  };

  export const useUpdateTournament = () => {
    const { updateTournament: updateExistingTournament } =
      useTournamentService();

    return useMutation({
      mutationFn: (tournament: Tournament) => {
        return updateExistingTournament(tournament.toDto());
      },
    });
  };
}
