import { useMutation } from '@tanstack/react-query';
import useGameService from 'services/GameService';
import Game from 'types/Game';

const useUpdateGame = () => {
  const { updateGame: updateExistingGame } = useGameService();

  const { mutateAsync: updateGame } = useMutation({
    mutationFn: (game: Game) => {
      return updateExistingGame(game.toDto());
    },
  });

  return {
    updateGame,
  };
};

export default useUpdateGame;
