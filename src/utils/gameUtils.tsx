import Game from 'types/Game';
import { GameState } from 'types/GameState';

export const getNotFinishedGames = (games: Game[]) => {
  return games.filter((game) => game.gameState === GameState.finished);
};

export const getFinishedGames = (games: Game[]) => {
  return games.filter((game) => game.gameState === GameState.finished);
};
