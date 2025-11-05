import { useEffect, useState } from 'react';
import useGameServiceRxDB from 'services/GameServiceRxDB';
import useLeagueServiceRxDB from 'services/LeagueServiceRxDB';
import { useRxDB } from 'store/RxDBContext';
import Game from 'types/Game';
import League from 'types/League';
import Tournament from 'types/Tournament';
import useActiveStateObservable from './useActiveStateObservable';
import useTournamentObservable from './useTournamentObservable';

/**
 * Populated active state object with full League, Tournament, and Game objects
 */
export interface PopulatedActiveState {
  league: League | null;
  tournament: Tournament | null;
  game: Game | null;
  isLoading: boolean;
}

/**
 * Hook that combines active state IDs with populated objects using RxDB observables
 *
 * This hook automatically updates when:
 * - Active state changes (leagueId, tournamentId, gameId)
 * - Tournament data changes (via useTournamentObservable)
 * - League data changes
 * - Game data changes
 *
 * No manual invalidation needed - everything updates reactively!
 *
 * @returns Populated active state with league, tournament, and game objects
 *
 * @example
 * ```tsx
 * const { league, tournament, game, isLoading } = usePopulatedActiveState();
 * // All objects automatically update when any related data changes
 * ```
 */
export const usePopulatedActiveState = (): PopulatedActiveState => {
  const { database } = useRxDB();
  const activeState = useActiveStateObservable();
  const tournament = useTournamentObservable(activeState?.tournamentId || null);

  const { getLeague } = useLeagueServiceRxDB();
  const { getGame } = useGameServiceRxDB();

  const [league, setLeague] = useState<League | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load league when leagueId changes
  useEffect(() => {
    if (!activeState?.leagueId || !database) {
      setLeague(null);
      setIsLoading(false);
      return undefined;
    }

    let isMounted = true;

    const loadLeague = async () => {
      try {
        const leagueData = await getLeague(activeState.leagueId!);
        if (isMounted) {
          setLeague(leagueData);
          setIsLoading(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'Failed to load league in usePopulatedActiveState:',
          error,
        );
        if (isMounted) {
          setLeague(null);
          setIsLoading(false);
        }
      }
    };

    loadLeague();

    return () => {
      isMounted = false;
    };
  }, [activeState?.leagueId, database, getLeague]);

  // TODO: Replace with useLeagueObservable when created
  // For now, observe league document changes manually
  useEffect(() => {
    if (!activeState?.leagueId || !database) {
      return undefined;
    }

    const subscription = database.collections.leagues
      .findOne({ selector: { _id: activeState.leagueId } })
      .$.subscribe(async (leagueDoc) => {
        if (leagueDoc) {
          try {
            const leagueData = await getLeague(activeState.leagueId!);
            setLeague(leagueData);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to update league in observable:', error);
          }
        }
      });

    return () => subscription.unsubscribe();
  }, [activeState?.leagueId, database, getLeague]);

  // Load game when gameId changes
  useEffect(() => {
    if (!activeState?.gameId || !database) {
      setGame(null);
      return undefined;
    }

    let isMounted = true;

    const loadGame = async () => {
      try {
        const gameData = await getGame(activeState.gameId!);
        if (isMounted) {
          setGame(gameData);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load game in usePopulatedActiveState:', error);
        if (isMounted) {
          setGame(null);
        }
      }
    };

    loadGame();

    return () => {
      isMounted = false;
    };
  }, [activeState?.gameId, database, getGame]);

  // TODO: Replace with useGameObservable when created
  // For now, observe game document changes manually
  useEffect(() => {
    if (!activeState?.gameId || !database) {
      return undefined;
    }

    const subscription = database.collections.games
      .findOne({ selector: { _id: activeState.gameId } })
      .$.subscribe(async (gameDoc) => {
        if (gameDoc) {
          try {
            const gameData = await getGame(activeState.gameId!);
            setGame(gameData);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to update game in observable:', error);
          }
        }
      });

    return () => subscription.unsubscribe();
  }, [activeState?.gameId, database, getGame]);

  return {
    league,
    tournament,
    game,
    isLoading: isLoading || !activeState, // Still loading if activeState not yet loaded
  };
};
