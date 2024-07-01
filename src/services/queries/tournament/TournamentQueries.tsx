import { useMutation, useQuery } from '@tanstack/react-query';
import useTournamentService from 'services/TournamentService';
import Tournament from 'types/Tournament';
import TournamentActivity from 'types/TournamentActivity';

export namespace TournamentQueries {
  export const keys = {
    all: ['leagues'] as const,
    selectedLeague: () => [...keys.all, 'selected-league'],
    list: () => [...keys.all, 'list'],
    activityList: () => [...keys.all, 'activity-list'],
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

  export const useTournamentActivityList = (tournamentId: string) => {
    const { getTournamentActivity } = useTournamentService();

    return useQuery({
      queryKey: TournamentQueries.keys.activityList(),
      queryFn: () => getTournamentActivity(tournamentId).then((res) => res),
    });
  };

  export const useAddActivityToTournament = () => {
    const { addNewTournamentActivity } = useTournamentService();

    return useMutation({
      mutationFn: (activity: TournamentActivity) => {
        return addNewTournamentActivity(activity.toDto());
      },
    });
  };
}
