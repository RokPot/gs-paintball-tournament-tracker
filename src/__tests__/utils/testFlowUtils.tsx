import Game from 'types/Game';
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

  export const UpdateGameInTournament = (
    game: Game,
    tournament: Tournament,
  ) => {
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

    tournament.currentStageGroups?.forEach((group) => {
      const oldGroupGameIndex = group.games.findIndex(
        (groupGame) => groupGame.id === game.id,
      );
      if (oldGroupGameIndex !== undefined && oldGroupGameIndex >= 0) {
        group.games[oldGroupGameIndex] = game;
      }
    });
  };

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

    newTournamentState.gamesToUpdate.forEach((game) =>
      TournamentFlowTestUtils.UpdateGameInTournament(game, tournament),
    );

    if (
      newTournamentState?.nextGameState !==
      TournamentFlow.FlowState.NoGamesAvailable
    ) {
      const { nextGameState } = newTournamentState;
      tournament.state.activeGameId = nextGameState.newActiveGame.id;
      tournament.state.pairedGame1Id = nextGameState.newPairedGame1.id;
      tournament.state.pairedGame2Id = nextGameState.newPairedGame2?.id;
      nextGameState.newActiveGame.game.gameState = GameState.playing;
      TournamentFlowTestUtils.UpdateGameInTournament(
        nextGameState.newActiveGame.game,
        tournament,
      );
    }

    const tournamentEndState =
      TournamentFlow.onAfterFinishedMatchEndTournamentCheck(
        newTournamentState,
        tournament.currentStageGroups || [],
        tournament,
      );

    switch (tournamentEndState) {
      case TournamentFlow.EndTournamentCheck.GoToNextTournamentStage:
        return {
          newTournamentState,
          state: FinishMatchState.GoToNextTournamentStage,
        };
      case TournamentFlow.EndTournamentCheck.FinishTournament:
        return { newTournamentState, state: FinishMatchState.FinishTournament };
      case TournamentFlow.EndTournamentCheck.ContinueTournamentStage:
      default:
        break;
    }
    return { newTournamentState, state: FinishMatchState.ContinueTournament };
  };
}
