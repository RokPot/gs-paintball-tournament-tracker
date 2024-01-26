import { useCallback } from 'react';
import useUpdateGame from 'services/queries/game/useUpdateGame';
import Game from 'types/Game';

const useGameQueries = () => {
  const { updateGame } = useUpdateGame();

  const updateGameData = useCallback(
    async (game: Game) => {
      await updateGame(game);
    },
    [updateGame],
  );
  return { updateGameData };
};

export default useGameQueries;
