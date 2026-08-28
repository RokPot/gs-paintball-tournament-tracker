import { useMutation } from '@tanstack/react-query';
import useGameServiceRxDB from 'services/GameServiceRxDB';
import Game from 'types/Game';

export namespace GameQueries {
  export const keys = {
    all: ['games'],
  };

  export const useAddGame = () => {
    const { addNewGame } = useGameServiceRxDB();

    return useMutation({
      mutationFn: (game: Game) => {
        return addNewGame(game.toDto());
      },
    });
  };

  export const useAddGames = () => {
    const { addNewGameBatch } = useGameServiceRxDB();

    return useMutation({
      mutationFn: (games: Game[]) => {
        return addNewGameBatch(games.map((game) => game.toDto()));
      },
    });
  };

  export const useDeleteGame = () => {
    const { deleteGame } = useGameServiceRxDB();

    return useMutation({
      mutationFn: (game: Game) => {
        return deleteGame(game.toDto());
      },
    });
  };

  export const useUpdateGame = () => {
    const { updateGame: updateExistingGame } = useGameServiceRxDB();

    return useMutation({
      mutationFn: (game: Game) => {
        return updateExistingGame(game.toDto());
      },
      // NOTE: No manual invalidation needed!
      // When a game is updated, RxDB observables (useTournamentObservable, etc.)
      // automatically detect the change and update subscribed components.
      // This means tournament data stays in sync without manual cache invalidation.
    });
  };
}
