import { useMutation } from '@tanstack/react-query';
import useGameService from 'services/GameService';
import Game from 'types/Game';

const useAddGame = () => {
  const { addNewGame, addNewGameBatch } = useGameService();

  const { mutateAsync: addGame } = useMutation({
    mutationFn: (game: Game) => {
      return addNewGame(game.toDto());
    },
  });

  const { mutateAsync: addGamesBulk } = useMutation({
    mutationFn: (games: Game[]) => {
      return addNewGameBatch(games.map((game) => game.toDto()));
    },
  });

  return {
    addGame,
    addGamesBulk,
  };
};

export default useAddGame;
