import { useMutation } from '@tanstack/react-query';
import Game from 'types/Game';
import useGameServiceRxDB from 'services/GameServiceRxDB';

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
    });
  };
}
