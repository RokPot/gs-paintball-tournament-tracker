import { useMemo } from 'react';
import { isByePlaceholderGame } from 'types/BracketProperties';
import { GameState } from 'types/GameState';
import League from 'types/League';
import TournamentScheduleGame from 'types/TournamentScheduleGame';

const MAX_ON_DECK_GAMES = 2;

/**
 * Single source of truth for what the results window shows. `switchGames`
 * alternates teams on and off the field rather than running matches in
 * parallel, so there is always exactly one active game and the paired game is
 * simply the one waiting to swap in.
 */
const useResultsWindowGames = (activeLeague?: League | null) => {
  const activeTournament = activeLeague?.activeTournament;
  const schedule = activeTournament?.currentStageSchedule;
  const state = activeTournament?.state;

  const activeGame = useMemo(() => {
    if (!schedule?.length || !state?.activeGameId) {
      return undefined;
    }
    return schedule.find(
      (scheduledGame) => scheduledGame.id === state.activeGameId,
    );
  }, [schedule, state?.activeGameId]);

  const upcomingGames = useMemo(() => {
    if (!schedule?.length) {
      return [] as TournamentScheduleGame[];
    }
    return schedule.filter(
      (scheduledGame) =>
        scheduledGame.game.gameState !== GameState.finished &&
        scheduledGame.id !== activeGame?.id &&
        !isByePlaceholderGame(scheduledGame.game),
    );
  }, [schedule, activeGame?.id]);

  const onDeckGames = useMemo(() => {
    if (!schedule?.length) {
      return [] as TournamentScheduleGame[];
    }

    const pairedGame = schedule.find(
      (scheduledGame) =>
        scheduledGame.id === state?.pairedGame2Id &&
        scheduledGame.id !== activeGame?.id &&
        scheduledGame.game.gameState !== GameState.finished &&
        !isByePlaceholderGame(scheduledGame.game),
    );

    const games = pairedGame ? [pairedGame] : [];
    const remaining = upcomingGames.filter(
      (scheduledGame) => scheduledGame.id !== pairedGame?.id,
    );

    return [...games, ...remaining].slice(0, MAX_ON_DECK_GAMES);
  }, [schedule, state?.pairedGame2Id, activeGame?.id, upcomingGames]);

  return { activeGame, onDeckGames, upcomingGames };
};

export default useResultsWindowGames;
