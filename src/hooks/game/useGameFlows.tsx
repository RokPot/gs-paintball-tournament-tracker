import useTournamentFlows from 'hooks/tournament/useTournamentFlows';
import { useCallback } from 'react';
import { GameQueries } from 'services/queries/game/GameQueries';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import ActivityChangeType from 'types/ActivityChangeType';
import Game from 'types/Game';
import { GameWinner } from 'types/GameState';
import MatchState from 'types/MatchState';
import Tournament from 'types/Tournament';
import TournamentActivity from 'types/TournamentActivity';
import { TournamentFlow } from 'utils/tournamentFlowUtils';

const useGameFlows = () => {
  const { mutateAsync: updateGame } = GameQueries.useUpdateGame();
  const { invalidateSelectedLeague } = LeagueQueries.useLeagueInvalidations();
  const { addNewTournamentActivity } = useTournamentFlows();
  const updateGameData = useCallback(
    async (game: Game) => {
      await updateGame(game);
    },
    [updateGame],
  );

  const updateGameWithMatchesAndRecalculate = useCallback(
    async (game: Game, tournament: Tournament) => {
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
      const currentStage = tournament.currentStage?.stage;
      const tournamentId = tournament._id;
      const newTournamentActivity: TournamentActivity = new TournamentActivity({
        id: '',
        _id: '',
        game,
        changeType: ActivityChangeType.GameEdited,
        previousTeam1Wins: game.team1Wins,
        previousTeam2Wins: game.team2Wins,
        nextTeam1Wins: 0,
        nextTeam2Wins: 0,
        stage: currentStage || 1,
        tournamentId,
        updatedAt: new Date(),
        gameTime: game.gameTime,
        match: game.matches?.[0],
      });
      // TO DO rokpot recalculate leaderboard, recalculate scoreboard
      const scheduledGame = tournament.currentStageSchedule?.find(
        (currentStageScheduledGame) =>
          currentStageScheduledGame.game.id === game.id,
      );
      const nextGames = TournamentFlow.prepareNextGameIfEliminationsTournament(
        game,
        tournament?.currentStageGroups?.find(
          (group) => group.id === scheduledGame?.group?.id,
        ),
        tournament.state.stage === 1
          ? tournament.settings?.type
          : tournament.settings?.secondStageType,
        true,
      );

      if (nextGames) {
        if (nextGames.nextRoundGameLoser) {
          await updateGame(nextGames.nextRoundGameLoser);
        }
        if (nextGames.nextRoundGameWinner) {
          await updateGame(nextGames.nextRoundGameWinner);
        }
      }
      await updateGame(game);
      await invalidateSelectedLeague();

      await addNewTournamentActivity(newTournamentActivity);
    },
    [addNewTournamentActivity, invalidateSelectedLeague, updateGame],
  );

  return { updateGameData, updateGameWithMatchesAndRecalculate };
};

export default useGameFlows;
