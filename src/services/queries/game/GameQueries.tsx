import { useMutation } from '@tanstack/react-query';
import useGameService from 'services/GameService';
import Game from 'types/Game';

export namespace GameQueries {
  export const keys = {
    all: ['games'],
  };

  export const useAddGame = () => {
    const { addNewGame } = useGameService();

    return useMutation({
      mutationFn: (game: Game) => {
        return addNewGame(game.toDto());
      },
    });
  };

  export const useAddGames = () => {
    const { addNewGameBatch } = useGameService();

    return useMutation({
      mutationFn: (games: Game[]) => {
        return addNewGameBatch(games.map((game) => game.toDto()));
      },
    });
  };

  export const useDeleteGame = () => {
    const { deleteGame } = useGameService();

    return useMutation({
      mutationFn: (game: Game) => {
        return deleteGame(game.toDto());
      },
    });
  };

  export const useUpdateGame = () => {
    const { updateGame: updateExistingGame } = useGameService();

    return useMutation({
      mutationFn: (game: Game) => {
        return updateExistingGame(game.toDto());
      },
    });
  };
}
