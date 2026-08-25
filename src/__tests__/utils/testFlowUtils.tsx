import Game from 'types/Game';
import { Match } from 'types/Match';
import Tournament from 'types/Tournament';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentStatus } from 'types/TournamentStatus';
import { TournamentFlow } from 'utils/tournamentFlowUtils';
import { generateNextTournamentStage } from 'utils/tournamentUtils';

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

  export const GoToNextTournamentStage = (tournament: Tournament) => {
    const nextStage = generateNextTournamentStage(
      tournament,
      tournament.settings.secondStageType,
    );
    if (nextStage) {
      tournament.stages!.push(nextStage);

      return (
        TournamentFlow.prepareGamesForTournament(
          tournament,
          nextStage.schedule,
        ) || undefined
      );
    }

    return undefined;
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
      TournamentFlow.applyActivePairGameStates(
        nextGameState.newActiveGame,
        nextGameState.newPairedGame1,
        nextGameState.newPairedGame2,
      );
      TournamentFlowTestUtils.UpdateGameInTournament(
        nextGameState.newActiveGame.game,
        tournament,
      );
      TournamentFlowTestUtils.UpdateGameInTournament(
        nextGameState.newPairedGame1.game,
        tournament,
      );
      if (nextGameState.newPairedGame2) {
        TournamentFlowTestUtils.UpdateGameInTournament(
          nextGameState.newPairedGame2.game,
          tournament,
        );
      }
    }

    const tournamentEndState =
      TournamentFlow.onAfterFinishedMatchEndTournamentCheck(
        newTournamentState,
        tournament.currentStageGroups || [],
        tournament,
      );

    switch (tournamentEndState) {
      case TournamentFlow.EndTournamentCheck.GoToNextTournamentStage:
        tournament.state.stage += 1;
        tournament.state.status = TournamentStatus.stageChange;
        return {
          newTournamentState,
          state: FinishMatchState.GoToNextTournamentStage,
        };
      case TournamentFlow.EndTournamentCheck.FinishTournament:
        tournament.state.isTournamentFinished = true;
        tournament.state.status = TournamentStatus.finished;
        return { newTournamentState, state: FinishMatchState.FinishTournament };
      case TournamentFlow.EndTournamentCheck.ContinueTournamentStage:
      default:
        break;
    }
    return { newTournamentState, state: FinishMatchState.ContinueTournament };
  };
}
