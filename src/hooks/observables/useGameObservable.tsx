import { useEffect, useState } from 'react';
import useGameServiceRxDB from 'services/GameServiceRxDB';
import { useRxDB } from 'store/RxDBContext';
import Game from 'types/Game';
import { ObservableResult } from './observableTypes';

/**
 * Hook to reactively observe a game using RxDB observables.
 */
const useGameObservable = (
  gameId: string | null | undefined,
): ObservableResult<Game> => {
  const { database } = useRxDB();
  const { getGame } = useGameServiceRxDB();
  const [data, setData] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(!!gameId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!gameId || !database) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return undefined;
    }

    setIsLoading(true);

    const subscription = database.collections.games
      .findOne({ selector: { _id: gameId } })
      .$.subscribe(async (gameDoc: any) => {
        if (!gameDoc) {
          setData(null);
          setIsLoading(false);
          setError(null);
          return;
        }

        try {
          const gameData = await getGame(gameId);
          setData(gameData);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setData(null);
        } finally {
          setIsLoading(false);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [gameId, database, getGame]);

  return {
    data: gameId ? data : null,
    isLoading: gameId ? isLoading : false,
    error: gameId ? error : null,
  };
};

export default useGameObservable;
