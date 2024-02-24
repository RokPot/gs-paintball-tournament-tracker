import { useMutation } from '@tanstack/react-query';
import useGameService from 'services/GameService';
import Game from 'types/Game';

const useDeleteGame = () => {
  const { deleteGame } = useGameService();

  const { mutateAsync: deleteGameMutate } = useMutation({
    mutationFn: (game: Game) => {
      return deleteGame(game.toDto());
    },
  });

  return {
    deleteGameMutate,
  };
};

export default useDeleteGame;
