import { GameState } from 'types/GameState';
import { Match } from 'types/Match';
import Tournament from 'types/Tournament';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentFlow } from 'utils/tournamentFlowUtils';

export namespace TournamentFlowTestUtils {
  export enum FinishMatchState {
    GoToNextTournamentStage = 'goToNextTournamentStage',
    FinishTournament = 'finishTournament',
    ContinueTournament = 'continueTournament',
  }

  export const BeginFreshTournament = () => {};

  export const FinishScheduledGameMatch = (
    match: Match,
    scheduledGame: TournamentScheduleGame,
    durations: { currentDuration: number; timeLeft: number },
    tournament: Tournament,
  ) => {
    TournamentFlow.addMatchDataToGame(
      scheduledGame,
      match,
      durations.timeLeft,
      durations.currentDuration,
    );

    const newTournamentState = TournamentFlow.onAfterFinishedMatchProcedure(
      scheduledGame,
      durations.timeLeft,
      tournament,
    );

    newTournamentState.gamesToUpdate.forEach((game) => {
      const oldGameIndex = tournament.currentStageSchedule?.findIndex(
        (schedGame) => schedGame.game.id === game.id,
      );

      if (
        tournament.currentStageSchedule !== undefined &&
        oldGameIndex !== undefined &&
        oldGameIndex >= 0
      ) {
        tournament.currentStageSchedule[oldGameIndex].game = game;
      }
    });

    if (
      newTournamentState.flowState === TournamentFlow.FlowState.NoGamesAvailable
    ) {
      const currentStageGamesThatAreNotYetFinished =
        tournament.currentStageGroups
          ?.map((group) =>
            group.games.filter((game) => game.gameState !== GameState.finished),
          )
          .flat();

      if (!currentStageGamesThatAreNotYetFinished?.length) {
        if (
          tournament.settings?.secondStageType &&
          tournament.settings?.numberOfGroups > 1
        ) {
          // await goToNextTournamentStage();
          return {
            newTournamentState,
            state: FinishMatchState.GoToNextTournamentStage,
          };
        }
        return { newTournamentState, state: FinishMatchState.FinishTournament };
      }
    }
    return { newTournamentState, state: FinishMatchState.ContinueTournament };
  };
}
