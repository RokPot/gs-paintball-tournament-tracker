import { useEffect, useRef, useState } from 'react';
import useGameServiceRxDB from 'services/GameServiceRxDB';
import { useRxDB } from 'store/RxDBContext';
import Tournament from 'types/Tournament';
import {
  collectGameIdsFromTournament,
  populateTournament,
} from 'utils/tournamentPopulationUtils';

/**
 * Hook to reactively observe a tournament using RxDB observables
 *
 * This hook automatically updates when:
 * - The tournament document changes
 * - Any game in the tournament changes (by also subscribing to game documents)
 *
 * No manual invalidation needed - RxDB handles reactivity automatically!
 *
 * @param tournamentId - The tournament ID to observe
 * @returns Tournament object that updates reactively, or null if not found
 *
 * @example
 * ```tsx
 * const tournament = useTournamentObservable(tournamentId);
 * // tournament automatically updates when any game in it changes
 * ```
 */
const useTournamentObservable = (
  tournamentId: string | null | undefined,
): Tournament | null => {
  const { database } = useRxDB();
  const { getGames } = useGameServiceRxDB();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const gameSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    if (!tournamentId || !database) {
      setTournament(null);
      // Cleanup game subscription if it exists
      if (gameSubscriptionRef.current) {
        gameSubscriptionRef.current.unsubscribe();
        gameSubscriptionRef.current = null;
      }
      return undefined;
    }

    let tournamentDataCache: any = null;

    // Helper function to populate and set tournament
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const populateAndSetTournament = async (tournamentData: any) => {
      try {
        const populated = await populateTournament(
          tournamentData,
          database!,
          getGames,
        );
        setTournament(populated);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to populate tournament in observable:', error);
        setTournament(null);
      }
    };

    // Subscribe to tournament document changes
    const tournamentSubscription = database.collections.tournaments
      .findOne({ selector: { _id: tournamentId } })
      .$.subscribe(async (tournamentDoc) => {
        if (!tournamentDoc) {
          setTournament(null);
          // Cleanup game subscription
          if (gameSubscriptionRef.current) {
            gameSubscriptionRef.current.unsubscribe();
            gameSubscriptionRef.current = null;
          }
          return;
        }

        tournamentDataCache = tournamentDoc.toMutableJSON();
        await populateAndSetTournament(tournamentDataCache);

        // Also subscribe to games in this tournament
        // When games change, we need to re-populate the tournament
        const gameIds = collectGameIdsFromTournament(tournamentDataCache);

        if (gameIds.length > 0 && !gameSubscriptionRef.current) {
          // Subscribe to all games in the tournament
          // When any game changes, re-populate the tournament
          const gameSubscription = database.collections.games
            .find({
              selector: {
                _id: { $in: gameIds },
              },
            })
            .$.subscribe(async () => {
              // Game changed - re-populate tournament with fresh games
              if (tournamentDataCache) {
                await populateAndSetTournament(tournamentDataCache);
              }
            });

          gameSubscriptionRef.current = gameSubscription;
        }
      });

    // Cleanup subscriptions on unmount or when tournamentId changes
    return () => {
      tournamentSubscription.unsubscribe();
      if (gameSubscriptionRef.current) {
        gameSubscriptionRef.current.unsubscribe();
        gameSubscriptionRef.current = null;
      }
    };
  }, [tournamentId, database, getGames]);

  return tournament;
};

export default useTournamentObservable;
