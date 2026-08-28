import { useEffect, useRef, useState } from 'react';
import useGameServiceRxDB from 'services/GameServiceRxDB';
import { useRxDB } from 'store/RxDBContext';
import Tournament from 'types/Tournament';
import {
  collectGameIdsFromTournament,
  populateTournament,
} from 'utils/tournamentPopulationUtils';
import { ObservableResult } from './observableTypes';

/**
 * Hook to reactively observe a tournament using RxDB observables
 *
 * This hook automatically updates when:
 * - The tournament document changes
 * - Any game in the tournament changes (by also subscribing to game documents)
 */
const useTournamentObservable = (
  tournamentId: string | null | undefined,
): ObservableResult<Tournament> => {
  const { database } = useRxDB();
  const { getGames } = useGameServiceRxDB();
  const [data, setData] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(!!tournamentId);
  const [error, setError] = useState<Error | null>(null);
  const gameSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    if (!tournamentId || !database) {
      setData(null);
      setIsLoading(false);
      setError(null);
      if (gameSubscriptionRef.current) {
        gameSubscriptionRef.current.unsubscribe();
        gameSubscriptionRef.current = null;
      }
      return undefined;
    }

    setIsLoading(true);
    let tournamentDataCache: any = null;

    const populateAndSetTournament = async (tournamentData: any) => {
      try {
        const populated = await populateTournament(
          tournamentData,
          database!,
          getGames,
        );
        setData(populated);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    const tournamentSubscription = database.collections.tournaments
      .findOne({ selector: { _id: tournamentId } })
      .$.subscribe(async (tournamentDoc: any) => {
        if (!tournamentDoc) {
          setData(null);
          setIsLoading(false);
          setError(null);
          if (gameSubscriptionRef.current) {
            gameSubscriptionRef.current.unsubscribe();
            gameSubscriptionRef.current = null;
          }
          return;
        }

        tournamentDataCache = tournamentDoc.toMutableJSON();
        await populateAndSetTournament(tournamentDataCache);

        const gameIds = collectGameIdsFromTournament(tournamentDataCache);

        if (gameIds.length > 0 && !gameSubscriptionRef.current) {
          const gameSubscription = database.collections.games
            .find({
              selector: {
                _id: { $in: gameIds },
              },
            })
            .$.subscribe(async () => {
              if (tournamentDataCache) {
                await populateAndSetTournament(tournamentDataCache);
              }
            });

          gameSubscriptionRef.current = gameSubscription;
        }
      });

    return () => {
      tournamentSubscription.unsubscribe();
      if (gameSubscriptionRef.current) {
        gameSubscriptionRef.current.unsubscribe();
        gameSubscriptionRef.current = null;
      }
    };
  }, [tournamentId, database, getGames]);

  return {
    data: tournamentId ? data : null,
    isLoading: tournamentId ? isLoading : false,
    error: tournamentId ? error : null,
  };
};

export default useTournamentObservable;
