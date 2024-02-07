import { useCallback } from 'react';
import useUpdateGame from 'services/queries/game/useUpdateGame';
import Game from 'types/Game';
import { GameWinner } from 'types/GameState';
import MatchState from 'types/MatchState';

const useGameQueries = () => {
  const { updateGame } = useUpdateGame();

  const updateGameData = useCallback(
    async (game: Game) => {
      await updateGame(game);
    },
    [updateGame],
  );

  const updateGameWithMatchesAndRecalculate = useCallback(
    async (game: Game) => {
      game.team1Wins = 0;
      game.team2Wins = 0;

      game.matches?.forEach((match) => {
        if (match.matchState === MatchState.team1Win) {
          game.team1Wins += 1;
          return;
        }
        if (match.matchState === MatchState.team2Win) {
          game.team2Wins += 1;
        }
      });

      if (game.team1Wins === game.team2Wins) {
        game.gameWinner = GameWinner.draw;
      } else if (game.team1Wins > game.team2Wins) {
        game.gameWinner = GameWinner.team1;
      } else {
        game.gameWinner = GameWinner.team2;
      }
      // TO DO rokpot recalculate leaderboard, recalculate scoreboard
      await updateGame(game);
    },
    [updateGame],
  );

  return { updateGameData, updateGameWithMatchesAndRecalculate };
};

export default useGameQueries;
