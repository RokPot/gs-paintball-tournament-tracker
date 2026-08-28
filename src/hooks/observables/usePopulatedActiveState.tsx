import { useMemo } from 'react';
import Game from 'types/Game';
import League from 'types/League';
import Tournament from 'types/Tournament';
import useActiveStateObservable from './useActiveStateObservable';
import useGameObservable from './useGameObservable';
import useLeagueObservable from './useLeagueObservable';
import useTournamentObservable from './useTournamentObservable';

export interface PopulatedActiveState {
  league: League | null;
  tournament: Tournament | null;
  game: Game | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook that combines active state IDs with populated objects using RxDB observables.
 *
 * Automatically updates when active IDs, league, tournament, or game documents change.
 */
export const usePopulatedActiveState = (): PopulatedActiveState => {
  const {
    data: activeState,
    isLoading: isActiveStateLoading,
    error: activeStateError,
  } = useActiveStateObservable();
  const {
    data: league,
    isLoading: isLeagueLoading,
    error: leagueError,
  } = useLeagueObservable(activeState?.leagueId || null);
  const {
    data: tournament,
    isLoading: isTournamentLoading,
    error: tournamentError,
  } = useTournamentObservable(activeState?.tournamentId || null);
  const {
    data: game,
    isLoading: isGameLoading,
    error: gameError,
  } = useGameObservable(activeState?.gameId || null);

  const populatedLeague = useMemo(() => {
    if (!league) {
      return null;
    }
    const selectedTournament = activeState?.tournamentId
      ? tournament || league.activeTournament
      : undefined;
    return new League({
      ...league,
      teams: league.teams,
      tournaments: league.tournaments,
      leaderboard: league.leaderboard,
      activeTournament: selectedTournament,
    });
  }, [activeState?.tournamentId, league, tournament]);

  return {
    league: populatedLeague,
    tournament: activeState?.tournamentId ? tournament : null,
    game: activeState?.gameId ? game : null,
    isLoading:
      isActiveStateLoading ||
      isLeagueLoading ||
      (!!activeState?.tournamentId && isTournamentLoading) ||
      (!!activeState?.gameId && isGameLoading),
    error:
      activeStateError || leagueError || tournamentError || gameError || null,
  };
};
